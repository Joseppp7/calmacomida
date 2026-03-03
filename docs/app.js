// CalmaComida Premium Engine 2026
const $ = (sel) => document.querySelector(sel);
const screen = $("#screen");
const STORAGE_KEY = "calmacomida_v4";

let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { done: {}, lastTab: "home" };

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function setActiveTab(tab) {
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  state.lastTab = tab;
  save();
  render(tab);
}

function render(tab) {
  if (tab === "home") renderHome();
  if (tab === "modules") renderModules();
  if (tab === "audio") renderAudios();
  if (tab === "progress") renderProgress();
}

function renderHome() {
  const done = Object.values(state.done).filter(Boolean).length;
  const total = APP_DATA.modules.length;
  
  screen.innerHTML = `
    <div class="hero">
      <img class="heroImg" src="${APP_DATA.coverImage}">
      <div class="heroContent">
        <h2 style="margin:0">Tu camino a la paz</h2>
        <p style="opacity:0.9">Regula tu relación con la comida sin dietas ni lucha.</p>
      </div>
    </div>
    
    <div class="card">
      <h3>¿Cómo te sientes hoy?</h3>
      <p>Si tienes un momento difícil ahora mismo, ve directo a Ayuda Rápida.</p>
      <button class="btn" id="btnQuick">Ayuda Rápida</button>
      <button class="btn ghost" id="btnStart">Continuar Programa</button>
    </div>

    <div class="card">
      <h3>Tu progreso</h3>
      <p>Has completado <b>${done} de ${total}</b> pasos de tu transformación.</p>
    </div>
  `;
  
  $("#btnQuick").onclick = () => setActiveTab("audio");
  $("#btnStart").onclick = () => setActiveTab("modules");
}

function renderModules() {
  const list = APP_DATA.modules.map(m => `
    <div class="item" onclick="openModule('${m.id}')">
      <img src="${m.image}" class="audioThumb">
      <div style="flex:1">
        <div style="font-weight:800">${m.title}</div>
        <div style="font-size:12px; color:var(--muted)">${m.desc}</div>
      </div>
      <div>${state.done[m.id] ? '✅' : '⚪'}</div>
    </div>
  `).join("");
  
  screen.innerHTML = `<div class="card"><h2>Programa Guiado</h2>${list}</div>`;
}

function openModule(id) {
  const m = APP_DATA.modules.find(x => x.id === id);
  screen.innerHTML = `
    <div class="card">
      <button class="btn ghost" onclick="renderModules()" style="width:auto; padding:8px 15px">← Volver</button>
      <h2 style="margin-top:15px">${m.title}</h2>
      <img src="${m.image}" style="width:100%; border-radius:15px; margin:10px 0">
      <p><i>"${m.phrase}"</i></p>
      <div style="background:var(--soft); padding:15px; border-radius:15px; margin:15px 0">
        <b>Objetivo:</b> ${m.goal}
      </div>
      <audio controls src="${m.audio}" style="width:100%"></audio>
      <button class="btn" onclick="toggleDone('${m.id}')">${state.done[m.id] ? 'Completado ✓' : 'Marcar como hecho'}</button>
    </div>
  `;
}

window.toggleDone = (id) => {
  state.done[id] = !state.done[id];
  save();
  openModule(id);
};

function renderAudios() {
  const quick = APP_DATA.audioStates.map(a => `
    <div class="item" onclick="playAudio('${a.file}')">
      <img src="${a.image}" class="audioThumb">
      <div>
        <div style="font-weight:800">${a.title}</div>
        <div style="font-size:12px">${a.desc}</div>
      </div>
    </div>
  `).join("");

  screen.innerHTML = `
    <div class="card">
      <h2>Ayuda Rápida</h2>
      <p>Audios cortos para momentos críticos.</p>
      ${quick}
    </div>
    <div class="card">
      <audio id="mainPlayer" controls style="width:100%"></audio>
    </div>
  `;
}

window.playAudio = (file) => {
  const p = $("#mainPlayer");
  p.src = file;
  p.play();
};

function renderProgress() {
  const done = Object.values(state.done).filter(Boolean).length;
  screen.innerHTML = `
    <div class="card" style="text-align:center">
      <h2>Tu Transformación</h2>
      <div style="font-size:48px; margin:20px 0">🌱</div>
      <p>Has dado <b>${done}</b> pasos hacia una vida más libre.</p>
      <button class="btn ghost" onclick="if(confirm('¿Resetear?')) {state.done={}; save(); render('progress');}">Reiniciar progreso</button>
    </div>
  `;
}

// Inicialización
document.querySelectorAll(".tab").forEach(t => t.onclick = () => setActiveTab(t.dataset.tab));
setActiveTab("home");