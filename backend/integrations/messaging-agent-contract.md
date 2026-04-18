# VetConnect Messaging Agent — Contrato de API

Este documento define el contrato que debe implementar el agente ARIA
"VetConnect Messaging Agent" para recibir y despachar mensajes de WhatsApp.

## Endpoint

```
POST /webhook/vetconnect-messaging
Authorization: Bearer {MESSAGING_AGENT_SECRET}
Content-Type: application/json
```

## Request Body

```json
{
  "jobType": "appointment_confirmation | reminder_24h | reminder_2h | post_consultation | followup_3d | vaccination_reminder",
  "jobId": "123 | null",
  "recipient": {
    "phone": "+5491123456789",
    "name": "María González",
    "email": "maria@example.com"
  },
  "appointment": {
    "id": 42,
    "date": "2026-04-20",
    "time": "10:00",
    "type": "Consulta General",
    "petName": "Max"
  }
}
```

## Response esperada (200 OK)

```json
{
  "success": true,
  "messageId": "wamid.xxxxx",
  "channel": "whatsapp"
}
```

## Response en error (4xx / 5xx)

```json
{
  "success": false,
  "error": "Descripción del error"
}
```

## Lógica por jobType

| jobType | Mensaje que envía el agente |
|---|---|
| `appointment_confirmation` | Confirmación de cita (inmediato al crear) |
| `reminder_24h` | Recordatorio + preguntas de triage |
| `reminder_2h` | Recordatorio corto 2h antes |
| `post_consultation` | Instrucciones de cuidado post-consulta |
| `followup_3d` | Seguimiento a los 3 días |
| `vaccination_reminder` | Recordatorio de vacuna próxima |

## Variables de entorno que necesita el agente

```
WHATSAPP_API_KEY=       # Token de Meta Graph API
WHATSAPP_PHONE_ID=      # ID del número VetConnect en Meta
MESSAGING_AGENT_SECRET= # Secret compartido con la Edge Function
```

## Notas de implementación

- El agente formatea el mensaje según `jobType` y datos del `appointment`
- El número de teléfono del recipient llega en formato E.164 (+código país + número)
- Si el número no tiene código de país, el agente debe asumir el país de la clínica
- Los mensajes deben enviarse vía WhatsApp Business Cloud API (Meta Graph API v18+)
- El agente registra en su propio log cada mensaje enviado con el messageId de Meta
