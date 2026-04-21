// Clinical Records / Patients Module
const ClinicalRecords = {
    selectedPet: null,
    selectedClient: null,

    render() {
        return `
      <!-- Search & Patient Selection -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">🐾 Buscar Paciente</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-2">
            <div class="form-group" style="margin:0;">
              <input type="text" class="form-input" id="patientSearch"
                placeholder="Buscar por nombre de mascota o dueño..."
                oninput="ClinicalRecords.filterPatients(this.value)">
            </div>
            <div class="form-group" style="margin:0;">
              <select class="form-select" id="patientSelect"
                onchange="ClinicalRecords.selectPet(this.value)">
                <option value="">Seleccionar paciente...</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Patient Profile (hidden until selected) -->
      <div id="patientProfile"></div>

      <!-- Clinical History + Vaccinations (hidden until selected) -->
      <div id="clinicalContent"></div>
    `;
    },

    init() {
        this.renderPatientList();
    },

    // Build the dropdown from App.data.clients
    renderPatientList(filter = '') {
        const select = document.getElementById('patientSelect');
        if (!select) return;

        const clients = App.getClients();
        const lc = filter.toLowerCase();
        let options = '<option value="">Seleccionar paciente...</option>';

        clients.forEach(client => {
            const pets = client.pets || client.patients || [];
            pets.forEach(pet => {
                const label = `${pet.name} (${pet.species || ''}) — ${client.name}`;
                if (!lc || label.toLowerCase().includes(lc)) {
                    // Use '||' as separator — safe with UUIDs
                    options += `<option value="${client.id}||${pet.id}">${label}</option>`;
                }
            });
        });

        select.innerHTML = options;
    },

    filterPatients(value) {
        this.renderPatientList(value);
    },

    selectPet(value) {
        if (!value) {
            document.getElementById('patientProfile').innerHTML = '';
            document.getElementById('clinicalContent').innerHTML = '';
            this.selectedPet = null;
            this.selectedClient = null;
            return;
        }

        const [clientId, petId] = value.split('||');
        const client = App.getClient(clientId);
        if (!client) return;

        const pets = client.pets || client.patients || [];
        const pet = pets.find(p => String(p.id) === String(petId));
        if (!pet) return;

        this.selectedClient = client;
        this.selectedPet = { ...pet, clientId, client };

        this.renderPatientProfile();
        this.renderClinicalSection();
    },

    // ─── PATIENT PROFILE ─────────────────────────────────────────

    renderPatientProfile() {
        const pet = this.selectedPet;
        const client = this.selectedClient;

        const speciesIcon = {
            'Perro': '🐕', 'Dog': '🐕',
            'Gato': '🐱', 'Cat': '🐱',
            'Ave': '🦜', 'Bird': '🦜',
            'Conejo': '🐇', 'Rabbit': '🐇',
            'Reptil': '🦎'
        }[pet.species] || '🐾';

        document.getElementById('patientProfile').innerHTML = `
      <div class="card mt-lg">
        <div class="card-header">
          <h3 class="card-title">${speciesIcon} Perfil del Paciente</h3>
          <button class="btn btn-secondary btn-sm"
            onclick="ClinicalRecords.showEditPetModal()">✏️ Editar</button>
        </div>
        <div class="card-body">
          <div class="grid grid-4">
            <div>
              <div class="form-label">Nombre</div>
              <div style="font-size:1.25rem;font-weight:600;">${pet.name}</div>
            </div>
            <div>
              <div class="form-label">Especie</div>
              <div>${pet.species || '—'}</div>
            </div>
            <div>
              <div class="form-label">Raza</div>
              <div>${pet.breed || '—'}</div>
            </div>
            <div>
              <div class="form-label">Edad</div>
              <div>${pet.age != null ? pet.age + ' años' : '—'}</div>
            </div>
          </div>

          <div class="grid grid-4 mt-md">
            <div>
              <div class="form-label">Sexo</div>
              <div>${pet.gender || '—'}</div>
            </div>
            <div>
              <div class="form-label">Peso</div>
              <div>${pet.weight != null ? pet.weight + ' kg' : '—'}</div>
            </div>
            <div>
              <div class="form-label">Microchip</div>
              <div style="font-size:0.85rem;">${pet.microchip || '—'}</div>
            </div>
            <div>
              <div class="form-label">ID</div>
              <div style="font-size:0.75rem;color:var(--text-muted);">${String(pet.id).slice(0,8)}…</div>
            </div>
          </div>

          <div class="mt-md">
            <div class="form-label">Propietario</div>
            <div style="padding:1rem;background:var(--bg-glass);border-radius:var(--radius-md);">
              <strong>${client.name}</strong>
              <span class="text-muted" style="margin-left:1rem;">${client.email || ''}</span>
              <span class="text-muted" style="margin-left:1rem;">${client.phone || ''}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    },

    // ─── CLINICAL SECTION ─────────────────────────────────────────

    renderClinicalSection() {
        const records = App.getClinicalRecords(this.selectedPet.id);

        document.getElementById('clinicalContent').innerHTML = `
      <div class="grid grid-2 mt-lg" style="align-items:start;">

        <!-- Historia Clínica -->
        <div class="card" style="grid-column: 1 / -1;">
          <div class="card-header">
            <h3 class="card-title">📋 Historia Clínica</h3>
            <button class="btn btn-primary btn-sm"
              onclick="ClinicalRecords.showNewRecordForm()">
              ➕ Nueva Nota
            </button>
          </div>
          <div class="card-body" id="clinicalHistoryBody">
            ${records.length === 0
                ? '<p class="text-muted text-center" style="padding:2rem;">Sin registros clínicos aún</p>'
                : this.renderRecords(records)
            }
          </div>
        </div>

        <!-- Vacunas -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">💉 Vacunaciones</h3>
          </div>
          <div class="card-body">
            <p class="text-muted" style="font-size:0.85rem;margin-bottom:1rem;">
              Módulo disponible en v2 — historial de vacunas con fechas y recordatorios automáticos.
            </p>
            <button class="btn btn-secondary" style="width:100%;opacity:0.5;" disabled>
              Próximamente
            </button>
          </div>
        </div>

        <!-- Desparasitaciones -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">🪱 Desparasitaciones</h3>
          </div>
          <div class="card-body">
            <p class="text-muted" style="font-size:0.85rem;margin-bottom:1rem;">
              Módulo disponible en v2 — control de desparasitaciones internas y externas.
            </p>
            <button class="btn btn-secondary" style="width:100%;opacity:0.5;" disabled>
              Próximamente
            </button>
          </div>
        </div>

      </div>
    `;
    },

    renderRecords(records) {
        return records.map(r => {
            const date = r.record_date || r.created_at || r.createdAt;
            const dateStr = date ? new Date(date).toLocaleDateString('es-ES', {
                day: '2-digit', month: 'short', year: 'numeric'
            }) : '—';

            return `
        <div style="padding:1.25rem;border-left:3px solid var(--accent-purple);
          background:var(--bg-glass);border-radius:var(--radius-md);margin-bottom:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
            <div>
              <span style="font-weight:600;">${r.chief_complaint || r.reason || 'Consulta'}</span>
              <span class="text-muted" style="margin-left:1rem;font-size:0.85rem;">${dateStr}</span>
            </div>
          </div>
          ${r.diagnosis ? `<div class="mt-sm"><span class="form-label">Diagnóstico: </span>${r.diagnosis}</div>` : ''}
          ${r.treatment ? `<div class="mt-sm"><span class="form-label">Tratamiento: </span>${r.treatment}</div>` : ''}
          ${r.notes ? `<div class="mt-sm text-muted" style="font-size:0.85rem;">${r.notes}</div>` : ''}
        </div>
      `;
        }).join('');
    },

    // ─── NUEVA NOTA CLÍNICA ───────────────────────────────────────

    // ─── LAB REFERENCE RANGES PER SPECIES ────────────────────────
    // Fuente: valores de referencia estándar veterinaria (Idexx/Antech/Merck Vet Manual)

    labRefs: {
        canino: {
            'Hemograma completo': {
                eritrocitos: '5.5–8.5 ×10⁶/µL', leucocitos: '6–17 ×10³/µL',
                hematocrito: '37–55%', hemoglobina: '12–18 g/dL', plaquetas: '200–500 ×10³/µL'
            },
            'Bioquímica sérica': {
                alt: '10–100 U/L', ast: '10–50 U/L', creatinina: '0.5–1.5 mg/dL',
                bun: '7–27 mg/dL', glucosa: '70–120 mg/dL', proteinas: '5.4–7.1 g/dL', albumina: '2.3–3.9 g/dL'
            },
            'Urianálisis': {
                uri_ph: '5.5–7.5', uri_densidad: '1.015–1.045', uri_celulas: '<5/campo'
            }
        },
        felino: {
            'Hemograma completo': {
                eritrocitos: '5–10 ×10⁶/µL', leucocitos: '5.5–19.5 ×10³/µL',
                hematocrito: '30–45%', hemoglobina: '8–15 g/dL', plaquetas: '300–700 ×10³/µL'
            },
            'Bioquímica sérica': {
                alt: '10–75 U/L', ast: '10–60 U/L', creatinina: '0.8–2.4 mg/dL',
                bun: '14–36 mg/dL', glucosa: '65–130 mg/dL', proteinas: '5.7–7.8 g/dL', albumina: '2.3–3.5 g/dL'
            },
            'Urianálisis': {
                uri_ph: '5.5–7.0', uri_densidad: '1.020–1.060', uri_celulas: '<5/campo'
            }
        },
        conejo: {
            'Hemograma completo': {
                eritrocitos: '4–7 ×10⁶/µL', leucocitos: '5–12 ×10³/µL',
                hematocrito: '33–50%', hemoglobina: '10–17.4 g/dL', plaquetas: '250–650 ×10³/µL'
            },
            'Bioquímica sérica': {
                alt: '14–80 U/L', ast: '10–98 U/L', creatinina: '0.5–2.5 mg/dL',
                bun: '10–29 mg/dL', glucosa: '75–155 mg/dL', proteinas: '5.4–7.4 g/dL', albumina: '2.4–4.6 g/dL'
            }
        },
        ave: {
            'Hemograma completo': {
                eritrocitos: '2.5–4.5 ×10⁶/µL', leucocitos: '4–12 ×10³/µL',
                hematocrito: '35–55%', hemoglobina: '11–19 g/dL', plaquetas: 'Variable'
            },
            'Bioquímica sérica': {
                alt: '19–48 U/L', ast: '45–230 U/L', creatinina: 'N/A (aves: ácido úrico)',
                bun: 'N/A', glucosa: '200–400 mg/dL', proteinas: '3–5 g/dL', albumina: '1.3–2.8 g/dL'
            }
        },
        reptil: {
            'Hemograma completo': {
                eritrocitos: '0.4–2.4 ×10⁶/µL', leucocitos: '3–15 ×10³/µL',
                hematocrito: '20–40%', hemoglobina: 'Variable', plaquetas: 'Variable'
            },
            'Bioquímica sérica': {
                alt: 'Variable', ast: 'Variable', creatinina: 'N/A',
                bun: 'N/A', glucosa: '60–160 mg/dL', proteinas: '3–8 g/dL', albumina: 'Variable'
            }
        },
        equino: {
            'Hemograma completo': {
                eritrocitos: '6.5–12.5 ×10⁶/µL', leucocitos: '5.5–12.5 ×10³/µL',
                hematocrito: '30–52%', hemoglobina: '11–19 g/dL', plaquetas: '100–350 ×10³/µL'
            },
            'Bioquímica sérica': {
                alt: 'N/A (usar GGT/AST)', ast: '226–366 U/L', creatinina: '1.2–1.9 mg/dL',
                bun: '10–24 mg/dL', glucosa: '60–100 mg/dL', proteinas: '5.8–8.0 g/dL', albumina: '2.6–4.0 g/dL'
            },
            'Urianálisis': {
                uri_ph: '7.0–9.0', uri_densidad: '1.020–1.050', uri_celulas: '<5/campo'
            }
        },
        bovino: {
            'Hemograma completo': {
                eritrocitos: '5–10 ×10⁶/µL', leucocitos: '4–12 ×10³/µL',
                hematocrito: '24–46%', hemoglobina: '8–15 g/dL', plaquetas: '100–800 ×10³/µL'
            },
            'Bioquímica sérica': {
                alt: 'N/A (usar GGT/AST)', ast: '78–132 U/L', creatinina: '1.0–2.0 mg/dL',
                bun: '6–27 mg/dL', glucosa: '45–75 mg/dL', proteinas: '6.7–7.5 g/dL', albumina: '3.0–3.5 g/dL'
            },
            'Urianálisis': {
                uri_ph: '7.0–8.5', uri_densidad: '1.020–1.040', uri_celulas: '<5/campo'
            }
        },
        cerdo: {
            'Hemograma completo': {
                eritrocitos: '5–8 ×10⁶/µL', leucocitos: '11–22 ×10³/µL',
                hematocrito: '32–50%', hemoglobina: '10–16 g/dL', plaquetas: '325–715 ×10³/µL'
            },
            'Bioquímica sérica': {
                alt: '22–46 U/L', ast: '15–55 U/L', creatinina: '1.0–2.7 mg/dL',
                bun: '8–24 mg/dL', glucosa: '65–150 mg/dL', proteinas: '6.0–8.0 g/dL', albumina: '1.9–3.9 g/dL'
            },
            'Urianálisis': {
                uri_ph: '5.0–8.0', uri_densidad: '1.010–1.050', uri_celulas: '<5/campo'
            }
        }
    },

    getSpeciesKey() {
        const s = (this.selectedPet?.species || '').toLowerCase();
        if (s.includes('perro') || s.includes('dog') || s.includes('cani')) return 'canino';
        if (s.includes('gato') || s.includes('cat') || s.includes('feli')) return 'felino';
        if (s.includes('conejo') || s.includes('rabbit')) return 'conejo';
        if (s.includes('ave') || s.includes('bird') || s.includes('loro') || s.includes('cotorra')) return 'ave';
        if (s.includes('reptil') || s.includes('iguana') || s.includes('tortuga') || s.includes('serpiente')) return 'reptil';
        if (s.includes('caballo') || s.includes('horse') || s.includes('equi') || s.includes('yegua') || s.includes('potro')) return 'equino';
        if (s.includes('bovino') || s.includes('vaca') || s.includes('toro') || s.includes('cattle') || s.includes('ternero')) return 'bovino';
        if (s.includes('cerdo') || s.includes('pig') || s.includes('porcino') || s.includes('chancho')) return 'cerdo';
        return null;
    },

    getRef(testName, fieldId) {
        const key = this.getSpeciesKey();
        if (!key) return '';
        return this.labRefs[key]?.[testName]?.[fieldId] || '';
    },

    // ─── LAB CONFIGURATION ───────────────────────────────────────

    labConfig: {
        'Hemograma completo': {
            icon: '🩸',
            fields: [
                { id: 'eritrocitos',  label: 'Eritrocitos',    unit: '×10⁶/µL' },
                { id: 'leucocitos',   label: 'Leucocitos',     unit: '×10³/µL' },
                { id: 'hematocrito',  label: 'Hematocrito',    unit: '%'        },
                { id: 'hemoglobina',  label: 'Hemoglobina',    unit: 'g/dL'     },
                { id: 'plaquetas',    label: 'Plaquetas',      unit: '×10³/µL'  },
                { id: 'hem_interp',   label: 'Interpretación', unit: '', wide: true }
            ]
        },
        'Bioquímica sérica': {
            icon: '🧪',
            fields: [
                { id: 'alt',          label: 'ALT/GPT',        unit: 'U/L'   },
                { id: 'ast',          label: 'AST/GOT',        unit: 'U/L'   },
                { id: 'creatinina',   label: 'Creatinina',     unit: 'mg/dL' },
                { id: 'bun',          label: 'BUN',            unit: 'mg/dL' },
                { id: 'glucosa',      label: 'Glucosa',        unit: 'mg/dL' },
                { id: 'proteinas',    label: 'Proteínas tot.', unit: 'g/dL'  },
                { id: 'albumina',     label: 'Albúmina',       unit: 'g/dL'  },
                { id: 'bio_interp',   label: 'Interpretación', unit: '', wide: true }
            ]
        },
        'Urianálisis': {
            icon: '🫧',
            fields: [
                { id: 'uri_aspecto',   label: 'Aspecto',    unit: ''        },
                { id: 'uri_ph',        label: 'pH',         unit: ''        },
                { id: 'uri_densidad',  label: 'Densidad',   unit: ''        },
                { id: 'uri_proteinas', label: 'Proteínas',  unit: ''        },
                { id: 'uri_glucosa',   label: 'Glucosa',    unit: ''        },
                { id: 'uri_celulas',   label: 'Células',    unit: '/campo'  },
                { id: 'uri_bacterias', label: 'Bacterias',  unit: ''        },
                { id: 'uri_interp',    label: 'Interpretación', unit: '', wide: true }
            ]
        },
        'Coproparasitológico': {
            icon: '🔬',
            fields: [
                { id: 'copro_res',  label: 'Resultado', unit: '', select: ['Negativo','Positivo'] },
                { id: 'copro_para', label: 'Parásitos encontrados', unit: '', wide: true }
            ]
        },
        'Cultivo y antibiograma': {
            icon: '🧫',
            fields: [
                { id: 'cult_muestra', label: 'Tipo de muestra',          unit: '' },
                { id: 'cult_org',     label: 'Microorganismo',            unit: '' },
                { id: 'cult_sensi',   label: 'Sensibilidad antibiótica',  unit: '', wide: true }
            ]
        },
        'Citología': {
            icon: '🔬',
            fields: [
                { id: 'cito_muestra', label: 'Tipo de muestra', unit: '' },
                { id: 'cito_hall',    label: 'Hallazgos',        unit: '', wide: true },
                { id: 'cito_interp',  label: 'Interpretación',   unit: '', wide: true }
            ]
        },
        'Radiografía': {
            icon: '🩻',
            fields: [
                { id: 'rx_region', label: 'Región',     unit: '' },
                { id: 'rx_proy',   label: 'Proyección', unit: '' },
                { id: 'rx_hall',   label: 'Hallazgos',  unit: '', wide: true }
            ]
        },
        'Ecografía': {
            icon: '📡',
            fields: [
                { id: 'eco_region', label: 'Órganos/Región evaluados', unit: '' },
                { id: 'eco_hall',   label: 'Hallazgos', unit: '', wide: true }
            ]
        },
        'PCR / Serología': {
            icon: '🧬',
            fields: [
                { id: 'pcr_test',   label: 'Test específico', unit: '' },
                { id: 'pcr_res',    label: 'Resultado',        unit: '', select: ['Negativo','Positivo','Dudoso'] },
                { id: 'pcr_titulo', label: 'Título/Índice',    unit: '' }
            ]
        },
        'Otro': {
            icon: '📄',
            fields: [
                { id: 'otro_nombre', label: 'Nombre del análisis', unit: '' },
                { id: 'otro_res',    label: 'Resultado',             unit: '', wide: true }
            ]
        }
    },

    renderLabField(f, testKey, testName) {
        const inputId = `${testKey}_${f.id}`;
        const ref = testName ? this.getRef(testName, f.id) : '';
        const refText = ref ? `<span style="font-size:0.7rem;color:var(--brand-green);margin-left:0.25rem;">(ref: ${ref})</span>` : '';

        if (f.select) {
            return `
          <div ${f.wide ? 'style="grid-column:1/-1;"' : ''}>
            <label style="font-size:0.78rem;color:var(--text-muted);display:block;margin-bottom:0.2rem;">
              ${f.label}${f.unit ? ` <em style="font-size:0.7rem;">${f.unit}</em>` : ''}${refText}
            </label>
            <select class="form-select" id="${inputId}" style="padding:0.3rem 0.5rem;font-size:0.82rem;">
              <option value="">—</option>
              ${f.select.map(o => `<option value="${o}">${o}</option>`).join('')}
            </select>
          </div>`;
        }

        return `
          <div ${f.wide ? 'style="grid-column:1/-1;"' : ''}>
            <label style="font-size:0.78rem;color:var(--text-muted);display:block;margin-bottom:0.2rem;">
              ${f.label}${f.unit ? ` <em style="font-size:0.7rem;">${f.unit}</em>` : ''}${refText}
            </label>
            <input type="text" class="form-input" id="${inputId}"
              style="padding:0.3rem 0.5rem;font-size:0.82rem;"
              placeholder="${ref || ''}">
          </div>`;
    },

    toggleLabPanel(checkbox, testName) {
        const container = document.getElementById('labPanelsContainer');
        const panelId = `labPanel_${testName.replace(/[^a-z0-9]/gi, '_')}`;

        if (checkbox.checked) {
            if (document.getElementById(panelId)) return;
            const config = this.labConfig[testName];
            const testKey = testName.replace(/[^a-z0-9]/gi, '_');
            const fieldsHtml = config.fields.map(f => this.renderLabField(f, testKey, testName)).join('');

            const panel = document.createElement('div');
            panel.id = panelId;
            panel.className = 'lab-panel';
            panel.innerHTML = `
          <div class="lab-panel-header">
            <span>${config.icon} ${testName}</span>
          </div>
          <div class="lab-panel-fields">${fieldsHtml}</div>
        `;
            container.appendChild(panel);

            // Animate in
            requestAnimationFrame(() => panel.classList.add('lab-panel--visible'));
        } else {
            const panel = document.getElementById(panelId);
            if (panel) {
                panel.classList.remove('lab-panel--visible');
                setTimeout(() => panel.remove(), 250);
            }
        }
    },

    collectLabResults() {
        const results = {};
        Object.entries(this.labConfig).forEach(([testName, config]) => {
            const panelId = `labPanel_${testName.replace(/[^a-z0-9]/gi, '_')}`;
            if (!document.getElementById(panelId)) return;

            const testKey = testName.replace(/[^a-z0-9]/gi, '_');
            const testData = {};
            config.fields.forEach(f => {
                const el = document.getElementById(`${testKey}_${f.id}`);
                if (el && el.value.trim()) testData[f.label] = el.value.trim();
            });
            if (Object.keys(testData).length) results[testName] = testData;
        });

        if (!Object.keys(results).length) return null;
        // Serialize to readable text
        return Object.entries(results).map(([test, fields]) =>
            `[${test}] ` + Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join(' | ')
        ).join('\n');
    },

    showNewRecordForm() {
        const petName = this.selectedPet?.name || 'Paciente';
        const today = new Date().toISOString().split('T')[0];
        const vetName = window.AuthState?.profile?.name || '';

        const labTests = Object.keys(this.labConfig);
        const labChecklist = labTests.map((test, i) => `
          <div class="lab-item">
            <input type="checkbox" id="lab_${i}"
              onchange="ClinicalRecords.toggleLabPanel(this, '${test.replace(/'/g, "\\'")}')">
            <label for="lab_${i}">${test}</label>
          </div>
        `).join('');

        const naBtn = (targetId) =>
            `<button type="button" class="btn-na" onclick="document.getElementById('${targetId}').value='N/A'">N/A</button>`;

        const content = `
      <form id="newClinicalRecordForm" onsubmit="ClinicalRecords.saveRecord(event)">

        <!-- Fila 1: Motivo + Fecha + Vet -->
        <div class="grid grid-3" style="margin-bottom:1rem;">
          <div class="form-group" style="grid-column:1/3;margin:0;">
            <label class="form-label">Motivo de Consulta *</label>
            <input type="text" class="form-input" id="recChiefComplaint"
              list="motivosList" placeholder="Selecciona o escribe..." required autocomplete="off">
            <datalist id="motivosList">
              <option value="Consulta general">
              <option value="Vacunación">
              <option value="Desparasitación">
              <option value="Control post-operatorio">
              <option value="Urgencia / Emergencia">
              <option value="Revisión dental">
              <option value="Problema dermatológico">
              <option value="Problema digestivo">
              <option value="Problema respiratorio">
              <option value="Problema urológico / renal">
              <option value="Problema oftalmológico">
              <option value="Problema neurológico">
              <option value="Trauma / Herida">
              <option value="Cirugía programada">
              <option value="Seguimiento de tratamiento">
              <option value="Revisión anual">
            </datalist>
          </div>
          <div class="form-group" style="margin:0;">
            <label class="form-label">Fecha</label>
            <input type="date" class="form-input" id="recDate" value="${today}">
          </div>
        </div>

        <!-- Fila 2: Síntomas + Examen Físico -->
        <div class="grid grid-2" style="margin-bottom:1rem;">
          <div class="form-group" style="margin:0;">
            <label class="form-label">Síntomas</label>
            <div class="field-with-na">
              <textarea class="form-textarea" id="recSymptoms"
                placeholder="Síntomas observados..." rows="3"></textarea>
              ${naBtn('recSymptoms')}
            </div>
          </div>
          <div class="form-group" style="margin:0;">
            <label class="form-label">Examen Físico</label>
            <div class="field-with-na">
              <textarea class="form-textarea" id="recExam"
                placeholder="Hallazgos del examen físico..." rows="3"></textarea>
              ${naBtn('recExam')}
            </div>
          </div>
        </div>

        <!-- Fila 3: Resultados de Laboratorio -->
        <div class="form-group" style="margin-bottom:1rem;">
          <label class="form-label">Resultados de Laboratorio
            <span style="font-size:0.75rem;color:var(--text-muted);font-weight:400;margin-left:0.5rem;">
              — Selecciona los análisis realizados
            </span>
          </label>
          <div class="lab-checklist">${labChecklist}</div>
          <div id="labPanelsContainer" style="margin-top:0.75rem;display:flex;flex-direction:column;gap:0.5rem;"></div>
        </div>

        <!-- Fila 4: Diagnóstico + Tratamiento -->
        <div class="grid grid-2" style="margin-bottom:1rem;">
          <div class="form-group" style="margin:0;">
            <label class="form-label">Diagnóstico *</label>
            <textarea class="form-textarea" id="recDiagnosis"
              placeholder="Diagnóstico clínico..." rows="3" required></textarea>
          </div>
          <div class="form-group" style="margin:0;">
            <label class="form-label">Tratamiento *</label>
            <textarea class="form-textarea" id="recTreatment"
              placeholder="Plan de tratamiento..." rows="3" required></textarea>
          </div>
        </div>

        <!-- Fila 5: Medicamentos + Revisión + Vet -->
        <div class="grid grid-3" style="margin-bottom:1rem;">
          <div class="form-group" style="margin:0;">
            <label class="form-label">Medicamentos</label>
            <div class="field-with-na">
              <input type="text" class="form-input" id="recMedications"
                placeholder="Medicamentos prescritos...">
              ${naBtn('recMedications')}
            </div>
          </div>
          <div class="form-group" style="margin:0;">
            <label class="form-label">Próxima Revisión</label>
            <input type="date" class="form-input" id="recFollowUp">
          </div>
          <div class="form-group" style="margin:0;">
            <label class="form-label">Veterinario</label>
            <input type="text" class="form-input" id="recVet"
              value="${vetName}" readonly style="opacity:0.7;">
          </div>
        </div>

        <!-- Fila 6: Notas -->
        <div class="form-group" style="margin-bottom:1.5rem;">
          <label class="form-label">Notas adicionales</label>
          <div class="field-with-na">
            <textarea class="form-textarea" id="recNotes"
              placeholder="Instrucciones para el dueño, observaciones..." rows="2"></textarea>
            ${naBtn('recNotes')}
          </div>
        </div>

        <div style="display:flex;gap:1rem;">
          <button type="submit" class="btn btn-primary" style="flex:1;">
            💾 Guardar Historia Clínica
          </button>
          <button type="button" class="btn btn-secondary" onclick="App.closeModal()">
            Cancelar
          </button>
        </div>
      </form>
    `;

        App.showModal(`Nueva Nota Clínica — ${petName}`, content, { wide: true });
    },

    async saveRecord(event) {
        event.preventDefault();

        const pet = this.selectedPet;
        if (!pet) return;

        const labResults = this.collectLabResults();

        const record = {
            patientId:      pet.id,
            appointmentId:  null,
            recordDate:     document.getElementById('recDate').value || new Date().toISOString().split('T')[0],
            chiefComplaint: document.getElementById('recChiefComplaint').value.trim(),
            symptoms:       document.getElementById('recSymptoms').value.trim() || null,
            physicalExam:   document.getElementById('recExam').value.trim() || null,
            diagnosis:      document.getElementById('recDiagnosis').value.trim(),
            treatment:      document.getElementById('recTreatment').value.trim(),
            medications:    document.getElementById('recMedications').value.trim() || null,
            labResults:     labResults || null,
            notes:          document.getElementById('recNotes').value.trim() || null,
            followUpDate:   document.getElementById('recFollowUp').value || null,
            veterinarian:   document.getElementById('recVet').value.trim() || null
        };

        try {
            await App.addClinicalRecord(record);
            App.closeModal();
            App.showNotification('Nota guardada', `Historia clínica de ${pet.name} actualizada.`, 'success');
            // Refresh the clinical section
            this.renderClinicalSection();
        } catch (err) {
            App.showNotification('Error', 'No se pudo guardar la nota clínica.', 'error');
            console.error('saveRecord error:', err);
        }
    },

    // ─── EDITAR PACIENTE ──────────────────────────────────────────

    showEditPetModal() {
        const pet = this.selectedPet;
        if (!pet) return;

        const content = `
      <form id="editPetForm" onsubmit="ClinicalRecords.savePetEdit(event)">
        <div class="grid grid-2">
          <div class="form-group">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-input" id="editPetName"
              value="${pet.name || ''}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Especie</label>
            <select class="form-select" id="editPetSpecies">
              ${['Perro','Gato','Ave','Conejo','Reptil','Caballo','Bovino','Cerdo','Otro'].map(s =>
                `<option value="${s}" ${pet.species === s ? 'selected' : ''}>${s}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Raza</label>
            <input type="text" class="form-input" id="editPetBreed"
              value="${pet.breed || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Sexo</label>
            <select class="form-select" id="editPetGender">
              <option value="">—</option>
              ${['Macho','Hembra','Macho castrado','Hembra esterilizada'].map(g =>
                `<option value="${g}" ${pet.gender === g ? 'selected' : ''}>${g}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Edad (años)</label>
            <input type="number" class="form-input" id="editPetAge"
              value="${pet.age || ''}" min="0" max="30" step="0.5">
          </div>
          <div class="form-group">
            <label class="form-label">Peso (kg)</label>
            <input type="number" class="form-input" id="editPetWeight"
              value="${pet.weight || ''}" min="0" step="0.1">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Microchip</label>
          <input type="text" class="form-input" id="editPetMicrochip"
            value="${pet.microchip || ''}" placeholder="Número de microchip">
        </div>
        <div style="display:flex;gap:1rem;margin-top:1.5rem;">
          <button type="submit" class="btn btn-primary" style="flex:1;">
            💾 Guardar Cambios
          </button>
          <button type="button" class="btn btn-secondary" onclick="App.closeModal()">
            Cancelar
          </button>
        </div>
      </form>
    `;

        App.showModal(`Editar — ${pet.name}`, content);
    },

    async savePetEdit(event) {
        event.preventDefault();
        const pet = this.selectedPet;
        if (!pet) return;

        const updates = {
            name:      document.getElementById('editPetName').value.trim(),
            species:   document.getElementById('editPetSpecies').value,
            breed:     document.getElementById('editPetBreed').value.trim() || null,
            gender:    document.getElementById('editPetGender').value || null,
            age:       parseFloat(document.getElementById('editPetAge').value) || null,
            weight:    parseFloat(document.getElementById('editPetWeight').value) || null,
            microchip: document.getElementById('editPetMicrochip').value.trim() || null
        };

        try {
            if (typeof DB !== 'undefined') {
                await DB.updatePatient(pet.id, updates);
            }
            // Update local cache
            const client = this.selectedClient;
            const pets = client.pets || client.patients || [];
            const idx = pets.findIndex(p => String(p.id) === String(pet.id));
            if (idx !== -1) pets[idx] = { ...pets[idx], ...updates };
            this.selectedPet = { ...this.selectedPet, ...updates };

            App.closeModal();
            App.showNotification('Actualizado', `Datos de ${updates.name} guardados.`, 'success');
            this.renderPatientProfile();
        } catch (err) {
            App.showNotification('Error', 'No se pudieron guardar los cambios.', 'error');
            console.error('savePetEdit error:', err);
        }
    }
};
