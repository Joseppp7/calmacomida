const $ = (sel) => document.querySelector(sel);
const screen = $("#screen");
const STORAGE_KEY = "calmacomida_premium_v1";

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
  if (tab === "audio") renderAudios();
  if (tab === "progress") renderProgress();
}

function renderHome() {
  const testHtml = APP_DATA.testimonials.map(t => `
    <div style="background:#fdf6ee; padding:15px; border-radius:12px; margin-bottom:10px; border-left:4px solid var(--brand)">
      <p class="p" style="font-style:italic; font-size:14px">"${t.text}"</p>
      <p style="font-size:12px; font-weight:700; margin-top:5px; color:var(--brand)">— ${t.name}</p>
    </div>
  `).join("");

  screen.innerHTML = `
    <section class="hero" style="position:relative; overflow:hidden; border-radius:20px; height:250px">
      <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=70" style="width:100%; height:100%; object-fit:cover">
      <div style="position:absolute; bottom:0; left:0; right:0; background:linear-gradient(transparent, rgba(0,0,0,0.7)); padding:20px; color:white">
        <h1 style="font-size:24px; font-weight:800">Libérate de la ansiedad por la comida</h1>
      </div>
    </section>

    <section class="card" style="margin-top:20px">
      <h2 class="h2">Tu camino a la calma</h2>
      <p class="p">Un programa diseñado para que dejes de pelear con la comida y empieces a disfrutar de tu cuerpo.</p>
      <button class="btn" onclick="setActiveTab('modules')">Empezar el programa</button>
    </section>

    <section class="card">
      <h2 class="h2" style="font-size:18px">Lo que dicen nuestras usuarias</h2>
      ${testHtml}
    </section>

    <section class="card" style="background:var(--brand); color:white; text-align:center">
      <h2 class="h2" style="color:white">¿Quieres el programa completo?</h2>
      <p style="opacity:0.9; margin-bottom:15px">Desbloquea todos los módulos y audios para siempre.</p>
      <a href="${APP_DATA.buyUrl}" target="_blank" class="btn" style="background:white; color:var(--brand); text-decoration:none; display:block">Comprar ahora - 47€</a>
    </section>
  `;
}

function renderModules() {
  const items = APP_DATA.modules.map(m => `
    <div class="item" onclick="openModule('${m.id}')" style="margin-bottom:10px">
      <img src="${m.image}" class="audioThumb" style="width:70px; height:70px">
      <div style="flex:1">
        <div class="itemTitle">${m.title}</div>
        <div class="p" style="font-size:12px">${m.desc || ''}</div>
      </div>
      <span style="font-size:20px">${state.done[m.id] ? "✅" : "⚪"}</span>
    </div>
  `).join("");
  screen.innerHTML = `<div class="card"><h2 class="h2">Módulos del Programa</h2><div class="list">${items}</div></div>`;
}

window.openModule = function(id) {
  const m = APP_DATA.modules.find(x => x.id === id);
  screen.innerHTML = `
    <div class="card">
      <button class="chip" onclick="setActiveTab('modules')">← Volver a módulos</button>
      <img src="${m.image}" style="width:100%; height:180px; object-fit:cover; border-radius:15px; margin:15px 0">
      <h2 class="h2">${m.title}</h2>
      <p class="p" style="margin-bottom:20px">${m.desc || ''}</p>
      <div style="background:#fdf6ee; padding:20px; border-radius:15px">
        <audio controls src="${m.audio}" style="width:100%"></audio>
      </div>
      <button class="btn" id="btnDone" style="margin-top:20px">
        ${state.done[id] ? "✅ Módulo completado" : "Marcar como completado"}
      </button>
    </div>
  `;
  $("#btnDone").onclick = () => {
    state.done[id] = !state.done[id];
    saveState();
    openModule(id);
  };
};

function renderAudios() {
  const items = APP_DATA.audioStates.map(a => `
    <div class="item" onclick="playAudio('${a.file}', '${a.title}')" style="padding:15px">
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
      <p class="p" style="margin-bottom:15px">Escucha estos audios cuando sientas que pierdes el control.</p>
      <div class="list">${items}</div>
      <div id="playerBox" style="display:none; margin-top:25px; background:#fdf6ee; padding:20px; border-radius:15px; border:1px solid var(--brand)">
        <p id="playingTitle" style="font-weight:700; margin-bottom:10px; color:var(--brand)"></p>
        <audio id="mainPlayer" controls style="width:100%"></audio>
      </div>
    </div>
  `;
}

window.playAudio = function(file, title) {
  const box = $("#playerBox");
  const player = $("#mainPlayer");
  $("#playingTitle").innerText = "Escuchando: " + title;
  box.style.display = "block";
  player.src = file;
  player.play();
  box.scrollIntoView({ behavior: 'smooth' });
};

function renderProgress() {
  const { done, total, pct } = stats();
  screen.innerHTML = `
    <div class="card" style="text-align:center; padding:40px 20px">
      <div style="font-size:60px; margin-bottom:10px">🌱</div>
      <h2 class="h2">Tu Transformación</h2>
      <div class="progress-container" style="height:15px">
        <div class="progress-bar" style="width:${pct}%"></div>
      </div>
      <p class="p" style="margin-top:15px">Has completado el <b>${pct}%</b> del programa.</p>
      <div style="margin-top:30px; display:flex; gap:10px; justify-content:center">
        <div style="background:#fdf6ee; padding:15px; border-radius:12px; flex:1">
          <div style="font-size:20px; font-weight:800">${done}</div>
          <div style="font-size:11px; color:var(--muted)">Hechos</div>
        </div>
        <div style="background:#fdf6ee; padding:15px; border-radius:12px; flex:1">
          <div style="font-size:20px; font-weight:800">${total - done}</div>
          <div style="font-size:11px; color:var(--muted)">Pendientes</div>
        </div>
      </div>
      <button class="btn ghost" style="margin-top:40px; font-size:12px; opacity:0.6" onclick="if(confirm('¿Reiniciar todo?')){localStorage.clear(); location.reload();}">Reiniciar progreso</button>
    </div>
  `;
}

document.querySelectorAll(".tab").forEach(btn => {
  btn.onclick = () => setActiveTab(btn.dataset.tab);
});

setActiveTab(state.lastTab || "home");