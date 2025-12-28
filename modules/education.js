// Education Module
const Education = {
  categories: ['Todas', 'Vacunación', 'Nutrición', 'Comportamiento', 'Emergencias', 'Cuidados', 'Prevención'],
  selectedCategory: 'Todas',

  render() {
    return `
      <!-- Category Filters -->
      <div class="card mb-lg">
        <div class="card-body">
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${this.categories.map(cat => `
              <button class="btn btn-secondary" onclick="Education.filterByCategory('${cat}')">
                ${cat}
              </button>
            `).join('')}
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
            <div style="padding: 1.5rem; background: var(--bg-glass); border-radius: var(--radius-md); border-left: 3px solid var(--accent-teal);">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <span style="font-size: 2rem;">✅</span>
                <div>
                  <strong>Post-Consulta</strong>
                  <div class="text-muted" style="font-size: 0.875rem;">Automático al completar cita</div>
                </div>
              </div>
              <p style="margin-bottom: 1rem; font-size: 0.875rem;">
                Envía automáticamente instrucciones de cuidado específicas según el tipo de consulta.
              </p>
              <ul style="font-size: 0.875rem; color: var(--text-muted);">
                <li>Instrucciones de medicación</li>
                <li>Cuidados en casa</li>
                <li>Señales de alerta</li>
                <li>Próximos pasos</li>
              </ul>
            </div>
            
            <div style="padding: 1.5rem; background: var(--bg-glass); border-radius: var(--radius-md); border-left: 3px solid var(--accent-blue);">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <span style="font-size: 2rem;">💉</span>
                <div>
                  <strong>Vacunación</strong>
                  <div class="text-muted" style="font-size: 0.875rem;">Recordatorio automático</div>
                </div>
              </div>
              <p style="margin-bottom: 1rem; font-size: 0.875rem;">
                Recordatorios automáticos de próximas vacunas con material educativo.
              </p>
              <ul style="font-size: 0.875rem; color: var(--text-muted);">
                <li>Calendario de vacunación</li>
                <li>Importancia de cada vacuna</li>
                <li>Cuidados post-vacunación</li>
                <li>Agendamiento fácil</li>
              </ul>
            </div>
            
            <div style="padding: 1.5rem; background: var(--bg-glass); border-radius: var(--radius-md); border-left: 3px solid var(--accent-purple);">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <span style="font-size: 2rem;">🔄</span>
                <div>
                  <strong>Seguimiento</strong>
                  <div class="text-muted" style="font-size: 0.875rem;">3, 7 y 30 días</div>
                </div>
              </div>
              <p style="margin-bottom: 1rem; font-size: 0.875rem;">
                Sistema de seguimiento automático post-tratamiento en intervalos específicos.
              </p>
              <ul style="font-size: 0.875rem; color: var(--text-muted);">
                <li>Check-in de 3 días</li>
                <li>Evaluación de 7 días</li>
                <li>Seguimiento de 30 días</li>
                <li>Recopilación de feedback</li>
              </ul>
            </div>
            
            <div style="padding: 1.5rem; background: var(--bg-glass); border-radius: var(--radius-md); border-left: 3px solid var(--accent-coral);">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <span style="font-size: 2rem;">🚨</span>
                <div>
                  <strong>Emergencias</strong>
                  <div class="text-muted" style="font-size: 0.875rem;">Guías rápidas</div>
                </div>
              </div>
              <p style="margin-bottom: 1rem; font-size: 0.875rem;">
                Protocolos de emergencia enviados cuando el cliente lo necesita.
              </p>
              <ul style="font-size: 0.875rem; color: var(--text-muted);">
                <li>Primeros auxilios</li>
                <li>Cuándo acudir urgente</li>
                <li>Qué hacer mientras llega</li>
                <li>Números de emergencia</li>
              </ul>
            </div>
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
    this.loadContent();
  },

  loadContent() {
    let content = this.getEducationalContent();

    if (this.selectedCategory !== 'Todas') {
      content = content.filter(c => c.category === this.selectedCategory);
    }

    const container = document.getElementById('educationalContent');

    container.innerHTML = `
      <div class="grid grid-3">
        ${content.map(item => this.renderContentCard(item)).join('')}
      </div>
    `;
  },

  getEducationalContent() {
    return [
      {
        id: 1,
        title: 'Cuidados Post-Vacunación',
        category: 'Vacunación',
        icon: '💉',
        summary: 'Guía completa sobre qué esperar y cómo cuidar a tu mascota después de la vacunación.',
        content: `
          <h3>Cuidados Post-Vacunación</h3>
          <p>Es normal que tu mascota presente algunos síntomas leves después de la vacunación. Aquí te explicamos qué esperar:</p>
          
          <h4>Síntomas Normales:</h4>
          <ul>
            <li>Ligera inflamación en el sitio de inyección</li>
            <li>Menor apetito por 24 horas</li>
            <li>Somnolencia</li>
            <li>Fiebre leve</li>
          </ul>
          
          <h4>Cuidados Recomendados:</h4>
          <ul>
            <li>Mantén a tu mascota en reposo por 24-48 horas</li>
            <li>Asegura acceso constante a agua fresca</li>
            <li>Evita ejercicio intenso</li>
            <li>Observa el sitio de inyección</li>
          </ul>
          
          <h4>Cuándo Contactar al Veterinario:</h4>
          <ul>
            <li>Vómitos persistentes</li>
            <li>Dificultad para respirar</li>
            <li>Hinchazón facial severa</li>
            <li>Letargo extremo por más de 48 horas</li>
          </ul>
        `
      },
      {
        id: 2,
        title: 'Alimentación Saludable para Perros',
        category: 'Nutrición',
        icon: '🥘',
        summary: 'Todo lo que necesitas saber sobre la nutrición canina y cómo mantener a tu perro saludable.',
        content: `
          <h3>Alimentación Saludable para Perros</h3>
          <p>Una dieta balanceada es fundamental para la salud, energía y longevidad de tu perro.</p>
          
          <h4>Componentes Esenciales:</h4>
          <ul>
            <li><strong>Proteínas:</strong> 25-30% de la dieta (carne, pescado, huevos)</li>
            <li><strong>Grasas:</strong> 15-20% (ácidos grasos omega-3 y omega-6)</li>
            <li><strong>Carbohidratos:</strong> Arroz, avena, batata en moderación</li>
            <li><strong>Vitaminas y Minerales:</strong> A través de alimentos completos</li>
          </ul>
          
          <h4>Alimentación según Edad:</h4>
          <ul>
            <li><strong>Cachorros (0-12 meses):</strong> 3-4 comidas al día, alto en proteína</li>
            <li><strong>Adultos (1-7 años):</strong> 2 comidas al día, dieta balanceada</li>
            <li><strong>Seniors (7+ años):</strong> Alimento senior con menos calorías</li>
          </ul>
          
          <h4>Alimentos Prohibidos:</h4>
          <ul>
            <li>❌ Chocolate y cafeína</li>
            <li>❌ Uvas y pasas</li>
            <li>❌ Cebolla y ajo</li>
            <li>❌ Aguacate</li>
            <li>❌ Alcohol</li>
          </ul>
        `
      },
      {
        id: 3,
        title: 'Señales de Estrés en Gatos',
        category: 'Comportamiento',
        icon: '🐱',
        summary: 'Aprende a identificar cuando tu gato está estresado y cómo ayudarlo.',
        content: `
          <h3>Señales de Estrés en Gatos</h3>
          <p>Los gatos son maestros en ocultar el estrés. Aprende a detectar las señales tempranas.</p>
          
          <h4>Señales Físicas:</h4>
          <ul>
            <li>Pupilas dilatadas constantemente</li>
            <li>Orejas hacia atrás o aplanadas</li>
            <li>Cola erizada o movimiento rápido</li>
            <li>Postura agachada o espalda arqueada</li>
            <li>Acicalamiento excesivo (calvas)</li>
          </ul>
          
          <h4>Cambios de Comportamiento:</h4>
          <ul>
            <li>Esconderse más de lo normal</li>
            <li>Agresividad repentina</li>
            <li>Maullidos excesivos</li>
            <li>Pérdida de apetito</li>
            <li>Hacer necesidades fuera del arenero</li>
          </ul>
          
          <h4>Cómo Ayudar:</h4>
          <ul>
            <li>Mantener rutinas constantes</li>
            <li>Proporcionar escondites seguros</li>
            <li>Usar feromonas calmantes</li>
            <li>Evitar cambios bruscos</li>
            <li>Respetar su espacio personal</li>
          </ul>
        `
      },
      {
        id: 4,
        title: 'Primeros Auxilios para Mascotas',
        category: 'Emergencias',
        icon: '🚨',
        summary: 'Guía esencial de primeros auxilios que todo dueño de mascota debe conocer.',
        content: `
          <h3>Primeros Auxilios para Mascotas</h3>
          <p>En emergencias, tu acción rápida puede salvar la vida de tu mascota.</p>
          
          <h4>🚨 Situaciones de Emergencia:</h4>
          <ul>
            <li><strong>Asfixia:</strong> Golpes firmes en espalda, maniobra de Heimlich</li>
            <li><strong>Hemorragia:</strong> Presión directa con gasa limpia</li>
            <li><strong>Fracturas:</strong> NO mover el área, inmovilizar si es seguro</li>
            <li><strong>Envenenamiento:</strong> Llamar VET inmediatamente, NO inducir vómito sin indicación</li>
          </ul>
          
          <h4>Botiquín Básico:</h4>
          <ul>
            <li>Gasas estériles y vendas</li>
            <li>Solución desinfectante</li>
            <li>Termómetro digital</li>
            <li>Número del veterinario y emergencias</li>
            <li>Manta térmica</li>
          </ul>
          
          <h4>⚠️ SIEMPRE Contactar al Veterinario en:</h4>
          <ul>
            <li>Dificultad para respirar</li>
            <li>Sangrado que no para</li>
            <li>Pérdida de consciencia</li>
            <li>Convulsiones</li>
            <li>Trauma severo</li>
          </ul>
        `
      },
      {
        id: 5,
        title: 'Prevención de Parásitos',
        category: 'Prevención',
        icon: '🪱',
        summary: 'Cómo proteger a tu mascota de parásitos internos y externos.',
        content: `
          <h3>Prevención de Parásitos</h3>
          <p>La prevención es más fácil y económica que el tratamiento.</p>
          
          <h4>Parásitos Externos:</h4>
          <ul>
            <li><strong>Pulgas:</strong> Pipetas mensuales, collares antiparasitarios</li>
            <li><strong>Garrapatas:</strong> Revisión post-paseo, antiparasitarios</li>
            <li><strong>Ácaros:</strong> Higiene regular, tratamiento veterinario</li>
          </ul>
          
          <h4>Parásitos Internos:</h4>
          <ul>
            <li><strong>Lombrices intestinales:</strong> Desparasitación cada 3-6 meses</li>
            <li><strong>Giardia:</strong> Agua limpia, higiene en paseos</li>
            <li><strong>Filaria (gusano del corazón):</strong> Prevención mensual obligatoria</li>
          </ul>
          
          <h4>Cronograma de Desparasitación:</h4>
          <ul>
            <li>Cachorros: Cada 2-4 semanas hasta 6 meses</li>
            <li>Adultos: Cada 3-6 meses</li>
            <li>Preventivo de filaria: Mensual</li>
          </ul>
          
          <h4>Señales de Parásitos:</h4>
          <ul>
            <li>Picazón o rascado excesivo</li>
            <li>Pérdida de peso</li>
            <li>Vómitos o diarrea</li>
            <li>Pelaje opaco</li>
            <li>Abdomen hinchado</li>
          </ul>
        `
      },
      {
        id: 6,
        title: 'Cuidado Dental',
        category: 'Cuidados',
        icon: '🦷',
        summary: 'Importancia de la higiene dental y cómo mantener los dientes de tu mascota saludables.',
        content: `
          <h3>Cuidado Dental en Mascotas</h3>
          <p>El 80% de perros y gatos mayores de 3 años tienen enfermedad periodontal.</p>
          
          <h4>¿Por qué es Importante?</h4>
          <ul>
            <li>Previene dolor y pérdida de dientes</li>
            <li>Evita infecciones que afectan órganos vitales</li>
            <li>Mejora calidad de vida y longevidad</li>
            <li>Elimina mal aliento</li>
          </ul>
          
          <h4>Rutina de Cuidado Dental:</h4>
          <ul>
            <li><strong>Cepillado:</strong> Idealmente diario, mínimo 3 veces/semana</li>
            <li><strong>Pasta dental:</strong> SOLO para mascotas (NO humana)</li>
            <li><strong>Juguetes dentales:</strong> Ayudan a remover placa</li>
            <li><strong>Snacks dentales:</strong> Complemento, no sustituto</li>
          </ul>
          
          <h4>Señales de Problemas Dentales:</h4>
          <ul>
            <li>Mal aliento persistente</li>
            <li>Encías rojas o sangrantes</li>
            <li>Dificultad para comer</li>
            <li>Babeo excesivo</li>
            <li>Dientes flojos o rotos</li>
          </ul>
          
          <h4>Limpieza Profesional:</h4>
          <p>Recomendada anualmente o según indicación veterinaria. Se realiza bajo anestesia para limpieza profunda y evaluación completa.</p>
        `
      }
    ];
  },

  renderContentCard(item) {
    return `
      <div class="card" onclick="Education.showContent(${item.id})" style="cursor: pointer;">
        <div class="card-body">
          <div style="font-size: 3rem; text-align: center; margin-bottom: 1rem;">${item.icon}</div>
          <h4 style="margin-bottom: 0.5rem;">${item.title}</h4>
          <div class="badge badge-info" style="margin-bottom: 1rem;">${item.category}</div>
          <p class="text-muted" style="font-size: 0.875rem;">${item.summary}</p>
          <button class="btn btn-secondary" style="width: 100%; margin-top: 1rem;">
            Ver Contenido
          </button>
        </div>
      </div>
    `;
  },

  showContent(id) {
    const content = this.getEducationalContent().find(c => c.id === id);
    if (!content) return;

    const modalContent = `
      <div style="font-size: 4rem; text-align: center; margin-bottom: 1rem;">${content.icon}</div>
      <div style="margin-bottom: 2rem;">
        ${content.content}
      </div>
      <div style="display: flex; gap: 1rem;">
        <button class="btn btn-primary" onclick="Education.sendContent(${id})" style="flex: 1;">
          📤 Enviar a Cliente
        </button>
        <button class="btn btn-secondary" onclick="App.closeModal()">
          Cerrar
        </button>
      </div>
    `;

    App.showModal(content.title, modalContent);
  },

  sendContent(id) {
    const content = this.getEducationalContent().find(c => c.id === id);
    if (!content) return;

    App.showNotification('Contenido enviado', `"${content.title}" ha sido enviado al cliente`, 'success');
    App.closeModal();
  }
};
