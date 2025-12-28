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
      <div class="stats-grid mb-lg">
        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">Total Citas</div>
              <div class="stat-value">127</div>
              <span class="stat-change positive">+18%</span>
            </div>
            <div class="stat-icon">📅</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">Nuevos Clientes</div>
              <div class="stat-value">23</div>
              <span class="stat-change positive">+32%</span>
            </div>
            <div class="stat-icon">👥</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">Tasa de Asistencia</div>
              <div class="stat-value">96%</div>
              <span class="stat-change positive">+4%</span>
            </div>
            <div class="stat-icon">✅</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <div>
              <div class="stat-label">Satisfacción</div>
              <div class="stat-value">4.8</div>
              <span class="stat-change positive">+0.3</span>
            </div>
            <div class="stat-icon">⭐</div>
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
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span>✅</span>
                      <strong>Confirmación de Citas</strong>
                    </div>
                  </td>
                  <td>127</td>
                  <td><span class="badge badge-success">99%</span></td>
                  <td><span class="badge badge-success">94%</span></td>
                  <td>89</td>
                </tr>
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span>⏰</span>
                      <strong>Recordatorios 24h</strong>
                    </div>
                  </td>
                  <td>98</td>
                  <td><span class="badge badge-success">98%</span></td>
                  <td><span class="badge badge-success">92%</span></td>
                  <td>76</td>
                </tr>
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span>🔔</span>
                      <strong>Recordatorios 2h</strong>
                    </div>
                  </td>
                  <td>95</td>
                  <td><span class="badge badge-success">99%</span></td>
                  <td><span class="badge badge-success">96%</span></td>
                  <td>82</td>
                </tr>
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span>📋</span>
                      <strong>Instrucciones Post-Consulta</strong>
                    </div>
                  </td>
                  <td>103</td>
                  <td><span class="badge badge-success">100%</span></td>
                  <td><span class="badge badge-success">88%</span></td>
                  <td>45</td>
                </tr>
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span>🔄</span>
                      <strong>Seguimiento 3 días</strong>
                    </div>
                  </td>
                  <td>87</td>
                  <td><span class="badge badge-success">99%</span></td>
                  <td><span class="badge badge-success">85%</span></td>
                  <td>62</td>
                </tr>
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span>💉</span>
                      <strong>Recordatorios de Vacunación</strong>
                    </div>
                  </td>
                  <td>34</td>
                  <td><span class="badge badge-success">100%</span></td>
                  <td><span class="badge badge-success">91%</span></td>
                  <td>28</td>
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
    this.loadCharts();
  },

  setPeriod(period) {
    this.selectedPeriod = period;
    this.loadCharts();
    App.showNotification('Período actualizado', `Mostrando datos de: ${period}`, 'info');
  },

  loadCharts() {
    // Appointments by Type
    const appointmentsByType = document.getElementById('appointmentsByType');
    appointmentsByType.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${this.renderBarChart('Consulta General', 42, '#667eea')}
        ${this.renderBarChart('Control', 28, '#4facfe')}
        ${this.renderBarChart('Vacunación', 23, '#00d4aa')}
        ${this.renderBarChart('Cirugía', 15, '#f5576c')}
        ${this.renderBarChart('Emergencia', 8, '#ff6b6b')}
      </div>
    `;

    // Communication Metrics
    const communicationMetrics = document.getElementById('communicationMetrics');
    communicationMetrics.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div class="text-muted" style="font-size: 0.875rem;">WhatsApp</div>
            <div style="font-size: 1.5rem; font-weight: 700;">156</div>
          </div>
          <span class="badge badge-success">94% abiertos</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div class="text-muted" style="font-size: 0.875rem;">Email</div>
            <div style="font-size: 1.5rem; font-weight: 700;">89</div>
          </div>
          <span class="badge badge-success">76% abiertos</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div class="text-muted" style="font-size: 0.875rem;">SMS</div>
            <div style="font-size: 1.5rem; font-weight: 700;">34</div>
          </div>
          <span class="badge badge-success">98% entregados</span>
        </div>
      </div>
    `;

    // Top Services
    const topServices = document.getElementById('topServices');
    topServices.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        ${this.renderServiceItem('🏥 Consulta General', '33%')}
        ${this.renderServiceItem('💉 Vacunación', '22%')}
        ${this.renderServiceItem('🔬 Análisis de Laboratorio', '18%')}
        ${this.renderServiceItem('✂️ Cirugías', '15%')}
        ${this.renderServiceItem('🦷 Limpieza Dental', '12%')}
      </div>
    `;

    // Performance Trends
    const performanceTrends = document.getElementById('performanceTrends');
    performanceTrends.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span class="text-muted" style="font-size: 0.875rem;">Tasa de Asistencia</span>
            <strong>96%</strong>
          </div>
          <div style="height: 8px; background: var(--bg-glass); border-radius: 4px; overflow: hidden;">
            <div style="width: 96%; height: 100%; background: var(--success-gradient);"></div>
          </div>
        </div>
        
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span class="text-muted" style="font-size: 0.875rem;">Satisfacción del Cliente</span>
            <strong>4.8/5.0</strong>
          </div>
          <div style="height: 8px; background: var(--bg-glass); border-radius: 4px; overflow: hidden;">
            <div style="width: 96%; height: 100%; background: var(--primary-gradient);"></div>
          </div>
        </div>
        
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span class="text-muted" style="font-size: 0.875rem;">Tasa de Retención</span>
            <strong>87%</strong>
          </div>
          <div style="height: 8px; background: var(--bg-glass); border-radius: 4px; overflow: hidden;">
            <div style="width: 87%; height: 100%; background: var(--secondary-gradient);"></div>
          </div>
        </div>
      </div>
    `;
  },

  renderBarChart(label, value, color) {
    const maxValue = 50;
    const percentage = (value / maxValue) * 100;

    return `
      <div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="font-size: 0.875rem;">${label}</span>
          <strong>${value}</strong>
        </div>
        <div style="height: 8px; background: var(--bg-glass); border-radius: 4px; overflow: hidden;">
          <div style="width: ${percentage}%; height: 100%; background: ${color};"></div>
        </div>
      </div>
    `;
  },

  renderServiceItem(name, percentage) {
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-glass); border-radius: var(--radius-md);">
        <span>${name}</span>
        <strong>${percentage}</strong>
      </div>
    `;
  },

  exportToSheets() {
    App.showNotification('Exportando', 'Generando archivo de reporte...', 'info');

    // Create CSV with report data
    const csvContent = `Reporte BioVetAI - ${new Date().toLocaleDateString('es-ES')}

