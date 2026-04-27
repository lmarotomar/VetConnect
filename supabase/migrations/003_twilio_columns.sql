-- ============================================================
-- VetConnect — Migration 003: Integration Columns
-- Agrega columnas de integraciones a la tabla organizations
-- Ejecutar en: Supabase SQL Editor
-- ============================================================

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS phone             TEXT,
  ADD COLUMN IF NOT EXISTS address           TEXT,
  ADD COLUMN IF NOT EXISTS website           TEXT,
  ADD COLUMN IF NOT EXISTS twilio_sid        TEXT,
  ADD COLUMN IF NOT EXISTS twilio_auth_token TEXT,
  ADD COLUMN IF NOT EXISTS twilio_phone      TEXT,
  ADD COLUMN IF NOT EXISTS sendgrid_key      TEXT,
  ADD COLUMN IF NOT EXISTS sender_email      TEXT,
  ADD COLUMN IF NOT EXISTS sender_name       TEXT;

-- Verificar
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'organizations'
  AND column_name IN ('twilio_sid','twilio_auth_token','twilio_phone','sendgrid_key','sender_email','phone','address','website')
ORDER BY column_name;
