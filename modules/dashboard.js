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
              <span class="stat-change" id="todayAppointmentsLabel" style="color:var(--text-muted);font-size:0.75rem;">cargando...</span>
            </div>
            <div class="stat-icon">📅</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">Pacientes Activos</div>
              <div class="stat-value" id="activePatients">0</div>
              <span class="stat-change" id="activePatientsLabel" style="color:var(--text-muted);font-size:0.75rem;">cargando...</span>
            </div>
            <div class="stat-icon">🐾</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">Mensajes Enviados</div>
              <div class="stat-value" id="messagesSent">0</div>
              <span class="stat-change" id="messagesSentLabel" style="color:var(--text-muted);font-size:0.75rem;">cargando...</span>
            </div>
            <div class="stat-icon">💬</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">Seguimientos</div>
              <div class="stat-value" id="followUps">0</div>
              <span class="stat-change" id="followUpsLabel" style="color:var(--text-muted);font-size:0.75rem;">cargando...</span>
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
        const todayAppointments = appointments.filter(a => (a.appointment_date || a.date) === today);

        const set     = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        const setLabel = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

        set('todayAppointments', todayAppointments.length);
        setLabel('todayAppointmentsLabel', todayAppointments.length === 1 ? '1 cita programada' : `${todayAppointments.length} citas programadas`);

        const clients = App.getClients();
        const totalPets = clients.reduce((sum, c) => sum + (c.pets?.length || c.patients?.length || 0), 0);
        set('activePatients', totalPets);
        setLabel('activePatientsLabel', `en ${clients.length} cliente${clients.length !== 1 ? 's' : ''}`);

        const communications = App.data?.communications || [];
        set('messagesSent', communications.length);
        const channels = [...new Set(communications.map(c => c.channel).filter(Boolean))];
        setLabel('messagesSentLabel', channels.length ? `vía ${channels.join(', ')}` : 'sin integraciones activas');

        const followUps = appointments.filter(a => (a.type || a.appointment_type) === 'Control').length;
        set('followUps', followUps);
        setLabel('followUpsLabel', 'tipo Control');
    },

    loadTodayAppointments() {
        const appointments = App.getAppointments();
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointments.filter(a => (a.appointment_date || a.date) === today);

        const container = document.getElementById('todayAppointmentsList');

        if (todayAppointments.length === 0) {
            container.innerHTML = '<p class="text-muted">No hay citas programadas para hoy</p>';
            return;
        }

        container.innerHTML = todayAppointments.map(apt => {
            // Supabase returns nested client/patient; fall back to cache for optimistic rows
            const client = apt.client || App.getClient(apt.clientId || apt.client_id);
            const pet = apt.patient || client?.pets?.find(p => p.id === (apt.petId || apt.patient_id));
            const aptTime = (apt.appointment_time || apt.time || '').slice(0, 5);
            const statusBadge = apt.status === 'confirmed' ? 'badge-success' : 'badge-warning';

            return `
        <div style="padding: 1rem; border-bottom: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 600;">${aptTime} - ${pet?.name || 'Mascota'}</div>
            <div class="text-muted" style="font-size: 0.875rem;">${client?.name || 'Cliente'} • ${apt.type || apt.appointment_type || ''}</div>
          </div>
          <span class="badge ${statusBadge}">${apt.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}</span>
        </div>
      `;
        }).join('');
    },

    loadPendingCommunications() {
        const communications = (App.data?.communications || []).slice(-5);
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
        <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">
          Datos del propietario y su mascota
        </p>

        <div style="font-weight: 600; color: var(--brand-green); margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-glass);">
          👤 Propietario
        </div>

        <div class="form-group">
          <label class="form-label">Nombre Completo</label>
          <input type="text" class="form-input" id="clientName" placeholder="Ej: María García" required>
        </div>

        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-input" id="clientEmail" placeholder="correo@ejemplo.com">
        </div>

        <div class="form-group">
          <label class="form-label">Teléfono</label>
          <input type="tel" class="form-input" id="clientPhone" placeholder="+1 555 000 0000" required>
        </div>

        <div style="font-weight: 600; color: var(--brand-green); margin: 1.5rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-glass);">
          🐾 Mascota
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">Nombre de la Mascota</label>
            <input type="text" class="form-input" id="petName" placeholder="Ej: Max" required>
          </div>
          <div class="form-group">
            <label class="form-label">Especie</label>
            <select class="form-select" id="petSpecies" required>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Ave">Ave</option>
              <option value="Conejo">Conejo</option>
              <option value="Reptil">Reptil</option>
              <option value="Caballo">Caballo</option>
              <option value="Bovino">Bovino</option>
              <option value="Cerdo">Cerdo</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Raza <span style="color:var(--text-muted)">(opcional)</span></label>
            <input type="text" class="form-input" id="petBreed" placeholder="Ej: Labrador">
          </div>
          <div class="form-group">
            <label class="form-label">Edad <span style="color:var(--text-muted)">(opcional)</span></label>
            <input type="text" class="form-input" id="petAge" placeholder="Ej: 3 años">
          </div>
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
          <button type="submit" class="btn btn-primary" style="flex: 1;">Crear Cliente y Mascota</button>
          <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
        </div>
      </form>
    `;

        App.showModal('Nuevo Cliente', content);

        setTimeout(() => {
            document.getElementById('newClientForm').addEventListener('submit', async (e) => {
                e.preventDefault();

                const client = {
                    name: document.getElementById('clientName').value,
                    email: document.getElementById('clientEmail').value || null,
                    phone: document.getElementById('clientPhone').value
                };

                const pet = {
                    name: document.getElementById('petName').value,
                    species: document.getElementById('petSpecies').value,
                    breed: document.getElementById('petBreed').value || null,
                    age: document.getElementById('petAge').value || null
                };

                try {
                    const savedClient = await App.addClient(client);
                    const clientId = savedClient?.id;

                    if (clientId && typeof DB !== 'undefined') {
                        await DB.addPatient({ ...pet, clientId });
                    }

                    App.closeModal();
                    App.showNotification('Registro completado', `${client.name} y ${pet.name} agregados correctamente`, 'success');
                    App.refreshData('clients');
                } catch (err) {
                    App.closeModal();
                    App.showNotification('Error', err.message || 'No se pudo crear el registro', 'error');
                }
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
