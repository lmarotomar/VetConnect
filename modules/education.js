// Education Module
const Education = {
  categories: ['Todas', 'Nutrición', 'Comportamiento', 'Emergencias', 'Cuidados', 'Vacunación & Prevención'],
  selectedCategory: 'Todas',
  _customContent: [], // content added this session

  render() {
    return `
      <!-- Header actions -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
        <div>
          <h2 class="card-title" style="font-size:1.5rem;margin-bottom:0.25rem;">📚 Educación del Cliente</h2>
          <p style="color:var(--text-muted);">Guías y recursos para compartir con tus clientes</p>
        </div>
        <button class="btn btn-primary" onclick="Education.showNewContentModal()">➕ Nueva Guía</button>
      </div>

      <!-- Category Filters -->
      <div class="card mb-lg">
        <div class="card-body">
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;" id="categoryFilters">
            ${this.categories.map(cat => `
              <button class="btn btn-secondary ${cat === this.selectedCategory ? 'active-filter' : ''}"
                onclick="Education.filterByCategory('${cat}')">${cat}
              </button>`).join('')}
          </div>
        </div>
      </div>

      <!-- Educational Content Library -->
      <div id="educationalContent"></div>

      <!-- Automated Protocols -->
      <div class="card mt-lg">
        <div class="card-header">
          <h3 class="card-title">🤖 Protocolos Automatizados</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-2">
            ${[
              { icon: '✅', color: 'var(--accent-teal)',   title: 'Post-Consulta',  sub: 'Automático al completar cita',
                items: ['Instrucciones de medicación','Cuidados en casa','Señales de alerta','Próximos pasos'] },
              { icon: '💉', color: 'var(--accent-blue)',   title: 'Vacunación',     sub: 'Recordatorio automático',
                items: ['Calendario de vacunación','Importancia de cada vacuna','Cuidados post-vacunación','Agendamiento fácil'] },
              { icon: '🔄', color: 'var(--accent-purple)', title: 'Seguimiento',   sub: '3, 7 y 30 días',
                items: ['Check-in de 3 días','Evaluación de 7 días','Seguimiento de 30 días','Recopilación de feedback'] },
              { icon: '🚨', color: 'var(--accent-coral)',  title: 'Emergencias',   sub: 'Guías rápidas',
                items: ['Primeros auxilios','Cuándo acudir urgente','Qué hacer mientras llega','Números de emergencia'] }
            ].map(p => `
              <div style="padding:1.5rem;background:var(--bg-glass);border-radius:var(--radius-md);border-left:3px solid ${p.color};">
                <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
                  <span style="font-size:2rem;">${p.icon}</span>
                  <div><strong>${p.title}</strong>
                    <div class="text-muted" style="font-size:0.875rem;">${p.sub}</div>
                  </div>
                </div>
                <ul style="font-size:0.875rem;color:var(--text-muted);">
                  ${p.items.map(i => `<li>${i}</li>`).join('')}
                </ul>
              </div>`).join('')}
          </div>
        </div>
      </div>
    `;
  },

  init() {
    this.loadContent();
  },

  filterByCategory(category) {
    this.selectedCategory = category;
    // Update button styles
    document.querySelectorAll('#categoryFilters .btn').forEach(btn => {
      btn.classList.toggle('active-filter', btn.textContent.trim() === category);
    });
    this.loadContent();
  },

  loadContent() {
    const all = [...this.getEducationalContent(), ...this._customContent];
    const filtered = this.selectedCategory === 'Todas'
      ? all
      : all.filter(c => c.category === this.selectedCategory);

    const container = document.getElementById('educationalContent');
    if (!container) return;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:3rem;color:var(--text-muted);">
          <div style="font-size:3rem;margin-bottom:1rem;">📭</div>
          <div>No hay contenido en esta categoría</div>
          <button class="btn btn-primary mt-md" onclick="Education.showNewContentModal()">Crear primera guía</button>
        </div>`;
      return;
    }

    container.innerHTML = `<div class="grid grid-3">${filtered.map(item => this.renderContentCard(item)).join('')}</div>`;
  },

  renderContentCard(item) {
    return `
      <div class="card" style="cursor:pointer;" onclick="Education.showContent(${item.id})">
        <div class="card-body">
          <div style="font-size:3rem;text-align:center;margin-bottom:1rem;">${item.icon}</div>
          <h4 style="margin-bottom:0.5rem;">${item.title}</h4>
          <span class="badge badge-info" style="margin-bottom:1rem;">${item.category}</span>
          <p class="text-muted" style="font-size:0.875rem;">${item.summary}</p>
          <button class="btn btn-secondary" style="width:100%;margin-top:1rem;">Ver Contenido</button>
        </div>
      </div>`;
  },

  showContent(id) {
    const all = [...this.getEducationalContent(), ...this._customContent];
    const item = all.find(c => c.id === id);
    if (!item) return;

    const modalContent = `
      <div style="font-size:4rem;text-align:center;margin-bottom:1rem;">${item.icon}</div>
      <div style="margin-bottom:2rem;">${item.content}</div>
      <div style="display:flex;gap:1rem;">
        <button class="btn btn-primary" onclick="Education.showSendModal(${item.id})" style="flex:1;">
          📤 Enviar a Cliente
        </button>
        <button class="btn btn-secondary" onclick="App.closeModal()">Cerrar</button>
      </div>`;

    App.showModal(item.title, modalContent, { wide: true });
  },

  // ─── ENVIAR A CLIENTE ─────────────────────────────────────────────────────

  showSendModal(contentId) {
    const all = [...this.getEducationalContent(), ...this._customContent];
    const item = all.find(c => c.id === contentId);
    if (!item) return;

    const clients = App.getClients();
    if (clients.length === 0) {
      App.showNotification('Sin clientes', 'No hay clientes registrados', 'warning');
      return;
    }

    const clientOptions = clients.map(c =>
      `<option value="${c.id}">${c.name}${c.email ? ` — ${c.email}` : ''}</option>`
    ).join('');

    const org = window.AuthState?.organization || {};
    const hasWhatsApp = !!(org.twilio_sid && org.twilio_phone);
    const hasEmail    = !!(org.sendgrid_key && org.sender_email);

    const modalContent = `
      <div style="margin-bottom:1rem;padding:0.75rem;background:var(--bg-glass);border-radius:var(--radius-sm);">
        <strong>${item.icon} ${item.title}</strong>
        <div class="text-muted" style="font-size:0.85rem;margin-top:0.25rem;">${item.summary}</div>
      </div>

      <div class="form-group">
        <label class="form-label">Enviar a</label>
        <select class="form-select" id="sendContentClient">
          <option value="">Seleccionar cliente...</option>
          ${clientOptions}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Canal</label>
        <select class="form-select" id="sendContentChannel">
          <option value="whatsapp" ${hasWhatsApp ? '' : 'disabled'}>📱 WhatsApp ${hasWhatsApp ? '' : '(no configurado)'}</option>
          <option value="email"    ${hasEmail    ? '' : 'disabled'}>📧 Email ${hasEmail ? '' : '(no configurado)'}</option>
          <option value="manual" selected>📝 Registro manual</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Mensaje personalizado <span class="text-muted">(opcional)</span></label>
        <textarea class="form-textarea" id="sendContentMessage" rows="3"
          placeholder="Agrega una nota personal para el cliente..."></textarea>
      </div>

      <div style="display:flex;gap:1rem;margin-top:1.5rem;">
        <button class="btn btn-primary" style="flex:1;" onclick="Education.sendContent(${contentId})">
          📤 Enviar
        </button>
        <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      </div>`;

    App.showModal(`📤 Enviar: ${item.title}`, modalContent);
  },

  async sendContent(contentId) {
    const all = [...this.getEducationalContent(), ...this._customContent];
    const item = all.find(c => c.id === contentId);
    const clientId = document.getElementById('sendContentClient')?.value;
    const channel  = document.getElementById('sendContentChannel')?.value;
    const note     = document.getElementById('sendContentMessage')?.value.trim();

    if (!clientId) {
      App.showNotification('Error', 'Selecciona un cliente', 'error');
      return;
    }

    const client = App.getClient(clientId);
    const org    = window.AuthState?.organization || {};
    const hasIntegration = (channel === 'whatsapp' && org.twilio_sid) ||
                           (channel === 'email' && org.sendgrid_key);

    const content = [
      note ? `${note}\n\n` : '',
      `📚 *${item.title}*\n`,
      `${item.summary}\n\n`,
      `Para más información, contacta a tu veterinario.`
    ].join('');

    await App.addCommunication({
      clientId,
      channel: channel === 'manual' ? 'manual' : channel,
      type:    'educational_content',
      content,
      status:  hasIntegration ? 'sent' : 'pending'
    });

    App.closeModal();
    App.showNotification(
      hasIntegration ? 'Contenido enviado' : 'Contenido registrado',
      `"${item.title}" → ${client?.name || 'cliente'}`,
      hasIntegration ? 'success' : 'info'
    );
  },

  // ─── CREAR CONTENIDO ──────────────────────────────────────────────────────

  showNewContentModal() {
    const modalContent = `
      <div class="grid grid-2">
        <div class="form-group">
          <label class="form-label">Título *</label>
          <input type="text" class="form-input" id="newContentTitle" placeholder="Ej: Cuidados post-operatorios">
        </div>
        <div class="form-group">
          <label class="form-label">Categoría *</label>
          <select class="form-select" id="newContentCategory">
            ${this.categories.filter(c => c !== 'Todas').map(c =>
              `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="grid grid-2">
        <div class="form-group">
          <label class="form-label">Ícono</label>
          <select class="form-select" id="newContentIcon">
            ${['📋','💊','🩺','🐾','💉','🥘','🦷','🧪','❤️','⚠️','🌿','🏃'].map(i =>
              `<option value="${i}">${i}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Resumen *</label>
          <input type="text" class="form-input" id="newContentSummary" placeholder="Una línea descriptiva">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Contenido *</label>
        <textarea class="form-textarea" id="newContentBody" rows="10"
          placeholder="Escribe el contenido completo de la guía. Puedes usar formato básico:&#10;&#10;Sección 1:&#10;- Punto 1&#10;- Punto 2&#10;&#10;Sección 2:&#10;- Punto A"></textarea>
      </div>

      <div style="display:flex;gap:1rem;margin-top:1.5rem;">
        <button class="btn btn-primary" style="flex:1;" onclick="Education.saveNewContent()">💾 Guardar Guía</button>
        <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      </div>`;

    App.showModal('➕ Nueva Guía Educativa', modalContent, { wide: true });
  },

  saveNewContent() {
    const title    = document.getElementById('newContentTitle')?.value.trim();
    const category = document.getElementById('newContentCategory')?.value;
    const icon     = document.getElementById('newContentIcon')?.value;
    const summary  = document.getElementById('newContentSummary')?.value.trim();
    const body     = document.getElementById('newContentBody')?.value.trim();

    if (!title || !summary || !body) {
      App.showNotification('Error', 'Título, resumen y contenido son obligatorios', 'error');
      return;
    }

    // Convert plain text to basic HTML
    const htmlContent = `<h3>${title}</h3>` +
      body.split('\n\n').map(block => {
        const lines = block.split('\n');
        if (lines.length === 1) return `<p>${lines[0]}</p>`;
        const [header, ...items] = lines;
        const isHeader = header.endsWith(':');
        return `${isHeader ? `<h4>${header}</h4>` : `<p>${header}</p>`}
          <ul>${items.filter(l => l.trim()).map(l =>
            `<li>${l.replace(/^[-•]\s*/, '')}</li>`).join('')}</ul>`;
      }).join('');

    const newItem = {
      id:       Date.now(),
      title,
      category,
      icon,
      summary,
      content:  htmlContent
    };

    this._customContent.push(newItem);
    App.closeModal();
    App.showNotification('Guía creada', `"${title}" agregada a ${category}`, 'success');
    this.filterByCategory(category); // navigate to new content's category
  },

  // ─── CONTENT LIBRARY ──────────────────────────────────────────────────────

  getEducationalContent() {
    return [
      {
        id: 1, icon: '💉', category: 'Vacunación & Prevención',
        title: 'Cuidados Post-Vacunación',
        summary: 'Guía completa sobre qué esperar y cómo cuidar a tu mascota después de la vacunación.',
        content: `<h3>Cuidados Post-Vacunación</h3>
          <p>Es normal que tu mascota presente algunos síntomas leves después de la vacunación.</p>
          <h4>Síntomas Normales:</h4>
          <ul><li>Ligera inflamación en el sitio de inyección</li><li>Menor apetito por 24 horas</li>
          <li>Somnolencia</li><li>Fiebre leve</li></ul>
          <h4>Cuidados Recomendados:</h4>
          <ul><li>Mantén a tu mascota en reposo por 24-48 horas</li><li>Asegura acceso constante a agua fresca</li>
          <li>Evita ejercicio intenso</li><li>Observa el sitio de inyección</li></ul>
          <h4>Cuándo Contactar al Veterinario:</h4>
          <ul><li>Vómitos persistentes</li><li>Dificultad para respirar</li>
          <li>Hinchazón facial severa</li><li>Letargo extremo por más de 48 horas</li></ul>`
      },
      {
        id: 2, icon: '🥘', category: 'Nutrición',
        title: 'Alimentación Saludable para Perros',
        summary: 'Todo lo que necesitas saber sobre la nutrición canina y cómo mantener a tu perro saludable.',
        content: `<h3>Alimentación Saludable para Perros</h3>
          <p>Una dieta balanceada es fundamental para la salud, energía y longevidad de tu perro.</p>
          <h4>Componentes Esenciales:</h4>
          <ul><li><strong>Proteínas:</strong> 25-30% de la dieta</li><li><strong>Grasas:</strong> 15-20%</li>
          <li><strong>Carbohidratos:</strong> Arroz, avena, batata en moderación</li></ul>
          <h4>Alimentos Prohibidos:</h4>
          <ul><li>❌ Chocolate y cafeína</li><li>❌ Uvas y pasas</li>
          <li>❌ Cebolla y ajo</li><li>❌ Aguacate</li></ul>`
      },
      {
        id: 3, icon: '🐱', category: 'Comportamiento',
        title: 'Señales de Estrés en Gatos',
        summary: 'Aprende a identificar cuando tu gato está estresado y cómo ayudarlo.',
        content: `<h3>Señales de Estrés en Gatos</h3>
          <p>Los gatos son maestros en ocultar el estrés. Aprende a detectar las señales tempranas.</p>
          <h4>Señales Físicas:</h4>
          <ul><li>Pupilas dilatadas constantemente</li><li>Orejas hacia atrás o aplanadas</li>
          <li>Cola erizada o movimiento rápido</li><li>Acicalamiento excesivo</li></ul>
          <h4>Cómo Ayudar:</h4>
          <ul><li>Mantener rutinas constantes</li><li>Proporcionar escondites seguros</li>
          <li>Usar feromonas calmantes</li><li>Respetar su espacio personal</li></ul>`
      },
      {
        id: 4, icon: '🚨', category: 'Emergencias',
        title: 'Primeros Auxilios para Mascotas',
        summary: 'Guía esencial de primeros auxilios que todo dueño de mascota debe conocer.',
        content: `<h3>Primeros Auxilios para Mascotas</h3>
          <p>En emergencias, tu acción rápida puede salvar la vida de tu mascota.</p>
          <h4>Situaciones de Emergencia:</h4>
          <ul><li><strong>Asfixia:</strong> Golpes firmes en espalda, maniobra de Heimlich</li>
          <li><strong>Hemorragia:</strong> Presión directa con gasa limpia</li>
          <li><strong>Envenenamiento:</strong> Llamar al VET inmediatamente</li></ul>
          <h4>⚠️ SIEMPRE Contactar al Veterinario en:</h4>
          <ul><li>Dificultad para respirar</li><li>Sangrado que no para</li>
          <li>Pérdida de consciencia</li><li>Convulsiones</li></ul>`
      },
      {
        id: 5, icon: '🪱', category: 'Vacunación & Prevención',
        title: 'Prevención de Parásitos',
        summary: 'Cómo proteger a tu mascota de parásitos internos y externos.',
        content: `<h3>Prevención de Parásitos</h3>
          <p>La prevención es más fácil y económica que el tratamiento.</p>
          <h4>Parásitos Externos:</h4>
          <ul><li><strong>Pulgas:</strong> Pipetas mensuales, collares antiparasitarios</li>
          <li><strong>Garrapatas:</strong> Revisión post-paseo</li></ul>
          <h4>Cronograma de Desparasitación:</h4>
          <ul><li>Cachorros: Cada 2-4 semanas hasta 6 meses</li>
          <li>Adultos: Cada 3-6 meses</li><li>Preventivo de filaria: Mensual</li></ul>`
      },
      {
        id: 6, icon: '🦷', category: 'Cuidados',
        title: 'Cuidado Dental',
        summary: 'Importancia de la higiene dental y cómo mantener los dientes de tu mascota saludables.',
        content: `<h3>Cuidado Dental en Mascotas</h3>
          <p>El 80% de perros y gatos mayores de 3 años tienen enfermedad periodontal.</p>
          <h4>Rutina de Cuidado Dental:</h4>
          <ul><li><strong>Cepillado:</strong> Idealmente diario, mínimo 3 veces/semana</li>
          <li><strong>Pasta dental:</strong> SOLO para mascotas</li>
          <li><strong>Juguetes dentales:</strong> Ayudan a remover placa</li></ul>
          <h4>Señales de Problemas Dentales:</h4>
          <ul><li>Mal aliento persistente</li><li>Encías rojas o sangrantes</li>
          <li>Dificultad para comer</li></ul>`
      }
    ];
  }
};

if (typeof window !== 'undefined') window.Education = Education;
