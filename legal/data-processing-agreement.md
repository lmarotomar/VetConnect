# Acuerdo de Procesamiento de Datos (DPA)

**Fecha de Vigencia:** 1 de enero de 2025  
**Versión:** 1.0

Este Acuerdo de Procesamiento de Datos ("**DPA**") se celebra entre:

**Controlador de Datos:** La clínica veterinaria o entidad comercial que se suscribe a VetConnect ("**Cliente**")  
**Procesador de Datos:** VetConnect, operado por BioVetAI ("**VetConnect**", "nosotros", "nos")

Este DPA complementa los Términos de Servicio de VetConnect y se aplica a todo el procesamiento de Datos Personales por parte de VetConnect en nombre del Cliente.

---

## 1. Definiciones

**Datos Personales:** Cualquier información relacionada con una persona física identificada o identificable (dueño de mascota/cliente).

**Procesamiento:** Cualquier operación realizada sobre Datos Personales, incluyendo recopilación, almacenamiento, uso, divulgación o eliminación.

**Sub-procesador:** Cualquier tercero contratado por VetConnect para procesar Datos Personales.

**Interesado (Sujeto de Datos):** La persona (dueño de mascota/cliente) cuyos Datos Personales están siendo procesados.

**Autoridad de Control:** La autoridad de protección de datos con jurisdicción (ej. AEPD, ICO, CNIL, etc.).

**GDPR:** Reglamento General de Protección de Datos (UE) 2016/679.

**CCPA:** Ley de Privacidad del Consumidor de California.

---

## 2. Alcance y Roles

### 2.1 Relación Controlador y Procesador

**El Cliente** es el **Controlador de Datos**:
- Determina los fines y medios del procesamiento de Datos Personales
- Es responsable del cumplimiento de las leyes de protección de datos
- Debe tener una base legal para el procesamiento (consentimiento, contrato, interés legítimo)

**VetConnect** es el **Procesador de Datos**:
- Procesa Datos Personales solo bajo instrucciones documentadas del Cliente
- No determina fines o medios del procesamiento
- Actúa únicamente como proveedor de servicios

### 2.2 Detalles del Procesamiento

**Asunto:** Provisión de software de gestión de clínicas veterinarias (SaaS).

**Duración:** Por el término de la suscripción a VetConnect.

**Naturaleza y Propósito:**
- Programación y gestión de citas
- Almacenamiento de registros de clientes y pacientes
- Comunicaciones automatizadas (WhatsApp, SMS, Email)
- Integración y sincronización de CRM
- Procesamiento de facturación y pagos
- Informes y análisis

**Categorías de Interesados:**
- Dueños de mascotas (clientes de la clínica)
- Personal de la clínica/veterinarios
- Contactos de emergencia

**Tipos de Datos Personales Procesados:**

| Categoría | Campos de Datos |
|-----------|-----------------|
| **Información de Contacto** | Nombre, email, teléfono, dirección |
| **Información de Mascota** | Nombre, especie, raza, edad, historial médico |
| **Datos de Cita** | Fecha, hora, tipo, notas, respuestas de triaje |
| **Registros de Comunicación** | Mensajes de WhatsApp, SMS, emails enviados/recibidos |
| **Información de Facturación** | Facturas, métodos de pago (tokenizados), historial de transacciones |
| **Datos de Uso** | Tiempos de inicio de sesión, direcciones IP, tipo de navegador |

---

## 3. Instrucciones del Cliente

### 3.1 Alcance de las Instrucciones

VetConnect procesará Datos Personales solo de acuerdo con las instrucciones documentadas del Cliente, que incluyen:

1. **Uso de la Plataforma VetConnect** como se describe en los Términos de Servicio
2. **Configuraciones** definidas por el Cliente en la aplicación
3. **Integraciones API** habilitadas por el Cliente (HubSpot, Google, etc.)
4. **Plantillas de Comunicación** creadas o aprobadas por el Cliente
5. **Instrucciones Escritas Específicas** proporcionadas vía email a support@vetconnect.com

