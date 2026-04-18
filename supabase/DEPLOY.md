# Supabase Edge Functions — Deploy Guide

## 1. Instalar Supabase CLI

```bash
brew install supabase/tap/supabase
```

## 2. Login y link al proyecto

```bash
supabase login
supabase link --project-ref dppxgwjvfiqbgjupxipf
```

## 3. Configurar variables de entorno en Supabase Dashboard

En: https://supabase.com/dashboard/project/dppxgwjvfiqbgjupxipf/settings/functions

Agregar estos secrets:
```
MESSAGING_AGENT_URL=     # URL del endpoint del Messaging Agent en ARIA
MESSAGING_AGENT_SECRET=  # Secret compartido (genera uno con: openssl rand -hex 32)
```

(SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY se inyectan automáticamente)

## 4. Deploy de las funciones

```bash
supabase functions deploy process-jobs
supabase functions deploy send-immediate
```

## 5. Configurar el cron (scheduler)

En Supabase Dashboard → Database → Extensions → habilitar `pg_cron`

Luego en SQL Editor:
```sql
SELECT cron.schedule(
  'process-vetconnect-jobs',
  '0 * * * *',   -- cada hora
  $$
  SELECT net.http_post(
    url := 'https://dppxgwjvfiqbgjupxipf.supabase.co/functions/v1/process-jobs',
    headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '"}'::jsonb
  );
  $$
);
```

## 6. Verificar deploy

```bash
supabase functions list
```

## Flujo completo

```
Usuario crea cita en VetConnect
        ↓
app.js → addAppointment()
        ↓
DB.addAppointment() → Supabase (appointments table)
DB.addScheduledJob() × 2 → (reminder_24h, reminder_2h)
        ↓
send-immediate Edge Fn → Messaging Agent → WhatsApp (confirmación inmediata)
        ↓
[1 hora después] process-jobs Edge Fn
        → lee scheduled_jobs donde scheduled_for <= now
        → para cada job → Messaging Agent → WhatsApp
```
