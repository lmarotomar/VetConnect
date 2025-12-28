# ACUERDO DE NIVEL DE SERVICIO (SLA)
## VetConnect Premium

**Última actualización:** 7 de diciembre de 2025  
**Válido para:** Suscriptores de VetConnect Premium

---

## 1. INTRODUCCIÓN

Este Acuerdo de Nivel de Servicio ("SLA") describe los niveles de servicio que VetConnect se compromete a proporcionar a suscriptores del Plan Premium.

Este SLA es parte integral de los Términos de Servicio.

---

## 2. DEFINICIONES

**Tiempo de Actividad (Uptime):** Porcentaje de tiempo que el servicio está disponible y funcionando correctamente.

**Tiempo de Inactividad (Downtime):** Periodos donde el servicio no está disponible o no funciona correctamente.

**Disponibilidad:** Capacidad de acceder y usar funcionalidades principales.

**Mantenimiento Planificado:** Ventanas de mantenimiento anunciadas con anticipación.

**Incidente:** Evento que afecta disponibilidad o rendimiento.

---

## 3. NIVELES DE SERVICIO GARANTIZADOS

### 3.1 Disponibilidad de la Plataforma

**Compromiso:**
- **99.5% uptime mensual** para Plan Premium
- **Calculado:** Total horas en mes - mantenimiento planificado

**Exclusiones del cálculo de uptime:**
- Mantenimiento plan ificado (notificado 48h antes)
- Problemas de internet/ISP del usuario
- Fallas de servicios de terceros (AWS, etc.)
- Fuerza mayor

### 3.2 Ventanas de Mantenimiento

**Mantenimiento Regular:**
- **Frecuencia:** Máximo mensual
- **Duración:** Máximo 4 horas
- **Notificación:** Mínimo 48 horas de anticipación
- **Horario:** Preferentemente madrugada (2-6 AM Zona del usuario)

**Mantenimiento de Emergencia:**
- Sin aviso previo si es crítico para seguridad
- Minimizado tanto como sea posible
- Comunicación durante el evento

---

## 4. MÉTRICAS DE RENDIMIENTO

### 4.1 Tiempo de Respuesta de la Aplicación

**Páginas principales:**
- **Carga inicial:** < 3 segundos (percentil 95)
- **Navegación:** < 1 segundo (percentil 95)
- **Guardado de datos:** < 2 segundos (percentil 95)

**API (para integraciones):**
- **Latencia promedio:** < 500ms
- **Percentil 95:** < 1 segundo
- **Percentil 99:** < 2 segundos

### 4.2 Procesamiento de Automatizaciones

**Envío de mensajes:**
- **Confirmaciones:** Dentro de 1 minuto de creación de cita
- **Recordatorios:** Dentro de 15 minutos de hora programada
- **Seguimientos:**Dentro de 1 hora de hora programada

**Sincronización con integraciones:**
- **HubSpot:** Dentro de 5 minutos
- **Google Calendar:** Tiempo real (< 1 minuto)
- **Google Sheets:** Dentro de 15minutos

---

## 5. RESPALDOS (BACKUPS)

### 5.1 Frecuencia

**Plan Premium:**
- **Backups automáticos:** Diarios
- **Retención:** Últimos 30 días
- **Almacenamiento:** Múltiples ubicaciones geográficas

### 5.2 Recuperación

**RTO (Recovery Time Objective):**
- **Meta:** < 4 horas desde solicitud
- **Máximo:** 24 horas

**RPO (Recovery Point Objective):**
- **Meta:** < 24 horas de datos
- **Garantizado:** < 48 horas

---

## 6. SOPORTE TÉCNICO

### 6.1 Canales de Soporte Premium

**Disponibles:**
- ✅ Email prioritario: support@vetconnect.com
- ✅ Chat en vivo (horas de oficina)
- ✅ Base de conocimiento 24/7
- ✅ Video tutoriales

**Plan FREE:**
- Email estándar solamente
- Sin chat en vivo
- Base de conocimiento

### 6.2 Tiempos de Respuesta

**Plan Premium:**

| Prioridad | Primera Respuesta | Resolución Meta |
|-----------|-------------------|-----------------|
| **Crítico** | < 2 horas | < 8 horas |
| **Alto** | < 4 horas | < 24 horas |
| **Medio** | < 8 horas | < 48 horas |
| **Bajo** | < 24 horas | < 5 días |

**Plan FREE:**
| Prioridad | Primera Respuesta | Resolución Meta |
|-----------|-------------------|-----------------|
| Todas | < 48 horas | Best effort |

### 6.3 Clasificación de Prioridad

**Crítico (P1):**
- Servicio completamente inaccesible
- Pérdida de datos
- Brecha de seguridad

**Alto (P2):**
- Funcionalidad principal no disponible
- Afecta múltiples usuarios
- Sin workaround disponible

**Medio (P3):**
- Funcionalidad secundaria afectada
- Workaround disponible
- Problema intermitente

**Bajo (P4):**
- Pregunta general
- Solicitud de feature
- Cosmético

### 6.4 Horario de Soporte

**Soporte por Email:**
- 24/7 para envío
- Respuesta según SLA arriba

**Chat en Vivo (Premium):**
- **Lunes - Viernes:** 8 AM - 8 PM [Zona Horaria]
- **Sábado:** 10 AM - 4 PM [Zona Horaria]
- **Domingo/Feriados:** Solo email

---

## 7. SEGURIDAD Y PROTECCIÓN

