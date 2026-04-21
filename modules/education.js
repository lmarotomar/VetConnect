// Education Module
const Education = {
  categories: ['Todas', 'Nutrición', 'Comportamiento', 'Emergencias', 'Cuidados', 'Vacunación & Prevención'],
  species:    ['Todas las especies', 'Perro', 'Gato', 'Ave', 'Conejo', 'Reptil', 'Caballo', 'Bovino', 'Cerdo'],
  icons:      ['📋','💊','🩺','🐾','💉','🥘','🦷','🧪','❤️','⚠️','🌿','🏃','🪱','🚨','🔬','🐱','🐶','🐴'],

  selectedCategory: 'Todas',
  selectedSpecies:  'Todas las especies',
  _customContent:   [],   // loaded from Supabase
  _editingId:       null, // id being edited

  render() {
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
        <div>
          <h2 class="card-title" style="font-size:1.5rem;margin-bottom:0.25rem;">📚 Educación del Cliente</h2>
          <p style="color:var(--text-muted);">Guías y recursos para compartir con tus clientes</p>
        </div>
        <button class="btn btn-primary" onclick="Education.showContentEditor()">➕ Nueva Guía</button>
      </div>

      <!-- Filters -->
      <div class="card mb-lg">
        <div class="card-body" style="display:flex;flex-direction:column;gap:0.75rem;">
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
            <span style="color:var(--text-muted);font-size:0.8rem;min-width:60px;">Tema:</span>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;" id="categoryFilters">
              ${this.categories.map(cat => `
                <button class="btn btn-secondary ${cat === this.selectedCategory ? 'active-filter' : ''}"
                  onclick="Education.filterByCategory('${cat}')">${cat}</button>`).join('')}
            </div>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
            <span style="color:var(--text-muted);font-size:0.8rem;min-width:60px;">Especie:</span>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;" id="speciesFilters">
              ${this.species.map(sp => `
                <button class="btn btn-secondary ${sp === this.selectedSpecies ? 'active-filter' : ''}"
                  style="font-size:0.8rem;padding:0.25rem 0.75rem;"
                  onclick="Education.filterBySpecies('${sp}')">${sp}</button>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Content Library -->
      <div id="educationalContent"></div>

      <!-- Automated Protocols -->
      <div class="card mt-lg">
        <div class="card-header">
          <h3 class="card-title">🤖 Protocolos Automatizados</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-2">
            ${[
              { icon:'✅', color:'var(--accent-teal)',   title:'Post-Consulta',  sub:'Automático al completar cita',
                items:['Instrucciones de medicación','Cuidados en casa','Señales de alerta','Próximos pasos'] },
              { icon:'💉', color:'var(--accent-blue)',   title:'Vacunación',     sub:'Recordatorio automático',
                items:['Calendario de vacunación','Importancia de cada vacuna','Cuidados post-vacunación','Agendamiento fácil'] },
              { icon:'🔄', color:'var(--accent-purple)', title:'Seguimiento',    sub:'3, 7 y 30 días',
                items:['Check-in de 3 días','Evaluación de 7 días','Seguimiento de 30 días','Recopilación de feedback'] },
              { icon:'🚨', color:'var(--accent-coral)',  title:'Emergencias',    sub:'Guías rápidas',
                items:['Primeros auxilios','Cuándo acudir urgente','Qué hacer mientras llega','Números de emergencia'] }
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

  async init() {
    this.selectedCategory = 'Todas';
    this.selectedSpecies  = 'Todas las especies';
    await this._loadCustomContent();
    this.loadContent();
  },

  async _loadCustomContent() {
    try {
      this._customContent = await DB.getEducationalContent();
    } catch (e) {
      this._customContent = [];
    }
  },

  // ─── FILTERS ──────────────────────────────────────────────────────────────

  filterByCategory(category) {
    this.selectedCategory = category;
    document.querySelectorAll('#categoryFilters .btn').forEach(b =>
      b.classList.toggle('active-filter', b.textContent.trim() === category));
    this.loadContent();
  },

  filterBySpecies(species) {
    this.selectedSpecies = species;
    document.querySelectorAll('#speciesFilters .btn').forEach(b =>
      b.classList.toggle('active-filter', b.textContent.trim() === species));
    this.loadContent();
  },

  // ─── RENDER LIBRARY ───────────────────────────────────────────────────────

  loadContent() {
    const all = [...this._getBuiltinContent(), ...this._customContent];

    let filtered = all;

    if (this.selectedCategory !== 'Todas') {
      filtered = filtered.filter(c => c.category === this.selectedCategory);
    }

    if (this.selectedSpecies !== 'Todas las especies') {
      filtered = filtered.filter(c =>
        !c.species || c.species.length === 0 ||
        c.species.includes(this.selectedSpecies)
      );
    }

    const container = document.getElementById('educationalContent');
    if (!container) return;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:3rem;color:var(--text-muted);">
          <div style="font-size:3rem;margin-bottom:1rem;">📭</div>
          <div>No hay contenido para estos filtros</div>
          <button class="btn btn-primary mt-md" onclick="Education.showContentEditor()">Crear primera guía</button>
        </div>`;
      return;
    }

    // Separate custom (editable) from builtin
    const custom  = filtered.filter(c => c.organization_id !== undefined && !c._builtin);
    const builtin = filtered.filter(c => c._builtin);

    let html = '';

    if (custom.length > 0) {
      html += `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
          <h4 style="color:var(--brand-gold);margin:0;">🏥 Guías de tu clínica (${custom.length})</h4>
        </div>
        <div class="grid grid-3" style="margin-bottom:1.5rem;">
          ${custom.map(item => this._renderCard(item, true)).join('')}
        </div>`;
    }

    if (builtin.length > 0) {
      html += `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
          <h4 style="color:var(--text-muted);margin:0;">📖 Biblioteca base (${builtin.length})</h4>
        </div>
        <div class="grid grid-3">
          ${builtin.map(item => this._renderCard(item, false)).join('')}
        </div>`;
    }

    container.innerHTML = html;
  },

  _renderCard(item, editable) {
    const speciesTag = item.species?.length
      ? `<div style="font-size:0.75rem;color:var(--accent-teal);margin-top:0.25rem;">${item.species.join(', ')}</div>`
      : '';
    return `
      <div class="card" style="cursor:pointer;position:relative;" onclick="Education.showContent('${item.id}')">
        ${editable ? `
          <div style="position:absolute;top:0.5rem;right:0.5rem;display:flex;gap:0.25rem;" onclick="event.stopPropagation()">
            <button class="btn btn-icon" title="Editar" onclick="Education.showContentEditor('${item.id}')">✏️</button>
            <button class="btn btn-icon" title="Eliminar" onclick="Education.deleteContent('${item.id}')">🗑️</button>
          </div>` : ''}
        <div class="card-body">
          <div style="font-size:3rem;text-align:center;margin-bottom:1rem;">${item.icon || '📋'}</div>
          <h4 style="margin-bottom:0.5rem;">${item.title}</h4>
          <span class="badge badge-info" style="margin-bottom:0.5rem;">${item.category}</span>
          ${speciesTag}
          <p class="text-muted" style="font-size:0.875rem;margin-top:0.5rem;">${item.summary}</p>
          <button class="btn btn-secondary" style="width:100%;margin-top:1rem;">Ver Contenido</button>
        </div>
      </div>`;
  },

  // ─── VIEW ─────────────────────────────────────────────────────────────────

  showContent(id) {
    const all = [...this._getBuiltinContent(), ...this._customContent];
    const item = all.find(c => String(c.id) === String(id));
    if (!item) return;

    App.showModal(item.title, `
      <div style="font-size:4rem;text-align:center;margin-bottom:1rem;">${item.icon || '📋'}</div>
      ${item.species?.length ? `<div style="text-align:center;margin-bottom:1rem;">
        <span class="badge badge-info">${item.category}</span>
        <span style="margin-left:0.5rem;font-size:0.85rem;color:var(--accent-teal);">${item.species.join(' · ')}</span>
      </div>` : ''}
      <div style="margin-bottom:2rem;">${item.content}</div>
      <div style="display:flex;gap:1rem;">
        <button class="btn btn-primary" onclick="Education.showSendModal('${item.id}')" style="flex:1;">📤 Enviar a Cliente</button>
        <button class="btn btn-secondary" onclick="App.closeModal()">Cerrar</button>
      </div>`, { wide: true });
  },

  // ─── EDITOR ───────────────────────────────────────────────────────────────

  showContentEditor(editId = null) {
    this._editingId = editId || null;
    const all  = [...this._getBuiltinContent(), ...this._customContent];
    const item = editId ? all.find(c => String(c.id) === String(editId)) : null;

    const speciesCheckboxes = this.species
      .filter(s => s !== 'Todas las especies')
      .map(s => `
        <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;">
          <input type="checkbox" value="${s}"
            ${item?.species?.includes(s) ? 'checked' : ''}
            style="accent-color:var(--brand-green);">
          ${s}
        </label>`).join('');

    const iconOptions = this.icons.map(i =>
      `<option value="${i}" ${item?.icon === i ? 'selected' : ''}>${i}</option>`).join('');

    const catOptions = this.categories
      .filter(c => c !== 'Todas')
      .map(c => `<option value="${c}" ${item?.category === c ? 'selected' : ''}>${c}</option>`).join('');

    App.showModal(editId ? `✏️ Editar: ${item?.title}` : '➕ Nueva Guía', `
      <div class="grid grid-2">
        <div class="form-group">
          <label class="form-label">Título *</label>
          <input type="text" class="form-input" id="edTitle" value="${item?.title || ''}" placeholder="Ej: Cuidados post-operatorios">
        </div>
        <div class="form-group">
          <label class="form-label">Categoría *</label>
          <select class="form-select" id="edCategory">${catOptions}</select>
        </div>
      </div>

      <div class="grid grid-2">
        <div class="form-group">
          <label class="form-label">Ícono</label>
          <select class="form-select" id="edIcon">${iconOptions}</select>
        </div>
        <div class="form-group">
          <label class="form-label">Resumen *</label>
          <input type="text" class="form-input" id="edSummary" value="${item?.summary || ''}" placeholder="Una línea descriptiva">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Especies aplicables</label>
        <div style="display:flex;flex-wrap:wrap;gap:0.75rem;padding:0.75rem;background:var(--bg-glass);border-radius:var(--radius-sm);" id="edSpecies">
          ${speciesCheckboxes}
        </div>
        <small style="color:var(--text-muted);">Sin selección = aplica a todas las especies</small>
      </div>

      <div class="form-group">
        <label class="form-label">Contenido *</label>
        <textarea class="form-textarea" id="edContent" rows="12"
          placeholder="Escribe el contenido. Puedes usar este formato:&#10;&#10;Sección 1:&#10;- Punto A&#10;- Punto B&#10;&#10;Sección 2:&#10;- Punto C"
          style="font-family:monospace;font-size:0.85rem;">${item?.content || ''}</textarea>
      </div>

      <div style="display:flex;gap:1rem;margin-top:1.5rem;">
        <button class="btn btn-primary" style="flex:1;" onclick="Education.saveContent()">
          💾 ${editId ? 'Guardar Cambios' : 'Publicar Guía'}
        </button>
        <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      </div>`, { wide: true });
  },

  async saveContent() {
    const title    = document.getElementById('edTitle')?.value.trim();
    const category = document.getElementById('edCategory')?.value;
    const icon     = document.getElementById('edIcon')?.value;
    const summary  = document.getElementById('edSummary')?.value.trim();
    const rawContent = document.getElementById('edContent')?.value.trim();
    const species  = [...document.querySelectorAll('#edSpecies input:checked')].map(cb => cb.value);

    if (!title || !summary || !rawContent) {
      App.showNotification('Error', 'Título, resumen y contenido son obligatorios', 'error');
      return;
    }

    // Convert plain text to HTML if it looks like plain text (no tags)
    const content = rawContent.includes('<') ? rawContent : this._textToHtml(title, rawContent);

    const payload = { title, category, icon, summary, content, species };

    try {
      if (this._editingId) {
        const saved = await DB.updateEducationalContent(this._editingId, payload);
        const idx = this._customContent.findIndex(c => String(c.id) === String(this._editingId));
        if (idx !== -1) this._customContent[idx] = { ...this._customContent[idx], ...saved };
        App.showNotification('Actualizado', `"${title}" ha sido actualizado`, 'success');
      } else {
        const saved = await DB.addEducationalContent(payload);
        this._customContent.unshift(saved);
        App.showNotification('Publicado', `"${title}" agregado a ${category}`, 'success');
      }
      this._editingId = null;
      App.closeModal();
      this.loadContent();
    } catch (err) {
      App.showNotification('Error', `No se pudo guardar: ${err.message}`, 'error');
      console.error('saveContent:', err);
    }
  },

  async deleteContent(id) {
    const item = this._customContent.find(c => String(c.id) === String(id));
    if (!item) return;
    if (!confirm(`¿Eliminar "${item.title}"? Esta acción no se puede deshacer.`)) return;

    try {
      await DB.deleteEducationalContent(id);
      this._customContent = this._customContent.filter(c => String(c.id) !== String(id));
      App.showNotification('Eliminado', `"${item.title}" ha sido eliminado`, 'success');
      this.loadContent();
    } catch (err) {
      App.showNotification('Error', `No se pudo eliminar: ${err.message}`, 'error');
    }
  },

  _textToHtml(title, text) {
    return `<h3>${title}</h3>` +
      text.split('\n\n').map(block => {
        const lines = block.split('\n').filter(l => l.trim());
        if (!lines.length) return '';
        const [first, ...rest] = lines;
        if (rest.length === 0) return `<p>${first}</p>`;
        return `${first.endsWith(':') ? `<h4>${first}</h4>` : `<p>${first}</p>`}
          <ul>${rest.map(l => `<li>${l.replace(/^[-•*]\s*/, '')}</li>`).join('')}</ul>`;
      }).join('');
  },

  // ─── SEND TO CLIENT ───────────────────────────────────────────────────────

  showSendModal(id) {
    const all  = [...this._getBuiltinContent(), ...this._customContent];
    const item = all.find(c => String(c.id) === String(id));
    if (!item) return;

    const clients = App.getClients();
    if (clients.length === 0) {
      App.showNotification('Sin clientes', 'No hay clientes registrados', 'warning');
      return;
    }

    const org = window.AuthState?.organization || {};
    const hasWhatsApp = !!(org.twilio_sid && org.twilio_phone);
    const hasEmail    = !!(org.sendgrid_key && org.sender_email);

    const clientOptions = clients.map(c =>
      `<option value="${c.id}">${c.name}${c.email ? ` — ${c.email}` : ''}</option>`).join('');

    App.showModal(`📤 Enviar: ${item.title}`, `
      <div style="margin-bottom:1rem;padding:0.75rem;background:var(--bg-glass);border-radius:var(--radius-sm);">
        <strong>${item.icon} ${item.title}</strong>
        <div class="text-muted" style="font-size:0.85rem;margin-top:0.25rem;">${item.summary}</div>
      </div>

      <div class="form-group">
        <label class="form-label">Enviar a *</label>
        <select class="form-select" id="sendClient">
          <option value="">Seleccionar cliente...</option>
          ${clientOptions}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Canal</label>
        <select class="form-select" id="sendChannel">
          <option value="whatsapp" ${hasWhatsApp ? '' : 'disabled'}>📱 WhatsApp ${hasWhatsApp ? '' : '(no configurado)'}</option>
          <option value="email"    ${hasEmail    ? '' : 'disabled'}>📧 Email ${hasEmail ? '' : '(no configurado)'}</option>
          <option value="manual" selected>📝 Registro manual</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Nota personal <span class="text-muted">(opcional)</span></label>
        <textarea class="form-textarea" id="sendNote" rows="3"
          placeholder="Agrega un mensaje personalizado para el cliente..."></textarea>
      </div>

      <div style="display:flex;gap:1rem;margin-top:1.5rem;">
        <button class="btn btn-primary" style="flex:1;" onclick="Education.sendContent('${id}')">📤 Enviar</button>
        <button class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
      </div>`);
  },

  async sendContent(id) {
    const all    = [...this._getBuiltinContent(), ...this._customContent];
    const item   = all.find(c => String(c.id) === String(id));
    const clientId = document.getElementById('sendClient')?.value;
    const channel  = document.getElementById('sendChannel')?.value;
    const note     = document.getElementById('sendNote')?.value.trim();

    if (!clientId) { App.showNotification('Error', 'Selecciona un cliente', 'error'); return; }

    const client = App.getClient(clientId);
    const org    = window.AuthState?.organization || {};
    const hasIntegration = (channel === 'whatsapp' && org.twilio_sid) ||
                           (channel === 'email' && org.sendgrid_key);

    const content = [
      note ? `${note}\n\n` : '',
      `📚 *${item.title}*\n${item.summary}\n\n`,
      `Para más información, contacta a tu veterinario.`
    ].join('');

    await App.addCommunication({
      clientId, channel: channel === 'manual' ? 'manual' : channel,
      type: 'educational_content', content,
      status: hasIntegration ? 'sent' : 'pending'
    });

    App.closeModal();
    App.showNotification(
      hasIntegration ? 'Contenido enviado' : 'Contenido registrado',
      `"${item.title}" → ${client?.name}`,
      hasIntegration ? 'success' : 'info'
    );
  },

  // ─── BUILTIN LIBRARY ──────────────────────────────────────────────────────

  _getBuiltinContent() {
    return [
      {
        id: 'b1', _builtin: true, icon: '💉', category: 'Vacunación & Prevención',
        species: ['Perro', 'Gato'],
        title: 'Cuidados Post-Vacunación',
        summary: 'Qué esperar y cómo cuidar a tu mascota después de la vacunación.',
        content: `<h3>Cuidados Post-Vacunación</h3>
          <p>Es normal que tu mascota presente síntomas leves después de la vacunación.</p>
          <h4>Síntomas Normales:</h4>
          <ul><li>Ligera inflamación en el sitio de inyección</li><li>Menor apetito por 24 horas</li>
          <li>Somnolencia</li><li>Fiebre leve</li></ul>
          <h4>Cuidados Recomendados:</h4>
          <ul><li>Reposo 24-48 horas</li><li>Acceso constante a agua fresca</li>
          <li>Evita ejercicio intenso</li></ul>
          <h4>Cuándo Contactar al Veterinario:</h4>
          <ul><li>Vómitos persistentes</li><li>Dificultad para respirar</li>
          <li>Hinchazón facial severa</li><li>Letargo extremo por más de 48 horas</li></ul>`
      },
      {
        id: 'b2', _builtin: true, icon: '🥘', category: 'Nutrición',
        species: ['Perro'],
        title: 'Alimentación Saludable para Perros',
        summary: 'Nutrición canina: componentes esenciales, frecuencia y alimentos prohibidos.',
        content: `<h3>Alimentación Saludable para Perros</h3>
          <p>Una dieta balanceada es fundamental para la salud y longevidad de tu perro.</p>
          <h4>Componentes Esenciales:</h4>
          <ul><li><strong>Proteínas:</strong> 25-30% (carne, pescado, huevos)</li>
          <li><strong>Grasas:</strong> 15-20% (omega-3 y omega-6)</li>
          <li><strong>Carbohidratos:</strong> Arroz, avena, batata en moderación</li></ul>
          <h4>Frecuencia según Edad:</h4>
          <ul><li><strong>Cachorros:</strong> 3-4 comidas al día</li>
          <li><strong>Adultos:</strong> 2 comidas al día</li>
          <li><strong>Seniors:</strong> Alimento senior con menos calorías</li></ul>
          <h4>Alimentos Prohibidos:</h4>
          <ul><li>❌ Chocolate y cafeína</li><li>❌ Uvas y pasas</li>
          <li>❌ Cebolla y ajo</li><li>❌ Aguacate</li></ul>`
      },
      {
        id: 'b3', _builtin: true, icon: '🐱', category: 'Comportamiento',
        species: ['Gato'],
        title: 'Señales de Estrés en Gatos',
        summary: 'Cómo identificar cuando tu gato está estresado y cómo ayudarlo.',
        content: `<h3>Señales de Estrés en Gatos</h3>
          <p>Los gatos son maestros en ocultar el estrés. Detecta las señales tempranas.</p>
          <h4>Señales Físicas:</h4>
          <ul><li>Pupilas dilatadas constantemente</li><li>Orejas hacia atrás o aplanadas</li>
          <li>Cola erizada</li><li>Acicalamiento excesivo</li></ul>
          <h4>Cambios de Comportamiento:</h4>
          <ul><li>Esconderse más de lo normal</li><li>Agresividad repentina</li>
          <li>Pérdida de apetito</li><li>Necesidades fuera del arenero</li></ul>
          <h4>Cómo Ayudar:</h4>
          <ul><li>Mantener rutinas constantes</li><li>Proporcionar escondites seguros</li>
          <li>Usar feromonas calmantes</li><li>Respetar su espacio personal</li></ul>`
      },
      {
        id: 'b4', _builtin: true, icon: '🚨', category: 'Emergencias',
        species: [],
        title: 'Primeros Auxilios para Mascotas',
        summary: 'Guía esencial que todo dueño de mascota debe conocer.',
        content: `<h3>Primeros Auxilios para Mascotas</h3>
          <p>En emergencias, tu acción rápida puede salvar la vida de tu mascota.</p>
          <h4>Situaciones de Emergencia:</h4>
          <ul><li><strong>Asfixia:</strong> Golpes firmes en espalda, maniobra de Heimlich</li>
          <li><strong>Hemorragia:</strong> Presión directa con gasa limpia</li>
          <li><strong>Fracturas:</strong> NO mover el área, inmovilizar si es seguro</li>
          <li><strong>Envenenamiento:</strong> Llamar al VET inmediatamente</li></ul>
          <h4>⚠️ SIEMPRE Contactar al Veterinario en:</h4>
          <ul><li>Dificultad para respirar</li><li>Sangrado que no para</li>
          <li>Pérdida de consciencia</li><li>Convulsiones</li><li>Trauma severo</li></ul>`
      },
      {
        id: 'b5', _builtin: true, icon: '🪱', category: 'Vacunación & Prevención',
        species: [],
        title: 'Prevención de Parásitos',
        summary: 'Guía completa para proteger a tu mascota de parásitos internos y externos durante todo el año.',
        content: `
          <h3>Prevención de Parásitos</h3>
          <p>La prevención es más segura, más efectiva y más económica que el tratamiento. Un programa antiparasitario constante protege a tu mascota — y a toda tu familia.</p>

          <h4>🦟 Parásitos Externos</h4>
          <ul>
            <li><strong>Pulgas:</strong> Se reproducen cada 21 días. Una sola pulga puede poner hasta 50 huevos diarios. Usa pipetas spot-on mensuales, collares de larga duración o tabletas masticables. Trata también el ambiente.</li>
            <li><strong>Garrapatas:</strong> Transmiten ehrlichiosis, babesiosis y enfermedad de Lyme. Revisa orejas, axilas, entre los dedos y alrededor del collar tras cada paseo.</li>
            <li><strong>Ácaros:</strong> La sarna sarcóptica puede contagiarse al humano. Los ácaros del oído producen secreción oscura y rascado. Requieren tratamiento veterinario específico.</li>
            <li><strong>Piojos:</strong> Poco frecuentes, se transmiten por contacto directo. Tratamiento con baños antiparasitarios.</li>
          </ul>

          <h4>🪱 Parásitos Internos</h4>
          <ul>
            <li><strong>Lombriz redonda (Toxocara):</strong> Muy común en cachorros, puede transmitirse al humano. Desparasitación obligatoria desde las 2 semanas de edad.</li>
            <li><strong>Tenias (Dipylidium):</strong> Se transmiten por ingesta de pulgas infectadas. Se observan segmentos blancos en heces o alrededor del ano.</li>
            <li><strong>Giardia:</strong> Protozoo que causa diarrea crónica. Frecuente en cachorros y animales con acceso a zonas húmedas.</li>
            <li><strong>Gusano del corazón (Dirofilaria):</strong> Transmitido por mosquitos. Afecta corazón y pulmones. Puede ser fatal. Prevención mensual obligatoria en zonas de riesgo.</li>
            <li><strong>Anquilostomas y trichuros:</strong> Causan anemia, diarrea con sangre y pérdida de peso.</li>
          </ul>

          <h4>📅 Cronograma de Desparasitación</h4>
          <ul>
            <li><strong>Cachorros/gatitos:</strong> Inicio a las 2 semanas, repetir cada 2 semanas hasta 3 meses, luego mensual hasta los 6 meses</li>
            <li><strong>Adultos:</strong> Interna cada 3 meses; externa mensual o según producto</li>
            <li><strong>Seniors (7+):</strong> Control cada 2-3 meses con examen de heces anual</li>
            <li><strong>Preventivo de filaria:</strong> Mensual todo el año en zonas endémicas</li>
          </ul>

          <h4>🔬 Señales de Alerta</h4>
          <ul>
            <li>Rascado o mordisqueo excesivo</li>
            <li>Pelaje opaco o zonas sin pelo</li>
            <li>Diarrea crónica o heces con sangre</li>
            <li>Vómitos con presencia de parásitos</li>
            <li>Pérdida de peso a pesar de comer bien</li>
            <li>Abdomen distendido (especialmente cachorros)</li>
            <li>Tos seca persistente (posible filaria)</li>
            <li>Arrastre del trasero en el suelo (tenias)</li>
          </ul>

          <h4>🏠 Prevención en el Hogar</h4>
          <ul>
            <li>Lavar regularmente la cama, mantas y juguetes</li>
            <li>Aspirar frecuentemente alfombras y tapetes</li>
            <li>Recoger heces del jardín diariamente</li>
            <li>Evitar que beba agua de charcos o ríos</li>
            <li>Controlar pulgas en todos los animales del hogar simultáneamente</li>
          </ul>

          <p style="margin-top:1rem;padding:0.75rem;background:rgba(64,224,208,0.1);border-left:3px solid var(--accent-teal);border-radius:4px;">
            <strong>Recuerda:</strong> Consulta a tu veterinario para el programa antiparasitario más adecuado según especie, edad, peso, estilo de vida y zona geográfica.
          </p>`
      },
      {
        id: 'b6', _builtin: true, icon: '🦷', category: 'Cuidados',
        species: ['Perro', 'Gato'],
        title: 'Cuidado Dental',
        summary: 'Higiene dental: por qué es importante y cómo mantener los dientes saludables.',
        content: `<h3>Cuidado Dental en Mascotas</h3>
          <p>El 80% de perros y gatos mayores de 3 años tienen enfermedad periodontal.</p>
          <h4>¿Por qué es Importante?</h4>
          <ul><li>Previene dolor y pérdida de dientes</li><li>Evita infecciones que afectan órganos vitales</li>
          <li>Mejora calidad de vida</li><li>Elimina mal aliento</li></ul>
          <h4>Rutina de Cuidado Dental:</h4>
          <ul><li><strong>Cepillado:</strong> Idealmente diario, mínimo 3 veces/semana</li>
          <li><strong>Pasta dental:</strong> SOLO para mascotas</li>
          <li><strong>Juguetes dentales:</strong> Ayudan a remover placa</li></ul>
          <h4>Señales de Problemas Dentales:</h4>
          <ul><li>Mal aliento persistente</li><li>Encías rojas o sangrantes</li>
          <li>Dificultad para comer</li><li>Dientes flojos o rotos</li></ul>`
      }
    ];
  }
};

if (typeof window !== 'undefined') window.Education = Education;
