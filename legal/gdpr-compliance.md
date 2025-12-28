# Guía de Cumplimiento GDPR

**VetConnect - Cumplimiento del Reglamento General de Protección de Datos**  
**Versión:** 1.0  
**Fecha de Vigencia:** 1 de enero de 2025

Este documento describe cómo VetConnect cumple con el Reglamento General de Protección de Datos (GDPR) de la UE y cómo nuestros clientes (clínicas veterinarias) pueden usar VetConnect de manera compatible con GDPR.

---

## 1. Resumen Ejecutivo

VetConnect se compromete a proteger los datos personales y cumplir con los requisitos del GDPR. Esta guía cubre:

✅ Nuestro rol como Procesador de Datos  
✅ Sus responsabilidades como Controlador de Datos  
✅ Implementación de Derechos de los Interesados  
✅ Medidas de seguridad y salvaguardas  
✅ Transferencias internacionales de datos  
✅ Procedimientos de notificación de brechas  

---

## 2. Fundamentos de GDPR

### 2.1 ¿Qué es GDPR?

El **Reglamento General de Protección de Datos (GDPR)** es una ley de la UE que:
- Protege los datos personales de los residentes de la UE
- Aplica a cualquier organización que procese datos de residentes de la UE
- Impone multas significativas por incumplimiento (hasta €20M o 4% de ingresos globales)

**Aplica a usuarios de VetConnect que:**
- Tienen clínicas en la UE
- Sirven a clientes/dueños de mascotas en la UE
- Procesan datos personales de residentes de la UE

### 2.2 Principios Clave

GDPR requiere que los datos personales sean:

| Principio | Significado | Implementación en VetConnect |
|-----------|-------------|------------------------------|
| **Licitud** | Tener base legal | Consentimiento, contrato, interés legítimo |
| **Lealtad** | Procesamiento transparente | Avisos de privacidad claros |
| **Transparencia** | Informar a interesados | Política de Privacidad, avisos in-app |
| **Limitación de Propósito** | Recopilar para fines específicos | Solo datos de citas/médicos |
| **Minimización de Datos** | Recopilar solo lo necesario | Campos configurables |
| **Exactitud** | Mantener datos actualizados | Funcionalidad de editar/actualizar |
| **Limitación de Plazo** | No guardar más de lo necesario | Retención configurable |
| **Integridad** | Procesamiento seguro | Cifrado, controles de acceso |
| **Responsabilidad** | Demostrar cumplimiento | Logs de auditoría, documentación |

---

## 3. Roles y Responsabilidades

### 3.1 VetConnect como Procesador de Datos

**Procesamos datos personales en su nombre**

**Nuestras Obligaciones:**
- ✅ Procesar datos solo según sus instrucciones
- ✅ Asegurar la confidencialidad del personal
- ✅ Implementar medidas de seguridad apropiadas
- ✅ Asistir con solicitudes de derechos de interesados
- ✅ Notificarle de brechas de datos dentro de 24 horas
- ✅ Eliminar datos bajo su solicitud
- ✅ Mantener registros de actividades de procesamiento

**Documentado en:** [Acuerdo de Procesamiento de Datos (DPA)](data-processing-agreement.md)

### 3.2 Usted (Clínica) como Controlador de Datos

**Usted determina qué datos se recopilan y por qué**

**Sus Obligaciones:**
- ✅ Tener una base legal para el procesamiento
- ✅ Informar a dueños de mascotas sobre el procesamiento
- ✅ Obtener consentimiento explícito donde sea requerido
- ✅ Responder a solicitudes de derechos de interesados
- ✅ Reportar brechas a la autoridad de control (dentro de 72 horas)
- ✅ Realizar Evaluaciones de Impacto de Protección de Datos (DPIAs)
- ✅ Designar un Delegado de Protección de Datos (DPO) si es requerido

### 3.3 Cuándo se Requiere DPO

Debe designar un DPO si:
- ✅ Es una autoridad pública (clínica veterinaria pública)
- ✅ Sus actividades principales requieren monitoreo sistemático a gran escala
- ✅ Procesa categorías especiales de datos a gran escala

**Categorías especiales de datos incluyen:** Datos de salud (historias clínicas de mascotas pueden calificar).

**La mayoría de las clínicas veterinarias privadas** no requieren un DPO formal pero deben designar un punto de contacto de privacidad.