RESUMEN FINANCIERO
Ingresos del Período,$45280
Gastos Operativos,$12450
Ganancia Neta,$32830
Ticket Promedio,$385
Total Citas,${this.selectedPeriod === 'week' ? '45' : this.selectedPeriod === 'month' ? '186' : '2245'}

SERVICIOS MÁS SOLICITADOS
Consultas Generales,35%
Vacunaciones,25%
Cirugías,15%
Laboratorio,12%
Grooming,8%
Otros,5%

DISTRIBUCIÓN POR DÍA
Lunes,18
Martes,22
Miércoles,25
Jueves,20
Viernes,28
Sábado,15
Domingo,8`;

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
                    <h2>📊 Resumen Financiero</h2>
                    <div class="stat-row"><span>Ingresos del Período</span><span class="stat-value">$45,280</span></div>
                    <div class="stat-row"><span>Gastos Operativos</span><span class="stat-value">$12,450</span></div>
                    <div class="stat-row"><span>Ganancia Neta</span><span class="stat-value">$32,830</span></div>
                    <div class="stat-row"><span>Ticket Promedio</span><span class="stat-value">$385</span></div>
                </div>
                
                <div class="section">
                    <h2>📅 Actividad</h2>
                    <div class="stat-row"><span>Total Citas</span><span class="stat-value">186</span></div>
                    <div class="stat-row"><span>Nuevos Pacientes</span><span class="stat-value">24</span></div>
                    <div class="stat-row"><span>Mensajes Enviados</span><span class="stat-value">312</span></div>
                </div>
                
                <div class="section">
                    <h2>🎯 Servicios Más Solicitados</h2>
                    <div class="stat-row"><span>Consultas Generales</span><span class="stat-value">35%</span></div>
                    <div class="stat-row"><span>Vacunaciones</span><span class="stat-value">25%</span></div>
                    <div class="stat-row"><span>Cirugías</span><span class="stat-value">15%</span></div>
                    <div class="stat-row"><span>Laboratorio</span><span class="stat-value">12%</span></div>
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
