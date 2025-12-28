# DOCUMENTACIÓN TÉCNICA: EXPORTACIONES Y RECORDATORIOS
## VetConnect - Sistema de Automatización

**Última actualización:** 7 de diciembre de 2025

---

## 📤 SISTEMA DE EXPORTACIÓN DE REPORTES

### ¿A dónde se exportan los reportes?

**Estado actual:** DEMO (sin backend activo)  
**Estado productivo:** Los reportes se exportan a múltiples destinos según tu preferencia:

#### 1. **Google Sheets (Recomendado)**
**Ubicación:** Tu Google Drive  
**Funcionamiento:**
- VetConnect se conecta a tu cuenta de Google
- Crea automáticamente hojas de cálculo organizadas
- Actualización automática cada 24 horas o bajo demanda
- Estructura:
  ```
  📁 Google Drive
    └── 📁 VetConnect Reportes
        ├── 📊 Reporte Mensual - Diciembre 2025.xlsx
        ├── 📊 Clientes y Mascotas.xlsx
        ├── 📊 Historial de Citas.xlsx
        └── 📊 Finanzas y Facturación.xlsx
  ```

**Cómo Configurar:**
1. Ve a Configuración → Integraciones
2. Click en "Conectar Google Sheets"
3. Autoriza acceso a tu cuenta
4. Selecciona carpeta de destino

#### 2. **Descarga Local (PDF/Excel)**
**Ubicación:** Carpeta de descargas de tu navegador  
**Formato:** PDF o XLSX  
**Uso:**
```
Dashboard → Reportes → [Seleccionar reporte] → Botón "Exportar"
```

**Reportes disponibles:**
- 📊 **Reporte Mensual:** Resumen completo del mes
- 📄 **Reporte de Citas:** Listado y estadísticas de citas
- 💰 **Reporte Financiero:** Ingresos, gastos, proyecciones
- 👥 **Base de Datos de Clientes:** Lista completa exportable
- 📈 **Analytics:** Métricas de rendimiento

#### 3. **Email Automático**
**Ubicación:** Tu bandeja de entrada  
**Frecuencia:** Mensual o configurada  
**Contenido:**
- PDF adjunto con reporte mensual
- Resumen ejecutivo en el cuerpo del email
- Links para descarga de archivos Excel

**Ejemplo de configuración:**
```javascript
// En Configuración → Notificaciones
{
  emailReports: true,
  frequency: 'monthly',
  sendTo: 'lmarotomar@biovetai.org',
  includeAttachments: true
}
```

#### 4. **Integración con CRM (HubSpot)**
**Ubicación:** Tu cuenta de HubSpot  
**Sincronización:** Automática  
**Datos exportados:**
- Contactos de clientes
- Historiales de interacción
- Métricas de engagement
- Deals y oportunidades

---

## 📲 SISTEMA DE RECORDATORIOS AUTOMÁTICOS

### ¿A dónde se envían los recordatorios?

**VetConnect envía recordatorios automáticos por 3 canales:**

### 1. WhatsApp Business (Principal)

**Destino:** Número de WhatsApp del cliente  
**API:** Twilio WhatsApp Business API  
**Flujo:**

```
Cita Agendada
    ↓
24 HORAS ANTES:
    → WhatsApp: "Hola María, te recordamos tu cita mañana 10 AM para Max 🐕"
    
2 HORAS ANTES:
    → WhatsApp: "Hola María, tu cita con Max es en 2 horas (10 AM). 
                 ¿Confirmas asistencia? Responde SÍ o NO"
    
POST-CONSULTA (Inmediato):
    → WhatsApp: "Gracias por tu visita. Aquí las instrucciones de cuidado para Max..."
    
SEGUIMIENTO (+3 días):
    → WhatsApp: "¿Cómo está Max? ¿Alguna preocupación?"
    
SEGUIMIENTO (+7 días):
    → WhatsApp: "Check-in semanal: ¿Max se está recuperando bien?"
```

**Configuración:**
```javascript
// backend/integrations/whatsapp.js
const config = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER,
  
  reminders: {
    appointment24h: true,
    appointment2h: true,
    postConsult: true,
    followUp3d: true,
    followUp7d: true,
    followUp30d: false // Opcional
  }
}
```

### 2. SMS (Alternativo)

**Destino:** Número celular del cliente  
**API:** Twilio SMS  
**Cuándo se usa:**
- Cliente no tiene WhatsApp
- Mensajes críticos de respaldo
- Opción configurada por cliente

**Flujo:**
```
24h antes: "VETCONNECT: Cita mañana 10 AM para Max. Confirma: bit.ly/vc123"
2h antes:  "VETCONNECT: Cita HOY 10 AM para Max. Ubicación: [maps link]"
```

### 3. Email

**Destino:** Email del cliente  
**Proveedor:** SendGrid  
**Tipo:** HTML formateado con branding  
**Contenido:**
- Confirmación de cita con detalles
- Archivo ICS adjunto (para calendario)
- Instrucciones de llegada
- Links a contenido educativo

**Ejemplo de email:**
```html
Asunto: Confirmación de Cita - Max (Labrador)

Hola María,

Tu cita ha sido confirmada:
🗓️ Fecha: Lunes, 10 de diciembre 2025
⏰ Hora: 10:00 AM
🐕 Mascota: Max (Labrador, 3 años)
📍 Ubicación: Clínica VetConnect

[Botón: Agregar a Calendario] [Botón: Ver Mapa]

Instrucciones pre-consulta:
- Trae cartilla de vacunación
- Max debe estar en ayunas (8 horas)
...
```

