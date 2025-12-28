// Main Application Logic
const App = {
    currentView: 'dashboard',
    mockData: {
        clients: [
            {
                id: 1,
                name: 'María González',
                email: 'maria@example.com',
                phone: '+1234567890',
                pets: [
                    { id: 1, name: 'Max', species: 'Perro', breed: 'Labrador', age: 3 }
                ]
            },
            {
                id: 2,
                name: 'Carlos Ramírez',
                email: 'carlos@example.com',
                phone: '+1234567891',
                pets: [
                    { id: 2, name: 'Luna', species: 'Gato', breed: 'Siamés', age: 2 }
                ]
            }
        ],
        appointments: [
            {
                id: 1,
                clientId: 1,
                petId: 1,
                date: '2025-12-07',
                time: '10:00',
                type: 'Consulta General',
                status: 'confirmed',
                notes: 'Vacunación anual'
            },
            {
                id: 2,
                clientId: 2,
                petId: 2,
                date: '2025-12-07',
                time: '14:00',
                type: 'Control',
                status: 'pending',
                notes: 'Control post-operatorio'
            }
        ],
        clinicalRecords: [],
        communications: [],
        educationalContent: [
            {
                id: 1,
                title: 'Cuidados Post-Vacunación',
                category: 'Vacunación',
                content: 'Instrucciones para después de la vacunación...'
            },
            {
                id: 2,
                title: 'Alimentación Saludable para Perros',
                category: 'Nutrición',
                content: 'Guía completa de nutrición canina...'
            }
        ]
    },

    init() {
        this.setupEventListeners();
        this.loadView('dashboard');
        this.loadMockData();
    },

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.currentTarget.dataset.view;
                if (view) {
                    this.navigateTo(view);
                }
            });
        });

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('sidebar');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-visible');
            });
        }

        // Modal close
        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }

        // New appointment button
        const newAppointmentBtn = document.getElementById('newAppointmentBtn');
        if (newAppointmentBtn) {
            newAppointmentBtn.addEventListener('click', () => {
                this.showNewAppointmentModal();
            });
        }
    },

    navigateTo(view) {
        this.currentView = view;

        // Update active nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.view === view) {
                link.classList.add('active');
            }
        });

        // Close mobile menu
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('mobile-visible');
        }

        // Load view
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

        // Load module content
        const container = document.getElementById('contentContainer');

        switch (view) {
            case 'dashboard':
                if (typeof Dashboard !== 'undefined') {
                    container.innerHTML = Dashboard.render();
                    Dashboard.init();
                }
                break;
            case 'appointments':
                if (typeof Appointments !== 'undefined') {
                    container.innerHTML = Appointments.render();
                    Appointments.init();
                }
                break;
            case 'clinical-records':
                if (typeof ClinicalRecords !== 'undefined') {
                    container.innerHTML = ClinicalRecords.render();
                    ClinicalRecords.init();
                }
                break;
            case 'communication':
                if (typeof Communication !== 'undefined') {
                    container.innerHTML = Communication.render();
                    Communication.init();
                }
                break;
            case 'education':
                if (typeof Education !== 'undefined') {
                    container.innerHTML = Education.render();
                    Education.init();
                }
                break;
            case 'billing':
                if (typeof Billing !== 'undefined') {
                    container.innerHTML = Billing.render();
                }
                break;
            case 'inventory':
                if (typeof Inventory !== 'undefined') {
                    container.innerHTML = Inventory.render();
                }
                break;
            case 'reports':
                if (typeof Reports !== 'undefined') {
                    container.innerHTML = Reports.render();
                    Reports.init();
                }
                break;
            case 'settings':
                if (typeof Settings !== 'undefined') {
                    container.innerHTML = Settings.render();
                }
                break;
        }
    },

    loadMockData() {
        // Load data from localStorage if exists, otherwise use mock data
        const storedData = localStorage.getItem('vetFlowData');
        if (storedData) {
            this.mockData = JSON.parse(storedData);
        } else {
            this.saveMockData();
        }
    },

    saveMockData() {
        localStorage.setItem('vetFlowData', JSON.stringify(this.mockData));
    },

    getClients() {
        return this.mockData.clients;
    },

    getClient(id) {
        return this.mockData.clients.find(c => c.id === id);
    },

    addClient(client) {
        const newClient = {
            ...client,
            id: Date.now(),
            pets: []
        };
        this.mockData.clients.push(newClient);
        this.saveMockData();
        return newClient;
    },

    getAppointments() {
        return this.mockData.appointments;
    },

    getAppointment(id) {
        return this.mockData.appointments.find(a => a.id === id);
    },

    addAppointment(appointment) {
        const newAppointment = {
            ...appointment,
            id: Date.now(),
            status: 'pending'
        };
        this.mockData.appointments.push(newAppointment);
        this.saveMockData();

        // Trigger automation
        this.triggerAutomation('appointment_created', newAppointment);

        return newAppointment;
    },

    updateAppointment(id, updates) {
        const index = this.mockData.appointments.findIndex(a => a.id === id);
        if (index !== -1) {
            this.mockData.appointments[index] = {
                ...this.mockData.appointments[index],
                ...updates
            };
            this.saveMockData();
        }
    },

    getClinicalRecords(petId) {
        return this.mockData.clinicalRecords.filter(r => r.petId === petId);
    },

    addClinicalRecord(record) {
        const newRecord = {
            ...record,
            id: Date.now(),
            createdAt: new Date().toISOString()
        };
        this.mockData.clinicalRecords.push(newRecord);
        this.saveMockData();
        return newRecord;
    },

    getCommunications(clientId) {
        return this.mockData.communications.filter(c => c.clientId === clientId);
    },

    addCommunication(communication) {
        const newComm = {
            ...communication,
            id: Date.now(),
            timestamp: new Date().toISOString()
        };
        this.mockData.communications.push(newComm);
        this.saveMockData();
        return newComm;
    },

    getEducationalContent() {
        return this.mockData.educationalContent;
    },

    // Automation Engine
    triggerAutomation(eventType, data) {
        console.log('🤖 Automation triggered:', eventType, data);

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

    sendConfirmationMessage(appointment) {
        const client = this.getClient(appointment.clientId);
        if (!client) return;

        const message = {
            clientId: client.id,
            channel: 'whatsapp',
            type: 'appointment_confirmation',
            content: `Hola ${client.name}, tu cita ha sido confirmada para el ${appointment.date} a las ${appointment.time}.`,
            status: 'sent'
        };

        this.addCommunication(message);
        this.showNotification('Confirmación enviada', `WhatsApp enviado a ${client.name}`, 'success');
    },

    scheduleReminders(appointment) {
        console.log('📅 Recordatorios programados:', appointment);
        // In production, this would schedule actual reminders
        this.showNotification('Recordatorios programados', 'Se enviarán 24h y 2h antes de la cita', 'info');
    },

    sendFollowUpInstructions(appointment) {
        console.log('📧 Enviando instrucciones de seguimiento...');
        this.showNotification('Seguimiento enviado', 'Instrucciones de cuidado enviadas al cliente', 'success');
    },

    generateClinicalReport(record) {
        console.log('📄 Generando reporte clínico...');
        this.showNotification('Reporte generado', 'Historia clínica actualizada', 'success');
    },

    // Modal Management
    showModal(title, content) {
        const modal = document.getElementById('modalOverlay');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modal.classList.add('active');
    },

    closeModal() {
        const modal = document.getElementById('modalOverlay');
        modal.classList.remove('active');
    },

    showNewAppointmentModal() {
        const clients = this.getClients();
        const clientOptions = clients.map(c =>
            `<option value="${c.id}">${c.name}</option>`
        ).join('');

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
      </form>
    `;

        this.showModal('Nueva Cita', content);

        // Setup form handlers
        setTimeout(() => {
            const clientSelect = document.getElementById('appointmentClient');
            const petSelect = document.getElementById('appointmentPet');

            clientSelect.addEventListener('change', (e) => {
                const client = this.getClient(parseInt(e.target.value));
                if (client && client.pets) {
                    petSelect.innerHTML = '<option value="">Seleccionar mascota...</option>' +
                        client.pets.map(p => `<option value="${p.id}">${p.name} (${p.species})</option>`).join('');
                }
            });

            const form = document.getElementById('newAppointmentForm');
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const appointment = {
                    clientId: parseInt(clientSelect.value),
                    petId: parseInt(petSelect.value),
                    date: document.getElementById('appointmentDate').value,
                    time: document.getElementById('appointmentTime').value,
                    type: document.getElementById('appointmentType').value,
                    notes: document.getElementById('appointmentNotes').value
                };

                this.addAppointment(appointment);
                this.closeModal();
                this.showNotification('Cita creada', 'La cita ha sido creada exitosamente', 'success');

                // Reload current view if in appointments
                if (this.currentView === 'appointments') {
                    this.loadView('appointments');
                }
            });
        }, 100);
    },

    // Notification System
    showNotification(title, message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        const id = Date.now();

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.id = `notification-${id}`;
        notification.innerHTML = `
      <div class="notification-header">
        <span>${icons[type] || icons.info} ${title}</span>
        <button class="modal-close" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
      <div class="notification-body">${message}</div>
    `;

        container.appendChild(notification);

        setTimeout(() => {
            const notif = document.getElementById(`notification-${id}`);
            if (notif) {
                notif.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => notif.remove(), 300);
            }
        }, 5000);
    },

    // Utility Functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    formatTime(timeString) {
        return timeString;
    }
};
