// Communication Module
const Communication = {
    selectedClient: null,

    render() {
        return `
      <!-- Stats -->
      <div class="stats-grid mb-lg">
        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">WhatsApp</div>
              <div class="stat-value" id="comm-whatsapp">—</div>
            </div>
            <div class="stat-icon">📱</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">Email</div>
              <div class="stat-value" id="comm-email">—</div>
            </div>
            <div class="stat-icon">📧</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">SMS</div>
              <div class="stat-value" id="comm-sms">—</div>
            </div>
            <div class="stat-icon">💬</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">Total</div>
              <div class="stat-value" id="comm-total">—</div>
            </div>
            <div class="stat-icon">📊</div>
          </div>
        </div>
      </div>

      <!-- Cliente + Historial -->
      <div class="grid grid-3">
        <!-- Lista de clientes -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Clientes</h3>
          </div>
          <div class="card-body" style="padding-top:0;">
            <div class="form-group" style="padding-top:1rem;">
              <input type="text" class="form-input" placeholder="Buscar cliente..."
                oninput="Communication.filterClients(this.value)">
            </div>
            <div id="clientList"></div>
          </div>
        </div>

        <!-- Historial -->
        <div class="card" style="grid-column:span 2;">
          <div class="card-header">
            <h3 class="card-title" id="historyTitle">Historial de Comunicaciones</h3>
            <button class="btn btn-primary" onclick="Communication.showNewMessageModal()">
              ➕ Nuevo Mensaje
            </button>
          </div>
          <div class="card-body">
            <div id="communicationHistory">
              <p class="text-muted text-center" style="padding:2rem;">
                Selecciona un cliente para ver el historial
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Plantillas -->
      <div class="card mt-lg">
        <div class="card-header">
          <h3 class="card-title">📝 Plantillas de Mensajes</h3>
          <span class="text-muted" style="font-size:0.8rem;" id="templateHint">Selecciona un cliente para personalizar</span>
        </div>
        <div class="card-body">
          <div class="grid grid-3" id="templateCards">
            ${Communication._templateCards()}
          </div>
        </div>
      </div>

      <!-- Estado de Integraciones -->
      <div class="card mt-lg">
        <div class="card-header">
          <h3 class="card-title">🔗 Estado de Integraciones</h3>
          <button class="btn btn-secondary btn-sm" onclick="App.navigateTo('settings')">
            ⚙️ Configurar
          </button>
        </div>
        <div class="card-body">
          <div class="grid grid-2" id="integrationStatus"></div>
        </div>
      </div>
    `;
    },

    _templateCards() {
        const client   = this.selectedClient;
        const nombre   = client?.name?.split(' ')[0] || null;
        const pet      = (client?.pets || client?.patients || [])[0];
        const mascota  = pet?.name || null;

        const fill = (text) => {
            if (!client) return text; // keep placeholders if no client selected
            return text
                .replace(/\{nombre\}/g,   nombre   || '{nombre}')
                .replace(/\{mascota\}/g,  mascota  || '{mascota}');
        };

        const templates = [
            { id: 'confirmation', icon: '✅', title: 'Confirmación de Cita',
              preview: fill('Hola {nombre}, tu cita está confirmada para el {fecha} a las {hora}.') },
            { id: 'reminder',     icon: '⏰', title: 'Recordatorio',
              preview: fill('Hola {nombre}, te recordamos tu cita mañana. Confirma tu asistencia.') },
            { id: 'followup',     icon: '🔄', title: 'Seguimiento',
              preview: fill('Hola {nombre}, ¿cómo ha evolucionado {mascota}? Nos gustaría saber de su progreso.') },
            { id: 'results',      icon: '📋', title: 'Resultados Listos',
              preview: fill('Hola {nombre}, los resultados de {mascota} están listos. Todo se ve bien.') },
            { id: 'instructions', icon: '📄', title: 'Instrucciones Post-Consulta',
              preview: fill('Hola {nombre}, aquí las instrucciones de cuidado post-consulta para {mascota}.') },
            { id: 'vaccination',  icon: '💉', title: 'Recordatorio de Vacuna',
              preview: fill('Hola {nombre}, es momento de la próxima vacuna de {mascota}. Agenda tu cita.') }
        ];

        const disabled = !client;
        return templates.map(t => `
          <div onclick="${disabled ? 'App.showNotification(\'Selecciona un cliente\',\'Primero selecciona un cliente de la lista\',\'warning\')' : `Communication.useTemplate('${t.id}')`}"
            style="padding:1rem;background:var(--bg-glass);border-radius:var(--radius-md);
              cursor:pointer;opacity:${disabled ? 0.5 : 1};transition:opacity 0.2s;"
            onmouseover="this.style.opacity=${disabled ? 0.5 : 0.8}"
            onmouseout="this.style.opacity=${disabled ? 0.5 : 1}">
            <div style="font-size:2rem;margin-bottom:0.5rem;">${t.icon}</div>
            <strong>${t.title}</strong>
            <p class="text-muted" style="font-size:0.8rem;margin-top:0.5rem;">"${t.preview}"</p>
          </div>`).join('');
    },

    init() {
        this.selectedClient = null; // reset on each visit
        this.loadStats();
        this.loadClients();
        this._renderIntegrationStatus();
    },

    loadStats() {
        const comms = App.data?.communications || [];
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('comm-whatsapp', comms.filter(c => c.channel === 'whatsapp').length);
        set('comm-email',    comms.filter(c => c.channel === 'email').length);
        set('comm-sms',      comms.filter(c => c.channel === 'sms').length);
        set('comm-total',    comms.length);
    },

    loadClients(filter = '') {
        const clients = App.getClients();
        const lc = filter.toLowerCase();
        const filtered = lc
            ? clients.filter(c => c.name?.toLowerCase().includes(lc) || c.email?.toLowerCase().includes(lc))
            : clients;

        const container = document.getElementById('clientList');
        if (!container) return;

        if (filtered.length === 0) {
            container.innerHTML = '<p class="text-muted" style="padding:1rem;font-size:0.85rem;">Sin resultados</p>';
            return;
        }

        container.innerHTML = filtered.map(client => {
            const lastComm = (App.data?.communications || [])
                .filter(c => String(c.client_id || c.clientId) === String(client.id))
                .sort((a, b) => new Date(b.created_at || b.timestamp) - new Date(a.created_at || a.timestamp))[0];
            const selected = this.selectedClient?.id === client.id;

            return `
          <div onclick="Communication.selectClient('${client.id}')"
            style="padding:1rem;border-bottom:1px solid var(--border-glass);cursor:pointer;
              background:${selected ? 'var(--bg-glass)' : 'transparent'};transition:background 0.2s;"
            onmouseover="this.style.background='var(--bg-glass)'"
            onmouseout="this.style.background='${selected ? 'var(--bg-glass)' : 'transparent'}'">
            <div style="font-weight:600;">${client.name}</div>
            <div class="text-muted" style="font-size:0.8rem;">${client.email || client.phone || ''}</div>
            ${lastComm ? `<div style="font-size:0.75rem;color:var(--accent-teal);margin-top:0.25rem;">
              Último: ${new Date(lastComm.created_at || lastComm.timestamp).toLocaleDateString('es-ES')}
            </div>` : ''}
          </div>`;
        }).join('');
    },

    filterClients(value) {
        this.loadClients(value);
    },

    selectClient(clientId) {
        this.selectedClient = App.getClient(clientId);
        if (!this.selectedClient) return;
        this.loadClients();
        this.loadCommunicationHistory();

        const title = document.getElementById('historyTitle');
        if (title) title.textContent = `Historial — ${this.selectedClient.name}`;

        // Refresh template cards with client data
        const tplContainer = document.getElementById('templateCards');
        if (tplContainer) tplContainer.innerHTML = this._templateCards();
        const hint = document.getElementById('templateHint');
        if (hint) {
            const pet = (this.selectedClient.pets || this.selectedClient.patients || [])[0];
            hint.textContent = `Personalizado para ${this.selectedClient.name}${pet ? ` y ${pet.name}` : ''} — haz clic para usar`;
            hint.style.color = 'var(--brand-green)';
        }
    },

    loadCommunicationHistory() {
        if (!this.selectedClient) return;

        const communications = App.getCommunications(this.selectedClient.id);
        const container = document.getElementById('communicationHistory');
        if (!container) return;

        if (communications.length === 0) {
            container.innerHTML = '<p class="text-muted text-center" style="padding:2rem;">Sin comunicaciones registradas con este cliente</p>';
            return;
        }

        const channelIcons = { whatsapp: '📱', email: '📧', sms: '💬' };
        const typeLabels = {
            appointment_confirmation: 'Confirmación de cita',
            reminder_24h: 'Recordatorio 24h',
            reminder_2h: 'Recordatorio 2h',
            followup: 'Seguimiento',
            manual: 'Mensaje manual'
        };

        container.innerHTML = [...communications]
            .sort((a, b) => new Date(b.created_at || b.timestamp) - new Date(a.created_at || a.timestamp))
            .map(comm => {
                const ts = comm.created_at || comm.timestamp;
                const dateStr = ts ? new Date(ts).toLocaleString('es-ES', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                }) : '—';
                const icon = channelIcons[comm.channel] || '💬';
                const label = typeLabels[comm.type] || comm.type || 'Mensaje';
                const statusBadge = comm.status === 'sent' ? 'badge-success' : 'badge-warning';

                return `
          <div style="padding:1rem;background:var(--bg-glass);border-radius:var(--radius-md);margin-bottom:0.75rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <span>${icon}</span>
                <strong style="font-size:0.9rem;">${label}</strong>
                <span class="badge ${statusBadge}">${comm.status}</span>
              </div>
              <span class="text-muted" style="font-size:0.75rem;">${dateStr}</span>
            </div>
            <div style="font-size:0.875rem;color:var(--text-muted);">${comm.content || ''}</div>
          </div>`;
            }).join('');
    },

    showNewMessageModal(prefilledContent = '') {
        if (!this.selectedClient) {
            App.showNotification('Selecciona un cliente', 'Primero selecciona un cliente de la lista', 'warning');
            return;
        }

        const org = window.AuthState?.organization || {};
        const hasWhatsApp = !!(org.twilio_sid && org.twilio_phone);
        const hasEmail    = !!(org.sendgrid_key && org.sender_email);
        const hasSMS      = !!(org.twilio_sid && org.twilio_phone);

        const integrationWarning = (!hasWhatsApp && !hasEmail) ? `
          <div style="padding:0.75rem;background:rgba(194,173,125,0.1);border:1px solid var(--brand-gold);
            border-radius:var(--radius-sm);margin-bottom:1rem;font-size:0.85rem;color:var(--brand-gold);">
            ⚠️ Sin integraciones configuradas — el mensaje se guardará como <strong>pendiente</strong>.
            <a href="#" onclick="App.closeModal();App.navigateTo('settings')" style="color:var(--brand-gold);text-decoration:underline;margin-left:0.5rem;">
              Configurar ahora →
            </a>
          </div>` : '';

        const pets = this.selectedClient.pets || this.selectedClient.patients || [];
        const petOptions = pets.map(p => `<option value="${p.name}">${p.name}</option>`).join('');

        const content = `
      <form id="newMessageForm" onsubmit="Communication.sendMessage(event)">
        ${integrationWarning}

        <div class="form-group">
          <label class="form-label">Canal</label>
          <select class="form-select" id="messageChannel" required>
            <option value="whatsapp" ${hasWhatsApp ? '' : 'disabled'}>📱 WhatsApp ${hasWhatsApp ? '' : '(no configurado)'}</option>
            <option value="sms"      ${hasSMS      ? '' : 'disabled'}>💬 SMS ${hasSMS ? '' : '(no configurado)'}</option>
            <option value="email"    ${hasEmail    ? '' : 'disabled'}>📧 Email ${hasEmail ? '' : '(no configurado)'}</option>
            <option value="manual" selected>📝 Registro manual</option>
          </select>
        </div>

        ${pets.length ? `
        <div class="form-group">
          <label class="form-label">Mascota <span style="color:var(--text-muted)">(opcional)</span></label>
          <select class="form-select" id="messagePet">
            <option value="">— General —</option>
            ${petOptions}
          </select>
        </div>` : ''}

        <div class="form-group">
          <label class="form-label">Mensaje</label>
          <textarea class="form-textarea" id="messageContent" rows="6" required
            placeholder="Escribe el mensaje...">${prefilledContent}</textarea>
        </div>

        <div style="display:flex;gap:1rem;margin-top:1.5rem;">
          <button type="submit" class="btn btn-primary" style="flex:1;">Enviar / Registrar</button>
          <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
        </div>
      </form>`;

        App.showModal(`Mensaje — ${this.selectedClient.name}`, content);
    },

    async sendMessage(event) {
        event.preventDefault();

        const channel = document.getElementById('messageChannel').value;
        const content = document.getElementById('messageContent').value.trim();
        const petName = document.getElementById('messagePet')?.value || '';

        const org = window.AuthState?.organization || {};
        const realChannels = ['whatsapp', 'sms', 'email'];
        const isReal = realChannels.includes(channel);
        const hasIntegration = isReal && (
            (channel === 'email' && org.sendgrid_key) ||
            ((channel === 'whatsapp' || channel === 'sms') && org.twilio_sid)
        );

        const message = {
            clientId:  this.selectedClient.id,
            channel:   channel === 'manual' ? 'manual' : channel,
            type:      'manual',
            content:   petName ? `[${petName}] ${content}` : content,
            status:    hasIntegration ? 'sent' : 'pending'
        };

        await App.addCommunication(message);
        App.closeModal();
        App.showNotification(
            hasIntegration ? 'Mensaje enviado' : 'Mensaje registrado',
            hasIntegration
                ? `Enviado a ${this.selectedClient.name} vía ${channel}`
                : 'Guardado como pendiente — configura la integración para enviar',
            hasIntegration ? 'success' : 'info'
        );
        this.loadStats();
        this.loadCommunicationHistory();
    },

    useTemplate(templateId) {
        const pet = (this.selectedClient?.pets || this.selectedClient?.patients || [])[0];
        const petName = pet?.name || '{mascota}';
        const clientName = this.selectedClient?.name?.split(' ')[0] || '{nombre}';

        const templates = {
            confirmation: `Hola ${clientName}, tu cita está confirmada. ¡Te esperamos!`,
            reminder:     `Hola ${clientName}, te recordamos tu cita mañana. Por favor confirma tu asistencia respondiendo este mensaje.`,
            followup:     `Hola ${clientName}, ¿cómo ha evolucionado ${petName}? Nos gustaría saber de su progreso después de la última consulta.`,
            results:      `Hola ${clientName}, los resultados de ${petName} están listos. Todo se ve bien. Puedes contactarnos para más detalles.`,
            instructions: `Hola ${clientName}, aquí están las instrucciones de cuidado post-consulta para ${petName}:\n\n[Agregar instrucciones específicas]`,
            vaccination:  `Hola ${clientName}, es momento de la próxima vacuna de ${petName}. Por favor agenda tu cita lo antes posible.`
        };

        this.showNewMessageModal(templates[templateId] || '');
    },

    _renderIntegrationStatus() {
        const org = window.AuthState?.organization || {};
        const container = document.getElementById('integrationStatus');
        if (!container) return;

        const integrations = [
            {
                icon: '📱', name: 'WhatsApp Business (Twilio)',
                active: !!(org.twilio_sid && org.twilio_auth_token && org.twilio_phone),
                detail: org.twilio_phone ? `Número: ${org.twilio_phone}` : 'Sin configurar'
            },
            {
                icon: '💬', name: 'SMS (Twilio)',
                active: !!(org.twilio_sid && org.twilio_phone),
                detail: org.twilio_sid ? 'Usa las mismas credenciales de WhatsApp' : 'Sin configurar'
            },
            {
                icon: '📧', name: 'Email (SendGrid / Twilio)',
                active: !!(org.sendgrid_key && org.sender_email),
                detail: org.sender_email ? `Remitente: ${org.sender_email}` : 'Sin configurar'
            },
            {
                icon: '📅', name: 'Google Calendar',
                active: false, soon: true,
                detail: 'Disponible en v2'
            }
        ];

        container.innerHTML = integrations.map(i => `
          <div style="padding:1rem;background:var(--bg-glass);border-radius:var(--radius-md);
            display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;align-items:center;gap:1rem;">
              <span style="font-size:2rem;">${i.icon}</span>
              <div>
                <strong>${i.name}</strong>
                <div class="text-muted" style="font-size:0.8rem;">${i.detail}</div>
              </div>
            </div>
            <span class="badge ${i.active ? 'badge-success' : i.soon ? '' : 'badge-warning'}"
              style="${i.soon ? 'background:var(--bg-glass);color:var(--text-muted);' : ''}">
              ${i.active ? 'Activo' : i.soon ? 'v2' : 'Pendiente'}
            </span>
          </div>`).join('');
    }
};
