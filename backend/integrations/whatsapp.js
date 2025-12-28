// WhatsApp Business API Integration
// Requires: whatsapp-business-sdk or direct API calls

class WhatsAppIntegration {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.phoneId = config.phoneId;
        this.businessId = config.businessId;
        this.baseUrl = 'https://graph.facebook.com/v18.0';
    }

    /**
     * Send a text message via WhatsApp
     */
    async sendMessage(to, message) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.phoneId}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: to,
                    type: 'text',
                    text: {
                        body: message
                    }
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            return {
                success: true,
                messageId: data.messages[0].id,
                status: 'sent'
            };
        } catch (error) {
            console.error('WhatsApp send error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send a template message (requires pre-approved templates)
     */
    async sendTemplate(to, templateName, parameters) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.phoneId}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: to,
                    type: 'template',
                    template: {
                        name: templateName,
                        language: {
                            code: 'es'
                        },
                        components: parameters
                    }
                })
            });

            const data = await response.json();

            return {
                success: !data.error,
                messageId: data.messages?.[0]?.id,
                error: data.error?.message
            };
        } catch (error) {
            console.error('WhatsApp template error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send appointment confirmation
     */
    async sendAppointmentConfirmation(clientPhone, appointmentData) {
        const message = `Hola ${appointmentData.clientName}, 

Tu cita ha sido confirmada ✅

📅 Fecha: ${appointmentData.date}
⏰ Hora: ${appointmentData.time}
🐾 Mascota: ${appointmentData.petName}
📋 Tipo: ${appointmentData.type}

Te esperamos en nuestra clínica. Si necesitas reprogramar, responde a este mensaje.

Saludos,
${appointmentData.clinicName}`;

        return await this.sendMessage(clientPhone, message);
    }

    /**
     * Send 24h reminder with triage form
     */
    async send24HourReminder(clientPhone, appointmentData) {
        const message = `Recordatorio de cita ⏰

Hola ${appointmentData.clientName},

Te recordamos tu cita mañana:
📅 ${appointmentData.date} a las ${appointmentData.time}
🐾 ${appointmentData.petName}

Por favor responde estas preguntas:
1. ¿Cuál es el motivo principal de la consulta?
2. ¿Ha presentado algún síntoma? ¿Cuáles?
3. ¿Está comiendo y bebiendo normalmente?
4. ¿Algún cambio en el comportamiento?

Tus respuestas nos ayudarán a preparar mejor la consulta.`;

        return await this.sendMessage(clientPhone, message);
    }

    /**
     * Send 2h reminder
     */
    async send2HourReminder(clientPhone, appointmentData) {
        const message = `⏰ Recordatorio: Tu cita es en 2 horas

${appointmentData.clientName}, te esperamos hoy a las ${appointmentData.time} para la consulta de ${appointmentData.petName}.

📍 ${appointmentData.clinicAddress}

¡Nos vemos pronto!`;

        return await this.sendMessage(clientPhone, message);
    }

    /**
     * Send post-consultation instructions
     */
    async sendPostConsultationInstructions(clientPhone, instructions) {
        const message = `Instrucciones de cuidado 📋

Hola ${instructions.clientName},

Aquí están las instrucciones para ${instructions.petName}:

${instructions.content}

Recordatorios importantes:
${instructions.reminders}

Si tienes alguna duda o ${instructions.petName} presenta alguno de estos síntomas, contáctanos inmediatamente.

Estamos para ayudarte 🐾`;

        return await this.sendMessage(clientPhone, message);
    }

    /**
     * Send follow-up message
     */
    async sendFollowUp(clientPhone, followUpData) {
        const message = `Seguimiento de ${followUpData.petName} 🔄

Hola ${followUpData.clientName},

¿Cómo ha evolucionado ${followUpData.petName} después de la consulta?

Nos encantaría saber:
- ¿Ha mejorado su condición?
- ¿Está siguiendo el tratamiento correctamente?
- ¿Alguna pregunta o preocupación?

Por favor comparte cómo se encuentra. Tu feedback es muy importante para nosotros.`;

        return await this.sendMessage(clientPhone, message);
    }

    /**
     * Send vaccination reminder
     */
    async sendVaccinationReminder(clientPhone, vaccinationData) {
        const message = `💉 Recordatorio de Vacunación

Hola ${vaccinationData.clientName},

Es momento de la próxima vacuna de ${vaccinationData.petName}:

Vacuna: ${vaccinationData.vaccineName}
Fecha recomendada: ${vaccinationData.dueDate}

Mantener las vacunas al día es esencial para la salud de ${vaccinationData.petName}.

¿Deseas agendar una cita? Responde con tu disponibilidad.`;

        return await this.sendMessage(clientPhone, message);
    }

    /**
     * Webhook handler for incoming messages
     */
    handleWebhook(webhookData) {
        // Process incoming messages from clients
        const entry = webhookData.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;

        if (value?.messages?.[0]) {
            const message = value.messages[0];
            return {
                from: message.from,
                messageId: message.id,
                timestamp: message.timestamp,
                type: message.type,
                text: message.text?.body,
                // Store this response in the database
            };
        }

        return null;
    }
}

module.exports = WhatsAppIntegration;
