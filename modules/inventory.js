// Inventory Module for VetConnect
// Handles product catalog, stock control, and purchase orders

const Inventory = {
  render() {
    return `
      <div class="inventory-container">
        <div class="mb-lg">
          <h2 class="card-title" style="font-size: 1.5rem; margin-bottom: 0.5rem;">📦 Inventario</h2>
          <p style="color: var(--text-muted);">Control de stock, productos y proveedores</p>
        </div>

        <!-- Inventory Summary Cards -->
        <div class="stats-grid mb-lg">
          ${this.renderInventoryStats()}
        </div>

        <!-- Quick Actions -->
        <div class="card mb-lg">
          <div class="card-body">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="Inventory.showAddProductModal()">
                ➕ Nuevo Producto
              </button>
              <button class="btn btn-secondary" onclick="Inventory.showLowStockAlert()">
                ⚠️ Stock Bajo
              </button>
              <button class="btn btn-secondary" onclick="Inventory.showExpiringProducts()">
                📅 Próximos a Vencer
              </button>
              <button class="btn btn-secondary" onclick="Inventory.showPurchaseOrders()">
                🛒 Órdenes de Compra
              </button>
            </div>
          </div>
        </div>

        <!-- Category Tabs -->
        <div class="card">
          <div class="card-header">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-secondary active" data-category="all" onclick="Inventory.filterByCategory('all')">
                  Todos
                </button>
                <button class="btn btn-secondary" data-category="medication" onclick="Inventory.filterByCategory('medication')">
                  💊 Medicamentos
                </button>
                <button class="btn btn-secondary" data-category="vaccine" onclick="Inventory.filterByCategory('vaccine')">
                  💉 Vacunas
                </button>
                <button class="btn btn-secondary" data-category="supply" onclick="Inventory.filterByCategory('supply')">
                  🧴 Suministros
                </button>
                <button class="btn btn-secondary" data-category="food" onclick="Inventory.filterByCategory('food')">
                  🍖 Alimentos
                </button>
              </div>
              <input type="text" class="form-input" placeholder="Buscar producto..." 
                     style="width: 250px;" id="productSearch" onkeyup="Inventory.filterProducts()">
            </div>
          </div>
          <div class="card-body">
            <div id="productsTableContainer">
              ${this.renderProductsTable()}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderInventoryStats() {
    const stats = this.getInventoryStats();
    return `
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-label">Valor Total</div>
          <div class="stat-icon" style="background: var(--primary-gradient);">💰</div>
        </div>
        <div class="stat-value">$${stats.totalValue.toLocaleString()}</div>
        <div class="stat-change positive">${stats.totalItems} productos</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-label">Stock Bajo</div>
          <div class="stat-icon" style="background: linear-gradient(135deg, #ff6b6b 0%, #c92a2a 100%);">⚠️</div>
        </div>
        <div class="stat-value">${stats.lowStockCount}</div>
        <div class="stat-change" style="background: rgba(255, 107, 107, 0.2); color: #ff6b6b;">
          Requiere reorden
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-label">Próximos a Vencer</div>
          <div class="stat-icon" style="background: var(--secondary-gradient);">📅</div>
        </div>
        <div class="stat-value">${stats.expiringCount}</div>
        <div class="stat-change" style="background: rgba(194, 173, 125, 0.2); color: var(--brand-gold);">
          En 30 días
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-label">Movimientos Hoy</div>
          <div class="stat-icon" style="background: var(--success-gradient);">📊</div>
        </div>
        <div class="stat-value">${stats.todayTransactions}</div>
        <div class="stat-change positive">Entradas y salidas</div>
      </div>
    `;
  },

  renderProductsTable() {
    const products = this.getProducts();

    if (products.length === 0) {
      return `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📦</div>
          <div>No hay productos en inventario</div>
          <button class="btn btn-primary mt-md" onclick="Inventory.showAddProductModal()">
            Agregar Primer Producto
          </button>
        </div>
      `;
    }

    return `
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Precio Venta</th>
              <th>Vencimiento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(product => `
              <tr>
                <td>
                  <div style="font-weight: 600;">${product.name}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">SKU: ${product.sku}</div>
                </td>
                <td>
                  <span class="badge badge-info">${this.getCategoryLabel(product.category)}</span>
                </td>
                <td>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <strong>${product.current_stock} ${product.unit}</strong>
                    ${this.renderStockIndicator(product)}
                  </div>
                </td>
                <td><strong>$${product.sale_price}</strong></td>
                <td>${product.expiration_date ? this.formatDate(product.expiration_date) : '-'}</td>
                <td>${this.renderProductStatus(product)}</td>
                <td>
                  <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-icon" onclick="Inventory.adjustStock(${product.id})" title="Ajustar Stock">
                      📝
                    </button>
                    <button class="btn btn-icon" onclick="Inventory.editProduct(${product.id})" title="Editar">
                      ✏️
                    </button>
                    <button class="btn btn-icon" onclick="Inventory.viewHistory(${product.id})" title="Historial">
                      📊
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  renderStockIndicator(product) {
    if (product.current_stock <= product.min_stock) {
      return '<span style="color: #ff6b6b;">⚠️</span>';
    } else if (product.current_stock <= product.min_stock * 1.5) {
      return '<span style="color: var(--brand-gold);">⚡</span>';
    }
    return '<span style="color: var(--brand-green);">✓</span>';
  },

  renderProductStatus(product) {
    if (!product.is_active) {
      return '<span class="badge badge-danger">Inactivo</span>';
    }
    if (product.current_stock <= product.min_stock) {
      return '<span class="badge badge-danger">Stock Bajo</span>';
    }
    if (product.expiration_date) {
      const daysToExpire = Math.floor((new Date(product.expiration_date) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysToExpire < 30) {
        return `<span class="badge badge-warning">Vence en ${daysToExpire}d</span>`;
      }
    }
    return '<span class="badge badge-success">OK</span>';
  },

  getCategoryLabel(category) {
    const labels = {
      medication: '💊 Medicamento',
      vaccine: '💉 Vacuna',
      supply: '🧴 Suministro',
      food: '🍖 Alimento',
      accessory: '🎀 Accesorio'
    };
    return labels[category] || category;
  },

  showAddProductModal() {
    const modalContent = `
      <div class="grid grid-2">
        <div class="form-group">
          <label class="form-label">Nombre del Producto *</label>
          <input type="text" class="form-input" id="productName" placeholder="Ej: Ivermectina 1%">
        </div>
        <div class="form-group">
          <label class="form-label">Categoría *</label>
          <select class="form-input" id="productCategory">
            <option value="medication">💊 Medicamento</option>
            <option value="vaccine">💉 Vacuna</option>
            <option value="supply">🧴 Suministro</option>
            <option value="food">🍖 Alimento</option>
            <option value="accessory">🎀 Accesorio</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Descripción</label>
        <textarea class="form-textarea" id="productDescription" placeholder="Descripción detallada del producto..."></textarea>
      </div>

      <div class="grid grid-2">
        <div class="form-group">
          <label class="form-label">SKU</label>
          <input type="text" class="form-input" id="productSKU" placeholder="Código interno">
        </div>
        <div class="form-group">
          <label class="form-label">Código de Barras</label>
          <input type="text" class="form-input" id="productBarcode" placeholder="Código de barras">
        </div>
      </div>

      <div class="grid grid-2">
        <div class="form-group">
          <label class="form-label">Stock Inicial *</label>
          <input type="number" class="form-input" id="productStock" value="0" min="0" step="0.01">
        </div>
        <div class="form-group">
          <label class="form-label">Unidad</label>
          <select class="form-input" id="productUnit">
            <option value="unit">Unidad</option>
            <option value="ml">ml</option>
            <option value="gr">gr</option>
            <option value="kg">kg</option>
            <option value="box">Caja</option>
            <option value="bottle">Botella</option>
            <option value="package">Paquete</option>
          </select>
        </div>
      </div>

      <div class="grid grid-2">
        <div class="form-group">
          <label class="form-label">Stock Mínimo</label>
          <input type="number" class="form-input" id="productMinStock" value="10" min="0" step="0.01">
          <small style="color: var(--text-muted); font-size: 0.75rem;">Alerta cuando stock baje de este nivel</small>
        </div>
        <div class="form-group">
          <label class="form-label">Stock Máximo</label>
          <input type="number" class="form-input" id="productMaxStock" value="100" min="0" step="0.01">
        </div>
      </div>

      <div class="grid grid-2">
        <div class="form-group">
          <label class="form-label">Precio de Costo</label>
          <input type="number" class="form-input" id="productCostPrice" value="0" min="0" step="0.01">
        </div>
        <div class="form-group">
          <label class="form-label">Precio de Venta *</label>
          <input type="number" class="form-input" id="productSalePrice" value="0" min="0" step="0.01">
        </div>
      </div>

      <div class="grid grid-2">
        <div class="form-group">
          <label class="form-label">Fecha de Vencimiento</label>
          <input type="date" class="form-input" id="productExpiration">
        </div>
        <div class="form-group">
          <label class="form-label">Número de Lote</label>
          <input type="text" class="form-input" id="productBatch" placeholder="Lote/Batch">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Ubicación en Clínica</label>
        <input type="text" class="form-input" id="productLocation" placeholder="Ej: Estante A, Refrigerador, etc.">
      </div>

      <div style="display: flex; gap: 1rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-glass);">
        <button class="btn btn-primary" onclick="Inventory.saveProduct()">💾 Guardar Producto</button>
        <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      </div>
    `;

    if (typeof App !== 'undefined') {
      App.showModal('➕ Nuevo Producto', modalContent, 'large');
    }
  },

  saveProduct() {
    const productData = {
      name: document.getElementById('productName')?.value,
      category: document.getElementById('productCategory')?.value,
      description: document.getElementById('productDescription')?.value,
      sku: document.getElementById('productSKU')?.value,
      barcode: document.getElementById('productBarcode')?.value,
      current_stock: parseFloat(document.getElementById('productStock')?.value) || 0,
      unit: document.getElementById('productUnit')?.value,
      min_stock: parseFloat(document.getElementById('productMinStock')?.value) || 0,
      max_stock: parseFloat(document.getElementById('productMaxStock')?.value) || 0,
      cost_price: parseFloat(document.getElementById('productCostPrice')?.value) || 0,
      sale_price: parseFloat(document.getElementById('productSalePrice')?.value) || 0,
      expiration_date: document.getElementById('productExpiration')?.value,
      batch_number: document.getElementById('productBatch')?.value,
      location: document.getElementById('productLocation')?.value
    };

    if (!productData.name || productData.sale_price <= 0) {
      if (typeof App !== 'undefined') {
        App.showNotification('Error', 'Debes completar los campos obligatorios', 'error');
      }
      return;
    }

    console.log('Saving product:', productData);

    if (typeof App !== 'undefined') {
      App.showNotification('Producto Guardado', `${productData.name} agregado al inventario`, 'success');
      App.closeModal();
      setTimeout(() => App.loadView('inventory'), 1000);
    }
  },

  adjustStock(id) {
    const modalContent = `
      <div class="form-group">
        <label class="form-label">Tipo de Ajuste</label>
        <select class="form-input" id="adjustmentType">
          <option value="purchase">Entrada (Compra)</option>
          <option value="sale">Salida (Venta)</option>
          <option value="adjustment">Ajuste de Inventario</option>
          <option value="waste">Merma/Desperdicio</option>
          <option value="return">Devolución</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Cantidad</label>
        <input type="number" class="form-input" id="adjustmentQuantity" value="0" min="0" step="0.01">
      </div>

      <div class="form-group">
        <label class="form-label">Notas</label>
        <textarea class="form-textarea" id="adjustmentNotes" placeholder="Motivo del ajuste..."></textarea>
      </div>

      <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
        <button class="btn btn-primary" onclick="Inventory.saveAdjustment(${id})">Aplicar Ajuste</button>
        <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      </div>
    `;

    if (typeof App !== 'undefined') {
      App.showModal('📝 Ajustar Stock', modalContent);
    }
  },

  saveAdjustment(productId) {
    if (typeof App !== 'undefined') {
      App.showNotification('Stock Actualizado', 'El inventario ha sido ajustado', 'success');
      App.closeModal();
      setTimeout(() => App.loadView('inventory'), 1000);
    }
  },

  // Data methods (mock data for now)
  getInventoryStats() {
    const products = this.getProducts();
    const today = new Date();
    const in30days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const totalValue    = products.reduce((sum, p) => sum + ((p.price || 0) * (p.current_stock || p.stock || 0)), 0);
    const lowStockCount = products.filter(p => (p.current_stock ?? p.stock ?? 0) <= (p.min_stock ?? p.min_quantity ?? 0)).length;
    const expiringCount = products.filter(p => {
      if (!p.expiry_date && !p.expiration_date) return false;
      const exp = new Date(p.expiry_date || p.expiration_date);
      return exp <= in30days && exp >= today;
    }).length;

    return {
      totalValue,
      totalItems: products.length,
      lowStockCount,
      expiringCount,
      todayTransactions: 0
    };
  },

  getProducts() {
    if (typeof App !== 'undefined' && App.data && App.data.inventory) {
      return App.data.inventory;
    }
    return [];
  },

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  },

  filterByCategory(category) {
    // Update button states
    document.querySelectorAll('[data-category]').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`)?.classList.add('active');

    // Store current filter
    this.currentCategoryFilter = category;

    // Apply filter
    const products = this.getProducts();
    const filtered = category === 'all' ? products : products.filter(p => p.category === category);

    const container = document.getElementById('productsTableContainer');
    if (container) {
      container.innerHTML = this.renderFilteredProducts(filtered);
    }
  },

  filterProducts() {
    const searchText = document.getElementById('productSearch')?.value.toLowerCase() || '';
    const categoryFilter = this.currentCategoryFilter || 'all';

    const products = this.getProducts();
    const filtered = products.filter(product => {
      const matchesSearch = !searchText ||
        product.name.toLowerCase().includes(searchText) ||
        product.sku.toLowerCase().includes(searchText);

      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });

    const container = document.getElementById('productsTableContainer');
    if (container) {
      if (filtered.length === 0) {
        container.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
                        <div>No se encontraron productos</div>
                    </div>
                `;
      } else {
        container.innerHTML = this.renderFilteredProducts(filtered);
      }
    }
  },

  renderFilteredProducts(products) {
    return `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Stock</th>
                            <th>Precio Venta</th>
                            <th>Vencimiento</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(product => `
                            <tr>
                                <td>
                                    <div style="font-weight: 600;">${product.name}</div>
                                    <div style="font-size: 0.75rem; color: var(--text-muted);">SKU: ${product.sku}</div>
                                </td>
                                <td>
                                    <span class="badge badge-info">${this.getCategoryLabel(product.category)}</span>
                                </td>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                                        <strong>${product.current_stock} ${product.unit}</strong>
                                        ${this.renderStockIndicator(product)}
                                    </div>
                                </td>
                                <td><strong>$${product.sale_price}</strong></td>
                                <td>${product.expiration_date ? this.formatDate(product.expiration_date) : '-'}</td>
                                <td>${this.renderProductStatus(product)}</td>
                                <td>
                                    <div style="display: flex; gap: 0.5rem;">
                                        <button class="btn btn-icon" onclick="Inventory.adjustStock(${product.id})" title="Ajustar Stock">📝</button>
                                        <button class="btn btn-icon" onclick="Inventory.editProduct(${product.id})" title="Editar">✏️</button>
                                        <button class="btn btn-icon" onclick="Inventory.viewHistory(${product.id})" title="Historial">📊</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
  },

  editProduct(id) {
    const product = this.getProducts().find(p => p.id === id);
    if (!product) return;

    const modalContent = `
            <div class="grid grid-2">
                <div class="form-group">
                    <label class="form-label">Nombre del Producto *</label>
                    <input type="text" class="form-input" id="editProductName" value="${product.name}">
                </div>
                <div class="form-group">
                    <label class="form-label">Categoría *</label>
                    <select class="form-input" id="editProductCategory">
                        <option value="medication" ${product.category === 'medication' ? 'selected' : ''}>💊 Medicamento</option>
                        <option value="vaccine" ${product.category === 'vaccine' ? 'selected' : ''}>💉 Vacuna</option>
                        <option value="supply" ${product.category === 'supply' ? 'selected' : ''}>🧴 Suministro</option>
                        <option value="food" ${product.category === 'food' ? 'selected' : ''}>🍖 Alimento</option>
                        <option value="accessory" ${product.category === 'accessory' ? 'selected' : ''}>🎀 Accesorio</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-2">
                <div class="form-group">
                    <label class="form-label">SKU</label>
                    <input type="text" class="form-input" id="editProductSKU" value="${product.sku}">
                </div>
                <div class="form-group">
                    <label class="form-label">Stock Actual</label>
                    <input type="number" class="form-input" id="editProductStock" value="${product.current_stock}" min="0" step="0.01">
                </div>
            </div>

            <div class="grid grid-2">
                <div class="form-group">
                    <label class="form-label">Stock Mínimo</label>
                    <input type="number" class="form-input" id="editProductMinStock" value="${product.min_stock}" min="0">
                </div>
                <div class="form-group">
                    <label class="form-label">Stock Máximo</label>
                    <input type="number" class="form-input" id="editProductMaxStock" value="${product.max_stock}" min="0">
                </div>
            </div>

            <div class="grid grid-2">
                <div class="form-group">
                    <label class="form-label">Precio de Costo</label>
                    <input type="number" class="form-input" id="editProductCostPrice" value="${product.cost_price}" min="0" step="0.01">
                </div>
                <div class="form-group">
                    <label class="form-label">Precio de Venta *</label>
                    <input type="number" class="form-input" id="editProductSalePrice" value="${product.sale_price}" min="0" step="0.01">
                </div>
            </div>

            <div class="grid grid-2">
                <div class="form-group">
                    <label class="form-label">Fecha de Vencimiento</label>
                    <input type="date" class="form-input" id="editProductExpiration" value="${product.expiration_date || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Número de Lote</label>
                    <input type="text" class="form-input" id="editProductBatch" value="${product.batch_number || ''}">
                </div>
            </div>

            <div style="display: flex; gap: 1rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-glass);">
                <button class="btn btn-primary" onclick="Inventory.updateProduct(${id})">💾 Guardar Cambios</button>
                <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
            </div>
        `;

    if (typeof App !== 'undefined') {
      App.showModal(`✏️ Editar: ${product.name}`, modalContent, 'large');
    }
  },

  updateProduct(id) {
    const updatedData = {
      id: id,
      name: document.getElementById('editProductName')?.value,
      category: document.getElementById('editProductCategory')?.value,
      sku: document.getElementById('editProductSKU')?.value,
      current_stock: parseFloat(document.getElementById('editProductStock')?.value) || 0,
      min_stock: parseFloat(document.getElementById('editProductMinStock')?.value) || 0,
      max_stock: parseFloat(document.getElementById('editProductMaxStock')?.value) || 0,
      cost_price: parseFloat(document.getElementById('editProductCostPrice')?.value) || 0,
      sale_price: parseFloat(document.getElementById('editProductSalePrice')?.value) || 0,
      expiration_date: document.getElementById('editProductExpiration')?.value || null,
      batch_number: document.getElementById('editProductBatch')?.value || null
    };

    console.log('Updating product:', updatedData);

    if (typeof App !== 'undefined') {
      App.showNotification('✅ Actualizado', `${updatedData.name} ha sido actualizado`, 'success');
      App.closeModal();
      setTimeout(() => App.loadView('inventory'), 500);
    }
  },

  viewHistory(id) {
    const product = this.getProducts().find(p => p.id === id);
    if (!product) return;

    // Mock history data
    const history = [
      { date: '2025-01-10', type: 'Entrada', quantity: '+20', reason: 'Compra a proveedor', user: 'Admin' },
      { date: '2025-01-08', type: 'Salida', quantity: '-3', reason: 'Venta - Factura INV-2025-001', user: 'Veterinario' },
      { date: '2025-01-05', type: 'Salida', quantity: '-2', reason: 'Venta - Factura INV-2025-002', user: 'Veterinario' },
      { date: '2025-01-01', type: 'Ajuste', quantity: '+5', reason: 'Inventario inicial', user: 'Admin' }
    ];

    const modalContent = `
            <div style="padding: 1rem;">
                <div style="margin-bottom: 1.5rem;">
                    <h3 style="color: var(--brand-gold);">${product.name}</h3>
                    <p style="color: var(--text-muted);">SKU: ${product.sku} | Stock actual: ${product.current_stock} ${product.unit}</p>
                </div>

                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Tipo</th>
                                <th>Cantidad</th>
                                <th>Motivo</th>
                                <th>Usuario</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${history.map(h => `
                                <tr>
                                    <td>${h.date}</td>
                                    <td><span class="badge ${h.type === 'Entrada' ? 'badge-success' : h.type === 'Salida' ? 'badge-warning' : 'badge-info'}">${h.type}</span></td>
                                    <td style="font-weight: 600; color: ${h.quantity.startsWith('+') ? 'var(--brand-green)' : '#ff6b6b'};">${h.quantity}</td>
                                    <td>${h.reason}</td>
                                    <td>${h.user}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                    <button class="btn btn-primary" onclick="Inventory.exportProductHistory(${id})">📥 Exportar Historial</button>
                    <button class="btn btn-secondary" onclick="App.closeModal()">Cerrar</button>
                </div>
            </div>
        `;

    if (typeof App !== 'undefined') {
      App.showModal(`📊 Historial de Movimientos`, modalContent, 'large');
    }
  },

  exportProductHistory(id) {
    const product = this.getProducts().find(p => p.id === id);
    const csvContent = `Fecha,Tipo,Cantidad,Motivo,Usuario
2025-01-10,Entrada,+20,Compra a proveedor,Admin
2025-01-08,Salida,-3,Venta,Veterinario
2025-01-05,Salida,-2,Venta,Veterinario
2025-01-01,Ajuste,+5,Inventario inicial,Admin`;

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Historial_${product?.sku || 'Producto'}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (typeof App !== 'undefined') {
      App.showNotification('📥 Exportado', 'Historial descargado', 'success');
    }
  },

  showLowStockAlert() {
    const products = this.getProducts();
    const lowStock = products.filter(p => p.current_stock <= p.min_stock);

    const modalContent = `
            <div style="padding: 1rem;">
                <div style="background: rgba(255, 107, 107, 0.1); border: 1px solid #ff6b6b; border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; color: #ff6b6b; font-weight: 600;">
                        ⚠️ ${lowStock.length} productos con stock bajo
                    </div>
                </div>

                ${lowStock.length > 0 ? `
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Stock Actual</th>
                                    <th>Stock Mínimo</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${lowStock.map(p => `
                                    <tr>
                                        <td><strong>${p.name}</strong></td>
                                        <td style="color: #ff6b6b; font-weight: 600;">${p.current_stock} ${p.unit}</td>
                                        <td>${p.min_stock} ${p.unit}</td>
                                        <td><button class="btn btn-primary" onclick="Inventory.adjustStock(${p.id}); App.closeModal();">Reponer</button></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : `
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                        <div>¡Excelente! No hay productos con stock bajo</div>
                    </div>
                `}

                <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                    <button class="btn btn-secondary" onclick="App.closeModal()">Cerrar</button>
                </div>
            </div>
        `;

    if (typeof App !== 'undefined') {
      App.showModal('⚠️ Alerta de Stock Bajo', modalContent, 'medium');
    }
  },

  showExpiringProducts() {
    const products = this.getProducts();
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const expiring = products.filter(p => {
      if (!p.expiration_date) return false;
      const expirationDate = new Date(p.expiration_date);
      return expirationDate <= thirtyDaysFromNow;
    });

    const modalContent = `
            <div style="padding: 1rem;">
                <div style="background: rgba(255, 145, 54, 0.1); border: 1px solid var(--brand-gold); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--brand-gold); font-weight: 600;">
                        📅 ${expiring.length} productos próximos a vencer (30 días)
                    </div>
                </div>

                ${expiring.length > 0 ? `
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Stock</th>
                                    <th>Vencimiento</th>
                                    <th>Días Restantes</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${expiring.map(p => {
      const daysLeft = Math.floor((new Date(p.expiration_date) - today) / (1000 * 60 * 60 * 24));
      return `
                                        <tr>
                                            <td><strong>${p.name}</strong></td>
                                            <td>${p.current_stock} ${p.unit}</td>
                                            <td>${this.formatDate(p.expiration_date)}</td>
                                            <td style="color: ${daysLeft < 15 ? '#ff6b6b' : 'var(--brand-gold)'}; font-weight: 600;">${daysLeft} días</td>
                                        </tr>
                                    `;
    }).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : `
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                        <div>No hay productos próximos a vencer</div>
                    </div>
                `}

                <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                    <button class="btn btn-secondary" onclick="App.closeModal()">Cerrar</button>
                </div>
            </div>
        `;

    if (typeof App !== 'undefined') {
      App.showModal('📅 Productos Próximos a Vencer', modalContent, 'medium');
    }
  },

  showPurchaseOrders() {
    const modalContent = `
            <div style="padding: 1rem;">
                <div style="margin-bottom: 1.5rem;">
                    <p style="color: var(--text-muted);">Gestiona órdenes de compra a proveedores</p>
                </div>

                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Orden #</th>
                                <th>Proveedor</th>
                                <th>Fecha</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>PO-2025-001</strong></td>
                                <td>Laboratorios Bayer</td>
                                <td>10 Ene 2025</td>
                                <td>5 productos</td>
                                <td>$2,450.00</td>
                                <td><span class="badge badge-success">Recibida</span></td>
                            </tr>
                            <tr>
                                <td><strong>PO-2025-002</strong></td>
                                <td>Hill's Pet Nutrition</td>
                                <td>08 Ene 2025</td>
                                <td>3 productos</td>
                                <td>$1,850.00</td>
                                <td><span class="badge badge-warning">En tránsito</span></td>
                            </tr>
                            <tr>
                                <td><strong>PO-2025-003</strong></td>
                                <td>Zoetis</td>
                                <td>05 Ene 2025</td>
                                <td>8 productos</td>
                                <td>$3,200.00</td>
                                <td><span class="badge badge-info">Pendiente</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="display: flex; gap: 1rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-glass);">
                    <button class="btn btn-primary" onclick="Inventory.createPurchaseOrder()">➕ Nueva Orden</button>
                    <button class="btn btn-secondary" onclick="App.closeModal()">Cerrar</button>
                </div>
            </div>
        `;

    if (typeof App !== 'undefined') {
      App.showModal('🛒 Órdenes de Compra', modalContent, 'large');
    }
  },

  createPurchaseOrder() {
    if (typeof App !== 'undefined') {
      App.showNotification('Nueva Orden', 'Creando orden de compra...', 'info');
    }
  }
};

// Auto-register module
if (typeof window !== 'undefined') {
  window.Inventory = Inventory;
}
