// Appointments Module
const Appointments = {
    currentFilter: 'all',

    render() {
        return `
      <!-- Filters and Actions -->
      <div class="card mb-lg">
        <div class="card-body">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;" id="appointmentFilters">
              <button class="btn btn-secondary active-filter" onclick="Appointments.filterBy('all')">Todas</button>
              <button class="btn btn-secondary" onclick="Appointments.filterBy('today')">Hoy</button>
              <button class="btn btn-secondary" onclick="Appointments.filterBy('week')">Esta Semana</button>
              <button class="btn btn-secondary" onclick="Appointments.filterBy('pending')">Pendientes</button>
              <button class="btn btn-secondary" onclick="Appointments.filterBy('confirmed')">Confirmadas</button>
              <button class="btn btn-secondary" onclick="Appointments.filterBy('completed')">Completadas</button>
              <button class="btn btn-secondary" onclick="Appointments.filterBy('cancelled')">Canceladas</button>
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
        // Update active filter button style
        document.querySelectorAll('#appointmentFilters .btn').forEach(btn => {
            btn.classList.remove('active-filter');
        });
        event?.target?.classList.add('active-filter');
        this.loadAppointments();
    },

    loadAppointments() {
        let appointments = App.getAppointments();
        const today = new Date().toISOString().split('T')[0];

        // Apply filters — Supabase returns appointment_date / appointment_time
        switch (this.currentFilter) {
            case 'today':
                appointments = appointments.filter(a => (a.appointment_date || a.date) === today);
                break;
            case 'week': {
                const weekFromNow = new Date();
                weekFromNow.setDate(weekFromNow.getDate() + 7);
                appointments = appointments.filter(a => {
                    const aptDate = new Date(a.appointment_date || a.date);
                    return aptDate >= new Date(today) && aptDate <= weekFromNow;
                });
                break;
            }
            case 'pending':
                appointments = appointments.filter(a => a.status === 'pending');
                break;
            case 'confirmed':
                appointments = appointments.filter(a => a.status === 'confirmed');
                break;
            case 'completed':
                appointments = appointments.filter(a => a.status === 'completed');
                break;
            case 'cancelled':
                appointments = appointments.filter(a => a.status === 'cancelled');
                break;
        }

        // Sort by date and time
        appointments.sort((a, b) => {
            const da = a.appointment_date || a.date || '';
            const db = b.appointment_date || b.date || '';
            if (da !== db) return da.localeCompare(db);
            const ta = a.appointment_time || a.time || '';
            const tb = b.appointment_time || b.time || '';
            return ta.localeCompare(tb);
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
        // Supabase returns nested client/patient objects; fall back to App cache for optimistic rows
        const client = appointment.client || App.getClient(appointment.clientId || appointment.client_id);
        const pet = appointment.patient || client?.pets?.find(p => p.id === (appointment.petId || appointment.patient_id));

        const aptDate = appointment.appointment_date || appointment.date || '';
        const aptTime = (appointment.appointment_time || appointment.time || '').slice(0, 5);

        const statusMap = {
            pending:   { badge: 'badge-warning', text: 'Pendiente' },
            confirmed: { badge: 'badge-success', text: 'Confirmada' },
            completed: { badge: 'badge-info',    text: 'Completada' },
            cancelled: { badge: 'badge-error',   text: 'Cancelada'  }
        };
        const { badge: statusBadge, text: statusText } = statusMap[appointment.status] || { badge: 'badge-warning', text: appointment.status };

        // Action buttons depend on current status
        const actions = [];
        actions.push(`<button class="btn btn-secondary btn-icon" onclick="Appointments.viewAppointment('${appointment.id}')" title="Ver detalles">👁️</button>`);

        if (appointment.status === 'pending') {
            actions.push(`<button class="btn btn-secondary btn-icon" style="color:var(--accent-teal);" onclick="Appointments.confirmAppointment('${appointment.id}')" title="Confirmar">✓</button>`);
            actions.push(`<button class="btn btn-secondary btn-icon" style="color:var(--error);" onclick="Appointments.cancelAppointment('${appointment.id}')" title="Cancelar">✕</button>`);
        }
        if (appointment.status === 'confirmed') {
            actions.push(`<button class="btn btn-primary btn-sm" onclick="Appointments.completeAppointment('${appointment.id}')" title="Marcar completada">Completar</button>`);
            actions.push(`<button class="btn btn-secondary btn-icon" style="color:var(--error);" onclick="Appointments.cancelAppointment('${appointment.id}')" title="Cancelar">✕</button>`);
        }

        return `
      <tr>
        <td>${App.formatDate(aptDate)}</td>
        <td><strong>${aptTime}</strong></td>
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
        <td>${appointment.type || appointment.appointment_type || ''}</td>
        <td><span class="badge ${statusBadge}">${statusText}</span></td>
        <td>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${actions.join('')}
          </div>
        </td>
      </tr>
    `;
    },

    viewAppointment(id) {
        const appointment = App.getAppointment(id);
        if (!appointment) return;

        const client = appointment.client || App.getClient(appointment.clientId || appointment.client_id);
        const pet = appointment.patient || client?.pets?.find(p => p.id === (appointment.petId || appointment.patient_id));
        const aptDate = appointment.appointment_date || appointment.date || '';
        const aptTime = (appointment.appointment_time || appointment.time || '').slice(0, 5);

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
            <span class="text-muted" style="font-size: 0.875rem;">${pet?.species || ''} • ${pet?.breed || ''} • ${pet?.age || ''}</span>
          </div>
        </div>

        <div class="grid grid-2">
          <div>
            <div class="form-label">Fecha</div>
            <div style="padding: 0.75rem; background: var(--bg-glass); border-radius: var(--radius-md);">
              ${App.formatDate(aptDate)}
            </div>
          </div>
          <div>
            <div class="form-label">Hora</div>
            <div style="padding: 0.75rem; background: var(--bg-glass); border-radius: var(--radius-md);">
              ${aptTime}
            </div>
          </div>
        </div>

        <div>
          <div class="form-label">Tipo de Consulta</div>
          <div style="padding: 0.75rem; background: var(--bg-glass); border-radius: var(--radius-md);">
            ${appointment.type || ''}
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

    confirmAppointment(id) {
        if (!confirm('¿Confirmar esta cita?')) return;
        App.updateAppointment(id, { status: 'confirmed' });
        App.showNotification('Cita confirmada', 'El estado ha sido actualizado a Confirmada', 'success');
        this.loadAppointments();
    },

    cancelAppointment(id) {
        if (!confirm('¿Cancelar esta cita? Esta acción no se puede deshacer.')) return;
        App.updateAppointment(id, { status: 'cancelled' });
        App.showNotification('Cita cancelada', 'La cita ha sido marcada como cancelada', 'info');
        this.loadAppointments();
    },

    completeAppointment(id) {
        const appointment = App.getAppointment(id);
        if (!appointment) return;

        const client = appointment.client || App.getClient(appointment.clientId || appointment.client_id);
        const pet    = appointment.patient || client?.pets?.find(p => p.id === (appointment.petId || appointment.patient_id));

        const content = `
      <div style="display:flex;flex-direction:column;gap:1.25rem;">
        <div style="padding:1rem;background:var(--bg-glass);border-radius:var(--radius-md);">
          <div style="font-weight:600;margin-bottom:0.25rem;">
            ${pet?.name || 'Mascota'} — ${client?.name || 'Cliente'}
          </div>
          <div class="text-muted" style="font-size:0.875rem;">
            ${appointment.type || ''} · ${App.formatDate(appointment.appointment_date || appointment.date)}
          </div>
        </div>

        <p style="color:var(--text-muted);font-size:0.9rem;">
          ¿Deseas crear una historia clínica para esta consulta ahora?
        </p>

        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          <button class="btn btn-primary" onclick="Appointments._doComplete('${id}', true)">
            ✓ Completar y abrir Historia Clínica
          </button>
          <button class="btn btn-secondary" onclick="Appointments._doComplete('${id}', false)">
            Completar sin historia clínica
          </button>
          <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
        </div>
      </div>`;

        App.showModal('Completar Cita', content);
    },

    async _doComplete(id, openRecord) {
        const appointment = App.getAppointment(id);
        App.closeModal();
        await App.updateAppointment(id, { status: 'completed' });
        App.triggerAutomation('appointment_completed', appointment);
        App.showNotification('Cita completada', 'Estado actualizado correctamente', 'success');
        this.loadAppointments();

        if (openRecord && appointment) {
            const client = appointment.client || App.getClient(appointment.clientId || appointment.client_id);
            const pets   = client?.pets || client?.patients || [];
            const petId  = appointment.petId || appointment.patient_id;
            const pet    = appointment.patient || pets.find(p => String(p.id) === String(petId));

            if (pet && client) {
                // Pre-select patient in Clinical Records and open form
                App.navigateTo('clinical-records');
                setTimeout(() => {
                    const select = document.getElementById('patientSelect');
                    if (select) {
                        const val = `${client.id}||${pet.id}`;
                        select.value = val;
                        ClinicalRecords.selectPet(val);
                        setTimeout(() => ClinicalRecords.showNewRecordForm(), 300);
                    }
                }, 400);
            }
        }
    }
};
