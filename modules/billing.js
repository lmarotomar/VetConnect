// Billing Module for VetConnect
// Handles invoice generation, payment processing, and financial reports

const Billing = {
  currentInvoice: null,

  render() {
    return `
      <div class="billing-container">
        <div class="mb-lg">
          <h2 class="card-title" style="font-size: 1.5rem; margin-bottom: 0.5rem;">💰 Facturación</h2>
          <p style="color: var(--text-muted);">Gestiona facturas, pagos y análisis financiero</p>
        </div>

        <!-- Financial Summary Cards -->
        <div class="stats-grid mb-lg">
          ${this.renderFinancialStats()}
        </div>

        <!-- Quick Actions -->
        <div class="card mb-lg">
          <div class="card-body">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="Billing.showCreateInvoiceModal()">
                📝 Nueva Factura
              </button>
              <button class="btn btn-secondary" onclick="Billing.showPendingInvoices()">
                ⏳ Facturas Pendientes
              </button>
              <button class="btn btn-secondary" onclick="Billing.showFinancialReports()">
                📊 Reportes Financieros
              </button>
              <button class="btn btn-secondary" onclick="Billing.exportToExcel()">
                📥 Exportar a Excel
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Invoices -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">📋 Facturas Recientes</h3>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" class="form-input" placeholder="Buscar factura..." 
                     style="width: 250px;" id="invoiceSearch" onkeyup="Billing.filterInvoices()">
              <select class="form-select" style="width: 150px;" id="statusFilter" onchange="Billing.filterInvoices()">
                <option value="all">Todos</option>
                <option value="pending">Pendientes</option>
                <option value="paid">Pagadas</option>
                <option value="overdue">Vencidas</option>
              </select>
            </div>
          </div>
          <div class="card-body">
            <div id="invoicesTableContainer">
              ${this.renderInvoicesTable()}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderFinancialStats() {
    const stats = this.getFinancialStats();
    return `
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-label">Ingresos del Mes</div>
          <div class="stat-icon" style="background: var(--success-gradient);">💵</div>
        </div>
        <div class="stat-value">$${stats.monthlyRevenue.toLocaleString()}</div>
        <div class="stat-change positive">+${stats.monthlyGrowth}% vs mes anterior</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-label">Facturas Pendientes</div>
          <div class="stat-icon" style="background: var(--secondary-gradient);">⏳</div>
        </div>
        <div class="stat-value">${stats.pendingCount}</div>
        <div class="stat-change" style="background: rgba(194, 173, 125, 0.2); color: var(--brand-gold);">
          $${stats.pendingAmount.toLocaleString()} por cobrar
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-label">Ingresos Hoy</div>
          <div class="stat-icon" style="background: var(--primary-gradient);">📅</div>
        </div>
        <div class="stat-value">$${stats.todayRevenue.toLocaleString()}</div>
        <div class="stat-change positive">${stats.todayInvoices} facturas</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-label">Ticket Promedio</div>
          <div class="stat-icon" style="background: var(--success-gradient);">🎫</div>
        </div>
        <div class="stat-value">$${stats.avgTicket.toLocaleString()}</div>
        <div class="stat-change positive">+${stats.ticketGrowth}% este mes</div>
      </div>
    `;
  },

  renderInvoicesTable() {
    const invoices = this.getRecentInvoices();

    if (invoices.length === 0) {
      return `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📄</div>
          <div>No hay facturas registradas</div>
          <button class="btn btn-primary mt-md" onclick="Billing.showCreateInvoiceModal()">
            Crear Primera Factura
          </button>
        </div>
      `;
    }

    return `
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Factura #</th>
              <th>Cliente</th>
              <th>Mascota</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${invoices.map(inv => `
              <tr>
                <td><strong>${inv.invoice_number}</strong></td>
                <td>${inv.client_name}</td>
                <td>${inv.pet_name || '-'}</td>
                <td>${this.formatDate(inv.invoice_date)}</td>
                <td><strong>$${inv.total.toLocaleString()}</strong></td>
                <td>${this.renderStatusBadge(inv.status)}</td>
                <td>
                  <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-icon" onclick="Billing.viewInvoice(${inv.id})" title="Ver">
                      👁️
                    </button>
                    <button class="btn btn-icon" onclick="Billing.downloadPDF(${inv.id})" title="Descargar PDF">
                      📥
                    </button>
                    <button class="btn btn-icon" onclick="Billing.sendInvoice(${inv.id})" title="Enviar">
                      📧
                    </button>
                    ${inv.status === 'pending' ? `
                      <button class="btn btn-icon" onclick="Billing.markAsPaid(${inv.id})" title="Marcar como pagada">
                        ✅
                      </button>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  renderStatusBadge(status) {
    const statusConfig = {
      pending: { label: 'Pendiente', class: 'badge-warning' },
      paid: { label: 'Pagada', class: 'badge-success' },
      overdue: { label: 'Vencida', class: 'badge-danger' },
      partial: { label: 'Pago Parcial', class: 'badge-info' },
      cancelled: { label: 'Cancelada', class: 'badge-danger' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return `<span class="badge ${config.class}">${config.label}</span>`;
  },

  showCreateInvoiceModal() {
    const modalContent = `
      <div class="form-group">
        <label class="form-label">Cliente</label>
        <select class="form-input" id="invoiceClient" onchange="Billing.loadClientPets()">
          <option value="">Seleccionar cliente...</option>
          ${this.getClients().map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Mascota (opcional)</label>
        <select class="form-input" id="invoicePet" disabled>
          <option value="">Seleccionar mascota...</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Cita Relacionada (opcional)</label>
        <select class="form-input" id="invoiceAppointment">
          <option value="">Sin cita asociada</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Fecha de Factura</label>
        <input type="date" class="form-input" id="invoiceDate" value="${new Date().toISOString().split('T')[0]}">
      </div>

      <div class="form-group">
        <label class="form-label">Fecha de Vencimiento (opcional)</label>
        <input type="date" class="form-input" id="invoiceDueDate">
      </div>

      <hr style="margin: 1.5rem 0; border-color: var(--border-glass);">
      
      <h4 style="margin-bottom: 1rem;">Servicios y Productos</h4>
      
      <div id="invoiceItemsContainer">
        ${this.renderInvoiceItemRow(0)}
      </div>

      <button class="btn btn-secondary" onclick="Billing.addInvoiceItem()" style="margin-top: 0.5rem;">
        + Agregar Línea
      </button>

      <hr style="margin: 1.5rem 0; border-color: var(--border-glass);">

      <div class="grid grid-2">
        <div class="form-group">
          <label class="form-label">Descuento ($)</label>
          <input type="number" class="form-input" id="invoiceDiscount" value="0" min="0" step="0.01" 
                 onchange="Billing.calculateInvoiceTotal()">
        </div>
        <div class="form-group">
          <label class="form-label">Impuesto (%)</label>
          <input type="number" class="form-input" id="invoiceTax" value="0" min="0" max="100" step="0.01"
                 onchange="Billing.calculateInvoiceTotal()">
        </div>
      </div>

      <div style="background: var(--bg-glass); padding: 1rem; border-radius: var(--radius-md); margin-top: 1rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span>Subtotal:</span>
          <span id="invoiceSubtotal">$0.00</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: var(--text-muted);">
          <span>Descuento:</span>
          <span id="invoiceDiscountAmount">-$0.00</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: var(--text-muted);">
          <span>Impuesto:</span>
          <span id="invoiceTaxAmount">$0.00</span>
        </div>
        <hr style="border-color: var(--border-glass); margin: 0.5rem 0;">
        <div style="display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 700;">
          <span>TOTAL:</span>
          <span id="invoiceTotal" style="color: var(--brand-gold)">$0.00</span>
        </div>
      </div>

      <div class="form-group" style="margin-top: 1rem;">
        <label class="form-label">Notas (opcional)</label>
        <textarea class="form-textarea" id="invoiceNotes" placeholder="Notas adicionales..."></textarea>
      </div>

      <div style="display: flex; gap: 1rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-glass);">
        <button class="btn btn-primary" onclick="Billing.saveInvoice()">💾 Crear Factura</button>
        <button class="btn btn-success" onclick="Billing.saveAndSendInvoice()">📧 Crear y Enviar</button>
        <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      </div>
    `;

    if (typeof App !== 'undefined') {
      App.showModal('📝 Nueva Factura', modalContent, 'large');
    }
  },

  renderInvoiceItemRow(index) {
    return `
      <div class="invoice-item-row" id="itemRow${index}" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr auto; gap: 0.5rem; margin-bottom: 0.5rem; align-items: end;">
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.75rem;">Descripción</label>
          <input type="text" class="form-input item-description" placeholder="Descripción del servicio/producto">
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.75rem;">Cantidad</label>
          <input type="number" class="form-input item-quantity" value="1" min="1" step="0.01" onchange="Billing.calculateInvoiceTotal()">
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.75rem;">Precio Unit.</label>
          <input type="number" class="form-input item-price" value="0" min="0" step="0.01" onchange="Billing.calculateInvoiceTotal()">
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.75rem;">Total</label>
          <input type="text" class="form-input item-total" value="$0.00" readonly style="background: var(--bg-glass);">
        </div>
        <button class="btn btn-icon" onclick="Billing.removeInvoiceItem(${index})" title="Eliminar">
          🗑️
        </button>
      </div>
    `;
  },

  addInvoiceItem() {
    const container = document.getElementById('invoiceItemsContainer');
    const index = container.children.length;
    const newRow = document.createElement('div');
    newRow.innerHTML = this.renderInvoiceItemRow(index);
    container.appendChild(newRow.firstElementChild);
  },

  removeInvoiceItem(index) {
    const row = document.getElementById(`itemRow${index}`);
    if (row) {
      row.remove();
      this.calculateInvoiceTotal();
    }
  },

  calculateInvoiceTotal() {
    let subtotal = 0;

    // Calculate subtotal from all items
    document.querySelectorAll('.invoice-item-row').forEach(row => {
      const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
      const price = parseFloat(row.querySelector('.item-price').value) || 0;
      const itemTotal = quantity * price;
      row.querySelector('.item-total').value = `$${itemTotal.toFixed(2)}`;
      subtotal += itemTotal;
    });

    const discount = parseFloat(document.getElementById('invoiceDiscount')?.value) || 0;
    const taxRate = parseFloat(document.getElementById('invoiceTax')?.value) || 0;

    const afterDiscount = subtotal - discount;
    const taxAmount = (afterDiscount * taxRate) / 100;
    const total = afterDiscount + taxAmount;

    // Update display
    if (document.getElementById('invoiceSubtotal')) {
      document.getElementById('invoiceSubtotal').textContent = `$${subtotal.toFixed(2)}`;
      document.getElementById('invoiceDiscountAmount').textContent = `-$${discount.toFixed(2)}`;
      document.getElementById('invoiceTaxAmount').textContent = `$${taxAmount.toFixed(2)}`;
      document.getElementById('invoiceTotal').textContent = `$${total.toFixed(2)}`;
    }

    return { subtotal, discount, taxAmount, total };
  },

  saveInvoice(sendEmail = false) {
    // Validate
    const clientId = document.getElementById('invoiceClient')?.value;
    if (!clientId) {
      if (typeof App !== 'undefined') {
        App.showNotification('Error', 'Debes seleccionar un cliente', 'error');
      }
      return;
    }

    // Collect invoice data
    const invoiceData = {
      client_id: clientId,
      patient_id: document.getElementById('invoicePet')?.value || null,
      appointment_id: document.getElementById('invoiceAppointment')?.value || null,
      invoice_date: document.getElementById('invoiceDate')?.value,
      due_date: document.getElementById('invoiceDueDate')?.value || null,
      notes: document.getElementById('invoiceNotes')?.value,
      items: [],
      ...this.calculateInvoiceTotal()
    };

    // Collect items
    document.querySelectorAll('.invoice-item-row').forEach(row => {
      const description = row.querySelector('.item-description').value;
      const quantity = parseFloat(row.querySelector('.item-quantity').value);
      const price = parseFloat(row.querySelector('.item-price').value);

      if (description && quantity > 0 && price > 0) {
        invoiceData.items.push({
          description,
          quantity,
          unit_price: price,
          total: quantity * price
        });
      }
    });

    if (invoiceData.items.length === 0) {
      if (typeof App !== 'undefined') {
        App.showNotification('Error', 'Debes agregar al menos un servicio o producto', 'error');
      }
      return;
    }

    // Save to database (mock for now)
    console.log('Saving invoice:', invoiceData);

    if (typeof App !== 'undefined') {
      App.showNotification(
        'Factura Creada',
        `Factura creada exitosamente. Total: $${invoiceData.total.toFixed(2)}`,
        'success'
      );
      App.closeModal();

      if (sendEmail) {
        setTimeout(() => {
          App.showNotification('Enviada', 'La factura ha sido enviada por WhatsApp y Email', 'success');
        }, 1000);
      }
    }

    // Refresh view
    setTimeout(() => {
      if (typeof App !== 'undefined' && App.currentView === 'billing') {
        App.loadView('billing');
      }
    }, 1500);
  },

  saveAndSendInvoice() {
    this.saveInvoice(true);
  },

  loadClientPets() {
    const clientId = document.getElementById('invoiceClient')?.value;
    const petSelect = document.getElementById('invoicePet');

    if (!clientId) {
      petSelect.disabled = true;
      petSelect.innerHTML = '<option value="">Seleccionar mascota...</option>';
      return;
    }

    // Mock pets for selected client
    const pets = this.getPetsByClient(parseInt(clientId));
    petSelect.disabled = false;
    petSelect.innerHTML = '<option value="">Sin mascota específica</option>' +
      pets.map(p => `<option value="${p.id}">${p.name} (${p.species})</option>`).join('');
  },

  // Data methods (mock data for now)
  getFinancialStats() {
    return {
      monthlyRevenue: 45280,
      monthlyGrowth: 12,
      pendingCount: 8,
      pendingAmount: 3450,
      todayRevenue: 1850,
      todayInvoices: 6,
      avgTicket: 385,
      ticketGrowth: 8
    };
  },

  getRecentInvoices() {
    return [
      {
        id: 1,
        invoice_number: 'INV-2025-001',
        client_name: 'María García',
        pet_name: 'Max',
        invoice_date: '2025-01-10',
        total: 450.00,
        status: 'paid'
      },
      {
        id: 2,
        invoice_number: 'INV-2025-002',
        client_name: 'Carlos López',
        pet_name: 'Luna',
        invoice_date: '2025-01-09',
        total: 280.00,
        status: 'pending'
      },
      {
        id: 3,
        invoice_number: 'INV-2025-003',
        client_name: 'Ana Martínez',
        pet_name: 'Rocky',
        invoice_date: '2025-01-08',
        total: 650.00,
        status: 'paid'
      }
    ];
  },

  getClients() {
    return [
      { id: 1, name: 'María García' },
      { id: 2, name: 'Carlos López' },
      { id: 3, name: 'Ana Martínez' },
      { id: 4, name: 'Pedro Sánchez' }
    ];
  },

  getPetsByClient(clientId) {
    const petsByClient = {
      1: [{ id: 1, name: 'Max', species: 'Perro' }],
      2: [{ id: 2, name: 'Luna', species: 'Gato' }],
      3: [{ id: 3, name: 'Rocky', species: 'Perro' }],
      4: [{ id: 4, name: 'Mimi', species: 'Gato' }]
    };
    return petsByClient[clientId] || [];
  },

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  },

  filterInvoices() {
    const searchText = document.getElementById('invoiceSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';

    const invoices = this.getRecentInvoices();
    const filtered = invoices.filter(inv => {
      const matchesSearch = !searchText ||
        inv.invoice_number.toLowerCase().includes(searchText) ||
        inv.client_name.toLowerCase().includes(searchText) ||
        (inv.pet_name && inv.pet_name.toLowerCase().includes(searchText));

      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Re-render table with filtered results
    const container = document.getElementById('invoicesTableContainer');
    if (container) {
      if (filtered.length === 0) {
        container.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
                        <div>No se encontraron facturas con esos criterios</div>
                    </div>
                `;
      } else {
        container.innerHTML = this.renderFilteredTable(filtered);
      }
    }
  },

  renderFilteredTable(invoices) {
    return `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Factura #</th>
                            <th>Cliente</th>
                            <th>Mascota</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoices.map(inv => `
                            <tr>
                                <td><strong>${inv.invoice_number}</strong></td>
                                <td>${inv.client_name}</td>
                                <td>${inv.pet_name || '-'}</td>
                                <td>${this.formatDate(inv.invoice_date)}</td>
                                <td><strong>$${inv.total.toLocaleString()}</strong></td>
                                <td>${this.renderStatusBadge(inv.status)}</td>
                                <td>
                                    <div style="display: flex; gap: 0.5rem;">
                                        <button class="btn btn-icon" onclick="Billing.viewInvoice(${inv.id})" title="Ver">👁️</button>
                                        <button class="btn btn-icon" onclick="Billing.downloadPDF(${inv.id})" title="Descargar PDF">📥</button>
                                        <button class="btn btn-icon" onclick="Billing.sendInvoice(${inv.id})" title="Enviar">📧</button>
                                        ${inv.status === 'pending' ? `
                                            <button class="btn btn-icon" onclick="Billing.markAsPaid(${inv.id})" title="Marcar como pagada">✅</button>
                                        ` : ''}
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
  },

  viewInvoice(id) {
    const invoice = this.getRecentInvoices().find(inv => inv.id === id);
    if (!invoice) return;

    const modalContent = `
            <div style="padding: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
                    <div>
                        <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--brand-gold);">${invoice.invoice_number}</h2>
                        <p style="color: var(--text-muted);">Fecha: ${this.formatDate(invoice.invoice_date)}</p>
                    </div>
                    <div>${this.renderStatusBadge(invoice.status)}</div>
                </div>
                
                <div class="grid grid-2" style="gap: 2rem; margin-bottom: 2rem;">
                    <div>
                        <h4 style="color: var(--text-muted); margin-bottom: 0.5rem;">Cliente</h4>
                        <p style="font-size: 1.1rem;">${invoice.client_name}</p>
                    </div>
                    <div>
                        <h4 style="color: var(--text-muted); margin-bottom: 0.5rem;">Mascota</h4>
                        <p style="font-size: 1.1rem;">${invoice.pet_name || 'N/A'}</p>
                    </div>
                </div>
                
                <div style="background: var(--bg-glass); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 2rem;">
                    <h4 style="margin-bottom: 1rem;">Detalle de Servicios</h4>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 1px solid var(--border-glass);">
                                <th style="text-align: left; padding: 0.5rem 0;">Descripción</th>
                                <th style="text-align: right; padding: 0.5rem 0;">Cant.</th>
                                <th style="text-align: right; padding: 0.5rem 0;">Precio</th>
                                <th style="text-align: right; padding: 0.5rem 0;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 0.75rem 0;">Consulta General</td>
                                <td style="text-align: right;">1</td>
                                <td style="text-align: right;">$${(invoice.total * 0.6).toFixed(2)}</td>
                                <td style="text-align: right;">$${(invoice.total * 0.6).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 0.75rem 0;">Medicamentos</td>
                                <td style="text-align: right;">1</td>
                                <td style="text-align: right;">$${(invoice.total * 0.4).toFixed(2)}</td>
                                <td style="text-align: right;">$${(invoice.total * 0.4).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div style="display: flex; justify-content: flex-end;">
                    <div style="width: 250px;">
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-glass);">
                            <span>Subtotal:</span>
                            <span>$${invoice.total.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-glass); color: var(--text-muted);">
                            <span>Impuesto:</span>
                            <span>$0.00</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; font-size: 1.25rem; font-weight: 700;">
                            <span>TOTAL:</span>
                            <span style="color: var(--brand-gold);">$${invoice.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 1rem; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-glass);">
                    <button class="btn btn-primary" onclick="Billing.downloadPDF(${id})">📥 Descargar PDF</button>
                    <button class="btn btn-secondary" onclick="Billing.sendInvoice(${id})">📧 Enviar al Cliente</button>
                    ${invoice.status === 'pending' ? `<button class="btn btn-success" onclick="Billing.markAsPaid(${id}); App.closeModal();">✅ Marcar Pagada</button>` : ''}
                    <button class="btn btn-secondary" onclick="App.closeModal()">Cerrar</button>
                </div>
            </div>
        `;

    if (typeof App !== 'undefined') {
      App.showModal(`📄 Factura ${invoice.invoice_number}`, modalContent, 'large');
    }
  },

  downloadPDF(id) {
    const invoice = this.getRecentInvoices().find(inv => inv.id === id);
    if (!invoice) return;

    // Generate PDF content (using basic HTML to PDF approach)
    const pdfContent = `
            <html>
            <head>
                <title>Factura ${invoice.invoice_number}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; }
                    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
                    .logo { font-size: 24px; font-weight: bold; color: #40e0d0; }
                    .invoice-title { font-size: 28px; color: #333; }
                    .info-row { display: flex; justify-content: space-between; margin-bottom: 20px; }
                    .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                    .table th { background: #f5f5f5; }
                    .total-row { font-size: 18px; font-weight: bold; }
                    .footer { margin-top: 40px; text-align: center; color: #666; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">🐾 BioVetAI</div>
                    <div class="invoice-title">FACTURA</div>
                </div>
                <div class="info-row">
                    <div><strong>Factura:</strong> ${invoice.invoice_number}</div>
                    <div><strong>Fecha:</strong> ${this.formatDate(invoice.invoice_date)}</div>
                </div>
                <div class="info-row">
                    <div><strong>Cliente:</strong> ${invoice.client_name}</div>
                    <div><strong>Mascota:</strong> ${invoice.pet_name || 'N/A'}</div>
                </div>
                <table class="table">
                    <thead><tr><th>Descripción</th><th>Cantidad</th><th>Precio</th><th>Total</th></tr></thead>
                    <tbody>
                        <tr><td>Consulta General</td><td>1</td><td>$${(invoice.total * 0.6).toFixed(2)}</td><td>$${(invoice.total * 0.6).toFixed(2)}</td></tr>
                        <tr><td>Medicamentos</td><td>1</td><td>$${(invoice.total * 0.4).toFixed(2)}</td><td>$${(invoice.total * 0.4).toFixed(2)}</td></tr>
                    </tbody>
                </table>
                <div class="total-row" style="text-align: right;">TOTAL: $${invoice.total.toFixed(2)}</div>
                <div class="footer">
                    <p>BioVetAI - Sistema de Gestión Veterinaria</p>
                    <p>www.biovetai.org | lmarotomar@biovetai.org</p>
                </div>
            </body>
            </html>
        `;

    // Create and download
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Factura_${invoice.invoice_number}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (typeof App !== 'undefined') {
      App.showNotification('Descargado', `Factura ${invoice.invoice_number} descargada`, 'success');
    }
  },

  sendInvoice(id) {
    const invoice = this.getRecentInvoices().find(inv => inv.id === id);
    if (!invoice) return;

    // Simulate sending via WhatsApp and email
    const message = `Estimado ${invoice.client_name}, le enviamos su factura ${invoice.invoice_number} por un total de $${invoice.total.toFixed(2)}. Gracias por confiar en BioVetAI.`;

    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    if (typeof App !== 'undefined') {
      App.showNotification('Enviando', 'Abriendo WhatsApp para enviar la factura...', 'success');
    }
  },

  markAsPaid(id) {
    if (confirm('¿Confirmar que esta factura ha sido pagada?')) {
      // In a real app, this would update the database
      const invoices = this.getRecentInvoices();
      const invoice = invoices.find(inv => inv.id === id);
      if (invoice) {
        invoice.status = 'paid';
      }

      if (typeof App !== 'undefined') {
        App.showNotification('✅ Actualizada', 'Factura marcada como pagada', 'success');
        setTimeout(() => App.loadView('billing'), 500);
      }
    }
  },

  showPendingInvoices() {
    // Set filter to pending and apply
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
      statusFilter.value = 'pending';
      this.filterInvoices();
    }

    if (typeof App !== 'undefined') {
      App.showNotification('Filtro Aplicado', 'Mostrando solo facturas pendientes', 'info');
    }
  },

  showFinancialReports() {
    const stats = this.getFinancialStats();
    const invoices = this.getRecentInvoices();

    const modalContent = `
            <div style="padding: 1rem;">
                <h3 style="margin-bottom: 1.5rem; color: var(--brand-gold);">📊 Resumen Financiero</h3>
                
                <div class="grid grid-2" style="gap: 1.5rem; margin-bottom: 2rem;">
                    <div style="background: var(--bg-glass); padding: 1.5rem; border-radius: var(--radius-md);">
                        <div style="color: var(--text-muted); margin-bottom: 0.5rem;">Ingresos del Mes</div>
                        <div style="font-size: 2rem; font-weight: 700; color: var(--brand-green);">$${stats.monthlyRevenue.toLocaleString()}</div>
                        <div style="color: var(--text-muted); font-size: 0.875rem;">+${stats.monthlyGrowth}% vs mes anterior</div>
                    </div>
                    <div style="background: var(--bg-glass); padding: 1.5rem; border-radius: var(--radius-md);">
                        <div style="color: var(--text-muted); margin-bottom: 0.5rem;">Pendiente de Cobro</div>
                        <div style="font-size: 2rem; font-weight: 700; color: var(--brand-gold);">$${stats.pendingAmount.toLocaleString()}</div>
                        <div style="color: var(--text-muted); font-size: 0.875rem;">${stats.pendingCount} facturas pendientes</div>
                    </div>
                </div>
                
                <h4 style="margin-bottom: 1rem;">📈 Desglose por Estado</h4>
                <div style="background: var(--bg-glass); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-glass);">
                        <span>Pagadas</span>
                        <span style="color: var(--brand-green);">${invoices.filter(i => i.status === 'paid').length} facturas</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-glass);">
                        <span>Pendientes</span>
                        <span style="color: var(--brand-gold);">${invoices.filter(i => i.status === 'pending').length} facturas</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                        <span>Vencidas</span>
                        <span style="color: #ff6b6b;">${invoices.filter(i => i.status === 'overdue').length} facturas</span>
                    </div>
                </div>
                
                <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                    <button class="btn btn-primary" onclick="Billing.exportToExcel()">📥 Exportar Reporte</button>
                    <button class="btn btn-secondary" onclick="App.closeModal()">Cerrar</button>
                </div>
            </div>
        `;

    if (typeof App !== 'undefined') {
      App.showModal('📊 Reportes Financieros', modalContent, 'medium');
    }
  },

  exportToExcel() {
    const invoices = this.getRecentInvoices();

    // Create CSV content
    const headers = ['Factura', 'Cliente', 'Mascota', 'Fecha', 'Total', 'Estado'];
    const rows = invoices.map(inv => [
      inv.invoice_number,
      inv.client_name,
      inv.pet_name || 'N/A',
      inv.invoice_date,
      inv.total.toFixed(2),
      inv.status === 'paid' ? 'Pagada' : inv.status === 'pending' ? 'Pendiente' : 'Vencida'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV file
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Facturas_BioVetAI_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (typeof App !== 'undefined') {
      App.showNotification('📥 Exportado', 'Archivo CSV descargado exitosamente', 'success');
    }
  }
};

// Auto-register module
if (typeof window !== 'undefined') {
  window.Billing = Billing;
}