### 3.2 Cumplimiento de Instrucciones

Si VetConnect cree que una instrucción viola el GDPR, CCPA u otras leyes de protección de datos:
1. Informará inmediatamente al Cliente
2. Suspenderá la instrucción hasta que se resuelva
3. Documentará la preocupación por escrito

### 3.3 Cambios a las Instrucciones

El Cliente puede cambiar las instrucciones de procesamiento:
- Actualizando configuraciones en el panel de VetConnect
- Enviando una solicitud por escrito a support@vetconnect.com

VetConnect implementará los cambios dentro de **5 días hábiles**.

---

## 4. Obligaciones de VetConnect

### 4.1 Confidencialidad

Todo el personal de VetConnect con acceso a Datos Personales está:
- Obligado por acuerdos de confidencialidad (contractuales o estatutarios)
- Capacitado en principios de protección de datos
- Con acceso otorgado solo en base a necesidad de conocer

Se realizan **verificaciones de antecedentes** para todos los empleados que manejan Datos Personales.

### 4.2 Medidas de Seguridad

VetConnect implementa medidas técnicas y organizativas de **última generación**:

#### Medidas Técnicas:
- ✅ **Cifrado en reposo** (AES-256)
- ✅ **Cifrado en tránsito** (TLS 1.3)
- ✅ **Autenticación multifactor** (MFA)
- ✅ **Control de acceso basado en roles** (RBAC)
- ✅ **Respaldos automatizados** (diarios, cifrados)
- ✅ **Sistemas de detección de intrusiones** (IDS/IPS)
- ✅ **Protección DDoS** (Cloudflare)
- ✅ **Monitoreo y registro de seguridad** (SIEM)

#### Medidas Organizativas:
- ✅ Centros de datos certificados **ISO 27001**
- ✅ Cumplimiento **SOC 2 Tipo II** (auditoría anual)
- ✅ **Plan de respuesta a incidentes** (guardia 24/7)
- ✅ **Pruebas de penetración regulares** (trimestrales)
- ✅ **Capacitación de seguridad para empleados** (anual)
- ✅ **Evaluaciones de impacto de protección de datos** (DPIA)

**Política de Seguridad Completa:** [security-policy.md](security-policy.md)

### 4.3 Sub-procesadores

VetConnect contrata a los siguientes Sub-procesadores:

| Sub-procesador | Servicio | Ubicación | Salvaguardas |
|----------------|----------|-----------|--------------|
| **AWS** | Alojamiento en la nube | EE. UU. (us-east-1) | Cláusulas Contractuales Tipo (SCCs) |
| **Stripe** | Procesamiento de pagos | EE. UU. | PCI-DSS Nivel 1, SCCs |
| **Twilio** | SMS/WhatsApp | EE. UU. | Cumple GDPR, SCCs |
| **SendGrid** | Envío de email | EE. UU. | Cumple GDPR, SCCs |
| **Google Cloud** | Integración Calendar/Sheets | EE. UU. | Cumple GDPR, SCCs |
| **HubSpot** | Integración CRM | EE. UU. | Cumple GDPR, sucesor de Privacy Shield |

#### Cambios de Sub-procesador:

VetConnect proporcionará **30 días de aviso** antes de:
- Agregar un nuevo Sub-procesador
- Reemplazar un Sub-procesador existente

**El Cliente puede objetar** a un nuevo Sub-procesador. Si la objeción es razonable, VetConnect podrá:
1. No usar el Sub-procesador, o
2. Permitir al Cliente terminar el acuerdo sin penalización

**Lista actual de Sub-procesadores:** Siempre disponible en https://www.vetconnect.com/sub-processors

### 4.4 Derechos del Interesado

VetConnect asistirá al Cliente en el cumplimiento de solicitudes de Interesados:

