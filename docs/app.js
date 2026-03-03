// ===== CALMACOMIDA · APP v707 (FIXED PATHS ../img/) =====

let state = {
  currentTab: 'home',
  currentModule: null,
  progress: JSON.parse(localStorage.getItem('calma_progress') || '{}')
};

// DOM
const screen = document.getElementById('screen');
const tabs = document.querySelectorAll('.tab');
const btnReset = document.getElementById('btnReset');

// Navigation
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    navigate(target);
  });
});

btnReset.addEventListener('click', () => {
  if (confirm('¿Resetear todo el progreso?')) {
    localStorage.clear();
    state.progress = {};
    render();
  }
});

function navigate(tabName) {
  state.currentTab = tabName;
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
  render();
}

// Render
function render() {
  switch(state.currentTab) {
    case 'home': renderHome(); break;
    case 'modules': renderModules(); break;
    case 'audio': renderAudios(); break;
    case 'progress': renderProgress(); break;
  }
}

// HOME
function renderHome() {
  screen.innerHTML = `
    <div class="hero" style="background: linear-gradient(135deg, #7D9D85 0%, #C17B6F 100%); padding: 3rem 1.5rem; text-align: center; color: white; border-radius: 24px; margin-bottom: 2rem;">
      <h1 style="font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 1rem; line-height: 1.3;">
        Recupera la paz con la comida
      </h1>
      <p style="font-size: 1.1rem; opacity: 0.95; margin-bottom: 2rem; line-height: 1.6;">
        Sin dietas. Sin restricciones. Solo tú, aprendiendo a cuidarte de verdad.
      </p>
      <button onclick="navigate('modules')" style="background: white; color: #7D9D85; padding: 1rem 2.5rem; border: none; border-radius: 50px; font-weight: 600; font-size: 1.1rem; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        Comenzar ahora
      </button>
    </div>

    <h2 style="font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 1.5rem; color: #2C3E37;">
      Tu camino hacia la calma
    </h2>
    <div class="grid">
      ${APP_DATA.modules.slice(0, 3).map((mod, i) => `
        <div class="card" onclick="openModule('${mod.id}')" style="cursor: pointer;">
          <div style="width: 100%; height: 180px; border-radius: 16px; overflow: hidden; margin-bottom: 1rem; background: linear-gradient(135deg, #7D9D85 0%, #C17B6F 100%);">
            <img src="img/module-${i + 1}.jpg" alt="${mod.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'">
          </div>
          <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; color: #2C3E37;">${mod.title}</h3>
          <p style="font-size: 0.9rem; color: #6B7C73; line-height: 1.5;">${mod.subtitle}</p>
        </div>
      `).join('')}
    </div>
  `;
}

