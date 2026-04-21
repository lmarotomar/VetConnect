// Settings Module — VetConnect
const Settings = {

    render() {
        return `
      <div class="settings-container">
        <div class="mb-lg">
          <h2 class="card-title" style="font-size:1.5rem;margin-bottom:0.5rem;">Configuración</h2>
          <p style="color:var(--text-muted);">Gestiona tu cuenta, clínica e integraciones</p>
        </div>

        <!-- Perfil de Usuario -->
        <div class="card mb-lg">
          <div class="card-header">
            <h3 class="card-title">👤 Perfil de Usuario</h3>
          </div>
          <div class="card-body">
            <div class="grid grid-2">
              <div class="form-group">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-input" id="settingsFirstName" placeholder="Nombre">
              </div>
              <div class="form-group">
                <label class="form-label">Apellido</label>
                <input type="text" class="form-input" id="settingsLastName" placeholder="Apellido">
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" id="settingsEmail" disabled
                  style="opacity:0.6;" title="El email no se puede cambiar aquí">
              </div>
              <div class="form-group">
                <label class="form-label">Rol</label>
                <input type="text" class="form-input" id="settingsRole" disabled style="opacity:0.6;">
              </div>
            </div>
            <button class="btn btn-primary mt-md" onclick="Settings.saveProfile()">
              💾 Guardar Perfil
            </button>
          </div>
        </div>

        <!-- Información de la Clínica -->
        <div class="card mb-lg">
          <div class="card-header">
            <h3 class="card-title">🏥 Información de la Clínica</h3>
          </div>
          <div class="card-body">
            <div class="grid grid-2">
              <div class="form-group">
                <label class="form-label">Nombre de la Clínica</label>
                <input type="text" class="form-input" id="clinicName" placeholder="Mi Clínica Veterinaria">
              </div>
              <div class="form-group">
                <label class="form-label">Teléfono</label>
                <input type="tel" class="form-input" id="clinicPhone" placeholder="+1 555 000 0000">
              </div>
              <div class="form-group">
                <label class="form-label">Dirección</label>
                <input type="text" class="form-input" id="clinicAddress" placeholder="Calle Principal 123">
              </div>
              <div class="form-group">
                <label class="form-label">Sitio Web</label>
                <input type="url" class="form-input" id="clinicWebsite" placeholder="https://miclínica.com">
              </div>
            </div>
            <button class="btn btn-primary mt-md" onclick="Settings.saveClinic()">
              💾 Guardar Clínica
            </button>
          </div>
        </div>

        <!-- Integraciones -->
        <div class="card mb-lg">
          <div class="card-header">
            <h3 class="card-title">🔌 Integraciones</h3>
          </div>
          <div class="card-body" id="integrationsBody">
            <p class="text-muted">Cargando...</p>
          </div>
        </div>

        <!-- Suscripción -->
        <div class="card mb-lg">
          <div class="card-header">
            <h3 class="card-title">💎 Suscripción</h3>
          </div>
          <div class="card-body">
            <div style="background:var(--bg-glass);padding:1.5rem;border-radius:var(--radius-md);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
                <div>
                  <div style="font-size:1.1rem;font-weight:700;color:var(--brand-gold);">Plan Activo</div>
                  <div style="color:var(--text-muted);font-size:0.875rem;">Período de prueba — acceso completo</div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:1.5rem;font-weight:700;">Beta</div>
                </div>
              </div>
              <div style="display:flex;gap:1rem;">
                <a href="pricing.html" class="btn btn-secondary">Ver Planes</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Zona de Peligro -->
        <div class="card" style="border-color:var(--accent-coral);">
          <div class="card-header">
            <h3 class="card-title" style="color:var(--accent-coral);">⚠️ Zona de Peligro</h3>
          </div>
          <div class="card-body">
            <p style="color:var(--text-muted);margin-bottom:1rem;">
              Estas acciones son permanentes e irreversibles.
            </p>
            <div style="display:flex;gap:1rem;">
              <button class="btn" style="background:rgba(255,107,107,0.2);color:var(--accent-coral);"
                onclick="Settings.exportData()">
                📦 Exportar Datos
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    },

    async init() {
        this._loadProfile();
        await this._loadClinic();
        this._renderIntegrations();
    },

    // ─── PERFIL ──────────────────────────────────────────────────────────────

    _loadProfile() {
        const profile = window.AuthState?.profile;
        const name    = profile?.name || '';
        const parts   = name.split(' ');
        const roleLabels = {
            super_admin: 'Super Administrador', clinic_admin: 'Administrador',
            veterinarian: 'Veterinario', technician: 'Técnico',
            receptionist: 'Recepcionista', viewer: 'Solo Lectura'
        };

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
        set('settingsFirstName', parts[0] || '');
        set('settingsLastName',  parts.slice(1).join(' ') || '');
        set('settingsEmail',     profile?.email || '');
        set('settingsRole',      roleLabels[profile?.role] || profile?.role || '');
    },

    async saveProfile() {
        const firstName = document.getElementById('settingsFirstName').value.trim();
        const lastName  = document.getElementById('settingsLastName').value.trim();
        if (!firstName) { App.showNotification('Error', 'El nombre es obligatorio', 'error'); return; }

        try {
            const userId = window.AuthState?.user?.id;
            if (userId && typeof supabase !== 'undefined') {
                await supabase
                    .from('user_profiles')
                    .update({ first_name: firstName, last_name: lastName, updated_at: new Date().toISOString() })
                    .eq('user_id', userId);
            }
            // Update local AuthState
            if (window.AuthState?.profile) {
                window.AuthState.profile.name = [firstName, lastName].filter(Boolean).join(' ');
            }
            // Update header display
            if (typeof updateUserDisplay === 'function') {
                updateUserDisplay(window.AuthState.profile, window.AuthState.organization);
            }
            App.showNotification('Perfil actualizado', 'Tus datos han sido guardados', 'success');
        } catch (err) {
            App.showNotification('Error', 'No se pudo guardar el perfil', 'error');
            console.error('saveProfile:', err);
        }
    },

    // ─── CLÍNICA ─────────────────────────────────────────────────────────────

    async _loadClinic() {
        const org = window.AuthState?.organization;
        if (!org) return;

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
        set('clinicName',    org.name);
        set('clinicPhone',   org.phone);
        set('clinicAddress', org.address);
        set('clinicWebsite', org.website);
    },

    async saveClinic() {
        const updates = {
            name:    document.getElementById('clinicName').value.trim(),
            phone:   document.getElementById('clinicPhone').value.trim() || null,
            address: document.getElementById('clinicAddress').value.trim() || null,
            website: document.getElementById('clinicWebsite').value.trim() || null
        };

        if (!updates.name) { App.showNotification('Error', 'El nombre de la clínica es obligatorio', 'error'); return; }

        try {
            const saved = await DB.updateOrganization(updates);
            if (window.AuthState) window.AuthState.organization = { ...window.AuthState.organization, ...saved };
            // Update sidebar clinic name
            const clinicEl = document.getElementById('clinicNameDisplay');
            if (clinicEl) clinicEl.textContent = updates.name;
            App.showNotification('Clínica actualizada', 'Los datos han sido guardados', 'success');
        } catch (err) {
            App.showNotification('Error', 'No se pudo guardar la información', 'error');
            console.error('saveClinic:', err);
        }
    },

    // ─── INTEGRACIONES ────────────────────────────────────────────────────────

    _renderIntegrations() {
        const org = window.AuthState?.organization || {};
        const integrations = [
            {
                id:    'whatsapp',
                name:  'WhatsApp Business (Twilio)',
                icon:  '📱',
                active: !!(org.twilio_sid && org.twilio_auth_token && org.twilio_phone)
            },
            {
                id:    'email',
                name:  'SendGrid Email',
                icon:  '📧',
                active: !!(org.sendgrid_key && org.sender_email)
            },
            {
                id:    'calendar',
                name:  'Google Calendar',
                icon:  '📅',
                active: false,
                soon:  true
            }
        ];

        const body = document.getElementById('integrationsBody');
        if (!body) return;

        body.innerHTML = `<div style="display:flex;flex-direction:column;gap:1rem;">
          ${integrations.map(i => `
            <div style="display:flex;justify-content:space-between;align-items:center;
              padding:1rem;background:var(--bg-glass);border-radius:var(--radius-sm);">
              <div>
                <div style="font-weight:600;">${i.icon} ${i.name}</div>
                <div style="font-size:0.875rem;color:${i.active ? 'var(--brand-green)' : 'var(--text-muted)'};">
                  ${i.active ? '✅ Conectado' : i.soon ? '🔜 Próximamente' : '⚪ No configurado'}
                </div>
              </div>
              ${i.soon
                ? `<span class="badge" style="background:var(--bg-glass);color:var(--text-muted);">v2</span>`
                : `<button class="btn btn-secondary" onclick="Settings.configureIntegration('${i.id}')">
                    ${i.active ? 'Editar' : 'Configurar'}
                   </button>`
              }
            </div>`).join('')}
        </div>`;
    },

    configureIntegration(id) {
        const org = window.AuthState?.organization || {};
        let title, content;

        if (id === 'whatsapp') {
            title = '📱 WhatsApp Business (Twilio)';
            content = `
          <p class="text-muted" style="font-size:0.875rem;margin-bottom:1.5rem;">
            Necesitas una cuenta Twilio con WhatsApp Business habilitado.
          </p>
          <div class="form-group">
            <label class="form-label">Account SID</label>
            <input type="text" class="form-input" id="int_twilio_sid"
              value="${org.twilio_sid || ''}" placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx">
          </div>
          <div class="form-group">
            <label class="form-label">Auth Token</label>
            <input type="password" class="form-input" id="int_twilio_token"
              value="${org.twilio_auth_token ? '••••••••••••••••' : ''}" placeholder="Tu Auth Token de Twilio">
          </div>
          <div class="form-group">
            <label class="form-label">Número WhatsApp (formato E.164)</label>
            <input type="tel" class="form-input" id="int_twilio_phone"
              value="${org.twilio_phone || ''}" placeholder="+15550000000">
          </div>
          <div style="display:flex;gap:1rem;margin-top:1.5rem;">
            <button class="btn btn-primary" style="flex:1;" onclick="Settings.saveIntegration('whatsapp')">
              💾 Guardar
            </button>
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
          </div>`;
        }

        if (id === 'email') {
            title = '📧 SendGrid Email';
            content = `
          <p class="text-muted" style="font-size:0.875rem;margin-bottom:1.5rem;">
            Necesitas una API Key de SendGrid con permisos de envío.
          </p>
          <div class="form-group">
            <label class="form-label">API Key</label>
            <input type="password" class="form-input" id="int_sg_key"
              value="${org.sendgrid_key ? '••••••••••••••••' : ''}" placeholder="SG.xxxxxxx...">
          </div>
          <div class="form-group">
            <label class="form-label">Email Remitente</label>
            <input type="email" class="form-input" id="int_sg_email"
              value="${org.sender_email || ''}" placeholder="noreply@tuclínica.com">
          </div>
          <div class="form-group">
            <label class="form-label">Nombre Remitente</label>
            <input type="text" class="form-input" id="int_sg_name"
              value="${org.sender_name || org.name || ''}" placeholder="Mi Clínica Veterinaria">
          </div>
          <div style="display:flex;gap:1rem;margin-top:1.5rem;">
            <button class="btn btn-primary" style="flex:1;" onclick="Settings.saveIntegration('email')">
              💾 Guardar
            </button>
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
          </div>`;
        }

        App.showModal(title, content);
    },

    async saveIntegration(id) {
        let updates = {};

        if (id === 'whatsapp') {
            const sid   = document.getElementById('int_twilio_sid').value.trim();
            const token = document.getElementById('int_twilio_token').value.trim();
            const phone = document.getElementById('int_twilio_phone').value.trim();
            if (!sid || !phone) { App.showNotification('Error', 'SID y teléfono son obligatorios', 'error'); return; }
            updates = { twilio_sid: sid, twilio_phone: phone };
            // Only update token if it was changed (not placeholder)
            if (token && !token.startsWith('•')) updates.twilio_auth_token = token;
        }

        if (id === 'email') {
            const key   = document.getElementById('int_sg_key').value.trim();
            const email = document.getElementById('int_sg_email').value.trim();
            const name  = document.getElementById('int_sg_name').value.trim();
            if (!email) { App.showNotification('Error', 'El email remitente es obligatorio', 'error'); return; }
            updates = { sender_email: email, sender_name: name || null };
            if (key && !key.startsWith('•')) updates.sendgrid_key = key;
        }

        try {
            const saved = await DB.updateOrganization(updates);
            if (window.AuthState) window.AuthState.organization = { ...window.AuthState.organization, ...saved };
            App.closeModal();
            App.showNotification('Integración guardada', 'La configuración ha sido actualizada', 'success');
            this._renderIntegrations();
        } catch (err) {
            App.showNotification('Error', 'No se pudo guardar la integración', 'error');
            console.error('saveIntegration:', err);
        }
    },

    exportData() {
        if (!confirm('¿Exportar todos los datos de tu organización?')) return;

        const data = {
            exported_at: new Date().toISOString(),
            organization: window.AuthState?.organization?.name,
            clients: App.data?.clients?.length || 0,
            appointments: App.data?.appointments?.length || 0,
            clinical_records: App.data?.clinicalRecords?.length || 0
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url  = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `VetConnect_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        App.showNotification('Datos exportados', 'El archivo ha sido descargado', 'success');
    }
};

if (typeof window !== 'undefined') {
    window.Settings = Settings;
}
