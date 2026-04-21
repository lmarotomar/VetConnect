// VetConnect — Supabase Data Layer
// Replaces all localStorage operations with real Supabase queries.
// All functions are async and return { data, error } to mirror Supabase SDK conventions.

const DB = {

    // Returns the current user's organization_id (required for all inserts)
    _orgId() {
        return window.AuthState?.organization?.id || null;
    },

    // ─── CLIENTS ──────────────────────────────────────────────────────────────

    async getClients() {
        const { data, error } = await supabase
            .from('clients')
            .select('*, pets:patients(*)')
            .order('name');
        if (error) console.error('DB.getClients:', error.message);
        return data || [];
    },

    async getClient(id) {
        const { data, error } = await supabase
            .from('clients')
            .select('*, pets:patients(*)')
            .eq('id', id)
            .single();
        if (error) console.error('DB.getClient:', error.message);
        return data || null;
    },

    async addClient(client) {
        const { data, error } = await supabase
            .from('clients')
            .insert([{
                organization_id: this._orgId(),
                name: client.name,
                email: client.email,
                phone: client.phone,
                address: client.address || null
            }])
            .select('*, pets:patients(*)')
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async updateClient(id, updates) {
        const { data, error } = await supabase
            .from('clients')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    // ─── PATIENTS (PETS) ──────────────────────────────────────────────────────

    async addPatient(patient) {
        const { data, error } = await supabase
            .from('patients')
            .insert([{
                organization_id: this._orgId(),
                client_id: patient.clientId,
                name: patient.name,
                species: patient.species,
                breed: patient.breed || null,
                age: patient.age || null,
                gender: patient.gender || null,
                weight: patient.weight || null,
                microchip: patient.microchip || null
            }])
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async updatePatient(id, updates) {
        const { data, error } = await supabase
            .from('patients')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async getPatientsByClient(clientId) {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('client_id', clientId)
            .order('name');
        if (error) console.error('DB.getPatientsByClient:', error.message);
        return data || [];
    },

    // ─── APPOINTMENTS ─────────────────────────────────────────────────────────

    async getAppointments({ date, status } = {}) {
        let query = supabase
            .from('appointments')
            .select('*, client:clients(id, name, phone, email), patient:patients(id, name, species, breed)')
            .order('appointment_date', { ascending: true })
            .order('appointment_time', { ascending: true });

        if (date) query = query.eq('appointment_date', date);
        if (status) query = query.eq('status', status);

        const { data, error } = await query;
        if (error) console.error('DB.getAppointments:', error.message);
        return data || [];
    },

    async getAppointment(id) {
        const { data, error } = await supabase
            .from('appointments')
            .select('*, client:clients(id, name, phone, email), patient:patients(id, name, species, breed)')
            .eq('id', id)
            .single();
        if (error) console.error('DB.getAppointment:', error.message);
        return data || null;
    },

    async addAppointment(appointment) {
        const { data, error } = await supabase
            .from('appointments')
            .insert([{
                organization_id: this._orgId(),
                client_id: appointment.clientId,
                patient_id: appointment.petId,
                appointment_date: appointment.date,
                appointment_time: appointment.time,
                type: appointment.type,
                notes: appointment.notes || null,
                status: 'pending'
            }])
            .select('*, client:clients(id, name, phone, email), patient:patients(id, name, species, breed)')
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async updateAppointment(id, updates) {
        // Map frontend field names to DB column names
        const dbUpdates = {};
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
        if (updates.confirmationSent !== undefined) dbUpdates.confirmation_sent = updates.confirmationSent;
        if (updates.reminder24hSent !== undefined) dbUpdates.reminder_24h_sent = updates.reminder24hSent;
        if (updates.reminder2hSent !== undefined) dbUpdates.reminder_2h_sent = updates.reminder2hSent;
        dbUpdates.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('appointments')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    // ─── CLINICAL RECORDS ─────────────────────────────────────────────────────

    async getClinicalRecords(patientId = null) {
        let query = supabase
            .from('clinical_records')
            .select('*')
            .order('record_date', { ascending: false });
        if (patientId) query = query.eq('patient_id', patientId);
        const { data, error } = await query;
        if (error) console.error('DB.getClinicalRecords:', error.message);
        return data || [];
    },

    async addClinicalRecord(record) {
        const { data, error } = await supabase
            .from('clinical_records')
            .insert([{
                organization_id: this._orgId(),
                patient_id:      record.patientId,
                appointment_id:  record.appointmentId || null,
                record_date:     record.recordDate || new Date().toISOString(),
                chief_complaint: record.chiefComplaint || null,
                symptoms:        record.symptoms || null,
                physical_exam:   record.physicalExam || null,
                diagnosis:       record.diagnosis,
                treatment:       record.treatment,
                medications:     record.medications || null,
                lab_results:     record.labResults || null,
                notes:           record.notes || null,
                follow_up_date:  record.followUpDate || null,
                veterinarian:    record.veterinarian || null
            }])
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    // ─── COMMUNICATIONS ───────────────────────────────────────────────────────

    async getCommunications(clientId = null) {
        let query = supabase
            .from('communications')
            .select('*')
            .order('created_at', { ascending: false });
        if (clientId) query = query.eq('client_id', clientId);
        const { data, error } = await query;
        if (error) console.error('DB.getCommunications:', error.message);
        return data || [];
    },

    async addCommunication(communication) {
        const { data, error } = await supabase
            .from('communications')
            .insert([{
                organization_id: this._orgId(),
                client_id: communication.clientId,
                channel: communication.channel,
                type: communication.type,
                content: communication.content,
                status: communication.status || 'pending'
            }])
            .select()
            .single();
        if (error) console.error('DB.addCommunication:', error.message);
        return data;
    },

    // ─── INVENTORY ────────────────────────────────────────────────────────────

    async getInventory() {
        const { data, error } = await supabase
            .from('inventory_items')
            .select('*')
            .order('name');
        if (error) console.error('DB.getInventory:', error.message);
        return data || [];
    },

    async addInventoryItem(item) {
        const { data, error } = await supabase
            .from('inventory_items')
            .insert([{
                organization_id:  this._orgId(),
                name:             item.name,
                category:         item.category,
                description:      item.description  || null,
                sku:              item.sku           || null,
                barcode:          item.barcode       || null,
                current_stock:    item.current_stock || 0,
                unit:             item.unit          || 'unit',
                min_stock:        item.min_stock     || 0,
                max_stock:        item.max_stock     || null,
                cost_price:       item.cost_price    || 0,
                sale_price:       item.sale_price    || 0,
                expiration_date:  item.expiration_date || null,
                batch_number:     item.batch_number  || null,
                location:         item.location      || null,
                is_active:        true
            }])
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async updateInventoryItem(id, updates) {
        const { data, error } = await supabase
            .from('inventory_items')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async addInventoryMovement(movement) {
        const { data, error } = await supabase
            .from('inventory_movements')
            .insert([{
                organization_id: this._orgId(),
                product_id:      movement.productId,
                type:            movement.type,
                quantity:        movement.quantity,
                stock_before:    movement.stockBefore,
                stock_after:     movement.stockAfter,
                notes:           movement.notes || null,
                created_by:      window.AuthState?.profile?.name || null
            }])
            .select()
            .single();
        if (error) console.error('DB.addInventoryMovement:', error.message);
        return data;
    },

    async getInventoryMovements(productId) {
        const { data, error } = await supabase
            .from('inventory_movements')
            .select('*')
            .eq('product_id', productId)
            .order('created_at', { ascending: false });
        if (error) console.error('DB.getInventoryMovements:', error.message);
        return data || [];
    },

    // ─── INVOICES ─────────────────────────────────────────────────────────────

    async getInvoices() {
        const { data, error } = await supabase
            .from('invoices')
            .select('*, client:clients(id, name, email, phone), patient:patients(id, name)')
            .order('invoice_date', { ascending: false });
        if (error) console.error('DB.getInvoices:', error.message);
        return data || [];
    },

    async addInvoice(invoice) {
        const { data, error } = await supabase
            .from('invoices')
            .insert([{
                organization_id:  this._orgId(),
                client_id:        invoice.client_id,
                patient_id:       invoice.patient_id       || null,
                appointment_id:   invoice.appointment_id   || null,
                invoice_number:   invoice.invoice_number,
                invoice_date:     invoice.invoice_date,
                due_date:         invoice.due_date          || null,
                subtotal:         invoice.subtotal,
                discount:         invoice.discount          || 0,
                tax_amount:       invoice.taxAmount         || 0,
                total:            invoice.total,
                status:           'pending',
                notes:            invoice.notes             || null,
                items:            invoice.items             || []
            }])
            .select('*, client:clients(id, name), patient:patients(id, name)')
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async updateInvoice(id, updates) {
        const { data, error } = await supabase
            .from('invoices')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    // ─── ORGANIZATION ─────────────────────────────────────────────

    async getOrganization() {
        const orgId = this._orgId();
        if (!orgId) return null;
        const { data, error } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', orgId)
            .single();
        if (error) console.error('DB.getOrganization:', error.message);
        return data || null;
    },

    async updateOrganization(updates) {
        const orgId = this._orgId();
        if (!orgId) throw new Error('No organization loaded');
        const { data, error } = await supabase
            .from('organizations')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', orgId)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    // ─── EDUCATIONAL CONTENT ──────────────────────────────────────────────────

    async getEducationalContent() {
        const { data, error } = await supabase
            .from('educational_content')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });
        if (error) console.error('DB.getEducationalContent:', error.message);
        return data || [];
    },

    async addEducationalContent(item) {
        const { data, error } = await supabase
            .from('educational_content')
            .insert([{
                organization_id: this._orgId(),
                title:           item.title,
                category:        item.category,
                species:         item.species  || [],
                icon:            item.icon     || '📋',
                summary:         item.summary,
                content:         item.content,
                is_active:       true,
                created_by:      window.AuthState?.profile?.name || null
            }])
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async updateEducationalContent(id, updates) {
        const { data, error } = await supabase
            .from('educational_content')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    },

    async deleteEducationalContent(id) {
        const { error } = await supabase
            .from('educational_content')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq('id', id);
        if (error) throw new Error(error.message);
    },

    async addScheduledJob(job) {
        const { data, error } = await supabase
            .from('scheduled_jobs')
            .insert([{
                organization_id: this._orgId(),
                job_type: job.type,
                reference_id: job.referenceId,
                reference_type: job.referenceType,
                scheduled_for: job.scheduledFor,
                status: 'pending'
            }])
            .select()
            .single();
        if (error) console.error('DB.addScheduledJob:', error.message);
        return data;
    }
};

// Export globally
if (typeof window !== 'undefined') {
    window.DB = DB;
}