---

## 4. Base Legal para el Procesamiento

### 4.1 Bases Legales Disponibles

Elija UNA base legal para cada actividad de procesamiento:

#### 1. **Consentimiento**
- **Cuándo:** El dueño de mascota acepta explícitamente
- **Ejemplo:** Comunicaciones de marketing, funciones opcionales
- **Requisitos:** Libre, específico, informado, inequívoco
- **Herramienta VetConnect:** Checkboxes de consentimiento en formularios

#### 2. **Contrato**
- **Cuándo:** Procesamiento necesario para proveer servicio
- **Ejemplo:** Programación de citas, historias clínicas
- **Herramienta VetConnect:** Aceptación de Términos de Servicio

#### 3. **Obligación Legal**
- **Cuándo:** Requerido por ley
- **Ejemplo:** Reportar enfermedades animales a autoridades
- **Herramienta VetConnect:** Campos obligatorios para cumplimiento legal

#### 4. **Intereses Legítimos**
- **Cuándo:** Procesamiento necesario para sus intereses legítimos
- **Ejemplo:** Prevención de fraude, seguridad de red
- **Prueba de equilibrio:** Su interés no debe anular derechos del dueño
- **Herramienta VetConnect:** Plantilla de Evaluación de Interés Legítimo (LIA)

#### 5. **Intereses Vitales**
- **Cuándo:** Proteger vida/salud
- **Ejemplo:** Atención veterinaria de emergencia
- **Raro en la práctica**

#### 6. **Misión Pública**
- **Cuándo:** Realizar tareas de interés público
- **Ejemplo:** Servicios veterinarios de salud pública
- **Raro para clínicas privadas**

### 4.2 Gestión de Consentimiento en VetConnect

**Cómo obtener consentimiento:**

1. **Durante el Registro de Cliente:**
   ```
   ☑️ Consiento que VetConnect almacene mi información de contacto
      para recordatorios de citas (requerido)
   
   ☐ Consiento recibir comunicaciones de marketing sobre
      consejos de cuidado y promociones (opcional)
   ```

2. **Consentimiento Granular:**
   - Checkboxes separados para cada propósito
   - Casillas pre-marcadas NO son consentimiento válido
   - Fácil de retirar en cualquier momento

3. **Registro de Consentimiento:**
   - VetConnect registra: quién, cuándo, qué, cómo
   - Almacenado en perfil del cliente
   - Disponible para auditoría

**Retirar Consentimiento:**
- El dueño puede retirar vía Configuración > Privacidad
- El personal de la clínica puede retirar en su nombre
- El procesamiento se detiene inmediatamente (excepto donde aplique otra base legal)

---

## 5. Derechos del Interesado

### 5.1 Derechos Bajo GDPR

GDPR otorga a dueños de mascotas (interesados) 8 derechos:

| Derecho | Qué significa | Función VetConnect |
|---------|---------------|-------------------|
| **1. Derecho a Estar Informado** | Saber cómo se usan sus datos | Política de Privacidad, avisos in-app |
| **2. Derecho de Acceso** | Solicitar copia de sus datos | Botón exportar (JSON, PDF, CSV) |
| **3. Derecho de Rectificación** | Corregir datos inexactos | Editar perfil de cliente |
| **4. Derecho de Supresión** | Eliminar sus datos ("derecho al olvido") | Botón eliminar con confirmación |
| **5. Derecho a la Limitación** | Congelar sus datos | Funcionalidad "Congelar Cuenta" |
| **6. Derecho a la Portabilidad** | Recibir datos en formato legible | Exportar como JSON/CSV |
| **7. Derecho de Oposición** | Objetar cierto procesamiento | Enlaces de opt-out |
| **8. Derechos sobre Decisiones Automatizadas** | No ser sujeto a perfiles automatizados | No usamos decisiones automatizadas |

### 5.2 Respondiendo a Solicitudes

**Cronograma:** Debe responder dentro de **1 mes** (extensible por 2 meses si es complejo).

**Cómo Ayuda VetConnect:**

#### Solicitud de Acceso (SAR)
1. Dueño solicita sus datos
2. Usted verifica su identidad
3. En VetConnect: **Perfil Cliente > Exportar Datos**
4. Descarga incluye:
   - Info de contacto
   - Detalles de mascota
   - Historial de citas
   - Logs de comunicación
   - Registros de facturación
