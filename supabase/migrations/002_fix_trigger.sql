-- ============================================================
-- VetConnect — Fix trigger handle_new_user
-- Problema: SECURITY DEFINER sin search_path falla en Supabase hosted
-- Ejecutar en: Supabase SQL Editor
-- ============================================================

-- Recrear la función con search_path explícito
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_org_id UUID;
BEGIN
  INSERT INTO public.organizations (name, type)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'clinic_name', 'Mi Clínica'),
    COALESCE(NEW.raw_user_meta_data->>'org_type', 'clinic')
  )
  RETURNING id INTO new_org_id;

  INSERT INTO public.user_profiles (user_id, organization_id, first_name, last_name, role)
  VALUES (
    NEW.id,
    new_org_id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'clinic_admin')
  );

  RETURN NEW;
END;
$$;

-- Asegurar que el trigger sigue apuntando a la función corregida
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verificar que el trigger existe
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
