const $ = (sel) => document.querySelector(sel);
const screen = $("#screen");
const STORAGE_KEY = "calmacomida_v1";

let state = { done: {}, lastTab: "home" };
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) state = JSON.parse(saved);
} catch(e) {}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function stats() {
  const total = APP_DATA.modules.length;
  const done  = Object.values(state.done).filter(Boolean).length;
  const pct   = total ? Math.round((done / total) * 100) : 0;
  return { total, done, pct };
}

function setActiveTab(tab) {
  state.lastTab = tab;
  saveState();
  document.querySelectorAll(".tab").forEach(b => {
    b.classList.toggle("active", b.dataset.tab === tab);
  });
  render(tab);
}

function render(tab) {
  if (tab === "home")     renderHome();
  if (tab === "modules")  renderModules();
  if (tab === "audio")    renderAudios();
  if (tab === "progress") renderProgress();
}

function renderHome() {
  screen.innerHTML = `
    <img class="heroImg" src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=70">
    <div class="card" style="margin-top:16px">
      <h2 class="h2">Bienvenida 🌿</h2>
      <p class="p">Este es tu espacio para trabajar tu relación con la comida, paso a paso y sin juicios.</p>
      <button class="btn" id="goMod">Empezar con los módulos</button>
    </div>
  `;
  $("#goMod").onclick = () => setActiveTab("modules");
}

function renderModules() {
  const items = APP_DATA.modules.map(m => `
    <div class="item" onclick="openModule('${m.id}')">
      <img src="${m.image}" class="audioThumb" style="width:60px;height:60px">
      <div style="flex:1"><div class="itemTitle">${m.title}</div></div>
      <span>${state.done[m.id] ? "✅" : "⚪"}</span>
    </div>
  `).join("");
  screen.innerHTML = `
    <div class="card">
      <h2 class="h2">Módulos 📚</h2>
      <div class="list">${items}</div>
    </div>
  `;
}

window.openModule = function(id) {
  const m = APP_DATA.modules.find(x => x.id === id);
  screen.innerHTML = `
    <div class="card">
      <button class="chip" id="btnVolver">← Volver</button>
      <h2 class="h2" style="margin-top:16px">${m.title}</h2>
      <audio controls src="${m.audio}"></audio>
      <button class="btn" id="btnDone" style="margin-top:16px">
        ${state.done[id] ? "✅ Completado" : "Marcar como hecho"}
      </button>
    </div>
  `;
  $("#btnVolver").onclick = () => renderModules();
  $("#btnDone").onclick = () => {
    state.done[id] = !state.done[id];
    saveState();
    openModule(id);
  };
};

function renderAudios() {
  const items = APP_DATA.audioStates.map(a => `
    <div class="item" onclick="playAudio('${a.file}')">
      <img src="${a.image}" class="audioThumb" style="width:60px;height:60px">
      <div style="flex:1">
        <div class="itemTitle">${a.title}</div>
        <div class="p" style="font-size:13px">${a.desc}</div>
      </div>
      <div style="background:var(--brand);color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0">▶</div>
    </div>
  `).join("");
  screen.innerHTML = `
    <div class="card">
      <h2 class="h2">Ayuda Rápida 🆘</h2>
      <p class="p">Pulsa según cómo te sientes ahora mismo.</p>
      <div class="list">${items}</div>
      <div id="playerBox" style="display:none;margin-top:20px">
        <audio id="mainPlayer" controls style="width:100%"></audio>
      </div>
    </div>
  `;
}

window.playAudio = function(file) {
  const box    = $("#playerBox");
  const player = $("#mainPlayer");
  box.style.display = "block";
  player.src = file;
  player.play();
};

function renderProgress() {
  const { done, total, pct } = stats();
  screen.innerHTML = `
    <div class="card" style="text-align:center;padding:30px 20px">
      <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=70" style="width:100%;height:160px;object-fit:cover;border-radius:12px;margin-bottom:20px">
      <div style="font-size:50px">🌱</div>
      <h2 class="h2" style="margin-top:10px">Tu Transformación</h2>
      <div class="progress-container">
        <div class="progress-bar" style="width:${pct}%"></div>
      </div>
      <p class="p" style="margin-top:10px">Has completado el <b>${pct}%</b> — ${done} de ${total} módulos</p>
      <button class="btn ghost" style="margin-top:20px" id="btnReset">Reiniciar progreso</button>
    </div>
  `;
  $("#btnReset").onclick = () => {
    if (confirm("¿Borrar todo tu progreso?")) {
      localStorage.removeItem(STORAGE_KEY);
      state = { done: {}, lastTab: "home" };
      setActiveTab("home");
    }
  };
}

// ARRANQUE
document.querySelectorAll(".tab").forEach(btn => {
  btn.onclick = () => setActiveTab(btn.dataset.tab);
});

setActiveTab(state.lastTab || "home");