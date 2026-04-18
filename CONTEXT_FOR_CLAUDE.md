# VetConnect™ — Contexto de Sesión para Claude

> Adjunta este archivo al inicio de una nueva sesión para restaurar el contexto completo.

---

## Quién soy
Prof. Dr. Luis Orlando Maroto Martín (DVM, PhD) — CEO de ARIA.
Ecosistema: ARIA → BioVetAI → NexusVet → VetConnect™

---

## Qué es VetConnect
Plataforma SaaS de gestión para clínicas veterinarias y vets independientes.
Mercado objetivo: **LATAM primero** (competencia débil, WhatsApp-first, margen 95%+).
Producto central de la comunidad **NexusVet** (próximamente).

**Ubicación del proyecto:**
`/Users/luismaroto/Desktop/JOB/HOME JOBS/00. BioVetAI™/04. VetConnect™ v.1/VetConnect/vet-automation`

**Repo GitHub:** `lmarotomar/VetConnect`

---

## Estado actual del código

### Fase 1 — COMPLETADA ✅
- `config.js` creado (gitignored) — credenciales Supabase fuera del código
- `config.example.js` creado — template para nuevos deployments
- `.gitignore` creado — protege `config.js`
- `db.js` creado — capa de datos Supabase (reemplaza localStorage)
- `auth/supabase-client.js` — lee de `config.js`, sin hardcode
- `app.js` — usa `DB.*` (Supabase), `init()` es async, fallback a mockData
- `index.html` — auth guard real, redirige a login sin sesión, scripts ordenados
- `auth/login.html` — usa `Auth.signIn()`, sin bypass demo, sin hardcode
- `auth/register.html` — usa `Auth.signUp()`, sin hardcode

### Fase 2 — COMPLETADA ✅
- `supabase/functions/process-jobs/index.ts` — scheduler horario, procesa `scheduled_jobs`
- `supabase/functions/send-immediate/index.ts` — confirmaciones instantáneas
- `backend/integrations/messaging-agent-contract.md` — contrato API del Messaging Agent
- `supabase/DEPLOY.md` — instrucciones de deploy de Edge Functions
- `app.js` — `triggerAutomation` llama a Edge Functions reales

### Fase 3 — PENDIENTE ⏳
- Deploy en **Vercel** (decisión tomada — no GitHub Pages, no Cloudflare aún)
- Razón: soporta variables de entorno, HTTPS, CDN LATAM, no requiere migración después
- Pasos: conectar repo → configurar env vars → dominio `vetconnect.app`

### Fase 4 — PENDIENTE ⏳
- Stripe pagos recurrentes
- Activar `LicenseManager` (ya existe en código)
- `pricing.html` ya está lista

---

## Arquitectura WhatsApp — Decisión tomada

**NO** usar el número de VetPrompt Pro (ese corre en n8n.cloud).
**NO** conectar WhatsApp directo desde el frontend.

Arquitectura:
```
VetConnect (evento en DB)
        ↓
Supabase Edge Function (send-immediate / process-jobs)
        ↓
VetConnect Messaging Agent (ARIA — pendiente de construir)
        ↓
WhatsApp Business API (número NUEVO bajo el mismo WABA de Meta)
```

El **VetConnect Messaging Agent** es un agente ARIA dedicado que:
- Recibe payload vía webhook con `jobType` + datos del appointment
- Formatea y envía el mensaje WhatsApp correcto
- Maneja los 6 tipos: confirmation, reminder_24h, reminder_2h, post_consultation, followup_3d, vaccination_reminder
- Contrato completo en: `backend/integrations/messaging-agent-contract.md`

---

## Lo que está pendiente de Luis (bloquea avance)

1. **Ejecutar `schema.sql` en Supabase Cloud** — sin esto la DB está vacía
   - Ir a: https://supabase.com/dashboard/project/dppxgwjvfiqbgjupxipf
   - SQL Editor → pegar contenido de `backend/database/schema.sql` → Run

2. **Deploy Edge Functions** — instrucciones en `supabase/DEPLOY.md`
   - Requiere Supabase CLI instalado
   - Requiere definir `MESSAGING_AGENT_URL` y `MESSAGING_AGENT_SECRET`

3. **Número WhatsApp nuevo** bajo el WABA de Meta (separado de VetPrompt)

4. **Construir el Messaging Agent** en ARIA (sesión separada)

---

## Decisiones de diseño (NO cambiar)
- Mantener diseño actual: dark theme, turquesa `#40e0d0` + naranja `#FF9136`
- Mantener logo existente (`assets/logo.jpg`)
- No agregar features de v2 hasta que v1 esté en producción
- v2: Email SendGrid, HubSpot CRM, reportes reales, Google Sheets, PDF

---

## Stack técnico
- Frontend: HTML5 + CSS3 + JavaScript Vanilla
- Auth + DB: Supabase (PostgreSQL) — proyecto `dppxgwjvfiqbgjupxipf`
- Scheduler: Supabase Edge Functions (Deno/TypeScript)
- Mensajería: WhatsApp via Messaging Agent ARIA → Meta Graph API
- Pagos: Stripe (Fase 4)
- Deploy: Vercel (Fase 3)

---

## Contexto ARIA relevante
- VetPrompt Pro: corre en n8n.cloud, número WA `+1 (904) 934-7620` — NO tocar
- Cloudflare Tunnel: planeado pero pendiente (depende de Pi con OS activo)
- Raspberry Pi 5: hardware confirmado, OS aún no instalado — desbloquea Fases 1-6 de seguridad ARIA
- NexusVet: comunidad veterinaria en construcción — VetConnect será su herramienta central

---

## Próxima sesión — por dónde continuar

1. Luis ejecuta `schema.sql` en Supabase → confirma que tablas están creadas
2. Fase 3: Deploy en Vercel + configurar env vars
3. Test end-to-end: login → crear cita → verificar en Supabase DB
4. Sesión separada: construir VetConnect Messaging Agent en ARIA
