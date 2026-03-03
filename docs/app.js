const $ = (sel) => document.querySelector(sel);
const screen = $("#screen");
const STORAGE_KEY = "calmacomida_vfinal";

let state = { done: {}, lastTab: "home" };
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) state = JSON.parse(saved);
} catch(e) {}

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function stats() {
  const total = APP_DATA.modules.length;
  const done  = Object.values(state.done).filter(Boolean).length;
  const pct   = total ? Math.round((done / total) * 100) : 0;
  return { total, done, pct };
}

function setActiveTab(tab) {
  state.lastTab = tab;
  saveState();
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  render(tab);
  window.scrollTo(0,0);
}

function render(tab) {
  if (tab === "home") renderHome();
  if (tab === "modules") renderModules();
  if (tab === "audio") renderHelp();
  if (tab === "progress") renderProgress();
}

function renderHome() {
  screen.innerHTML = `
    <section class="card" style="padding:0; overflow:hidden">
      <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=70" style="width:100%; height:200px; object-fit:cover">
      <div style="padding:20px">
        <h2 class="h2">Bienvenida a CalmaComida 🌿</h2>
        <p class="p">Sigue este orden para obtener los mejores resultados:</p>
        
        <div style="margin-top:15px; display:flex; flex-direction:column; gap:10px">
          <div class="item" onclick="playExtra('intro')" style="background:#fdf6ee; border:1px solid var(--brand)">
            <div style="flex:1">
              <div class="itemTitle">${APP_DATA.extras.intro.title}</div>
              <div class="p" style="font-size:12px">${APP_DATA.extras.intro.desc}</div>
            </div>
            <div style="background:var(--brand); color:white; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center">▶</div>
          </div>

          <div class="item" onclick="setActiveTab('modules')">
            <div style="flex:1">
              <div class="itemTitle">3. Los 7 Módulos</div>
              <div class="p" style="font-size:12px">El núcleo del programa. Haz uno por semana.</div>
            </div>
            <span>📚</span>
          </div>

          <div class="item" onclick="playExtra('cierre')" style="background:#fdf6ee; border:1px solid var(--brand)">
            <div style="flex:1">
              <div class="itemTitle">${APP_DATA.extras.cierre.title}</div>
              <div class="p" style="font-size:12px">${APP_DATA.extras.cierre.desc}</div>
            </div>
            <div style="background:var(--brand); color:white; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center">▶</div>
          </div>
        </div>

        <div id="extraPlayer" style="display:none; margin-top:20px; padding:15px; background:white; border-radius:12px; box-shadow:var(--shadow)">
          <p id="extraTitle" style="font-weight:700; color:var(--brand); margin-bottom:8px"></p>
          <audio id="audioExtra" controls style="width:100%"></audio>
        </div>
      </div>
    </section>
  `;
}

window.playExtra = (type) => {
  const data = APP_DATA.extras[type];
  const box = $("#extraPlayer");
  const player = $("#audioExtra");
  $("#extraTitle").innerText = data.title;
  box.style.display = "block";
  player.src = data.file;
  player.play();
  box.scrollIntoView({ behavior: 'smooth' });
};

function renderModules() {
  const items = APP_DATA.modules.map(m => `
    <div class="item" onclick="openModule('${m.id}')">
      <img src="${m.image}" class="audioThumb" style="width:60px; height:60px">
      <div style="flex:1">
        <div class="itemTitle">${m.title}</div>
        <div class="p" style="font-size:12px">${m.desc}</div>
      </div>
      <span>${state.done[m.id] ? "✅" : "⚪"}</span>
    </div>
  `).join("");
  screen.innerHTML = `<div class="card"><h2 class="h2">Módulos del Programa</h2><div class="list">${items}</div></div>`;
}

