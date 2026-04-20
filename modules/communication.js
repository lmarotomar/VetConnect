// Communication Module
const Communication = {
    selectedClient: null,

    render() {
        return `
      <!-- Communication Channels -->
      <div class="stats-grid mb-lg" id="commStats">
        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">WhatsApp Enviados</div>
              <div class="stat-value" id="comm-whatsapp">—</div>
            </div>
            <div class="stat-icon">📱</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">Emails Enviados</div>
              <div class="stat-value" id="comm-email">—</div>
            </div>
            <div class="stat-icon">📧</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">SMS Enviados</div>
              <div class="stat-value" id="comm-sms">—</div>
            </div>
            <div class="stat-icon">💬</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">Total Mensajes</div>
              <div class="stat-value" id="comm-total">—</div>
            </div>
            <div class="stat-icon">📊</div>
          </div>
        </div>
      </div>
      
      <!-- Main Communication Interface -->
      <div class="grid grid-3">
        <!-- Client List -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Clientes</h3>
          </div>
          <div class="card-body">
            <div class="form-group">
              <input type="text" class="form-input" placeholder="Buscar cliente..." id="clientSearch">
            </div>
            <div id="clientList"></div>
          </div>
        </div>
        
        <!-- Communication History -->
        <div class="card" style="grid-column: span 2;">
          <div class="card-header">
            <h3 class="card-title">Historial de Comunicaciones</h3>
            <button class="btn btn-primary" onclick="Communication.showNewMessageModal()">
              ➕ Nuevo Mensaje
            </button>
          </div>
          <div class="card-body">
            <div id="communicationHistory">
              <p class="text-muted text-center" style="padding: 2rem;">Selecciona un cliente para ver el historial</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Message Templates -->
      <div class="card mt-lg">
        <div class="card-header">
          <h3 class="card-title">📝 Plantillas de Mensajes</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-3">
            <div class="template-card" onclick="Communication.useTemplate('confirmation')">
              <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md); cursor: pointer; transition: all 0.3s ease;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">✅</div>
                <strong>Confirmación de Cita</strong>
                <p class="text-muted" style="font-size: 0.875rem; margin-top: 0.5rem;">
                  "Hola {nombre}, tu cita está confirmada para el {fecha} a las {hora}."
                </p>
              </div>
            </div>
            
            <div class="template-card" onclick="Communication.useTemplate('reminder')">
              <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md); cursor: pointer; transition: all 0.3s ease;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">⏰</div>
                <strong>Recordatorio</strong>
                <p class="text-muted" style="font-size: 0.875rem; margin-top: 0.5rem;">
                  "Te recordamos tu cita mañana a las {hora}. Por favor confirma tu asistencia."
                </p>
              </div>
            </div>
            
            <div class="template-card" onclick="Communication.useTemplate('followup')">
              <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md); cursor: pointer; transition: all 0.3s ease;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔄</div>
                <strong>Seguimiento</strong>
                <p class="text-muted" style="font-size: 0.875rem; margin-top: 0.5rem;">
                  "¿Cómo ha evolucionado {mascota}? Nos gustaría saber sobre su progreso."
                </p>
              </div>
            </div>
            
            <div class="template-card" onclick="Communication.useTemplate('results')">
              <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md); cursor: pointer; transition: all 0.3s ease;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">📋</div>
                <strong>Resultados</strong>
                <p class="text-muted" style="font-size: 0.875rem; margin-top: 0.5rem;">
                  "Los resultados de {mascota} están listos. Todo se ve bien."
                </p>
              </div>
            </div>
            
            <div class="template-card" onclick="Communication.useTemplate('instructions')">
              <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md); cursor: pointer; transition: all 0.3s ease;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">📄</div>
                <strong>Instrucciones</strong>
                <p class="text-muted" style="font-size: 0.875rem; margin-top: 0.5rem;">
                  "Aquí están las instrucciones de cuidado post-consulta para {mascota}."
                </p>
              </div>
            </div>
            
            <div class="template-card" onclick="Communication.useTemplate('vaccination')">
              <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md); cursor: pointer; transition: all 0.3s ease;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">💉</div>
                <strong>Recordatorio Vacunación</strong>
                <p class="text-muted" style="font-size: 0.875rem; margin-top: 0.5rem;">
                  "Es momento de la vacuna de {mascota}. Agenda tu cita."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Integration Status -->
      <div class="card mt-lg">
        <div class="card-header">
          <h3 class="card-title">🔗 Estado de Integraciones</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-2">
            <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-size: 2rem;">📱</span>
                <div>
                  <strong>WhatsApp Business API</strong>
                  <div class="text-muted" style="font-size: 0.875rem;">Conectado y activo</div>
                </div>
              </div>
              <span class="badge badge-success">Activo</span>
            </div>
            
            <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-size: 2rem;">📞</span>
                <div>
                  <strong>Twilio SMS</strong>
                  <div class="text-muted" style="font-size: 0.875rem;">Conectado y activo</div>
                </div>
              </div>
              <span class="badge badge-success">Activo</span>
            </div>
            
            <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-size: 2rem;">📧</span>
                <div>
                  <strong>SendGrid Email</strong>
                  <div class="text-muted" style="font-size: 0.875rem;">Pendiente configuración</div>
                </div>
              </div>
              <span class="badge badge-warning">Config</span>
            </div>
            
            <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-size: 2rem;">🔗</span>
                <div>
                  <strong>HubSpot CRM</strong>
                  <div class="text-muted" style="font-size: 0.875rem;">Sincronización activa</div>
                </div>
              </div>
              <span class="badge badge-success">Activo</span>
            </div>
          </div>
        </div>
      </div>
    `;
    },

    init() {
        this.loadStats();
        this.loadClients();
    },

    loadStats() {
        const comms = (typeof App !== 'undefined' && App.data && App.data.communications) ? App.data.communications : [];
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('comm-whatsapp', comms.filter(c => c.channel === 'whatsapp').length);
        set('comm-email',    comms.filter(c => c.channel === 'email').length);
        set('comm-sms',      comms.filter(c => c.channel === 'sms').length);
        set('comm-total',    comms.length);
    },

    loadClients() {
        const clients = App.getClients();
        const container = document.getElementById('clientList');

        container.innerHTML = clients.map(client => `
      <div class="client-item" onclick="Communication.selectClient(${client.id})" style="padding: 1rem; border-bottom: 1px solid var(--border-glass); cursor: pointer; transition: all 0.2s ease;">
        <div style="font-weight: 600;">${client.name}</div>
        <div class="text-muted" style="font-size: 0.875rem;">${client.email}</div>
      </div>
    `).join('');
    },

    selectClient(clientId) {
        this.selectedClient = App.getClient(clientId);
        this.loadCommunicationHistory();

        // Highlight selected client
        document.querySelectorAll('.client-item').forEach(item => {
            item.style.background = 'transparent';
        });
        event.currentTarget.style.background = 'var(--bg-glass)';
    },

    loadCommunicationHistory() {
        if (!this.selectedClient) return;

        const communications = App.getCommunications(this.selectedClient.id);
        const container = document.getElementById('communicationHistory');

        if (communications.length === 0) {
            container.innerHTML = '<p class="text-muted text-center" style="padding: 2rem;">No hay comunicaciones registradas</p>';
            return;
        }

        const channelIcons = {
            whatsapp: '📱 WhatsApp',
            email: '📧 Email',
            sms: '💬 SMS'
        };

        container.innerHTML = communications.map(comm => `
      <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md); margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
          <div>
            <strong>${channelIcons[comm.channel] || comm.channel}</strong>
            <span class="badge badge-${comm.status === 'sent' ? 'success' : 'warning'}">${comm.status}</span>
          </div>
          <span class="text-muted" style="font-size: 0.75rem;">${new Date(comm.timestamp).toLocaleString('es-ES')}</span>
        </div>
        <div>${comm.content}</div>
      </div>
    `).join('');
    },

    showNewMessageModal() {
        if (!this.selectedClient) {
            App.showNotification('Selecciona un cliente', 'Primero debes seleccionar un cliente', 'warning');
            return;
        }

        const content = `
      <form id="newMessageForm">
        <div class="form-group">
          <label class="form-label">Canal de Comunicación</label>
          <select class="form-select" id="messageChannel" required>
            <option value="whatsapp">📱 WhatsApp</option>
            <option value="sms">💬 SMS</option>
            <option value="email">📧 Email</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Mensaje</label>
          <textarea class="form-textarea" id="messageContent" required rows="6"></textarea>
        </div>
        
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
          <button type="submit" class="btn btn-primary" style="flex: 1;">Enviar Mensaje</button>
          <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
        </div>
      </form>
    `;

        App.showModal('Nuevo Mensaje - ' + this.selectedClient.name, content);

        setTimeout(() => {
            document.getElementById('newMessageForm').addEventListener('submit', (e) => {
                e.preventDefault();

                const message = {
                    clientId: this.selectedClient.id,
                    channel: document.getElementById('messageChannel').value,
                    content: document.getElementById('messageContent').value,
                    status: 'sent'
                };

                App.addCommunication(message);
                App.closeModal();
                App.showNotification('Mensaje enviado', 'El mensaje ha sido enviado exitosamente', 'success');
                this.loadCommunicationHistory();
            });
        }, 100);
    },

    useTemplate(templateType) {
        const templates = {
            confirmation: 'Hola {nombre}, tu cita está confirmada para el {fecha} a las {hora}. ¡Te esperamos!',
            reminder: 'Te recordamos tu cita mañana a las {hora}. Por favor confirma tu asistencia respondiendo este mensaje.',
            followup: '¿Cómo ha evolucionado {mascota}? Nos gustaría saber sobre su progreso después de la última consulta.',
            results: 'Los resultados de los exámenes de {mascota} están listos. Todo se ve bien. Puedes pasar a recogerlos cuando gustes.',
            instructions: 'Aquí están las instrucciones de cuidado post-consulta para {mascota}: {instrucciones}',
            vaccination: 'Es momento de la próxima vacuna de {mascota}. Por favor agenda tu cita lo antes posible.'
        };

        const template = templates[templateType];
        if (template) {
            this.showNewMessageModal();
            setTimeout(() => {
                document.getElementById('messageContent').value = template;
            }, 150);
        }
    }
};