| Derecho | Acción de VetConnect | Tiempo de Respuesta |
|---------|----------------------|---------------------|
| **Acceso** | Proveer herramientas para exportar datos | 48 horas |
| **Rectificación** | Permitir al Cliente editar registros | Tiempo real |
| **Supresión** | Proveer funcionalidad de eliminación | 48 horas |
| **Limitación** | Soportar congelamiento de datos | 48 horas |
| **Portabilidad** | Exportar en formato legible por máquina (JSON, CSV) | 48 horas |
| **Oposición** | Asistir con procesamiento de exclusión | 48 horas |

**Nota:** El Cliente es responsable de verificar la identidad de los Interesados.

### 4.5 Notificación de Brecha de Datos

En caso de una brecha de Datos Personales, VetConnect:

**Dentro de 24 horas:**
1. Notificará al Cliente vía email a contactos administrativos
2. Proveerá evaluación inicial de la brecha
3. Asignará un gerente de incidentes dedicado

**Dentro de 72 horas:**
1. Proveerá un informe escrito detallado incluyendo:
   - Naturaleza de la brecha
   - Categorías y número aproximado de Interesados afectados
   - Consecuencias probables
   - Medidas tomadas o propuestas para mitigar

VetConnect **asistirá razonablemente** al Cliente en la notificación a Autoridades de Control e Interesados si es requerido.

### 4.6 Auditorías e Inspecciones

El Cliente tiene derecho a auditar el cumplimiento de este DPA por parte de VetConnect:

**Informe SOC 2 Anual:** Provisto anualmente sin cargo.

**Auditoría In Situ:** El Cliente puede realizar o designar un auditor independiente para realizar una auditoría in situ:
- Máximo **una vez al año** (a menos que haya ocurrido una brecha)
- Con **30 días de aviso por escrito**
- Durante horas laborales
- Sujeto a obligaciones de confidencialidad
- **Costo:** A cargo del Cliente

VetConnect proporcionará **asistencia razonable** y acceso a:
- Registros y documentación relevantes
- Personal para entrevistas
- Sistemas para revisión técnica (en entorno controlado)

### 4.7 Retención y Eliminación de Datos

**Durante el Acuerdo:**
- Los Datos Personales se retienen mientras la cuenta del Cliente esté activa
- El Cliente puede eliminar datos en cualquier momento vía la aplicación

**Después de la Terminación:**

| Plazo | Acción |
|-------|--------|
| **0-30 días** | Datos permanecen accesibles para exportación |
| **30 días** | Comienza eliminación automatizada de sistemas de producción |
| **60 días** | Eliminación de sistemas de respaldo |
| **90 días** | Destrucción completa, incluyendo:  • Respaldos cifrados  • Logs con Datos Personales  • Datos en Sub-procesadores |

**Certificado de Eliminación:** Provisto bajo solicitud escrita.

**Excepción de Retención Legal:** Si es requerido por ley o procedimientos legales, VetConnect notificará al Cliente de cualquier eliminación retrasada.

---

## 5. Transferencias Internacionales de Datos

### 5.1 Transferencias de EEE a EE. UU.

Para transferencias de Datos Personales desde el Espacio Económico Europeo (EEE) a los EE. UU.:

**Mecanismo:** Cláusulas Contractuales Tipo (SCCs) aprobadas por la Comisión Europea.

**SCCs incorporadas** por referencia: [Decisión UE SCCs 2021/914](https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj)

**Módulo:** Módulo Dos (Controlador a Procesador)

**Cláusulas Opcionales:** Cláusula de anclaje (docking clause) habilitada, permitiendo que nuevas partes se unan.

### 5.2 Transferencias del Reino Unido

Para transferencias desde el Reino Unido:

**Mecanismo:** Acuerdo de Transferencia Internacional de Datos del Reino Unido (IDTA) o Adenda del Reino Unido a las SCCs de la UE.

### 5.3 Suiza

Para transferencias desde Suiza:

**Mecanismo:** SCCs aprobadas por Suiza

### 5.4 Medidas Suplementarias

Además de las SCCs, VetConnect implementa medidas técnicas suplementarias:
- Cifrado de extremo a extremo
- Seudonimización donde sea posible
- Controles de acceso estrictos
- Restricciones contractuales sobre acceso gubernamental

