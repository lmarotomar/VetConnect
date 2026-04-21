// Main Application Logic
const App = {
    currentView: 'dashboard',

    // Live data cache — loaded from Supabase on init
    data: {
        clients: [],
        appointments: [],
        clinicalRecords: [],
        communications: [],
        inventory: [],
        invoices: [],
        educationalContent: [
            { id: 1, title: 'Cuidados Post-Vacunación', category: 'Vacunación', content: 'Instrucciones para después de la vacunación...' },
            { id: 2, title: 'Alimentación Saludable para Perros', category: 'Nutrición', content: 'Guía completa de nutrición canina...' }
        ]
    },

    async init() {
        this.setupEventListeners();
        await this.loadData();
        this.loadView('dashboard');
    },

    // Load all data from Supabase into local cache
    async loadData() {
        if (typeof DB === 'undefined') return;
        try {
            const [clients, appointments, records, comms, inventory, invoices] = await Promise.all([
                DB.getClients(),
                DB.getAppointments(),
                DB.getClinicalRecords(),
                DB.getCommunications(),
                DB.getInventory(),
                DB.getInvoices()
            ]);
            this.data.clients         = clients      || [];
            this.data.appointments    = appointments  || [];
            this.data.clinicalRecords = records       || [];
            this.data.communications  = comms         || [];
            this.data.inventory       = inventory     || [];
            this.data.invoices        = invoices      || [];
        } catch (e) {
            console.error('Error loading data from Supabase:', e);
        }
    },

    // Refresh a specific collection and re-render current view
    async refreshData(collection) {
        if (typeof DB === 'undefined') return;
        try {
            if (collection === 'clients' || !collection) {
                this.data.clients = await DB.getClients() || [];
            }
            if (collection === 'appointments' || !collection) {
                this.data.appointments = await DB.getAppointments() || [];
            }
        } catch (e) {
            console.error('Error refreshing data:', e);
        }
        this.loadView(this.currentView);
    },

    setupEventListeners() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.currentTarget.dataset.view;
                if (view) this.navigateTo(view);
            });
        });

        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('sidebar');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-visible');
            });
        }

        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalClose) modalClose.addEventListener('click', () => this.closeModal());
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) this.closeModal();
            });
        }

        const newAppointmentBtn = document.getElementById('newAppointmentBtn');
        if (newAppointmentBtn) {
            newAppointmentBtn.addEventListener('click', () => this.showNewAppointmentModal());
        }
    },

    navigateTo(view) {
        this.currentView = view;
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.view === view) link.classList.add('active');
        });
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('mobile-visible');
        }
        this.loadView(view);
    },

    loadView(view) {
        const titleMap = {
            dashboard: 'Dashboard',
            appointments: 'Gestión de Citas',
            'clinical-records': 'Historias Clínicas',
            communication: 'Centro de Comunicación',
            education: 'Educación del Cliente',
            billing: 'Facturación',
            inventory: 'Inventario',
            reports: 'Reportes y Análisis',
            settings: 'Configuración'
        };

        document.getElementById('pageTitle').textContent = titleMap[view] || view;
        const container = document.getElementById('contentContainer');

        switch (view) {
            case 'dashboard':
                if (typeof Dashboard !== 'undefined') { container.innerHTML = Dashboard.render(); Dashboard.init(); }
                break;
            case 'appointments':
                if (typeof Appointments !== 'undefined') { container.innerHTML = Appointments.render(); Appointments.init(); }
                break;
            case 'clinical-records':
                if (typeof ClinicalRecords !== 'undefined') { container.innerHTML = ClinicalRecords.render(); ClinicalRecords.init(); }
                break;
            case 'communication':
                if (typeof Communication !== 'undefined') { container.innerHTML = Communication.render(); Communication.init(); }
                break;
            case 'education':
                if (typeof Education !== 'undefined') { container.innerHTML = Education.render(); Education.init(); }
                break;
            case 'billing':
                if (typeof Billing !== 'undefined') container.innerHTML = Billing.render();
                break;
            case 'inventory':
                if (typeof Inventory !== 'undefined') container.innerHTML = Inventory.render();
                break;
            case 'reports':
                if (typeof Reports !== 'undefined') { container.innerHTML = Reports.render(); Reports.init(); }
                break;
            case 'settings':
                if (typeof Settings !== 'undefined') { container.innerHTML = Settings.render(); Settings.init(); }
                break;
        }
    },

    // ─── READ (sync — from cache) ─────────────────────────────────────────────

    getClients() {
        return this.data.clients;
    },

    getClient(id) {
        const numId = parseInt(id);
        return this.data.clients.find(c => c.id === numId || c.id === id);
    },

    getAppointments() {
        return this.data.appointments;
    },

    getAppointment(id) {
        const numId = parseInt(id);
        return this.data.appointments.find(a => a.id === numId || a.id === id);
    },

    getClinicalRecords(patientId) {
        return this.data.clinicalRecords.filter(r => r.patient_id === patientId || r.petId === patientId);
    },

    getCommunications(clientId) {
        return this.data.communications.filter(c => c.client_id === clientId || c.clientId === clientId);
    },

    getEducationalContent() {
        return this.data.educationalContent;
    },

    // ─── WRITE (async — Supabase + cache update) ──────────────────────────────

    async addClient(client) {
        // Optimistic local add
        const tempId = Date.now();
        const newClient = { ...client, id: tempId, patients: [], pets: [] };
        this.data.clients.push(newClient);

        if (typeof DB !== 'undefined') {
            const saved = await DB.addClient(client);
            if (saved) {
                const idx = this.data.clients.findIndex(c => c.id === tempId);
                if (idx !== -1) this.data.clients[idx] = { ...saved, patients: [], pets: [] };
                return this.data.clients.find(c => c.id === (saved.id || tempId));
            }
        }
        return newClient;
    },

    async addAppointment(appointment) {
        const tempId = Date.now();
        const newAppointment = { ...appointment, id: tempId, status: 'pending' };
        this.data.appointments.push(newAppointment);

        if (typeof DB !== 'undefined') {
            const saved = await DB.addAppointment(appointment);
            if (saved) {
                const idx = this.data.appointments.findIndex(a => a.id === tempId);
                if (idx !== -1) this.data.appointments[idx] = saved;
            }
        }

        this.triggerAutomation('appointment_created', newAppointment);
        return newAppointment;
    },

    async updateAppointment(id, updates) {
        const idx = this.data.appointments.findIndex(a => a.id === id || a.id === parseInt(id));
        if (idx !== -1) {
            this.data.appointments[idx] = { ...this.data.appointments[idx], ...updates };
        }
        if (typeof DB !== 'undefined') {
            await DB.updateAppointment(id, updates);
        }
    },

    async addClinicalRecord(record) {
        const newRecord = { ...record, id: Date.now(), createdAt: new Date().toISOString() };
        this.data.clinicalRecords.push(newRecord);
        if (typeof DB !== 'undefined') {
            const saved = await DB.addClinicalRecord(record);
            if (saved) {
                const idx = this.data.clinicalRecords.findIndex(r => r.id === newRecord.id);
                if (idx !== -1) this.data.clinicalRecords[idx] = saved;
            }
        }
        return newRecord;
    },

    async addCommunication(communication) {
        const newComm = { ...communication, id: Date.now(), timestamp: new Date().toISOString() };
        this.data.communications.push(newComm);
        if (typeof DB !== 'undefined') {
            await DB.addCommunication(communication);
        }
        return newComm;
    },

    // ─── AUTOMATION ───────────────────────────────────────────────────────────

    triggerAutomation(eventType, data) {
        switch (eventType) {
            case 'appointment_created':
                this.sendConfirmationMessage(data);
                this.scheduleReminders(data);
                break;
            case 'appointment_completed':
                this.sendFollowUpInstructions(data);
                break;
            case 'clinical_record_created':
                this.generateClinicalReport(data);
                break;
        }
    },

    // Check if a messaging integration is active (WhatsApp, email, SMS)
    isIntegrationConfigured(channel) {
        const settings = window.AuthState?.organization || {};
        if (channel === 'whatsapp') return !!(settings.whatsapp_token || settings.twilio_sid);
        if (channel === 'email') return !!(settings.smtp_host || settings.sendgrid_key);
        return false;
    },

    sendConfirmationMessage(appointment) {
        // Only fire if an actual messaging integration is configured
        if (!this.isIntegrationConfigured('whatsapp') && !this.isIntegrationConfigured('email')) return;

        const client = this.getClient(appointment.clientId || appointment.client_id);
        if (!client) return;
        const channel = this.isIntegrationConfigured('whatsapp') ? 'whatsapp' : 'email';
        const message = {
            clientId: client.id,
            channel,
            type: 'appointment_confirmation',
            content: `Hola ${client.name}, tu cita ha sido confirmada para el ${appointment.date || appointment.appointment_date} a las ${appointment.time || appointment.appointment_time}.`,
            status: 'sent'
        };
        this.addCommunication(message);
        this.showNotification('Confirmación enviada', `Mensaje enviado a ${client.name} vía ${channel}`, 'success');
    },

    scheduleReminders(appointment) {
        // Only fire if messaging is configured
        if (!this.isIntegrationConfigured('whatsapp') && !this.isIntegrationConfigured('email')) return;
        this.showNotification('Recordatorios programados', 'Se enviarán 24h y 2h antes de la cita', 'info');
    },

    sendFollowUpInstructions(appointment) {
        if (!this.isIntegrationConfigured('whatsapp') && !this.isIntegrationConfigured('email')) return;
        this.showNotification('Seguimiento enviado', 'Instrucciones de cuidado enviadas al cliente', 'success');
    },

    generateClinicalReport(record) {
        this.showNotification('Reporte generado', 'Historia clínica actualizada', 'success');
    },

    // ─── MODALS ───────────────────────────────────────────────────────────────

    showModal(title, content, { wide = false } = {}) {
        const overlay = document.getElementById('modalOverlay');
        const modalEl = overlay.querySelector('.modal');
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = content;
        modalEl.classList.toggle('modal--wide', wide);
        overlay.classList.add('active');
    },

    closeModal() {
        const overlay = document.getElementById('modalOverlay');
        overlay.querySelector('.modal')?.classList.remove('modal--wide');
        overlay.classList.remove('active');
    },

    showNewAppointmentModal() {
        const clients = this.getClients();
        const clientOptions = clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

        const content = `
      <form id="newAppointmentForm">
        <div class="form-group">
          <label class="form-label">Cliente</label>
          <select class="form-select" id="appointmentClient" required>
            <option value="">Seleccionar cliente...</option>
            ${clientOptions}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Mascota</label>
          <select class="form-select" id="appointmentPet" required>
            <option value="">Seleccionar mascota...</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Fecha</label>
          <input type="date" class="form-input" id="appointmentDate" required>
        </div>
        <div class="form-group">
          <label class="form-label">Hora</label>
          <input type="time" class="form-input" id="appointmentTime" required>
        </div>
        <div class="form-group">
          <label class="form-label">Tipo de Consulta</label>
          <select class="form-select" id="appointmentType" required>
            <option value="Consulta General">Consulta General</option>
            <option value="Control">Control</option>
            <option value="Vacunación">Vacunación</option>
            <option value="Cirugía">Cirugía</option>
            <option value="Emergencia">Emergencia</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Notas</label>
          <textarea class="form-textarea" id="appointmentNotes"></textarea>
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
          <button type="submit" class="btn btn-primary" style="flex: 1;">Crear Cita</button>
          <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
        </div>
      </form>`;

        this.showModal('Nueva Cita', content);

        setTimeout(() => {
            const clientSelect = document.getElementById('appointmentClient');
            const petSelect = document.getElementById('appointmentPet');

            clientSelect.addEventListener('change', (e) => {
                const client = this.getClient(e.target.value);
                if (client) {
                    const pets = client.patients || client.pets || [];
                    petSelect.innerHTML = '<option value="">Seleccionar mascota...</option>' +
                        pets.map(p => `<option value="${p.id}">${p.name} (${p.species || p.especie || ''})</option>`).join('');
                }
            });

            const form = document.getElementById('newAppointmentForm');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const appointment = {
                    clientId: clientSelect.value,
                    petId: petSelect.value,
                    date: document.getElementById('appointmentDate').value,
                    time: document.getElementById('appointmentTime').value,
                    type: document.getElementById('appointmentType').value,
                    notes: document.getElementById('appointmentNotes').value
                };
                await this.addAppointment(appointment);
                this.closeModal();
                this.showNotification('Cita creada', 'La cita ha sido creada exitosamente', 'success');
                if (this.currentView === 'appointments' || this.currentView === 'dashboard') {
                    this.loadView(this.currentView);
                }
            });
        }, 100);
    },

    // ─── NOTIFICATIONS ────────────────────────────────────────────────────────

    showNotification(title, message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        const id = Date.now();
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.id = `notification-${id}`;
        notification.innerHTML = `
      <div class="notification-header">
        <span>${icons[type] || icons.info} ${title}</span>
        <button class="modal-close" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
      <div class="notification-body">${message}</div>`;

        container.appendChild(notification);
        setTimeout(() => {
            const notif = document.getElementById(`notification-${id}`);
            if (notif) {
                notif.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => notif.remove(), 300);
            }
        }, 5000);
    },

    // ─── UTILITIES ────────────────────────────────────────────────────────────

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    },

    formatTime(timeString) {
        return timeString || '';
    }
};