// MODULES
function renderModules() {
  if (state.currentModule) {
    renderModuleDetail();
    return;
  }

  screen.innerHTML = `
    <h1 style="font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 1.5rem; color: #2C3E37;">
      Módulos de aprendizaje
    </h1>
    <div class="list">
      ${APP_DATA.modules.map((mod, i) => `
        <div class="card" onclick="openModule('${mod.id}')" style="cursor: pointer; display: flex; gap: 1rem; align-items: center;">
          <div style="width: 100px; height: 100px; border-radius: 12px; overflow: hidden; flex-shrink: 0; background: linear-gradient(135deg, #7D9D85 0%, #C17B6F 100%);">
            <img src="img/module-${i + 1}.jpg" alt="${mod.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'">
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.75rem; font-weight: 600; color: #7D9D85; margin-bottom: 0.25rem;">MÓDULO ${i + 1}</div>
            <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.25rem; color: #2C3E37;">${mod.title}</h3>
            <p style="font-size: 0.85rem; color: #6B7C73;">${mod.subtitle}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function openModule(id) {
  state.currentModule = APP_DATA.modules.find(m => m.id === id);
  render();
}

function renderModuleDetail() {
  const mod = state.currentModule;
  const modIndex = APP_DATA.modules.findIndex(m => m.id === mod.id);
  const modNum = modIndex + 1;
  
  screen.innerHTML = `
    <button onclick="closeModule()" style="background: none; border: none; color: #7D9D85; font-size: 1rem; margin-bottom: 1rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; padding: 0;">
      ← Volver a módulos
    </button>

    <div style="width: 100%; height: 240px; border-radius: 20px; overflow: hidden; margin-bottom: 1.5rem; background: linear-gradient(135deg, #7D9D85 0%, #C17B6F 100%);">
      <img src="img/module-${modNum}.jpg" alt="${mod.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'">
    </div>

    <h1 style="font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 0.5rem; color: #2C3E37;">
      ${mod.title}
    </h1>
    <p style="font-size: 1rem; color: #6B7C73; margin-bottom: 2rem; line-height: 1.6;">
      ${mod.subtitle}
    </p>

    <div class="card" style="background: #F4F6F5; border: none;">
      <h3 style="font-size: 0.9rem; font-weight: 600; color: #7D9D85; margin-bottom: 0.5rem;">QUÉ VAS A LOGRAR</h3>
      <p style="color: #2C3E37; line-height: 1.6;">${mod.goal}</p>
    </div>

    <div class="card" style="background: #F4F6F5; border: none;">
      <h3 style="font-size: 0.9rem; font-weight: 600; color: #7D9D85; margin-bottom: 0.5rem;">PRÁCTICA PRINCIPAL</h3>
      <p style="color: #2C3E37; line-height: 1.6;">${mod.practice}</p>
    </div>

    <div class="card" style="background: #F4F6F5; border: none;">
      <h3 style="font-size: 0.9rem; font-weight: 600; color: #7D9D85; margin-bottom: 0.5rem;">QUÉ ESPERAR</h3>
      <p style="color: #2C3E37; line-height: 1.6;">${mod.expect}</p>
    </div>

    <div class="audio-box" style="background: linear-gradient(135deg, #7D9D85 0%, #C17B6F 100%); padding: 1.5rem; border-radius: 16px; margin-top: 2rem;">
      <div style="color: white; font-size: 0.85rem; margin-bottom: 0.5rem; opacity: 0.9;">AUDIO PRINCIPAL</div>
      <audio controls style="width: 100%; margin-top: 0.5rem;">
        <source src="${mod.audio}" type="audio/mpeg">
      </audio>
    </div>

    ${mod.daily ? `
      <div class="audio-box" style="background: linear-gradient(135deg, #A8BFA8 0%, #D4A89A 100%); padding: 1.5rem; border-radius: 16px; margin-top: 1rem;">
        <div style="color: white; font-size: 0.85rem; margin-bottom: 0.5rem; opacity: 0.9;">PRÁCTICA DIARIA</div>
        <audio controls style="width: 100%; margin-top: 0.5rem;">
          <source src="${mod.daily}" type="audio/mpeg">
        </audio>
      </div>
    ` : ''}
  `;
}

function closeModule() {
  state.currentModule = null;
  render();
}

// AUDIOS
function renderAudios() {
  screen.innerHTML = `
    <h1 style="font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 1.5rem; color: #2C3E37;">
      Sesiones guiadas
    </h1>
    <div class="list">
      ${APP_DATA.audios.map(audio => `
        <div class="card" style="display: flex; gap: 1rem; align-items: center;">
          <div style="width: 80px; height: 80px; border-radius: 12px; background: linear-gradient(135deg, #7D9D85 0%, #C17B6F 100%); flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 1.5rem;">▶</span>
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.75rem; font-weight: 600; color: #7D9D85; margin-bottom: 0.25rem;">${audio.category}</div>
            <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem; color: #2C3E37;">${audio.title}</h3>
            <p style="font-size: 0.85rem; color: #6B7C73;">${audio.duration}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// PROGRESS
function renderProgress() {
  const completed = Object.keys(state.progress).length;
  const total = APP_DATA.modules.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  screen.innerHTML = `
    <h1 style="font-family: 'Playfair Display', serif; font-size: 1.8rem; margin-bottom: 1.5rem; color: #2C3E37;">
      Tu progreso
    </h1>
    
    <div class="card" style="text-align: center; padding: 2rem;">
      <div style="font-size: 3rem; font-weight: 700; color: #7D9D85; margin-bottom: 0.5rem;">${percent}%</div>
      <p style="color: #6B7C73; font-size: 1rem;">completado</p>
      <div style="width: 100%; height: 8px; background: #E8EBE9; border-radius: 10px; margin-top: 1.5rem; overflow: hidden;">
        <div style="width: ${percent}%; height: 100%; background: linear-gradient(90deg, #7D9D85 0%, #C17B6F 100%); transition: width 0.3s;"></div>
      </div>
    </div>

    <p style="color: #6B7C73; text-align: center; margin-top: 2rem; line-height: 1.6;">
      Has completado ${completed} de ${total} módulos.<br>
      Cada paso cuenta. Sigue adelante.
    </p>
  `;
}

// Init
render();