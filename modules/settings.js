// Settings Module for VetConnect

const Settings = {
  render() {
    return `
      <div class="settings-container">
        <div class="mb-lg">
          <h2 class="card-title" style="font-size: 1.5rem; margin-bottom: 0.5rem;">Configuración</h2>
          <p style="color: var(--text-muted);">Gestiona tu cuenta, clínica y preferencias del sistema</p>
        </div>

        <!-- Profile Settings -->
        <div class="card mb-lg">
          <div class="card-header">
            <h3 class="card-title">👤 Perfil de Usuario</h3>
          </div>
          <div class="card-body">
            <div class="grid grid-2">
              <div class="form-group">
                <label class="form-label">Nombre Completo</label>
                <input type="text" class="form-input" value="Luis Maroto" id="settingsName">
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" value="lmarotomar@biovetai.org" id="settingsEmail">
              </div>
              <div class="form-group">
                <label class="form-label">Teléfono</label>
                <input type="tel" class="form-input" value="+1 234 567 8900" id="settingsPhone">
              </div>
              <div class="form-group">
                <label class="form-label">Rol</label>
                <input type="text" class="form-input" value="Administrador" disabled>
              </div>
            </div>
            <button class="btn btn-primary mt-md" onclick="Settings.saveProfile()">
              Guardar Cambios
            </button>
          </div>
        </div>

        <!-- Clinic Settings -->
        <div class="card mb-lg">
          <div class="card-header">
            <h3 class="card-title">🏥 Información de la Clínica</h3>
          </div>
          <div class="card-body">
            <div class="grid grid-2">
              <div class="form-group">
                <label class="form-label">Nombre de la Clínica</label>
                <input type="text" class="form-input" value="Clínica Veterinaria Demo" id="clinicName">
              </div>
              <div class="form-group">
                <label class="form-label">Sitio Web</label>
                <input type="url" class="form-input" placeholder="https://ejemplo.com" id="clinicWebsite">
              </div>
              <div class="form-group">
                <label class="form-label">Dirección</label>
                <input type="text" class="form-input" placeholder="Calle Principal 123" id="clinicAddress">
              </div>
              <div class="form-group">
                <label class="form-label">Teléfono de Contacto</label>
                <input type="tel" class="form-input" placeholder="+1 234 567 8900" id="clinicPhone">
              </div>
            </div>
            <button class="btn btn-primary mt-md" onclick="Settings.saveClinic()">
              Guardar Información
            </button>
          </div>
        </div>

        <!-- Subscription & Billing -->
        <div class="card mb-lg">
          <div class="card-header">
            <h3 class="card-title">💎 Suscripción y Facturación</h3>
          </div>
          <div class="card-body">
            <div style="background: var(--bg-glass); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div>
                  <div style="font-size: 1.25rem; font-weight: 700; color: var(--brand-gold);">Plan Premium</div>
                  <div style="color: var(--text-muted); font-size: 0.875rem;">Acceso completo a todas las funcionalidades</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 2rem; font-weight: 700; color: var(--text-primary);">$79</div>
                  <div style="color: var(--text-muted); font-size: 0.875rem;">USD/mes</div>
                </div>
              </div>
              <div style="padding: 0.75rem; background: rgba(37, 75, 65, 0.2); border-radius: var(--radius-sm); margin-bottom: 1rem;">
                <div style="font-size: 0.875rem;">
                  <strong>Próximo pago:</strong> 7 de enero de 2026
                </div>
              </div>
              <div style="display: flex; gap: 1rem;">
                <a href="pricing.html" class="btn btn-secondary">Ver Planes</a>
                <button class="btn btn-secondary" onclick="Settings.manageBilling()">Gestionar Facturación</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notification Preferences -->
        <div class="card mb-lg">
          <div class="card-header">
            <h3 class="card-title">🔔 Preferencias de Notificaciones</h3>
          </div>
          <div class="card-body">
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <label style="display: flex; align-items: center; gap: 1rem; cursor: pointer; padding: 0.75rem; background: var(--bg-glass); border-radius: var(--radius-sm);">
                <input type="checkbox" checked id="notifEmail">
                <div>
                  <div style="font-weight: 600;">Notificaciones por Email</div>
                  <div style="font-size: 0.875rem; color: var(--text-muted);">Recibir actualizaciones importantes por correo</div>
                </div>
              </label>
              <label style="display: flex; align-items: center; gap: 1rem; cursor: pointer; padding: 0.75rem; background: var(--bg-glass); border-radius: var(--radius-sm);">
                <input type="checkbox" checked id="notifWhatsApp">
                <div>
                  <div style="font-weight: 600;">Notificaciones por WhatsApp</div>
                  <div style="font-size: 0.875rem; color: var(--text-muted);">Alertas de citas y recordatorios</div>
                </div>
              </label>
              <label style="display: flex; align-items: center; gap: 1rem; cursor: pointer; padding: 0.75rem; background: var(--bg-glass); border-radius: var(--radius-sm);">
                <input type="checkbox" checked id="notifAppointment">
                <div>
                  <div style="font-weight: 600;">Recordatorios de Citas</div>
                  <div style="font-size: 0.875rem; color: var(--text-muted);">24h y 2h antes de cada cita</div>
                </div>
              </label>
            </div>
            <button class="btn btn-primary mt-md" onclick="Settings.saveNotifications()">
              Guardar Preferencias
            </button>
          </div>
        </div>

        <!-- Integrations -->
        <div class="card mb-lg">
          <div class="card-header">
            <h3 class="card-title">🔌 Integraciones</h3>
          </div>
          <div class="card-body">
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${this.renderIntegrationCard('WhatsApp Business', '✅ Conectado', 'success')}
              ${this.renderIntegrationCard('HubSpot CRM', '✅ Conectado', 'success')}
              ${this.renderIntegrationCard('Google Calendar', '⚠️ No configurado', 'warning')}
              ${this.renderIntegrationCard('SendGrid Email', '✅ Conectado', 'success')}
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="card" style="border-color: var(--accent-coral);">
          <div class="card-header">
            <h3 class="card-title" style="color: var(--accent-coral);">⚠️ Zona de Peligro</h3>
          </div>
          <div class="card-body">
            <p style="color: var(--text-muted); margin-bottom: 1rem;">
              Estas acciones son permanentes y no se pueden deshacer.
            </p>
            <div style="display: flex; gap: 1rem;">
              <button class="btn" style="background: rgba(255, 107, 107, 0.2); color: var(--accent-coral);" onclick="Settings.exportData()">
                📦 Exportar Todos los Datos
              </button>
              <button class="btn" style="background: rgba(255, 107, 107, 0.3); color: white;" onclick="Settings.deleteAccount()">
                🗑️ Eliminar Cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderIntegrationCard(name, status, type) {
    const statusColors = {
      success: 'var(--brand-green)',
      warning: 'var(--brand-gold)',
      danger: 'var(--accent-coral)'
    };

    const integrationId = name.toLowerCase().replace(/\s+/g, '-');

    return `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-sm);">
        <div>
          <div style="font-weight: 600;">${name}</div>
          <div style="font-size: 0.875rem; color: ${statusColors[type]};">${status}</div>
        </div>
        <button class="btn btn-secondary" style="padding: 0.5rem 1rem;" onclick="Settings.configureIntegration('${integrationId}', '${name}')">
          Configurar
        </button>
      </div>
    `;
  },

  configureIntegration(id, name) {
    const integrationConfigs = {
      'whatsapp-business': {
        title: '📱 WhatsApp Business API',
        content: `
          <div class="form-group">
            <label class="form-label">Número de Teléfono</label>
            <input type="tel" class="form-input" value="+1 234 567 8900" placeholder="+1 234 567 8900">
            <small style="color: var(--text-muted); font-size: 0.75rem;">Número verificado en WhatsApp Business</small>
          </div>
          <div class="form-group">
            <label class="form-label">API Key (Twilio)</label>
            <input type="password" class="form-input" value="sk_live_••••••••••••••••" placeholder="sk_live_...">
          </div>
          <div class="form-group">
            <label class="form-label">Account SID</label>
            <input type="text" class="form-input" value="AC••••••••••••••••••••••••••••••" placeholder="ACxxxxx...">
          </div>
          <div class="form-group">
            <label class="form-label">Auth Token</label>
            <input type="password" class="form-input" value="••••••••••••••••••••••••••••••" placeholder="Auth Token">
          </div>
          <div style="padding: 1rem; background: rgba(46, 90, 79, 0.2); border-radius: var(--radius-sm); margin-top: 1rem;">
            <div style="font-size: 0.875rem;">
              <strong>Estado de Conexión:</strong> <span style="color: var(--brand-green);">✅ Conectado</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">
              Última sincronización: hace 5 minutos
            </div>
          </div>
        `
      },
      'hubspot-crm': {
        title: '🔄 HubSpot CRM',
        content: `
          <div class="form-group">
            <label class="form-label">API Key</label>
            <input type="password" class="form-input" value="pat-na1-••••••••••••••••" placeholder="pat-na1-...">
          </div>
          <div class="form-group">
            <label class="form-label">Portal ID</label>
            <input type="text" class="form-input" value="12345678" placeholder="12345678">
          </div>
          <div class="form-group">
            <label class="form-label">Webhook URL</label>
            <input type="url" class="form-input" value="https://vetconnect.app/webhooks/hubspot" readonly>
            <small style="color: var(--text-muted); font-size: 0.75rem;">Configura este URL en HubSpot Webhooks</small>
          </div>
          <div style="margin-top: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" checked>
              <span style="font-size: 0.875rem;">Sincronización bidireccional automática</span>
            </label>
          </div>
          <div style="padding: 1rem; background: rgba(46, 90, 79, 0.2); border-radius: var(--radius-sm); margin-top: 1rem;">
            <div style="font-size: 0.875rem;">
              <strong>Estado de Conexión:</strong> <span style="color: var(--brand-green);">✅ Activo</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">
              347 contactos sincronizados
            </div>
          </div>
        `
      },
      'google-calendar': {
        title: '📅 Google Calendar',
        content: `
          <div style="padding: 1rem; background: rgba(194, 173, 125, 0.1); border: 1px solid var(--brand-gold); border-radius: var(--radius-sm); margin-bottom: 1rem;">
            <div style="font-size: 0.875rem; color: var(--brand-gold);">
              ⚠️ Configuración requerida
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">
              Conecta tu cuenta de Google para sincronizar citas automáticamente
            </div>
          </div>
          <button class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">
            🔐 Conectar con Google
          </button>
          <div class="form-group">
            <label class="form-label">Calendar ID</label>
            <input type="text" class="form-input" placeholder="primary" value="primary">
            <small style="color: var(--text-muted); font-size: 0.75rem;">El ID del calendario a sincronizar</small>
          </div>
          <div style="margin-top: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" checked>
              <span style="font-size: 0.875rem;">Enviar invitaciones automáticas</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin-top: 0.5rem;">
              <input type="checkbox" checked>
              <span style="font-size: 0.875rem;">Sincronización bidireccional</span>
            </label>
          </div>
        `
      },
      'sendgrid-email': {
        title: '✉️ SendGrid Email',
        content: `
          <div class="form-group">
            <label class="form-label">API Key</label>
            <input type="password" class="form-input" value="SG.••••••••••••••••••••••••••••" placeholder="SG.xxxxx...">
          </div>
          <div class="form-group">
            <label class="form-label">Email de Remitente</label>
            <input type="email" class="form-input" value="lmarotomar@biovetai.org" placeholder="noreply@tudominio.com">
          </div>
          <div class="form-group">
            <label class="form-label">Nombre de Remitente</label>
            <input type="text" class="form-input" value="VetConnect" placeholder="Tu Clínica">
          </div>
          <div class="form-group">
            <label class="form-label">Template ID (Recordatorios)</label>
            <input type="text" class="form-input" value="d-1234567890abcdef" placeholder="d-...">
          </div>
          <div style="padding: 1rem; background: rgba(46, 90, 79, 0.2); border-radius: var(--radius-sm); margin-top: 1rem;">
            <div style="font-size: 0.875rem;">
              <strong>Estado de Conexión:</strong> <span style="color: var(--brand-green);">✅ Verificado</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">
              1,243 emails enviados este mes
            </div>
          </div>
        `
      }
    };

    const config = integrationConfigs[id];
    if (config && typeof App !== 'undefined') {
      App.showModal(config.title, config.content + `
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-glass);">
          <button class="btn btn-primary" onclick="Settings.saveIntegration('${id}')">Guardar Configuración</button>
          <button class="btn btn-secondary" onclick="Settings.testIntegration('${id}')">Probar Conexión</button>
        </div>
      `);
    }
  },

  saveIntegration(id) {
    if (typeof App !== 'undefined') {
      App.showNotification('Configuración Guardada', `La integración ha sido actualizada correctamente`, 'success');
      App.closeModal();
    }
  },

  testIntegration(id) {
    if (typeof App !== 'undefined') {
      App.showNotification('Probando Conexión', 'Verificando credenciales...', 'info');
      setTimeout(() => {
        App.showNotification('Conexión Exitosa', 'La integración está funcionando correctamente', 'success');
      }, 2000);
    }
  },

  saveProfile() {
    if (typeof App !== 'undefined') {
      App.showNotification('Perfil Actualizado', 'Tus cambios han sido guardados correctamente', 'success');
    }
  },

  saveClinic() {
    if (typeof App !== 'undefined') {
      App.showNotification('Información Guardada', 'Los datos de la clínica han sido actualizados', 'success');
    }
  },

  saveNotifications() {
    if (typeof App !== 'undefined') {
      App.showNotification('Preferencias Guardadas', 'Tus preferencias de notificación han sido actualizadas', 'success');
    }
  },

  manageBilling() {
    if (typeof App !== 'undefined') {
      App.showModal('Gestionar Facturación', `
        <p>Portal de facturación (integración con Stripe)</p>
        <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 1rem;">
          En producción, esto abriría el portal de facturación de Stripe donde puedes:
        </p>
        <ul style="color: var(--text-muted); font-size: 0.875rem; margin-top: 0.5rem;">
          <li>Actualizar métodos de pago</li>
          <li>Ver historial de facturas</li>
          <li>Descargar recibos</li>
          <li>Cancelar suscripción</li>
        </ul>
      `);
    }
  },

  exportData() {
    if (confirm('¿Estás seguro de que deseas exportar todos tus datos? Se creará un archivo descargable.')) {
      if (typeof App !== 'undefined') {
        App.showNotification('Exportación Iniciada', 'Preparando tus datos para descarga...', 'info');
        // En producción, esto iniciaría la exportación
      }
    }
  },

  deleteAccount() {
    if (confirm('⚠️ ADVERTENCIA: Esta acción es PERMANENTE y eliminará todos tus datos.\n\n¿Estás absolutamente seguro?')) {
      if (confirm('Escribe DELETE para confirmar')) {
        if (typeof App !== 'undefined') {
          App.showNotification('Procesando', 'Tu solicitud de eliminación ha sido recibida', 'info');
          // En producción, esto iniciaría el proceso de eliminación
        }
      }
    }
  }
};

// Auto-register module
if (typeof window !== 'undefined') {
  window.Settings = Settings;
}
