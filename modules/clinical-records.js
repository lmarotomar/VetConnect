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

    showNewRecordForm() {
        const petName = this.selectedPet?.name || 'Paciente';

        const today = new Date().toISOString().split('T')[0];
        const content = `
      <form id="newClinicalRecordForm" onsubmit="ClinicalRecords.saveRecord(event)">
        <div class="grid grid-2">
          <div class="form-group">
            <label class="form-label">Motivo de Consulta *</label>
            <input type="text" class="form-input" id="recChiefComplaint"
              placeholder="Ej: Vómitos, decaimiento, revisión anual..." required>
          </div>
          <div class="form-group">
            <label class="form-label">Fecha de Consulta</label>
            <input type="date" class="form-input" id="recDate" value="${today}">
          </div>
        </div>
        <div class="grid grid-2">
          <div class="form-group">
            <label class="form-label">Síntomas</label>
            <textarea class="form-textarea" id="recSymptoms"
              placeholder="Describe los síntomas observados..." rows="3"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Examen Físico</label>
            <textarea class="form-textarea" id="recExam"
              placeholder="Hallazgos del examen físico..." rows="3"></textarea>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Diagnóstico *</label>
          <textarea class="form-textarea" id="recDiagnosis"
            placeholder="Diagnóstico clínico..." rows="2" required></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Tratamiento *</label>
          <textarea class="form-textarea" id="recTreatment"
            placeholder="Plan de tratamiento y medicación..." rows="2" required></textarea>
        </div>
        <div class="grid grid-2">
          <div class="form-group">
            <label class="form-label">Medicamentos</label>
            <input type="text" class="form-input" id="recMedications"
              placeholder="Medicamentos prescritos...">
          </div>
          <div class="form-group">
            <label class="form-label">Resultados de Laboratorio</label>
            <input type="text" class="form-input" id="recLabResults"
              placeholder="Hemograma, bioquímica, etc.">
          </div>
        </div>
        <div class="grid grid-2">
          <div class="form-group">
            <label class="form-label">Próxima Revisión</label>
            <input type="date" class="form-input" id="recFollowUp">
          </div>
          <div class="form-group">
            <label class="form-label">Veterinario</label>
            <input type="text" class="form-input" id="recVet"
              value="${window.AuthState?.profile?.name || ''}" readonly
              style="opacity:0.7;">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Notas adicionales</label>
          <textarea class="form-textarea" id="recNotes"
            placeholder="Observaciones, instrucciones para el dueño..." rows="2"></textarea>
        </div>
        <div style="display:flex;gap:1rem;margin-top:1.5rem;">
          <button type="submit" class="btn btn-primary" style="flex:1;">
            💾 Guardar Nota Clínica
          </button>
          <button type="button" class="btn btn-secondary" onclick="App.closeModal()">
            Cancelar
          </button>
        </div>
      </form>
    `;

        App.showModal(`Nueva Nota Clínica — ${petName}`, content);
    },

    async saveRecord(event) {
        event.preventDefault();

        const pet = this.selectedPet;
        if (!pet) return;

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
            labResults:     document.getElementById('recLabResults').value.trim() || null,
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
              ${['Perro','Gato','Ave','Conejo','Reptil','Otro'].map(s =>
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