### 7.1 Seguridad de Datos

**Cifrado:**
- ✅ TLS 1.3 para datos en tránsito
- ✅ AES-256 para datos en reposo
- ✅ Cifrado end-to-end para comunicaciones

**Autenticación:**
- ✅ Autenticación de dos factores disponible
- ✅ Políticas de contraseña robustas
- ✅ Sesiones con timeout automático

### 7.2 Monitoreo de Seguridad

**24/7:**
- Monitoring de amenazas
- Detección de intrusiones
- Logs de auditoría

**Respuesta a Incidentes:**
- Equipo de seguridad dedicado
- Notificación de brechas < 72 horas
- Plan de respuesta documentado

### 7.3 Cumplimiento

**Estándares:**
- SOC 2 Type II (en proceso)
- GDPR compliant
- CCPA compliant
- ISO 27001 (objetivo futuro)

---

## 8. NOTIFICACIONES Y COMUNICACIÓN

### 8.1 Estado del Servicio

**Status Page:**
- URL: status.vetconnect.com
- Actualización en tiempo real
- Historial de incidentes

**Notificaciones:**
- Email para incidentes que afecten su cuenta
- SMS opcional para incidentes críticos (Premium)
- In-app notifications

### 8.2 Mantenimiento Planificado

**Notificación:**
- Email 48 horas antes (mínimo)
- In-app banner 24 horas antes
- Actualización en status page

---

## 9. CRÉDITOS POR INCUMPLIMIENTO

### 9.1 Tabla de Créditos

Si no cumplimos con 99.5% uptime mensual:

| Uptime Mensual | Crédito de Servicio |
|----------------|---------------------|
| < 99.5% pero ≥ 99.0% | 10% de cuota mensual |
| < 99.0% pero ≥ 95.0% | 25% de cuota mensual |
| < 95.0% | 50% de cuota mensual |

### 9.2 Cómo Solicitar Créditos

**Proceso:**
1. Enviar email a: sla@vetconnect.com
2. Dentro de 30 días del fin del mes afectado
3. Incluir: mes, fechas/horas de inactividad
4. Procesaremos dentro de 15 días
5. Crédito aplicado a próxima factura

**Limitaciones:**
- Un crédito por mes como máximo
- Crédito no en efectivo, solo descuento futuro
- No aplica a causa de usuario o terceros

### 9.3 Remedio Exclusivo

Los créditos de servicio son el ÚNICO remedio por incumplimiento del SLA.

---

## 10. EXCLUSIONES

Este SLA no aplica a downtime causado por:

❌ Mantenimiento planificado notificado  
❌ Problemas de internet del usuario  
❌ Fuerza mayor (desastres naturales, guerras, etc.)  
❌ Fallas de servicios de terceros (AWS, WhatsApp, etc.)  
❌ Ataques DDoS u otros ataques cibernéticos  
❌ Acciones del usuario (modificación no autorizada, etc.)  
❌ Suspensión por violación de términos  
❌ Plan FREE (sin garantías de SLA)  

---

## 11. MONITOREO Y REPORTES

### 11.1 Monitoreo Continuo

Monitoreamos:
- Disponibilidad de servidores
- Tiempos de respuesta
- Tasas de error
- Uso de recursos
- Salud de base de datos

### 11.2 Reportes

**Disponibles para Premium:**
- Reporte mensual de uptime
- Estadísticas de su uso
- Métricas de automatizaciones
- Opcional: envío automático mensual

---

## 12. MEJORA CONTINUA

### 12.1 Revisión de Incidentes

**Post-Mortem:**
- Para incidentes críticos (P1)
- Documentación de causa raíz
- Plan de prevención
- Comunicación a usuarios afectados

### 12.2 Evolución del SLA

- Revisamos SLA trimestralmente
- Mejoras basadas en feedback
- Notificación de cambios con 60 días

---

## 13. SOPORTE DE ONBOARDING (Premium)

### 13.1 Nuevos Clientes Premium

**Incluido:**
- ✅ Sesión de onboarding de 1 hora (video)
- ✅ Configuración asistida de integraciones
- ✅ Importación de datos desde sistema anterior
- ✅ Training de equipo (hasta 5 usuarios)
- ✅ Materiales de capacitación personalizados

### 13.2 Migración de Datos

**Asistimos con:**
- Export desde sistema anterior
- Mapping de datos
- Import a VetConnect
- Validación de integridad

**Formatos soportados:**
- Excel, CSV
- SQL databases
- APIs de sistemas veterinarios comunes

---

## 14. CONTACTO SLA

**Preguntas sobre SLA:**  
sla@vetconnect.com

**Reportar incidentes:**  
support@vetconnect.com (marcar como "Urgente")

**Solicitar créditos de servicio:**  
sla@vetconnect.com

**Status del servicio:**  
status.vetconnect.com

---

## RESUMEN EJECUTIVO

| Métrica | Plan FREE | Plan PREMIUM |
|---------|-----------|--------------|
| **Uptime garantizado** | Best effort | 99.5% |
| **Soporte** | Email 48h | Email 2-24h + Chat |
| **Backups** | Semanal | Diario |
| **Retención** | 7 días | 30 días |
| **Onboarding** | Auto-servicio | 1 hora asistida |
| **Créditos** | No | Sí |

---

**Este SLA demuestra nuestro compromiso con la excelencia en el servicio para clientes Premium de VetConnect.**

**© 2025 VetConnect. Todos los derechos reservados.**