---

## 📅 CRONOGRAMA COMPLETO DE RECORDATORIOS

### Timeline de Una Cita:

```
DÍA -7 (7 días antes)
├─ ✉️ Email: Confirmación inicial con detalles
└─ 📋 Sistema: Cita creada en calendario interno

DÍA -1 (24 horas antes)
├─ 📲 WhatsApp: "Mañana tienes cita..."
├─ 📧 SMS: Backup si WhatsApp falla
└─ 📊 CRM: Actualización de pipeline

HORA -2 (2 horas antes)
├─ 📲 WhatsApp: "En 2 horas..."
├─ ❓ Sistema: Espera confirmación
└─ ⚠️  Si NO confirma: Alerta al staff

HORA 0 (Durante cita)
├─ 📝 Sistema: Marca cita como "En progreso"
└─ ⏱️  Timer: Duración estimada

POST-CONSULTA (Inmediatamente después)
├─ 📲 WhatsApp: Instrucciones de cuidado
├─ 📧 Email: PDF con instrucciones detalladas
├─ 📚 Contenido educativo según diagnóstico
└─ 📊 CRM: Log de interacción

DÍA +3 (3 días después)
├─ 📲 WhatsApp: "¿Cómo está Max?"
└─ 📊 Tracking de respuesta

DÍA +7 (7 días después)
├─ 📲 WhatsApp: Check-in semanal
└─ 📋 Opción: Agendar nueva cita si necesario

DÍA +30 (30 días después)
├─ 📧 Email: "¿Todo bien con Max?"
├─ ⭐ Solicitud de review/feedback
└─ 💉 Recordatorio de próxima vacuna (si aplica)
```

---

## ⚙️ CONFIGURACIÓN TÉCNICA

### Setup Inicial (Para Producción)

**1. Variables de Entorno (.env):**
```bash
# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=+14155238886

# SMS (Twilio)
TWILIO_PHONE_NUMBER=+1234567890

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=no-reply@vetconnect.com

# URLs
FRONTEND_URL=https://app.vetconnect.com
API_URL=https://api.vetconnect.com
```

**2. Código de Implementación:**
```javascript
// app.js - Trigger de recordatorios
triggerAutomation(eventType, data) {
  switch (eventType) {
    case 'appointment_created':
      // Envía confirmación inicial
      this.sendConfirmationMessage(data);
      
      // Programa recordatorios futuros
      this.scheduleReminders(data);
      break;
  }
}

scheduleReminders(appointment) {
  const appointmentDate = new Date(appointment.date + ' ' + appointment.time);
  
  // Recordatorio 24h antes
  const reminder24h = new Date(appointmentDate.getTime() - 24*60*60*1000);
  scheduleJob(reminder24h, () => {
    sendWhatsApp(appointment.clientId, 'reminder_24h', appointment);
  });
  
  // Recordatorio 2h antes
  const reminder2h = new Date(appointmentDate.getTime() - 2*60*60*1000);
  scheduleJob(reminder2h, () => {
    sendWhatsApp(appointment.clientId, 'reminder_2h', appointment);
  });
  
  // Seguimientos post-consulta
  const followUp3d = new Date(appointmentDate.getTime() + 3*24*60*60*1000);
  scheduleJob(followUp3d, () => {
    sendWhatsApp(appointment.clientId, 'followup_3d', appointment);
  });
}
```

---

## 🔍 MONITOREO Y LOGS

**Todos los mensajes enviados se registran en:**

1. **Base de Datos (communications table)**
```sql
SELECT * FROM communications 
WHERE client_id = 123 
ORDER BY timestamp DESC;
```

2. **Dashboard de Comunicación**
```
App → Comunicación → Historial
```
Muestra:
- ✅ Mensaje entregado
- ⏳ Mensaje enviado
- ❌ Error en envío
- 📖 Leído por cliente

3. **Logs de Sistema**
``` 
backend/logs/communication.log
```

---

## ❓ PREGUNTAS FRECUENTES

**P: ¿Los clientes pueden personalizar cuando reciben recordatorios?**
R: Sí, en sus preferencias pueden elegir:
- Solo WhatsApp
- Solo Email  
- Ambos
- Horarios preferidos (no antes de 9 AM, etc.)

**P: ¿Qué pasa si un cliente cancela?**
R: Los recordatorios programados se cancelan automáticamente

**P: ¿Puedo ver qué mensajes se enviaron?**
R: Sí, en Comunicación → Historial con filtros por cliente/fecha

**P: ¿Los recordatorios cuestan dinero?**
R: WhatsApp y SMS tienen costo por mensaje (Twilio). Email es gratis con SendGrid Free tier.

**P: ¿Funciona sin internet?**
R: No, necesita conexión para enviar mensajes. Las citas se guardan localmente pero recordatorios requieren backend activo.

---

## 📞 SOPORTE

**Problemas técnicos:**
- Email: lmarotomar@biovetai.org
- Tel: +1 (904) 934-7620
- Web: www.biovetai.org

**Documentación completa:**
- `/docs/BUSINESS_MODEL.md`
- `/legal/terms-of-service.md`
- `/README.md`

---

**© 2025 VetConnect - BioVetAI**
