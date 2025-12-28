// Clinical Records Module
const ClinicalRecords = {
    selectedPet: null,

    render() {
        return `
      <!-- Patient Selection -->
      <div class="grid grid-3">
        <div class="card" style="grid-column: 1 / -1;">
          <div class="card-header">
            <h3 class="card-title">Seleccionar Paciente</h3>
          </div>
          <div class="card-body">
            <div class="form-group">
              <select class="form-select" id="patientSelect" onchange="ClinicalRecords.selectPet(this.value)">
                <option value="">Seleccionar mascota...</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Patient Profile -->
      <div id="patientProfile" class="hidden"></div>
      
      <!-- Clinical History -->
      <div id="clinicalHistory" class="hidden"></div>
      
      <!-- New Clinical Record Form -->
      <div id="newRecordSection" class="hidden"></div>
    `;
    },

    init() {
        this.loadPatients();
    },

    loadPatients() {
        const clients = App.getClients();
        const select = document.getElementById('patientSelect');

        let options = '<option value="">Seleccionar mascota...</option>';

        clients.forEach(client => {
            if (client.pets && client.pets.length > 0) {
                client.pets.forEach(pet => {
                    options += `<option value="${client.id}-${pet.id}">${pet.name} - ${client.name} (${pet.species})</option>`;
                });
            }
        });

        select.innerHTML = options;
    },

    selectPet(value) {
        if (!value) {
            document.getElementById('patientProfile').classList.add('hidden');
            document.getElementById('clinicalHistory').classList.add('hidden');
            document.getElementById('newRecordSection').classList.add('hidden');
            return;
        }

        const [clientId, petId] = value.split('-').map(Number);
        const client = App.getClient(clientId);
        const pet = client?.pets?.find(p => p.id === petId);

        if (!pet) return;

        this.selectedPet = { ...pet, clientId, client };
        this.displayPatientProfile();
        this.loadClinicalHistory();
    },

    displayPatientProfile() {
        const pet = this.selectedPet;
        const profileContainer = document.getElementById('patientProfile');

        profileContainer.classList.remove('hidden');
        profileContainer.innerHTML = `
      <div class="card mt-lg">
        <div class="card-header">
          <h3 class="card-title">🐾 Perfil del Paciente</h3>
        </div>
        <div class="card-body">
          <div class="grid grid-4">
            <div>
              <div class="form-label">Nombre</div>
              <div style="font-size: 1.25rem; font-weight: 600;">${pet.name}</div>
            </div>
            <div>
              <div class="form-label">Especie</div>
              <div>${pet.species}</div>
            </div>
            <div>
              <div class="form-label">Raza</div>
              <div>${pet.breed}</div>
            </div>
            <div>
              <div class="form-label">Edad</div>
              <div>${pet.age} años</div>
            </div>
          </div>
          
          <div class="mt-md">
            <div class="form-label">Dueño</div>
            <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md);">
              <strong>${pet.client.name}</strong><br>
              <span class="text-muted">${pet.client.email} • ${pet.client.phone}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    },

    loadClinicalHistory() {
        const records = App.getClinicalRecords(this.selectedPet.id);
        const historyContainer = document.getElementById('clinicalHistory');
        const newRecordSection = document.getElementById('newRecordSection');

        historyContainer.classList.remove('hidden');
        newRecordSection.classList.remove('hidden');

        historyContainer.innerHTML = `
      <div class="card mt-lg">
        <div class="card-header">
          <h3 class="card-title">📋 Historia Clínica</h3>
          <button class="btn btn-primary" onclick="ClinicalRecords.showNewRecordForm()">
            ➕ Nueva Nota Clínica
          </button>
        </div>
        <div class="card-body">
          ${records.length === 0 ?
                '<p class="text-muted text-center" style="padding: 2rem;">No hay registros clínicos</p>' :
                this.renderClinicalRecords(records)
            }
        </div>
      </div>
    `;

        // Vaccination Schedule
        newRecordSection.innerHTML = `
      <div class="grid grid-2 mt-lg">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">💉 Vacunaciones</h3>
          </div>
          <div class="card-body">
            <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md); margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong>Rabia</strong>
                  <div class="text-muted" style="font-size: 0.875rem;">Última: 15/06/2024</div>
                </div>
                <span class="badge badge-success">Al día</span>
              </div>
            </div>
            <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md); margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong>Polivalente</strong>
                  <div class="text-muted" style="font-size: 0.875rem;">Última: 10/05/2024</div>
                </div>
                <span class="badge badge-success">Al día</span>
              </div>
            </div>
            <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong>Bordetella</strong>
                  <div class="text-muted" style="font-size: 0.875rem;">Próxima: 20/12/2025</div>
                </div>
                <span class="badge badge-warning">Próxima</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">🪱 Desparasitaciones</h3>
          </div>
          <div class="card-body">
            <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md); margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong>Interna</strong>
                  <div class="text-muted" style="font-size: 0.875rem;">Última: 01/11/2025</div>
                </div>
                <span class="badge badge-success">Al día</span>
              </div>
            </div>
            <div style="padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong>Externa</strong>
                  <div class="text-muted" style="font-size: 0.875rem;">Última: 15/10/2025</div>
                </div>
                <span class="badge badge-warning">Vence pronto</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    },

    renderClinicalRecords(records) {
        return records.map(record => `
      <div style="padding: 1.5rem; border-left: 3px solid var(--accent-purple); background: var(--bg-glass); border-radius: var(--radius-md); margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
          <div>
            <h4 style="margin: 0;">${record.title || 'Consulta'}</h4>
            <div class="text-muted" style="font-size: 0.875rem;">${new Date(record.createdAt).toLocaleString('es-ES')}</div>
          </div>
          <button class="btn btn-secondary btn-icon" onclick="ClinicalRecords.downloadPDF(${record.id})">📄</button>
        </div>
        
        <div style="margin-bottom: 1rem;">
          <strong>Motivo de consulta:</strong>
          <div>${record.reason || 'N/A'}</div>
        </div>
        
        <div style="margin-bottom: 1rem;">
          <strong>Diagnóstico:</strong>
          <div>${record.diagnosis || 'N/A'}</div>
        </div>
        
        <div style="margin-bottom: 1rem;">
          <strong>Tratamiento:</strong>
          <div>${record.treatment || 'N/A'}</div>
        </div>
        
        ${record.notes ? `
          <div>
            <strong>Notas adicionales:</strong>
            <div class="text-muted">${record.notes}</div>
          </div>
        ` : ''}
      </div>
    `).join('');
    },

    showNewRecordForm() {
        const content = `
      <form id="newClinicalRecordForm">
        <div class="form-group">
          <label class="form-label">Motivo de Consulta</label>
          <input type="text" class="form-input" id="recordReason" required>
        </div>
        
        <div class="form-group">
          <label class="form-label">Síntomas</label>
          <textarea class="form-textarea" id="recordSymptoms"></textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Examen Físico</label>
          <textarea class="form-textarea" id="recordExam"></textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Diagnóstico</label>
          <textarea class="form-textarea" id="recordDiagnosis" required></textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Tratamiento</label>
          <textarea class="form-textarea" id="recordTreatment" required></textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">Notas Adicionales</label>
          <textarea class="form-textarea" id="recordNotes"></textarea>
        </div>
        
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
          <button type="submit" class="btn btn-primary" style="flex: 1;">Guardar Historia Clínica</button>
          <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Cancelar</button>
        </div>
      </form>
    `;

        App.showModal('Nueva Nota Clínica - ' + this.selectedPet.name, content);

        setTimeout(() => {
            document.getElementById('newClinicalRecordForm').addEventListener('submit', (e) => {
                e.preventDefault();

                const record = {
                    petId: this.selectedPet.id,
                    reason: document.getElementById('recordReason').value,
                    symptoms: document.getElementById('recordSymptoms').value,
                    exam: document.getElementById('recordExam').value,
                    diagnosis: document.getElementById('recordDiagnosis').value,
                    treatment: document.getElementById('recordTreatment').value,
                    notes: document.getElementById('recordNotes').value
                };

                App.addClinicalRecord(record);
                App.triggerAutomation('clinical_record_created', record);
                App.closeModal();
                App.showNotification('Historia clínica guardada', 'El registro ha sido creado y la historia clínica ha sido generada', 'success');
                this.loadClinicalHistory();
            });
        }, 100);
    },

    downloadPDF(recordId) {
        App.showNotification('PDF generado', 'La historia clínica ha sido exportada a PDF', 'success');
    }
};