5. Enviar al dueño (email cifrado o enlace seguro)

#### Solicitud de Eliminación
1. Dueño solicita eliminación
2. Usted verifica identidad y revisa retenciones legales
3. En VetConnect: **Perfil Cliente > Eliminar Cuenta**
4. Diálogo de confirmación:
   ```
   ⚠️ ¿Está seguro? Esto eliminará:
   - Todos los registros de mascotas
   - Historial de citas
   - Logs de comunicación
   - No se puede deshacer
   
   [Cancelar] [Eliminar Permanentemente]
   ```
5. Datos eliminados de producción en 24 horas
6. Eliminados de respaldos en 90 días

#### Solicitud de Rectificación
1. Dueño solicita corrección
2. En VetConnect: **Perfil Cliente > Editar**
3. Actualizar información
4. El sistema registra el cambio para auditoría

#### Solicitud de Portabilidad
1. Igual que Solicitud de Acceso pero el formato importa
2. VetConnect provee: JSON, CSV, Excel
3. Campos comunes mapeados a esquemas estándar

### 5.3 Razones Válidas para Rechazar

Puede rechazar una solicitud si:
- ❌ La solicitud es manifiestamente infundada o excesiva
- ❌ No puede verificar la identidad del solicitante
- ❌ Obligación legal requiere mantener los datos
- ❌ Datos necesarios para reclamaciones legales

**Importante:** Debe explicar el rechazo por escrito dentro de 1 mes.

---

## 6. Seguridad y Protección de Datos desde el Diseño

### 6.1 Medidas Técnicas

VetConnect implementa:

**Cifrado:**
- ✅ Cifrado AES-256 en reposo
- ✅ Cifrado TLS 1.3 en tránsito
- ✅ Cifrado de extremo a extremo para campos sensibles (opcional)

**Controles de Acceso:**
- ✅ Autenticación multifactor (MFA)
- ✅ Control de acceso basado en roles (RBAC)
- ✅ Principio de menor privilegio
- ✅ Tiempo de espera de sesión automático

**Segregación de Datos:**
- ✅ Datos de cada clínica aislados (multi-tenencia)
- ✅ Separación lógica entre entornos (dev/staging/prod)

**Monitoreo:**
- ✅ Detección de intrusiones en tiempo real
- ✅ Logs de auditoría para todo acceso a datos
- ✅ Detección automatizada de anomalías

**Detalles completos:** [Política de Seguridad](security-policy.md)

### 6.2 Medidas Organizativas

**Políticas:**
- Plan de Respuesta a Incidentes de Seguridad
- Procedimiento de Notificación de Brecha de Datos
- Capacitación de Protección de Datos para Empleados (anual)
- Verificación de antecedentes para todo el personal

**Certificaciones:**
- ISO 27001 (Seguridad de la Información)
- SOC 2 Tipo II (auditoría anual)
- Cumplimiento GDPR certificado por auditor externo

### 6.3 Privacidad desde el Diseño

VetConnect está construido con privacidad en su núcleo:

**Minimización de Datos:**
- Solo campos requeridos son obligatorios
- Campos opcionales claramente marcados
- Sin recopilación de datos innecesaria

**Seudonimización:**
- IDs internos en lugar de identificadores personales donde sea posible
- Analítica usa solo datos agregados/anonimizados

**Predeterminados que Preservan Privacidad:**
- Marketing opt-in (no opt-out)
- Límites estrictos de retención de datos
- Anonimización automática de registros antiguos

---

## 7. Transferencias Internacionales de Datos

### 7.1 ¿Dónde se Almacenan los Datos?

**Ubicación Primaria:** AWS us-east-1 (Virginia, EE. UU.)

**Respaldos:** AWS us-west-2 (Oregón, EE. UU.)

**Esto significa:** Los datos se transfieren de la UE a EE. UU.

### 7.2 Mecanismos de Transferencia

Para transferencias UE a EE. UU., VetConnect usa:

#### Cláusulas Contractuales Tipo (SCCs)
- ✅ Aprobadas por Comisión Europea (Decisión 2021/914)
- ✅ Módulo Dos: Controlador a Procesador
- ✅ Incluidas en nuestro [DPA](data-processing-agreement.md)

#### Medidas Suplementarias
- ✅ Cifrado (extremo a extremo)
- ✅ Controles de acceso estrictos
- ✅ Restricciones contractuales sobre acceso gubernamental
- ✅ Informes de transparencia

