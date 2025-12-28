// HubSpot CRM Integration
// Sync contacts, activities, and communications with HubSpot

class HubSpotIntegration {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.portalId = config.portalId;
        this.baseUrl = 'https://api.hubapi.com';
    }

    /**
     * Create or update a contact in HubSpot
     */
    async syncContact(clientData) {
        try {
            // Check if contact exists
            const existingContact = await this.findContactByEmail(clientData.email);

            if (existingContact) {
                // Update existing contact
                return await this.updateContact(existingContact.vid, clientData);
            } else {
                // Create new contact
                return await this.createContact(clientData);
            }
        } catch (error) {
            console.error('HubSpot sync error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Create a new contact
     */
    async createContact(clientData) {
        const properties = [
            { property: 'email', value: clientData.email },
            { property: 'firstname', value: clientData.name.split(' ')[0] },
            { property: 'lastname', value: clientData.name.split(' ').slice(1).join(' ') },
            { property: 'phone', value: clientData.phone },
            { property: 'hs_lead_status', value: 'NEW' }
        ];

        // Add custom properties for pets
        if (clientData.pets && clientData.pets.length > 0) {
            properties.push({
                property: 'pet_names',
                value: clientData.pets.map(p => p.name).join(', ')
            });
            properties.push({
                property: 'pet_count',
                value: clientData.pets.length.toString()
            });
        }

        const response = await fetch(`${this.baseUrl}/contacts/v1/contact`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ properties })
        });

        const data = await response.json();

        return {
            success: !data.error,
            contactId: data.vid,
            error: data.message
        };
    }

    /**
     * Update existing contact
     */
    async updateContact(contactId, clientData) {
        const properties = [
            { property: 'phone', value: clientData.phone },
            { property: 'lastmodifieddate', value: new Date().getTime().toString() }
        ];

        if (clientData.pets) {
            properties.push({
                property: 'pet_names',
                value: clientData.pets.map(p => p.name).join(', ')
            });
        }

        const response = await fetch(`${this.baseUrl}/contacts/v1/contact/vid/${contactId}/profile`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ properties })
        });

        return { success: response.ok };
    }

    /**
     * Find contact by email
     */
    async findContactByEmail(email) {
        try {
            const response = await fetch(
                `${this.baseUrl}/contacts/v1/contact/email/${encodeURIComponent(email)}/profile`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`
                    }
                }
            );

            if (response.status === 404) {
                return null;
            }

            return await response.json();
        } catch (error) {
            return null;
        }
    }

    /**
     * Log an activity/engagement
     */
    async logActivity(contactId, activityData) {
        const engagement = {
            engagement: {
                active: true,
                type: activityData.type || 'NOTE', // NOTE, EMAIL, CALL, MEETING
                timestamp: Date.now()
            },
            associations: {
                contactIds: [contactId]
            },
            metadata: {
                body: activityData.body,
                subject: activityData.subject
            }
        };

        const response = await fetch(`${this.baseUrl}/engagements/v1/engagements`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(engagement)
        });

        const data = await response.json();

        return {
            success: !data.error,
            engagementId: data.engagement?.id
        };
    }

    /**
     * Log appointment as a meeting in HubSpot
     */
    async logAppointment(contactId, appointmentData) {
        return await this.logActivity(contactId, {
            type: 'MEETING',
            subject: `Cita Veterinaria - ${appointmentData.petName}`,
            body: `
        Tipo: ${appointmentData.type}
        Mascota: ${appointmentData.petName}
        Fecha: ${appointmentData.date}
        Hora: ${appointmentData.time}
        Notas: ${appointmentData.notes || 'N/A'}
      `
        });
    }

    /**
     * Log communication (WhatsApp, Email, SMS)
     */
    async logCommunication(contactId, communicationData) {
        const typeMap = {
            'whatsapp': 'NOTE',
            'email': 'EMAIL',
            'sms': 'NOTE'
        };

        return await this.logActivity(contactId, {
            type: typeMap[communicationData.channel] || 'NOTE',
            subject: `${communicationData.channel.toUpperCase()} - ${communicationData.type}`,
            body: communicationData.content
        });
    }

    /**
     * Create a deal (for services/treatments)
     */
    async createDeal(contactId, dealData) {
        const deal = {
            properties: [
                { name: 'dealname', value: dealData.name },
                { name: 'amount', value: dealData.amount },
                { name: 'dealstage', value: dealData.stage || 'appointmentscheduled' },
                { name: 'pipeline', value: 'default' }
            ],
            associations: {
                associatedVids: [contactId]
            }
        };

        const response = await fetch(`${this.baseUrl}/deals/v1/deal`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deal)
        });

        const data = await response.json();

        return {
            success: !data.error,
            dealId: data.dealId
        };
    }

    /**
     * Get contact timeline
     */
    async getContactTimeline(contactId) {
        const response = await fetch(
            `${this.baseUrl}/engagements/v1/engagements/associated/CONTACT/${contactId}/paged`,
            {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            }
        );

        const data = await response.json();

        return {
            success: !data.error,
            engagements: data.results || []
        };
    }

    /**
     * Webhook handler for HubSpot events
     */
    handleWebhook(webhookData) {
        // Process events from HubSpot (contact updates, etc.)
        const subscriptionType = webhookData.subscriptionType;
        const objectId = webhookData.objectId;

        // Handle different event types
        switch (subscriptionType) {
            case 'contact.creation':
            case 'contact.propertyChange':
                // Sync back to local database
                return {
                    type: 'contact_update',
                    contactId: objectId,
                    action: 'sync_required'
                };

            default:
                return null;
        }
    }
}

module.exports = HubSpotIntegration;
