# Recap Técnico — Estado VetPrompt y VetConnect
Fecha: 2026-04-30

## Estado Actual

### VetPrompt ✅ Parcialmente restaurado
- Número `+1 904-934-7620` re-registrado en la red de WhatsApp
- Mensajes llegan y se entregan (2 checkmarks)
- WF de n8n se activa correctamente al recibir mensajes
- **PENDIENTE:** El nodo `HTTP Request` dentro del WF falla — necesita revisión

### Supabase NexusVet (VetPrompt)
- Proyecto: `yyzoszwggxjyjqtjhhjs.supabase.co`
- Estaba pausado — ya reactivado ✅
- Tabla: `mensajes_procesados` con constraint unique en `wamid`
- El HTTP Request llama a `POST /rest/v1/mensajes_procesados`
- Error actual: falla con "Your request is invalid or could not be processed"

### n8n (mardigital.app.n8n.cloud)
- WF activo: `01.VetPrompt Pro`
- Credential WhatsApp: `n8n-WhatsApp` — token actualizado ✅
- Sistema de usuarios Meta: `n8n-WhatsApp` (ID: 61585607216931)
- Token: System User permanente generado 2026-04-29

### Meta / WhatsApp Business
- WABA: MarDigital (ID: 1258979549539588)
- Phone Number ID: `1123110644209986`
- Número: `+1 904-934-7620`
- Estado: CONNECTED, CLOUD_API, GREEN ✅
- 2FA: re-activada con nuevo PIN (guardarlo en lugar seguro)
- Webhook URL: `https://mardigital.app.n8n.cloud/webhook/whatsapp-vetprompt`
- Campos suscritos: `messages`, `message_template_status_update` ✅
- App Access Token: `749412314852408|cdff1a9916a2af895911fa322a64f2c6`

---

## Pendiente para próxima sesión

### 1. Reparar nodo HTTP Request en WF VetPrompt
- Revisar la URL de Supabase en el nodo
- Verificar headers (apikey, Authorization)
- Verificar el body del POST a `mensajes_procesados`
- Error actual: "Your request is invalid or could not be processed by the service"

### 2. Probar flujo completo VetPrompt
- Enviar mensaje personal → WF se activa → Claude/GPT procesa → responde por WhatsApp

### 3. VetConnect — Edge Functions
- Actualizar `send-immediate` y `process-jobs` para usar plantillas aprobadas
- Plantillas aprobadas:
  - `vetprompt_bienvenida` (Marketing, variable: `{{name}}`, format: NAMED)
  - `vetconnect_confirmacion_cita` (Utility)
  - `vetconnect_recordatorio_24h` (Utility)
- Pendiente aprobar: `vetconnect_seguimiento`

### 4. Token en n8n
- Guardar nuevo PIN del 2FA en gestor de contraseñas
- Verificar que el token del System User no expire

---

## Comandos útiles

**Verificar estado del número:**
```
curl -s "https://graph.facebook.com/v25.0/1123110644209986?fields=status,platform_type,quality_rating" -H "Authorization: Bearer TOKEN"
```

**Re-suscribir app al WABA:**
```
curl -X POST "https://graph.facebook.com/v25.0/1258979549539588/subscribed_apps" -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json"
```

**Re-registrar número (si vuelve a deregistrarse):**
```
curl -s -X POST "https://graph.facebook.com/v25.0/1123110644209986/register" -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" -d '{"messaging_product":"whatsapp","pin":"TU_PIN"}'
```