#### Evaluación de Impacto de Transferencia (TIA)
Hemos realizado una TIA y determinado que:
- SCCs + medidas técnicas proveen protección adecuada
- Sin probabilidad sustancial de acceso gubernamental de EE. UU.
- El cifrado hace los datos ininteligibles para terceros

**Alojamiento solo en UE (opcional):**
Clientes Enterprise pueden solicitar residencia de datos solo en UE (región Frankfurt) por tarifa adicional.

### 7.3 Ubicaciones de Sub-procesadores

Todos los Sub-procesadores están:
- En la UE/EEE, o
- Tienen salvaguardas adecuadas (SCCs o decisión de adecuación)

**Lista completa:** [Registro de Sub-procesadores](https://www.vetconnect.com/sub-processors)

---

## 8. Gestión de Brechas de Datos

### 8.1 ¿Qué es una Brecha de Datos Personales?

Una brecha de seguridad que conduce a:
- Destrucción accidental o ilícita
- Pérdida, alteración, divulgación no autorizada
- Acceso no autorizado a datos personales

**Ejemplos:**
- Ataque de ransomware cifrando base de datos
- Empleado envía lista de clientes por error a persona equivocada
- Laptop perdida/robada con datos de clientes sin cifrar
- Hacker gana acceso a cuenta administrativa

### 8.2 Respuesta de VetConnect (como Procesador)

**Dentro de 24 horas:**
1. Detectar y contener la brecha
2. Notificarle a usted (Cliente) vía email + teléfono
3. Proveer evaluación inicial

**Dentro de 72 horas:**
1. Informe escrito completo incluyendo:
   - Fecha/hora de la brecha
   - Categorías de datos afectados
   - Número de interesados afectados
   - Análisis de causa raíz
   - Pasos de remedición tomados
   - Recomendaciones

2. Asistencia con:
   - Notificación a autoridad de control
   - Notificación a interesados (si es requerido)
   - Respuesta a medios

### 8.3 Sus Obligaciones de Brecha (como Controlador)

**Dentro de 72 horas de enterarse:**
1. **Notificar Autoridad de Control:**
   - Su DPA nacional (ej. AEPD, CNIL)
   - Usar su portal online o email
   - Incluir: naturaleza, interesados afectados, consecuencias, medidas

2. **Evaluar si los Interesados Deben Ser Notificados:**
   - **Sí, si:** Alto riesgo para derechos/libertades
   - **No, si:** 
     - Datos estaban cifrados (y clave no comprometida)
     - Medidas subsecuentes eliminan riesgo
     - Esfuerzo desproporcionado (puede usar aviso público)

3. **Documentar Todo:**
   - Hechos de la brecha
   - Efectos
   - Acción remedial
   - Guardar para auditoría (indefinidamente)

**Multas por incumplimiento:** Hasta €10M o 2% de facturación global

**Hotline de Brechas VetConnect:** breach@vetconnect.com (24/7)

---

## 9. Evaluación de Impacto de Protección de Datos (DPIA)

### 9.1 Cuándo se Requiere DPIA

Realice una DPIA antes de:
- Procesar datos sensibles/categoría especial a gran escala
- Monitoreo sistemático a gran escala
- Usar nuevas tecnologías con alto riesgo

**Para usuarios VetConnect:**
- Mayoría de clínicas: **No requerido** (procesamiento a pequeña escala)
- Grandes cadenas, multi-ubicación: **Recomendado**
- Si comparte datos con instituciones de investigación: **Requerido**

### 9.2 Plantilla DPIA

VetConnect provee una plantilla DPIA para clientes:

**Secciones:**
1. Descripción de operaciones de procesamiento
2. Necesidad y proporcionalidad
3. Riesgos a derechos de interesados
4. Medidas para abordar riesgos
5. Consulta con partes interesadas

**Descarga:** [Plantilla DPIA](https://www.vetconnect.com/resources/dpia-template.docx)

---

## 10. Datos de Niños

### 10.1 ¿Se Requiere Consentimiento Parental?

**GDPR:** Si el dueño de mascota es menor de 16 (o edad menor fijada por Estado Miembro), se requiere consentimiento parental para servicios online.

**Posición de VetConnect:**
- Recopilamos datos sobre dueños (clientes), no sobre mascotas
- Menores raramente poseen mascotas a su nombre
- Sin embargo: Si un menor es el dueño legal, se requiere consentimiento parental

### 10.2 Verificación de Edad

VetConnect incluye:
- Filtro de edad en registro: "¿Eres mayor de 18 años?"
- Formulario de consentimiento parental para menores
- Restricción en procesamiento de datos de menores

**Su responsabilidad:** Verificar edad al registrar nuevos clientes en persona.

---

## 11. Datos de Categoría Especial

### 11.1 ¿Qué son Datos de Categoría Especial?

El Artículo 9 del GDPR prohíbe procesar datos que revelen:
- Origen racial/étnico
- Opiniones políticas
- Creencias religiosas
- Membresía sindical
- **Datos de salud**
- Vida sexual/orientación sexual
- Datos genéticos/biométricos

**VetConnect:**
- **Registros médicos de mascotas = datos de salud de mascota** (no humana)
- **No considerado generalmente categoría especial** bajo GDPR
- **Sin embargo:** Si los registros médicos contienen info de salud humana (ej. "Dueño alérgico a X"), esto SÍ es categoría especial

### 11.2 Procesando Datos de Categoría Especial

Si procesa datos de categoría especial, necesita:
- **Consentimiento explícito**, o
- **Obligación legal**, o
- **Intereses vitales** (vida/muerte), o
- **Diagnóstico médico** (profesional de salud)

**Recomendación VetConnect:**
- Evitar registrar datos de salud humana en registros de mascotas
- Si es necesario, obtener consentimiento explícito
- Usar campos de texto libre con moderación

### 11.3 Seguridad para Datos de Categoría Especial

VetConnect aplica **seguridad mejorada** a campos marcados como conteniendo datos de categoría especial:
- Capa de cifrado adicional
- Acceso restringido (necesidad de conocer)
- Registro de auditoría de todo acceso
- Claves de cifrado de respaldo separadas

---

## 12. Cookies y Rastreo Online

### 12.1 Consentimiento de Cookies (Directiva ePrivacy)

Además del GDPR, la Directiva ePrivacy requiere:
- **Consentimiento antes de colocar cookies** (excepto esenciales)
- Información clara sobre propósitos de cookies
- Fácil exclusión (opt-out)

**Cumplimiento VetConnect:**
- Banner de consentimiento de cookies en primera visita
- Opciones de consentimiento granular
- Fácil revocación

**Detalles completos:** [Política de Cookies](cookie-policy.md)

### 12.2 Do Not Track (DNT)

VetConnect respeta la señal de navegador DNT:
- Si DNT habilitado: Sin analítica, sin cookies de publicidad
- Solo cookies esenciales y funcionales

---

## 13. Gestión de Proveedores

### 13.1 Diligencia Debida de Sub-procesadores

VetConnect evalúa a todos los Sub-procesadores por:
- Cumplimiento GDPR
- Medidas de seguridad adecuadas
- Salvaguardas de transferencia de datos
- Historial

**Notificación al cliente:** 30 días antes de contratar nuevo Sub-procesador

**Derecho a objetar:** Si objeta, encontraremos alternativa o permitiremos terminación sin penalización

### 13.2 Sus Proveedores

Si usa otras herramientas junto con VetConnect:
- Usted es Controlador de Datos para esas herramientas también
- Asegure que tengan DPAs vigentes
- Verifique su cumplimiento GDPR

**Ejemplos:**
- Plataformas de email marketing
- Redes sociales (si recopila datos vía Facebook)
- Procesadores de pagos (si separados de VetConnect)

---

## 14. Autoridades de Control

### 14.1 DPAs de Estados Miembros de UE

Cada país de la UE tiene una autoridad de control (DPA):

| País | Autoridad | Sitio Web |
|------|-----------|-----------|
| **Irlanda** | Data Protection Commission (DPC) | dataprotection.ie |
| **Alemania** | Bundesbeauftragter für Datenschutz | bfdi.bund.de |
| **Francia** | CNIL | cnil.fr |
| **España** | AEPD | aepd.es |
| **Italia** | Garante Privacy | garanteprivacy.it |
| **Países Bajos** | Autoriteit Persoonsgegevens | autoriteitpersoonsgegevens.nl |
| **Bélgica** | Data Protection Authority | gegevensbeschermingsautoriteit.be |
| **...** | ... | ... |

**Su DPA:** Regístrese con la DPA donde su clínica está establecida.

### 14.2 Quejas

Los interesados pueden presentar quejas ante:
- Su DPA (jurisdicción de la clínica)
- Su propia DPA (residencia del interesado)
- La DPA de VetConnect (Irlanda - ya que estamos establecidos en UE vía AWS Irlanda)

**Manejo de quejas:**
1. DPA recibe queja
2. Investiga
3. Puede emitir:
   - Advertencia
   - Reprimenda
   - Orden de cumplir
   - Multa (hasta €20M o 4% de ingresos globales)

### 14.3 Mecanismo de Ventanilla Única

Si opera en múltiples países de la UE:
- Su DPA líder (donde está el establecimiento principal) maneja casos transfronterizos
- Otras DPAs cooperan
- Evita tener que tratar con 27 DPAs diferentes

---

## 15. Lista de Verificación de Cumplimiento VetConnect

### Para Clientes (Clínicas)

**Configuración:**
- ☐ Actualice la política de privacidad de su clínica para mencionar a VetConnect
- ☐ Incluya enlace a Política de Privacidad de VetConnect
- ☐ Capacite al personal en fundamentos de GDPR
- ☐ Designe un punto de contacto de privacidad
- ☐ Revise y firme el DPA de VetConnect
- ☐ Configure ajustes de retención de datos en VetConnect

**En curso:**
- ☐ Revise formularios de consentimiento anualmente
- ☐ Responda a solicitudes de interesados dentro de 1 mes
- ☐ Reporte brechas a DPA dentro de 72 horas (si aplica)
- ☐ Mantenga registros de actividades de procesamiento
- ☐ Realice DPIAs cuando sea requerido
- ☐ Monitoree cambios de sub-procesadores de VetConnect

**Anual:**
- ☐ Revise inventario de datos
- ☐ Actualice avisos de privacidad
- ☐ Recapacite al personal
- ☐ Audite logs de acceso
- ☐ Pruebe plan de respuesta a incidentes

### Para VetConnect (Nuestros Compromisos)

**Completado:**
- ✅ DPA disponible
- ✅ Certificado SOC 2 Tipo II
- ✅ Certificado ISO 27001
- ✅ SCCs implementadas
- ✅ Política de Cookies publicada
- ✅ Política de Privacidad compatible con GDPR
- ✅ Registro de Sub-procesadores mantenido
- ✅ Procedimiento de notificación de brechas
- ✅ Funcionalidad de exportación de datos
- ✅ Funcionalidad de eliminación de datos

**En curso:**
- ✅ Monitorear desarrollos legales
- ✅ Actualizar políticas según sea necesario
- ✅ Auditorías de cumplimiento anuales
- ✅ Pruebas de penetración trimestrales
- ✅ Monitoreo de seguridad continuo

---

## 16. Recursos y Soporte

### 16.1 Recursos VetConnect

- **Hub GDPR:** https://www.vetconnect.com/gdpr
- **Plantillas:** Avisos de privacidad, formularios de consentimiento, DPIA
- **Capacitación:** Webinar sobre GDPR para clínicas veterinarias
- **Base de Conocimiento:** https://support.vetconnect.com/gdpr

### 16.2 Recursos Oficiales GDPR

- **Portal GDPR UE:** https://gdpr.eu
- **ICO (Reino Unido):** https://ico.org.uk/for-organisations/guide-to-data-protection/
- **Comité Europeo de Protección de Datos:** https://edpb.europa.eu

### 16.3 Soporte GDPR VetConnect

**Email:** gdpr@vetconnect.com  
**Teléfono:** +1 (904) 934-7620 (Lun-Vie 9AM-5PM EST)  
**Contacto DPO:** dpo@vetconnect.com

---

## 17. Actualizaciones a Esta Guía

Esta guía de cumplimiento se actualiza:
- Trimestralmente (o a medida que evoluciona la ley GDPR)
- Después de cambios significativos en el producto
- Siguiendo orientación de DPAs

**Historial de Versiones:**
- v1.0 (1 de enero de 2025): Publicación inicial

**Notificación:** Cambios mayores notificados vía email y banner in-app.

---

**Al usar VetConnect, usted acepta cumplir con GDPR y esta guía.**

**¿Preguntas? Contacte a nuestro DPO:** dpo@vetconnect.com