### 5.5 Sucesor de Privacy Shield

VetConnect monitorea y adoptará cualquier marco sucesor del Escudo de Privacidad UE-EE. UU. si es adoptado.

---

## 6. Obligaciones del Cliente

### 6.1 Base Legal

El Cliente debe asegurar que tiene una base legal válida para el procesamiento:
- ✅ Consentimiento de dueños de mascotas
- ✅ Necesidad contractual
- ✅ Obligación legal
- ✅ Intereses legítimos

### 6.2 Transparencia

El Cliente debe informar a los Interesados sobre:
- Procesamiento por VetConnect
- Uso de cookies y rastreo
- Transferencias de datos a terceros países
- Sus derechos bajo leyes de protección de datos

**Recomendado:** Enlazar a la Política de Privacidad de VetConnect en el aviso de privacidad de su clínica.

### 6.3 Minimización de Datos

El Cliente solo debe recopilar y procesar Datos Personales que sean:
- Necesarios para el propósito especificado
- Precisos y actualizados
- Retenidos no más de lo necesario

---

## 7. Responsabilidad e Indemnización

### 7.1 Límite de Responsabilidad

La responsabilidad total de VetConnect bajo este DPA está limitada a la cláusula de **Limitación de Responsabilidad** en los Términos de Servicio.

**Excepción:** Sin límite de responsabilidad para:
- Negligencia grave o dolo
- Violación de leyes de protección de datos debido a acciones de VetConnect
- Brechas de datos causadas por fallas de seguridad de VetConnect

### 7.2 Indemnización

Cada parte indemnizará a la otra por:
- Reclamaciones derivadas del incumplimiento de este DPA
- Multas de Autoridades de Control debidas al incumplimiento de la otra parte
- Reclamaciones de terceros relacionadas con violaciones de protección de datos

---

## 8. Término y Terminación

### 8.1 Término

Este DPA permanece en vigor por la duración de la suscripción a VetConnect.

### 8.2 Supervivencia

Las siguientes obligaciones sobreviven a la terminación:
- Eliminación de datos (Sección 4.7)
- Confidencialidad (Sección 4.1)
- Derechos de auditoría (por 1 año post-terminación)
- Indemnización (Sección 7.2)

---

## 9. Enmiendas

Este DPA puede ser enmendado:
- Para reflejar cambios en la ley de protección de datos
- Para agregar nuevos Sub-procesadores (con 30 días de aviso)
- Por acuerdo mutuo por escrito

**Notificación:** Los cambios serán notificados vía email y publicados en https://www.vetconnect.com/legal/dpa

---

## 10. Ley Aplicable y Jurisdicción

Este DPA se rige por la misma ley y jurisdicción que los Términos de Servicio de VetConnect, **excepto** donde la ley de protección de datos mande una jurisdicción diferente.

Para disputas relacionadas con GDPR, los tribunales del Estado Miembro del Cliente tienen jurisdicción.

---

## 11. Información de Contacto

**Delegado de Protección de Datos (DPO) de VetConnect:**  
Email: dpo@vetconnect.com  
Correo: VetConnect - Data Protection Officer  
BioVetAI  
[Su Dirección]

**DPO/Contacto del Cliente:**  
A ser especificado en la configuración de la cuenta del Cliente.

---

## Apéndice A: Medidas Técnicas y Organizativas (TOMs)

_Ver [security-policy.md](security-policy.md) para detalles completos._

## Apéndice B: Cláusulas Contractuales Tipo

_Incorporadas por referencia: Decisión UE SCCs 2021/914, Módulo Dos._

## Apéndice C: Lista de Sub-procesadores

_Siempre actual en: https://www.vetconnect.com/sub-processors_

---

**Al usar VetConnect, el Cliente acepta este Acuerdo de Procesamiento de Datos.**

**Última Actualización:** 1 de enero de 2025  
**Versión:** 1.0
