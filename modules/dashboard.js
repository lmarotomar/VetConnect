// Dashboard Module
const Dashboard = {
    render() {
        return `
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">Citas Hoy</div>
              <div class="stat-value" id="todayAppointments">0</div>
              <span class="stat-change positive">+12%</span>
            </div>
            <div class="stat-icon">📅</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">Pacientes Activos</div>
              <div class="stat-value" id="activePatients">0</div>
              <span class="stat-change positive">+8%</span>
            </div>
            <div class="stat-icon">🐾</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">Mensajes Enviados</div>
              <div class="stat-value" id="messagesSent">0</div>
              <span class="stat-change positive">+24%</span>
            </div>
            <div class="stat-icon">💬</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">Seguimientos</div>
              <div class="stat-value" id="followUps">0</div>
              <span class="stat-change negative">-3%</span>
            </div>
            <div class="stat-icon">📋</div>
          </div>
        </div>
      </div>
      
      <!-- Main Content Grid -->
      <div class="grid grid-2">
        <!-- Today's Appointments -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Citas de Hoy</h3>
            <button class="btn btn-secondary btn-icon">🔄</button>
          </div>
          <div class="card-body">
            <div id="todayAppointmentsList"></div>
          </div>
        </div>
        
        <!-- Pending Communications -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Comunicaciones Pendientes</h3>
            <span class="badge badge-warning" id="pendingCount">0</span>
          </div>
          <div class="card-body">
            <div id="pendingCommunications"></div>
          </div>
        </div>
        
        <!-- Recent Activity -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Actividad Reciente</h3>
          </div>
          <div class="card-body">
            <div id="recentActivity"></div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Acciones Rápidas</h3>
          </div>
          <div class="card-body">
            <div style="display: grid; gap: 1rem;">
              <button class="btn btn-primary" onclick="App.showNewAppointmentModal()">
                ➕ Nueva Cita
              </button>
              <button class="btn btn-secondary" onclick="Dashboard.showNewClientModal()">
                👤 Nuevo Cliente
              </button>
              <button class="btn btn-secondary" onclick="Dashboard.sendBulkReminders()">
                📧 Enviar Recordatorios
              </button>
              <button class="btn btn-secondary" onclick="Dashboard.generateDailyReport()">
                📊 Reporte del Día
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    },

    init() {
        this.loadStats();
        this.loadTodayAppointments();
        this.loadPendingCommunications();
        this.loadRecentActivity();
    },

    loadStats() {
        const appointments = App.getAppointments();
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointments.filter(a => a.date === today);

        document.getElementById('todayAppointments').textContent = todayAppointments.length;

        const clients = App.getClients();
        const totalPets = clients.reduce((sum, client) => sum + (client.pets?.length || 0), 0);
        document.getElementById('activePatients').textContent = totalPets;

        const communications = App.mockData.communications;
        document.getElementById('messagesSent').textContent = communications.length;

        const followUps = appointments.filter(a => a.type === 'Control').length;
        document.getElementById('followUps').textContent = followUps;
    },

    loadTodayAppointments() {
        const appointments = App.getAppointments();
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointments.filter(a => a.date === today);

        const container = document.getElementById('todayAppointmentsList');

        if (todayAppointments.length === 0) {
            container.innerHTML = '<p class="text-muted">No hay citas programadas para hoy</p>';
            return;
        }

        container.innerHTML = todayAppointments.map(apt => {
            const client = App.getClient(apt.clientId);
            const pet = client?.pets?.find(p => p.id === apt.petId);
            const statusBadge = apt.status === 'confirmed' ? 'badge-success' : 'badge-warning';

            return `
        <div style="padding: 1rem; border-bottom: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 600;">${apt.time} - ${pet?.name || 'Mascota'}</div>
            <div class="text-muted" style="font-size: 0.875rem;">${client?.name || 'Cliente'} • ${apt.type}</div>
          </div>
          <span class="badge ${statusBadge}">${apt.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}</span>
        </div>
      `;
        }).join('');
    },

    loadPendingCommunications() {
        const communications = App.mockData.communications.slice(-5);
        const container = document.getElementById('pendingCommunications');

        if (communications.length === 0) {
            container.innerHTML = '<p class="text-muted">No hay comunicaciones pendientes</p>';
            document.getElementById('pendingCount').textContent = '0';
            return;
        }

        document.getElementById('pendingCount').textContent = communications.length;

        container.innerHTML = communications.map(comm => {
            const client = App.getClient(comm.clientId);
            const channelIcons = {
                whatsapp: '📱',
                email: '📧',
                sms: '💬'
            };

            return `
        <div style="padding: 1rem; border-bottom: 1px solid var(--border-glass);">
          <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.25rem;">
            <span>${channelIcons[comm.channel] || '💬'}</span>
            <span style="font-weight: 600;">${client?.name || 'Cliente'}</span>
            <span class="badge badge-${comm.status === 'sent' ? 'success' : 'warning'}">${comm.status}</span>
          </div>
          <div class="text-muted" style="font-size: 0.875rem;">${comm.content}</div>
        </div>
      `;
        }).join('');
    },

    loadRecentActivity() {
        const activities = [
            { icon: '📅', text: 'Nueva cita creada - Max (Labrador)', time: 'Hace 5 min' },
            { icon: '📧', text: 'Email enviado - María González', time: 'Hace 15 min' },
            { icon: '📋', text: 'Historia clínica actualizada - Luna', time: 'Hace 1 hora' },
            { icon: '💬', text: 'WhatsApp confirmado - Carlos Ramírez', time: 'Hace 2 horas' }
        ];

        const container = document.getElementById('recentActivity');
        container.innerHTML = activities.map(activity => `
      <div style="padding: 1rem; border-bottom: 1px solid var(--border-glass); display: flex; gap: 1rem;">
        <div style="font-size: 1.5rem;">${activity.icon}</div>
        <div style="flex: 1;">
          <div style="font-weight: 500;">${activity.text}</div>
          <div class="text-muted" style="font-size: 0.75rem;">${activity.time}</div>
        </div>
      </div>
    `).join('');
    },

    showNewClientModal() {
        const content = `
      <form id="newClientForm">
        <div class="form-group">
          <label class="form-label">Nombre Completo</label>
          <input type="text" class="form-input" id="clientName" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" id="clientEmail" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">Teléfono</label>
          <input type="tel" class="form-input" id="clientPhone" required>
        </div>
        
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
          <button type="submit" class="btn btn-primary" style="flex: 1;">Crear Cliente</button>
          <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
        </div>
      </form>
    `;

        App.showModal('Nuevo Cliente', content);

        setTimeout(() => {
            document.getElementById('newClientForm').addEventListener('submit', (e) => {
                e.preventDefault();

                const client = {
                    name: document.getElementById('clientName').value,
                    email: document.getElementById('clientEmail').value,
                    phone: document.getElementById('clientPhone').value
                };

                App.addClient(client);
                App.closeModal();
                App.showNotification('Cliente creado', 'El cliente ha sido creado exitosamente', 'success');
                this.loadStats();
            });
        }, 100);
    },

    sendBulkReminders() {
        App.showNotification('Recordatorios enviados', 'Se enviaron 12 recordatorios por WhatsApp', 'success');
    },

    generateDailyReport() {
        App.showNotification('Reporte generado', 'El reporte diario ha sido exportado a Google Sheets', 'success');
    }
};