window.openModule = (id) => {
  const m = APP_DATA.modules.find(x => x.id === id);
  screen.innerHTML = `
    <div class="card">
      <button class="chip" onclick="setActiveTab('modules')">← Volver</button>
      <h2 class="h2" style="margin-top:15px">${m.title}</h2>
      <p class="p" style="margin-bottom:20px">${m.desc}</p>
      
      <div style="display:flex; flex-direction:column; gap:15px">
        <div style="background:#fdf6ee; padding:15px; border-radius:15px; border:1px solid #eadfd6">
          <p style="font-weight:700; color:var(--brand); margin-bottom:5px">🎧 1. Audio del Módulo</p>
          <p class="p" style="font-size:12px; margin-bottom:10px">Escucha la teoría y los conceptos clave.</p>
          <audio controls src="${m.audioMain}" style="width:100%"></audio>
        </div>

        <div style="background:#fdf6ee; padding:15px; border-radius:15px; border:1px solid #eadfd6">
          <p style="font-weight:700; color:var(--brand); margin-bottom:5px">🧘 2. Práctica Diaria</p>
          <p class="p" style="font-size:12px; margin-bottom:10px">Usa este audio cada día de la semana para integrar el hábito.</p>
          <audio controls src="${m.audioDaily}" style="width:100%"></audio>
        </div>
      </div>

      <button class="btn" id="btnDone" style="margin-top:20px">
        ${state.done[id] ? "✅ Módulo completado" : "Marcar módulo como hecho"}
      </button>
    </div>
  `;
  $("#btnDone").onclick = () => {
    state.done[id] = !state.done[id];
    saveState();
    openModule(id);
  };
};

function renderHelp() {
  const items = APP_DATA.helpNow.map(a => `
    <div class="item" onclick="playHelp('${a.file}', '${a.title}')">
      <img src="${a.image}" class="audioThumb" style="width:60px; height:60px">
      <div style="flex:1">
        <div class="itemTitle">${a.title}</div>
        <p class="p" style="font-size:12px">${a.desc}</p>
      </div>
      <div style="background:var(--brand); color:white; width:35px; height:35px; border-radius:50%; display:flex; align-items:center; justify-content:center">▶</div>
    </div>
  `).join("");
  screen.innerHTML = `
    <div class="card">
      <h2 class="h2">Ayuda Rápida 🆘</h2>
      <p class="p" style="margin-bottom:15px">Pulsa según cómo te sientes ahora mismo.</p>
      <div class="list">${items}</div>
      <div id="helpBox" style="display:none; margin-top:20px; background:#fdf6ee; padding:15px; border-radius:12px">
        <p id="helpTitle" style="font-weight:700; color:var(--brand); margin-bottom:8px"></p>
        <audio id="audioHelp" controls style="width:100%"></audio>
      </div>
    </div>
  `;
}

window.playHelp = (file, title) => {
  const box = $("#helpBox");
  const player = $("#audioHelp");
  $("#helpTitle").innerText = "Escuchando: " + title;
  box.style.display = "block";
  player.src = file;
  player.play();
  box.scrollIntoView({ behavior: 'smooth' });
};

function renderProgress() {
  const { done, total, pct } = stats();
  screen.innerHTML = `
    <div class="card" style="text-align:center; padding:40px 20px">
      <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=70" style="width:100%; height:180px; object-fit:cover; border-radius:15px; margin-bottom:20px">
      <div style="font-size:60px">🌱</div>
      <h2 class="h2">Tu Transformación</h2>
      <div class="progress-container"><div class="progress-bar" style="width:${pct}%"></div></div>
      <p class="p" style="margin-top:15px">Has completado el <b>${pct}%</b> del programa.</p>
      <button class="btn ghost" style="margin-top:30px; opacity:0.6" onclick="if(confirm('¿Reiniciar?')){localStorage.clear(); location.reload();}">Reiniciar progreso</button>
    </div>
  `;
}

document.querySelectorAll(".tab").forEach(btn => {
  btn.onclick = () => setActiveTab(btn.dataset.tab);
});

setActiveTab(state.lastTab || "home");