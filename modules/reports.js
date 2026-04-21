// Reports Module
const Reports = {
  selectedPeriod: 'week',

  render() {
    return `
      <!-- Period Selection -->
      <div class="card mb-lg">
        <div class="card-body">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn btn-secondary" onclick="Reports.setPeriod('today')">Hoy</button>
              <button class="btn btn-secondary" onclick="Reports.setPeriod('week')">Esta Semana</button>
              <button class="btn btn-secondary" onclick="Reports.setPeriod('month')">Este Mes</button>
              <button class="btn btn-secondary" onclick="Reports.setPeriod('year')">Este Año</button>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-primary" onclick="Reports.exportToSheets()">
                📊 Exportar a Google Sheets
              </button>
              <button class="btn btn-secondary" onclick="Reports.downloadPDF()">
                📄 Descargar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Key Metrics -->
      <div class="stats-grid mb-lg" id="reportsMetrics">
        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">Total Citas</div>
              <div class="stat-value" id="rpt-appointments">—</div>
              <span class="stat-change" style="color: var(--text-muted); font-size: 0.75rem;">datos reales</span>
            </div>
            <div class="stat-icon">📅</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">Total Clientes</div>
              <div class="stat-value" id="rpt-clients">—</div>
              <span class="stat-change" style="color: var(--text-muted); font-size: 0.75rem;">datos reales</span>
            </div>
            <div class="stat-icon">👥</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">Citas Completadas</div>
              <div class="stat-value" id="rpt-completed">—</div>
              <span class="stat-change" style="color: var(--text-muted); font-size: 0.75rem;">datos reales</span>
            </div>
            <div class="stat-icon">✅</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">Citas Pendientes</div>
              <div class="stat-value" id="rpt-pending">—</div>
              <span class="stat-change" style="color: var(--text-muted); font-size: 0.75rem;">datos reales</span>
            </div>
            <div class="stat-icon">⏳</div>
          </div>
        </div>
      </div>
      
      <!-- Charts and Analytics -->
      <div class="grid grid-2">
        <!-- Appointments by Type -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Citas por Tipo</h3>
          </div>
          <div class="card-body">
            <div id="appointmentsByType"></div>
          </div>
        </div>
        
        <!-- Communication Metrics -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Métricas de Comunicación</h3>
          </div>
          <div class="card-body">
            <div id="communicationMetrics"></div>
          </div>
        </div>
        
        <!-- Top Services -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Servicios Más Solicitados</h3>
          </div>
          <div class="card-body">
            <div id="topServices"></div>
          </div>
        </div>
        
        <!-- Performance Trends -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Tendencias de Rendimiento</h3>
          </div>
          <div class="card-body">
            <div id="performanceTrends"></div>
          </div>
        </div>
      </div>
      
      <!-- Automation Performance -->
      <div class="card mt-lg">
        <div class="card-header">
          <h3 class="card-title">🤖 Rendimiento de Automatizaciones</h3>
        </div>
        <div class="card-body">
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Automatización</th>
                  <th>Mensajes Enviados</th>
                  <th>Tasa de Entrega</th>
                  <th>Tasa de Apertura</th>
                  <th>Respuestas</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div style="display: flex; align-items: center; gap: 0.5rem;"><span>✅</span><strong>Confirmación de Citas</strong></div></td>
                  <td>—</td>
                  <td><span class="badge" style="background:var(--bg-glass);color:var(--text-muted);">pendiente</span></td>
                  <td><span class="badge" style="background:var(--bg-glass);color:var(--text-muted);">pendiente</span></td>
                  <td>—</td>
                </tr>
                <tr>
                  <td><div style="display: flex; align-items: center; gap: 0.5rem;"><span>⏰</span><strong>Recordatorios 24h</strong></div></td>
                  <td>—</td>
                  <td><span class="badge" style="background:var(--bg-glass);color:var(--text-muted);">pendiente</span></td>
                  <td><span class="badge" style="background:var(--bg-glass);color:var(--text-muted);">pendiente</span></td>
                  <td>—</td>
                </tr>
                <tr>
                  <td><div style="display: flex; align-items: center; gap: 0.5rem;"><span>🔔</span><strong>Recordatorios 2h</strong></div></td>
                  <td>—</td>
                  <td><span class="badge" style="background:var(--bg-glass);color:var(--text-muted);">pendiente</span></td>
                  <td><span class="badge" style="background:var(--bg-glass);color:var(--text-muted);">pendiente</span></td>
                  <td>—</td>
                </tr>
                <tr>
                  <td><div style="display: flex; align-items: center; gap: 0.5rem;"><span>📋</span><strong>Instrucciones Post-Consulta</strong></div></td>
                  <td>—</td>
                  <td><span class="badge" style="background:var(--bg-glass);color:var(--text-muted);">pendiente</span></td>
                  <td><span class="badge" style="background:var(--bg-glass);color:var(--text-muted);">pendiente</span></td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Export Options -->
      <div class="card mt-lg">
        <div class="card-header">
          <h3 class="card-title">📤 Opciones de Exportación</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-3">
            <div style="padding: 1.5rem; background: var(--bg-glass); border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">📊</div>
              <strong>Google Sheets</strong>
              <p class="text-muted" style="font-size: 0.875rem; margin: 0.5rem 0;">
                Sincronización automática de datos
              </p>
              <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="Reports.exportToSheets()">
                Exportar
              </button>
            </div>
            
            <div style="padding: 1.5rem; background: var(--bg-glass); border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">📑</div>
              <strong>Reporte PDF</strong>
              <p class="text-muted" style="font-size: 0.875rem; margin: 0.5rem 0;">
                Reporte completo en formato PDF
              </p>
              <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="Reports.downloadPDF()">
                Descargar
              </button>
            </div>
            
            <div style="padding: 1.5rem; background: var(--bg-glass); border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">📧</div>
              <strong>Email Automático</strong>
              <p class="text-muted" style="font-size: 0.875rem; margin: 0.5rem 0;">
                Envío automático semanal/mensual
              </p>
              <button class="btn btn-secondary" style="width: 100%; margin-top: 1rem;" onclick="Reports.setupAutoEmail()">
                Configurar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    this.loadRealMetrics();
    this.loadCharts();
  },

  loadRealMetrics() {
    if (typeof App === 'undefined' || !App.data) return;

    const appointments = this._filterByPeriod(App.data.appointments || []);
    const clients      = App.data.clients || [];
    const completed    = appointments.filter(a => a.status === 'completed').length;
    const pending      = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('rpt-appointments', appointments.length);
    set('rpt-clients',      clients.length);
    set('rpt-completed',    completed);
    set('rpt-pending',      pending);
  },

  setPeriod(period) {
    this.selectedPeriod = period;
    this.loadRealMetrics();
    this.loadCharts();
  },

  // Returns appointments filtered to the selected period
  _filterByPeriod(appointments) {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    return appointments.filter(a => {
      const d = a.appointment_date || a.date;
      if (!d) return false;
      if (this.selectedPeriod === 'today') return d === today;
      if (this.selectedPeriod === 'week') {
        const start = new Date(now); start.setDate(now.getDate() - 6); start.setHours(0,0,0,0);
        return new Date(d) >= start;
      }
      if (this.selectedPeriod === 'month') {
        return d.startsWith(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`);
      }
      if (this.selectedPeriod === 'year') {
        return d.startsWith(`${now.getFullYear()}`);
      }
      return true;
    });
  },

  loadCharts() {
    const allAppointments = App.data?.appointments || [];
    const appointments    = this._filterByPeriod(allAppointments);
    const communications  = App.data?.communications || [];
    const total           = appointments.length;

    const periodLabel = { today: 'hoy', week: 'esta semana', month: 'este mes', year: 'este año' }[this.selectedPeriod] || '';

    // ── Citas por Tipo ────────────────────────────────────────────
    const typeCounts = {};
    appointments.forEach(a => {
      const t = a.type || a.appointment_type || 'Sin tipo';
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });
    const typeColors = ['#667eea','#4facfe','#00d4aa','#f5576c','#ff6b6b','#f6d365','#a18cd1'];
    const sortedTypes = Object.entries(typeCounts).sort((a,b) => b[1]-a[1]);
    const maxCount = sortedTypes[0]?.[1] || 1;

    const appointmentsByType = document.getElementById('appointmentsByType');
    appointmentsByType.innerHTML = sortedTypes.length
      ? `<div style="display:flex;flex-direction:column;gap:1rem;">
          ${sortedTypes.map(([t, n], i) => this.renderBarChart(t, n, maxCount, typeColors[i % typeColors.length])).join('')}
         </div>`
      : `<p class="text-muted text-center" style="padding:2rem;">Sin citas ${periodLabel}</p>`;

    // ── Métricas de Comunicación ──────────────────────────────────
    const channelCounts = {};
    communications.forEach(c => {
      const ch = c.channel || 'otro';
      channelCounts[ch] = (channelCounts[ch] || 0) + 1;
    });
    const channelIcons = { whatsapp: '📱', email: '📧', sms: '💬' };
    const commRows = Object.entries(channelCounts).sort((a,b) => b[1]-a[1]);

    const communicationMetrics = document.getElementById('communicationMetrics');
    communicationMetrics.innerHTML = commRows.length
      ? `<div style="display:flex;flex-direction:column;gap:1rem;">
          ${commRows.map(([ch, n]) => `
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div>
                <div class="text-muted" style="font-size:0.875rem;">${channelIcons[ch] || '💬'} ${ch}</div>
                <div style="font-size:1.5rem;font-weight:700;">${n}</div>
              </div>
              <span class="badge" style="background:var(--bg-glass);color:var(--text-muted);">registros</span>
            </div>`).join('')}
          <p class="text-muted" style="font-size:0.75rem;margin-top:0.5rem;">
            Tasas de apertura/entrega disponibles cuando las integraciones estén activas.
          </p>
         </div>`
      : `<p class="text-muted text-center" style="padding:2rem;">Sin comunicaciones registradas</p>`;

    // ── Servicios Más Solicitados (misma base que tipos de cita) ──
    const topServices = document.getElementById('topServices');
    topServices.innerHTML = sortedTypes.length
      ? `<div style="display:flex;flex-direction:column;gap:0.75rem;">
          ${sortedTypes.map(([t, n]) => {
            const pct = total > 0 ? Math.round((n/total)*100) : 0;
            return this.renderServiceItem(t, `${n} citas (${pct}%)`);
          }).join('')}
         </div>`
      : `<p class="text-muted text-center" style="padding:2rem;">Sin datos ${periodLabel}</p>`;

    // ── Tendencias de Rendimiento ─────────────────────────────────
    const completed  = appointments.filter(a => a.status === 'completed').length;
    const cancelled  = appointments.filter(a => a.status === 'cancelled').length;
    const attendance = total > 0 ? Math.round((completed / total) * 100) : null;

    const clients    = App.data?.clients || [];
    const clientsWithMultiple = clients.filter(c => {
      const pets = c.pets || c.patients || [];
      return allAppointments.filter(a => String(a.client_id || a.clientId) === String(c.id)).length > 1;
    }).length;
    const retention = clients.length > 0 ? Math.round((clientsWithMultiple / clients.length) * 100) : null;

    const performanceTrends = document.getElementById('performanceTrends');
    performanceTrends.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:1rem;">
        ${this.renderProgressBar(
          'Tasa de Asistencia',
          attendance !== null ? `${attendance}%` : '—',
          attendance,
          'var(--success-gradient)'
        )}
        ${this.renderProgressBar(
          'Citas Completadas / Total',
          total > 0 ? `${completed} / ${total}` : '—',
          total > 0 ? Math.round((completed/total)*100) : 0,
          'var(--primary-gradient)'
        )}
        ${this.renderProgressBar(
          'Tasa de Retención (clientes recurrentes)',
          retention !== null ? `${retention}%` : '—',
          retention,
          'var(--secondary-gradient)'
        )}
        ${cancelled > 0 ? `<p class="text-muted" style="font-size:0.8rem;">
          ${cancelled} cita${cancelled !== 1 ? 's' : ''} cancelada${cancelled !== 1 ? 's' : ''} ${periodLabel}.
        </p>` : ''}
        <p class="text-muted" style="font-size:0.75rem;margin-top:0.25rem;">
          Satisfacción del cliente disponible cuando se active el módulo de encuestas.
        </p>
      </div>`;
  },

  renderProgressBar(label, displayValue, pct, gradient) {
    const width = pct !== null ? Math.min(pct, 100) : 0;
    return `
      <div>
        <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
          <span class="text-muted" style="font-size:0.875rem;">${label}</span>
          <strong>${displayValue}</strong>
        </div>
        <div style="height:8px;background:var(--bg-glass);border-radius:4px;overflow:hidden;">
          <div style="width:${width}%;height:100%;background:${gradient};transition:width 0.4s ease;"></div>
        </div>
      </div>`;
  },

  renderBarChart(label, value, maxValue, color) {
    const percentage = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
    return `
      <div>
        <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
          <span style="font-size:0.875rem;">${label}</span>
          <strong>${value}</strong>
        </div>
        <div style="height:8px;background:var(--bg-glass);border-radius:4px;overflow:hidden;">
          <div style="width:${percentage}%;height:100%;background:${color};transition:width 0.4s ease;"></div>
        </div>
      </div>`;
  },

  renderServiceItem(name, percentage) {
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-glass); border-radius: var(--radius-md);">
        <span>${name}</span>
        <strong>${percentage}</strong>
      </div>
    `;
  },

  // Shared data snapshot used by both exportToSheets and downloadPDF
  _reportSnapshot() {
    const appointments = this._filterByPeriod(App.data?.appointments || []);
    const clients      = App.data?.clients || [];
    const comms        = App.data?.communications || [];
    const completed    = appointments.filter(a => a.status === 'completed').length;
    const pending      = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;
    const typeCounts   = {};
    appointments.forEach(a => {
      const t = a.type || a.appointment_type || 'Sin tipo';
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });
    const typeLines = Object.entries(typeCounts)
      .sort((a,b) => b[1]-a[1])
      .map(([t,n]) => `${t},${n}`)
      .join('\n');
    const periodLabel = { today: 'Hoy', week: 'Esta Semana', month: 'Este Mes', year: 'Este Año' }[this.selectedPeriod] || '';
    return { appointments, clients, comms, completed, pending, typeLines, periodLabel };
  },

  exportToSheets() {
    App.showNotification('Exportando', 'Generando archivo de reporte...', 'info');

    const { appointments, clients, comms, completed, pending, typeLines, periodLabel } = this._reportSnapshot();

    const csvContent = `Reporte VetConnect — ${periodLabel} — ${new Date().toLocaleDateString('es-ES')}

RESUMEN DE ACTIVIDAD
Total Citas,${appointments.length}
Citas Completadas,${completed}
Citas Pendientes/Confirmadas,${pending}
Total Clientes,${clients.length}
Mensajes Enviados,${comms.length}

CITAS POR TIPO
${typeLines || 'Sin datos'}

COMUNICACIONES POR CANAL
${Object.entries(
  comms.reduce((acc,c) => { const ch = c.channel||'otro'; acc[ch]=(acc[ch]||0)+1; return acc; }, {})
).map(([ch,n]) => `${ch},${n}`).join('\n') || 'Sin datos'}`;

    // Download CSV file
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Reporte_BioVetAI_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      App.showNotification('📥 Exportado', 'Reporte CSV descargado exitosamente', 'success');
    }, 500);
  },

  downloadPDF() {
    App.showNotification('Generando PDF', 'El reporte está siendo generado...', 'info');

    const { appointments, clients, comms, completed, pending, typeLines, periodLabel } = this._reportSnapshot();

    // Generate HTML report that can be printed as PDF
    const reportHTML = `
            <html>
            <head>
                <title>Reporte BioVetAI</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: auto; }
                    .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #40e0d0; padding-bottom: 20px; }
                    .logo { font-size: 28px; font-weight: bold; color: #40e0d0; }
                    .period { color: #666; margin-top: 10px; }
                    .section { margin: 30px 0; }
                    .section h2 { color: #FF9136; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
                    .stat-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                    .stat-value { font-weight: bold; }
                    .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">🐾 BioVetAI</div>
                    <div class="period">Reporte ${this.selectedPeriod === 'week' ? 'Semanal' : this.selectedPeriod === 'month' ? 'Mensual' : 'Anual'}</div>
                    <div class="period">Generado: ${new Date().toLocaleDateString('es-ES')}</div>
                </div>
                
                <div class="section">
                    <h2>📅 Actividad — ${periodLabel}</h2>
                    <div class="stat-row"><span>Total Citas</span><span class="stat-value">${appointments.length}</span></div>
                    <div class="stat-row"><span>Citas Completadas</span><span class="stat-value">${completed}</span></div>
                    <div class="stat-row"><span>Citas Pendientes/Confirmadas</span><span class="stat-value">${pending}</span></div>
                    <div class="stat-row"><span>Total Clientes</span><span class="stat-value">${clients.length}</span></div>
                    <div class="stat-row"><span>Mensajes Enviados</span><span class="stat-value">${comms.length}</span></div>
                </div>

                <div class="section">
                    <h2>🎯 Citas por Tipo</h2>
                    ${typeLines.split('\n').map(l => {
                      const [t,n] = l.split(',');
                      return t ? `<div class="stat-row"><span>${t}</span><span class="stat-value">${n}</span></div>` : '';
                    }).join('')}
                </div>
                
                <div class="footer">
                    <p>BioVetAI - Sistema de Gestión Veterinaria</p>
                    <p>www.biovetai.org | lmarotomar@biovetai.org</p>
                </div>
            </body>
            </html>
        `;

    // Open print dialog
    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportHTML);
    printWindow.document.close();
    printWindow.print();

    setTimeout(() => {
      App.showNotification('📄 PDF Listo', 'Use Ctrl+P o Cmd+P para guardar como PDF', 'success');
    }, 1000);
  },

  setupAutoEmail() {
    const content = `
      <form id="autoEmailForm">
        <div class="form-group">
          <label class="form-label">Frecuencia</label>
          <select class="form-select" id="emailFrequency" required>
            <option value="daily">Diario</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensual</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Email de Destino</label>
          <input type="email" class="form-input" id="emailDestination" required>
        </div>
        
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
          <button type="submit" class="btn btn-primary" style="flex: 1;">Configurar</button>
          <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
        </div>
      </form>
    `;

    App.showModal('Configurar Email Automático', content);

    setTimeout(() => {
      document.getElementById('autoEmailForm').addEventListener('submit', (e) => {
        e.preventDefault();
        App.closeModal();
        App.showNotification('Configuración guardada', 'Los reportes automáticos han sido configurados', 'success');
      });
    }, 100);
  }
};
