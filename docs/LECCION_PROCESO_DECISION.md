# Lección: Proceso de Decisión Técnica
## El caso VetPrompt — Abril 2026

---

## Lo que pasó

Durante dos días de trabajo intenso para configurar VetConnect e integrar WhatsApp Business API, el sistema VetPrompt (que funcionaba) dejó de funcionar. El proceso de diagnóstico fue largo, costoso en tiempo y energía, y estuvo a punto de terminar con la eliminación irreversible del número de WhatsApp.

---

## Cronología de errores de diagnóstico

| Diagnóstico | Resultado |
|-------------|-----------|
| Problema con el token de n8n | Falso — el token era secundario |
| Webhooks no suscritos | Falso — estaban suscritos |
| Número no registrado en WABA | Falso — estaba en MarDigital |
| App sin permisos sobre el número | Falso — System User tenía control total |
| Necesidad de plantillas | Parcialmente cierto — pero no era el bloqueante principal |
| Re-suscripción al WABA | No resolvió |
| Re-verificación de webhook | No resolvió |

**Causa real:** El proyecto Supabase NexusVet estaba pausado + el 2FA fue desactivado por un agente externo (Manus), lo que deregistró el número de la red de WhatsApp.

---

## Las decisiones que casi salen mal

### 1. Eliminar el número +1 904-934-7620
- Se llegó al punto de tener el diálogo de eliminación abierto
- **Luis frenó y preguntó:** "¿Estás seguro que Meta me permitirá añadirlo de nuevo?"
- Resultado: se descubrió que el re-registro con PIN era suficiente
- **Si se hubiera eliminado:** nuevo Phone Number ID, posible pérdida del número, tiempo de reactivación indefinido

### 2. Confiar en el diagnóstico de Manus sin verificar
- Manus diagnosticó el problema del token (ya resuelto horas antes)
- Su acción de desactivar el 2FA fue lo que causó el problema real
- **Luis cuestionó:** "¿Seguro que esto es de Meta y no de n8n?"
- Resultado: análisis más profundo que llevó a la solución real

---

## Las insistencias de Luis que salvaron el proceso

1. **"Analiza profundamente antes de hacer cambios"** — dicho al inicio, ignorado en momentos clave
2. **"No mezclemos VetConnect con VetPrompt sin resolver primero lo urgente"** — correcto, el orden importa
3. **"¿Por qué no revisamos Meta a profundidad primero?"** — esto llevó al diagnóstico real
4. **Frenar la eliminación del número** — la decisión más crítica de todo el proceso
5. **"¿Estás convencido que es Meta y no n8n?"** — obligó a validar la hipótesis antes de actuar

---

## Reglas para el futuro

1. **Nunca tomar acciones irreversibles sin evaluar el impacto completo**
2. **Verificar siempre el estado de servicios dependientes (Supabase, etc.) antes de buscar problemas en la capa de arriba**
3. **No confiar en diagnósticos externos sin validarlos contra el estado actual**
4. **El consentimiento explícito de Luis es requerido antes de cualquier acción destructiva**
5. **Resolver lo urgente primero — no mezclar problemas no relacionados**
6. **Probar el paso más simple antes del más drástico**

---

## Conclusión

La solución final fue un comando de una línea:
```
curl -X POST ".../register" -d '{"messaging_product":"whatsapp","pin":"XXXXXX"}'
```

Dos días de trabajo. La solución: una línea. La diferencia la hizo la insistencia de Luis en cuestionar cada diagnóstico y frenar cada decisión apresurada.
