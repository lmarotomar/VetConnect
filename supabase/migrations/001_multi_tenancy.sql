-- ============================================================
-- VetConnect — Multi-tenancy Migration
-- Ejecutar en: Supabase SQL Editor
-- ============================================================

-- ─── 1. TABLA ORGANIZATIONS ──────────────────────────────────

CREATE TABLE IF NOT EXISTS organizations (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  type          TEXT NOT NULL DEFAULT 'clinic',   -- individual | clinic | hospital
  plan          TEXT NOT NULL DEFAULT 'trial',    -- trial | solo | clinica | enterprise
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. TABLA USER_PROFILES ──────────────────────────────────

CREATE TABLE IF NOT EXISTS user_profiles (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  first_name      TEXT DEFAULT '',
  last_name       TEXT DEFAULT '',
  role            TEXT NOT NULL DEFAULT 'clinic_admin',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ─── 3. AGREGAR organization_id A TABLAS EXISTENTES ──────────

ALTER TABLE clients           ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE patients          ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE appointments      ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE communications    ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE clinical_records  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE scheduled_jobs    ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE inventory_items   ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- ─── 4. FUNCIÓN HELPER: obtener org_id del usuario actual ────

CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ─── 5. TRIGGER: crear org + perfil al registrar usuario ─────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_org_id UUID;
BEGIN
  INSERT INTO organizations (name, type)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'clinic_name', 'Mi Clínica'),
    COALESCE(NEW.raw_user_meta_data->>'org_type', 'clinic')
  )
  RETURNING id INTO new_org_id;

  INSERT INTO user_profiles (user_id, organization_id, first_name, last_name, role)
  VALUES (
    NEW.id,
    new_org_id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'clinic_admin')
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── 6. PERFIL MANUAL PARA USUARIOS EXISTENTES ───────────────
-- (Ejecuta esto UNA VEZ para el super admin ya existente)

DO $$
DECLARE
  admin_user_id UUID;
  admin_org_id  UUID;
BEGIN
  -- Buscar el super admin por email
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email IN ('lmarotomar@biovetai.org', 'lmarotomar130473@gmail.com')
  LIMIT 1;

  IF admin_user_id IS NOT NULL THEN
    -- Verificar si ya tiene perfil
    IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE user_id = admin_user_id) THEN
      -- Crear org del super admin
      INSERT INTO organizations (name, type, plan)
      VALUES ('BioVetAI — Admin', 'hospital', 'enterprise')
      RETURNING id INTO admin_org_id;

      -- Crear perfil
      INSERT INTO user_profiles (user_id, organization_id, first_name, last_name, role)
      VALUES (admin_user_id, admin_org_id, 'Luis', 'Maroto', 'super_admin');

      RAISE NOTICE 'Perfil de super admin creado con org_id: %', admin_org_id;
    ELSE
      RAISE NOTICE 'Super admin ya tiene perfil — sin cambios.';
    END IF;
  ELSE
    RAISE NOTICE 'Super admin no encontrado — regístrate primero.';
  END IF;
END $$;

-- ─── 7. HABILITAR RLS EN TABLAS NUEVAS ───────────────────────

ALTER TABLE organizations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles  ENABLE ROW LEVEL SECURITY;

-- ─── 8. ELIMINAR POLICIES PERMISIVAS ANTERIORES ──────────────
-- (Elimina cualquier policy existente en tablas de datos)

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname, tablename
    FROM pg_policies
    WHERE tablename IN (
      'clients','patients','appointments',
      'communications','clinical_records',
      'scheduled_jobs','inventory_items'
    )
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- ─── 9. POLICIES RLS PARA ORGANIZATIONS ──────────────────────

CREATE POLICY "org_select" ON organizations FOR SELECT
  USING (id = get_user_org_id());

CREATE POLICY "org_update" ON organizations FOR UPDATE
  USING (id = get_user_org_id());

-- ─── 10. POLICIES RLS PARA USER_PROFILES ─────────────────────

CREATE POLICY "profile_select" ON user_profiles FOR SELECT
  USING (organization_id = get_user_org_id());

CREATE POLICY "profile_insert" ON user_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "profile_update" ON user_profiles FOR UPDATE
  USING (user_id = auth.uid());

-- ─── 11. MACRO: generar policies para tablas de datos ─────────

DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'clients','patients','appointments',
    'communications','clinical_records',
    'scheduled_jobs','inventory_items'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format(
      'CREATE POLICY "%s_select" ON %I FOR SELECT USING (organization_id = get_user_org_id())',
      tbl, tbl
    );
    EXECUTE format(
      'CREATE POLICY "%s_insert" ON %I FOR INSERT WITH CHECK (organization_id = get_user_org_id())',
      tbl, tbl
    );
    EXECUTE format(
      'CREATE POLICY "%s_update" ON %I FOR UPDATE USING (organization_id = get_user_org_id())',
      tbl, tbl
    );
    EXECUTE format(
      'CREATE POLICY "%s_delete" ON %I FOR DELETE USING (organization_id = get_user_org_id())',
      tbl, tbl
    );
  END LOOP;
END $$;

-- ─── VERIFICACIÓN ─────────────────────────────────────────────
-- Revisar que las tablas existen:
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('organizations','user_profiles','clients','patients','appointments')
ORDER BY table_name;
