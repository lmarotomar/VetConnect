// Appointments Module
const Appointments = {
    currentFilter: 'all',

    render() {
        return `
      <!-- Filters and Actions -->
      <div class="card mb-lg">
        <div class="card-body">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn btn-secondary" onclick="Appointments.filterBy('all')">Todas</button>
              <button class="btn btn-secondary" onclick="Appointments.filterBy('today')">Hoy</button>
              <button class="btn btn-secondary" onclick="Appointments.filterBy('week')">Esta Semana</button>
              <button class="btn btn-secondary" onclick="Appointments.filterBy('pending')">Pendientes</button>
              <button class="btn btn-secondary" onclick="Appointments.filterBy('confirmed')">Confirmadas</button>
            </div>
            <button class="btn btn-primary" onclick="App.showNewAppointmentModal()">
              ➕ Nueva Cita
            </button>
          </div>
        </div>
      </div>
      
      <!-- Calendar View -->
      <div class="grid grid-2">
        <!-- Appointments List -->
        <div class="card" style="grid-column: 1 / -1;">
          <div class="card-header">
            <h3 class="card-title">Citas Programadas</h3>
            <span class="badge badge-info" id="appointmentCount">0</span>
          </div>
          <div class="card-body">
            <div id="appointmentsList"></div>
          </div>
        </div>
      </div>
      
      <!-- Triage Form Section -->
      <div class="card mt-lg">
        <div class="card-header">
          <h3 class="card-title">📋 Formulario de Triage</h3>
          <span class="text-muted" style="font-size: 0.875rem;">Se envía automáticamente 24h antes de la cita</span>
        </div>
        <div class="card-body">
          <div class="grid grid-2">
            <div>
              <h4 style="margin-bottom: 1rem;">Preguntas Pre-Consulta</h4>
              <ul style="list-style: none; padding: 0;">
                <li style="padding: 0.75rem; background: var(--bg-glass); margin-bottom: 0.5rem; border-radius: var(--radius-md);">
                  ✓ ¿Cuál es el motivo de la consulta?
                </li>
                <li style="padding: 0.75rem; background: var(--bg-glass); margin-bottom: 0.5rem; border-radius: var(--radius-md);">
                  ✓ ¿Ha presentado síntomas? ¿Cuáles?
                </li>
                <li style="padding: 0.75rem; background: var(--bg-glass); margin-bottom: 0.5rem; border-radius: var(--radius-md);">
                  ✓ ¿Está comiendo y bebiendo normalmente?
                </li>
                <li style="padding: 0.75rem; background: var(--bg-glass); margin-bottom: 0.5rem; border-radius: var(--radius-md);">
                  ✓ ¿Algún cambio en el comportamiento?
                </li>
                <li style="padding: 0.75rem; background: var(--bg-glass); margin-bottom: 0.5rem; border-radius: var(--radius-md);">
                  ✓ ¿Medicación actual?
                </li>
              </ul>
            </div>
            <div>
              <h4 style="margin-bottom: 1rem;">Automatizaciones</h4>
              <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md); border-left: 3px solid var(--accent-teal);">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <span style="font-size: 1.5rem;">📱</span>
                  <strong>Confirmación Inmediata</strong>
                </div>
                <p class="text-muted" style="font-size: 0.875rem; margin: 0;">WhatsApp enviado al crear la cita</p>
              </div>
              
              <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md); margin-top: 1rem; border-left: 3px solid var(--accent-blue);">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <span style="font-size: 1.5rem;">⏰</span>
                  <strong>Recordatorio 24h</strong>
                </div>
                <p class="text-muted" style="font-size: 0.875rem; margin: 0;">Incluye formulario de triage</p>
              </div>
              
              <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md); margin-top: 1rem; border-left: 3px solid var(--accent-purple);">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <span style="font-size: 1.5rem;">🔔</span>
                  <strong>Recordatorio 2h</strong>
                </div>
                <p class="text-muted" style="font-size: 0.875rem; margin: 0;">Recordatorio final antes de la cita</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    },

    init() {
        this.loadAppointments();
    },

    filterBy(filter) {
        this.currentFilter = filter;
        this.loadAppointments();
    },

    loadAppointments() {
        let appointments = App.getAppointments();
        const today = new Date().toISOString().split('T')[0];

        // Apply filters
        switch (this.currentFilter) {
            case 'today':
                appointments = appointments.filter(a => a.date === today);
                break;
            case 'week':
                const weekFromNow = new Date();
                weekFromNow.setDate(weekFromNow.getDate() + 7);
                appointments = appointments.filter(a => {
                    const aptDate = new Date(a.date);
                    return aptDate >= new Date(today) && aptDate <= weekFromNow;
                });
                break;
            case 'pending':
                appointments = appointments.filter(a => a.status === 'pending');
                break;
            case 'confirmed':
                appointments = appointments.filter(a => a.status === 'confirmed');
                break;
        }

        // Sort by date and time
        appointments.sort((a, b) => {
            if (a.date !== b.date) {
                return a.date.localeCompare(b.date);
            }
            return a.time.localeCompare(b.time);
        });

        const container = document.getElementById('appointmentsList');
        const countBadge = document.getElementById('appointmentCount');

        countBadge.textContent = appointments.length;

        if (appointments.length === 0) {
            container.innerHTML = '<p class="text-muted text-center" style="padding: 2rem;">No se encontraron citas</p>';
            return;
        }

        container.innerHTML = `
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Cliente</th>
              <th>Mascota</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${appointments.map(apt => this.renderAppointmentRow(apt)).join('')}
          </tbody>
        </table>
      </div>
    `;
    },

    renderAppointmentRow(appointment) {
        const client = App.getClient(appointment.clientId);
        const pet = client?.pets?.find(p => p.id === appointment.petId);
        const statusBadge = appointment.status === 'confirmed' ? 'badge-success' :
            appointment.status === 'pending' ? 'badge-warning' : 'badge-info';
        const statusText = appointment.status === 'confirmed' ? 'Confirmada' :
            appointment.status === 'pending' ? 'Pendiente' : appointment.status;

        return `
      <tr>
        <td>${App.formatDate(appointment.date)}</td>
        <td><strong>${appointment.time}</strong></td>
        <td>${client?.name || 'N/A'}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>🐾</span>
            <div>
              <div style="font-weight: 500;">${pet?.name || 'N/A'}</div>
              <div class="text-muted" style="font-size: 0.75rem;">${pet?.species || ''} ${pet?.breed || ''}</div>
            </div>
          </div>
        </td>
        <td>${appointment.type}</td>
        <td><span class="badge ${statusBadge}">${statusText}</span></td>
        <td>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary btn-icon" onclick="Appointments.viewAppointment(${appointment.id})" title="Ver detalles">👁️</button>
            <button class="btn btn-secondary btn-icon" onclick="Appointments.completeAppointment(${appointment.id})" title="Completar">✓</button>
          </div>
        </td>
      </tr>
    `;
    },

    viewAppointment(id) {
        const appointment = App.getAppointment(id);
        if (!appointment) return;

        const client = App.getClient(appointment.clientId);
        const pet = client?.pets?.find(p => p.id === appointment.petId);

        const content = `
      <div style="display: grid; gap: 1rem;">
        <div>
          <div class="form-label">Cliente</div>
          <div style="padding: 0.75rem; background: var(--bg-glass); border-radius: var(--radius-md);">
            ${client?.name || 'N/A'}<br>
            <span class="text-muted" style="font-size: 0.875rem;">${client?.email || ''} • ${client?.phone || ''}</span>
          </div>
        </div>
        
        <div>
          <div class="form-label">Mascota</div>
          <div style="padding: 0.75rem; background: var(--bg-glass); border-radius: var(--radius-md);">
            🐾 ${pet?.name || 'N/A'}<br>
            <span class="text-muted" style="font-size: 0.875rem;">${pet?.species || ''} • ${pet?.breed || ''} • ${pet?.age || ''} años</span>
          </div>
        </div>
        
        <div class="grid grid-2">
          <div>
            <div class="form-label">Fecha</div>
            <div style="padding: 0.75rem; background: var(--bg-glass); border-radius: var(--radius-md);">
              ${App.formatDate(appointment.date)}
            </div>
          </div>
          <div>
            <div class="form-label">Hora</div>
            <div style="padding: 0.75rem; background: var(--bg-glass); border-radius: var(--radius-md);">
              ${appointment.time}
            </div>
          </div>
        </div>
        
        <div>
          <div class="form-label">Tipo de Consulta</div>
          <div style="padding: 0.75rem; background: var(--bg-glass); border-radius: var(--radius-md);">
            ${appointment.type}
          </div>
        </div>
        
        <div>
          <div class="form-label">Notas</div>
          <div style="padding: 0.75rem; background: var(--bg-glass); border-radius: var(--radius-md);">
            ${appointment.notes || 'Sin notas'}
          </div>
        </div>
        
        <button class="btn btn-primary" onclick="App.closeModal()">Cerrar</button>
      </div>
    `;

        App.showModal('Detalles de la Cita', content);
    },

    completeAppointment(id) {
        const appointment = App.getAppointment(id);
        if (!appointment) return;

        App.updateAppointment(id, { status: 'completed' });
        App.triggerAutomation('appointment_completed', appointment);
        App.showNotification('Cita completada', 'Se han enviado instrucciones de seguimiento al cliente', 'success');
        this.loadAppointments();
    }
};
