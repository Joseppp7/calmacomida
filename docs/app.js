const $ = (sel) => document.querySelector(sel);
const screen = $("#screen");
const STORAGE_KEY = "calmacomida_v3";

let state = { done: {}, lastTab: "home" };
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) state = JSON.parse(saved);
} catch(e) { console.log("Error de estado"); }

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function stats() {
  const total = (window.APP_DATA && APP_DATA.modules) ? APP_DATA.modules.length : 0;
  const done  = Object.values(state.done).filter(Boolean).length;
  const pct   = total ? Math.round((done / total) * 100) : 0;
  return { total, done, pct };
}

function setActiveTab(tab) {
  state.lastTab = tab;
  saveState();
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  render(tab);
}

function render(tab) {
  if (!window.APP_DATA) {
    screen.innerHTML = `<div class="card"><p class="p" style="color:red">Error: No se cargó data.js. Revisa que el archivo esté en la carpeta docs.</p></div>`;
    return;
  }
  if (tab === "home") renderHome();
  if (tab === "modules") renderModules();
  if (tab === "audio") renderAudios();
  if (tab === "progress") renderProgress();
}

function renderHome() {
  const { pct } = stats();
  screen.innerHTML = `
    <section class="hero">
      <img class="heroImg" src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=70">
      <div class="heroContent">
        <p class="heroTitle">Tu relación con la comida puede ser más ligera</p>
      </div>
    </section>
    <section class="card" style="margin-top:16px">
      <h2 class="h2">Bienvenida</h2>
      <p class="p">Usa las pestañas de abajo para navegar por el programa.</p>
      <div class="row">
        <button class="btn" id="goMod">Ver Módulos</button>
      </div>
    </section>
  `;
  const btn = $("#goMod");
  if(btn) btn.onclick = () => setActiveTab("modules");
}

function renderModules() {
  const items = APP_DATA.modules.map(m => `
    <div class="item" onclick="openModule('${m.id}')">
      <img src="${m.image || ''}" class="audioThumb" style="width:60px;height:60px;object-fit:cover;border-radius:10px">
      <div style="flex:1">
        <div class="itemTitle">${m.title}</div>
      </div>
      <span>${state.done[m.id] ? "✅" : "⚪"}</span>
    </div>
  `).join("");
  screen.innerHTML = `<section class="card"><h2 class="h2">Módulos</h2><div class="list">${items}</div></section>`;
}

window.openModule = (id) => {
  const m = APP_DATA.modules.find(x => x.id === id);
  const isDone = !!state.done[id];
  screen.innerHTML = `
    <section class="card">
      <button class="chip" onclick="setActiveTab('modules')">← Volver</button>
      <h2 class="h2" style="margin-top:15px">${m.title}</h2>
      <div class="audioBox">
        <audio controls src="${m.audio || ''}"></audio>
      </div>
      <button class="btn" id="btnDone">${isDone ? "Completado ✅" : "Marcar como hecho"}</button>
    </section>
  `;
  $("#btnDone").onclick = () => {
    state.done[id] = !state.done[id];
    saveState();
    openModule(id);
  };
};

function renderAudios() {
  const estados = (APP_DATA.audioStates || []).map(a => `
    <div class="item" onclick="playDirect('${a.file}')">
      <img src="${a.image}" class="audioThumb" style="width:60px;height:60px;object-fit:cover;border-radius:10px">
      <div style="flex:1"><div class="itemTitle">${a.title}</div></div>
      <div style="background:var(--brand);color:white;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center">▶</div>
    </div>
  `).join("");
  screen.innerHTML = `<section class="card"><h2 class="h2">Ayuda Rápida</h2><div class="list">${estados}</div><div id="pCont" style="display:none;margin-top:20px"><audio id="qP" controls style="width:100%"></audio></div></section>`;
}

window.playDirect = (f) => {
  const c = $("#pCont"); const p = $("#qP");
  c.style.display = "block"; p.src = f; p.play();
};

function renderProgress() {
  const { pct } = stats();
  screen.innerHTML = `
    <section class="card" style="text-align:center;padding:40px 20px">
      <div style="font-size:60px">🌱</div>
      <h2 class="h2">Progreso: ${pct}%</h2>
      <div class="progress-container"><div class="progress-bar" style="width:${pct}%"></div></div>
      <button class="btn ghost" style="margin-top:20px" onclick="if(confirm('¿Borrar todo?')){localStorage.clear();location.reload();}">Reiniciar Todo</button>
    </section>
  `;
}

// --- ARRANQUE ---
document.querySelectorAll(".tab").forEach(btn => {
  btn.onclick = () => setActiveTab(btn.dataset.tab);
});

if (window.APP_DATA) {
  setActiveTab(state.lastTab || "home");
} else {
  screen.innerHTML = "Error: No se detecta APP_DATA. Revisa data.js";
}