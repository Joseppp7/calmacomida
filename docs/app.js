const $ = (sel) => document.querySelector(sel);
const screen = $("#screen");
const STORAGE_KEY = "calmacomida_premium_v2";

let state = { done: {}, lastTab: "home" };
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) state = JSON.parse(saved);
} catch (e) {}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function stats() {
  const total = (window.APP_DATA?.modules || []).length;
  const done = Object.values(state.done || {}).filter(Boolean).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return { total, done, pct };
}

function setActiveTab(tab) {
  state.lastTab = tab;
  saveState();
  document.querySelectorAll(".tab").forEach((b) =>
    b.classList.toggle("active", b.dataset.tab === tab)
  );
  render(tab);
  window.scrollTo(0, 0);
}

function render(tab) {
  if (!window.APP_DATA) {
    screen.innerHTML = `
      <div class="card">
        <h2 class="h2" style="color:#b00020">Error</h2>
        <p class="p">No se cargó <b>data.js</b> (APP_DATA no existe).</p>
      </div>`;
    return;
  }
  if (tab === "home") renderHome();
  if (tab === "modules") renderModules();
  if (tab === "audio") renderHelp();
  if (tab === "progress") renderProgress();
}

function renderHome() {
  const { pct, done, total } = stats();
  const tHtml = (APP_DATA.testimonials || [])
    .map(
      (t) => `
      <div style="background:#fdf6ee; padding:14px; border-radius:12px; border-left:4px solid var(--brand); margin-top:10px">
        <div class="p" style="font-style:italic">“${t.text}”</div>
        <div style="margin-top:6px; font-weight:800; font-size:12px; color:var(--brand)">— ${t.name}</div>
      </div>`
    )
    .join("");

  screen.innerHTML = `
    <section class="card" style="padding:0; overflow:hidden">
      <img class="heroImg" src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=70" style="border-radius:0;height:220px">
      <div style="padding:18px 18px 20px">
        <h2 class="h2" style="margin-bottom:6px">${APP_DATA.name}</h2>
        <p class="p">${APP_DATA.subtitle || ""}</p>

        <div style="margin-top:14px; background:#fdf6ee; border:1px solid #eadfd6; padding:14px; border-radius:14px">
          <div style="font-weight:800; color:var(--brand); margin-bottom:6px">Cómo usar la app (2 minutos al día)</div>
          <ul class="p" style="padding-left:18px">
            <li><b>Empieza por Módulos</b>: escucha 1 audio y marca “Completado”.</li>
            <li><b>Ayuda</b>: úsalo en el momento del impulso/ansiedad/culpa (es tu botón SOS).</li>
            <li><b>Progreso</b>: mira tu avance (${done}/${total} módulos · ${pct}%).</li>
          </ul>
        </div>

        <button class="btn" id="btnStart">Empezar ahora</button>
        <button class="btn ghost" id="btnHelp">Necesito ayuda rápida</button>
      </div>
    </section>

    <section class="card">
      <h2 class="h2" style="font-size:18px">Tu avance</h2>
      <div class="progress-container"><div class="progress-bar" style="width:${pct}%"></div></div>
      <p class="p" style="margin-top:10px">Vas por el <b>${pct}%</b> (${done}/${total} módulos)</p>
    </section>

    ${
      tHtml
        ? `<section class="card"><h2 class="h2" style="font-size:18px">Lo que dicen</h2>${tHtml}</section>`
        : ``
    }
  `;

  $("#btnStart").onclick = () => setActiveTab("modules");
  $("#btnHelp").onclick = () => setActiveTab("audio");
}

function renderModules() {
  const items = (APP_DATA.modules || [])
    .map(
      (m) => `
    <div class="item" onclick="openModule('${m.id}')">
      <img src="${m.image || ""}" class="audioThumb" style="width:70px;height:70px">
      <div style="flex:1">
        <div class="itemTitle">${m.title}</div>
        <div class="p" style="font-size:12px; margin-top:4px">${m.desc || ""}</div>
      </div>
      <div style="font-size:20px">${state.done?.[m.id] ? "✅" : "⚪"}</div>
    </div>`
    )
    .join("");

  screen.innerHTML = `
    <section class="card">
      <h2 class="h2">Módulos 📚</h2>
      <p class="p">Escucha y marca como completado. Sin prisa, sin juicio.</p>
      <div class="list">${items}</div>
    </section>`;
}

window.openModule = function (id) {
  const m = (APP_DATA.modules || []).find((x) => x.id === id);
  if (!m) return;

  const isDone = !!state.done?.[id];

  screen.innerHTML = `
    <section class="card">
      <button class="chip" id="backMods">← Volver</button>
      <img src="${m.image || ""}" style="width:100%;height:170px;object-fit:cover;border-radius:14px;margin:14px 0">
      <h2 class="h2">${m.title}</h2>
      ${m.desc ? `<p class="p" style="margin-top:6px">${m.desc}</p>` : ""}

      <div style="margin-top:16px; background:#fdf6ee; border:1px solid #eadfd6; padding:16px; border-radius:14px">
        <div style="font-weight:800; color:var(--brand); margin-bottom:8px">Audio del módulo</div>
        <audio controls preload="metadata" src="${m.audio || ""}"></audio>
        <div class="p" style="font-size:12px; margin-top:8px">
          Si no se reproduce, revisa que el archivo exista en la carpeta <b>/audio</b> y que el nombre coincida.
        </div>
      </div>

      <button class="btn" id="toggleDone">${isDone ? "✅ Completado" : "Marcar como hecho"}</button>
    </section>
  `;

  $("#backMods").onclick = () => setActiveTab("modules");
  $("#toggleDone").onclick = () => {
    state.done = state.done || {};
    state.done[id] = !state.done[id];
    saveState();
    openModule(id);
  };
};

function renderHelp() {
  const items = (APP_DATA.audioStates || [])
    .map(
      (a) => `
    <div class="item" onclick="playHelp('${a.file}', '${escapeHtml(a.title)}', '${escapeHtml(a.desc || "")}')">
      <img src="${a.image || ""}" class="audioThumb" style="width:60px;height:60px">
      <div style="flex:1">
        <div class="itemTitle">${a.title}</div>
        <div class="p" style="font-size:12px; margin-top:4px">${a.desc || ""}</div>
      </div>
      <div style="background:var(--brand);color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0">▶</div>
    </div>`
    )
    .join("");

  screen.innerHTML = `
    <section class="card">
      <h2 class="h2">Ayuda Rápida 🆘</h2>
      <p class="p">Elige cómo te sientes. Te acompaño ahora mismo.</p>
      <div class="list">${items}</div>

      <div id="playerBox" style="display:none; margin-top:18px; background:#fdf6ee; border:1px solid #eadfd6; padding:16px; border-radius:14px">
        <div id="pTitle" style="font-weight:900; color:var(--brand)"></div>
        <div id="pDesc" class="p" style="font-size:12px; margin-top:6px"></div>
        <audio id="helpPlayer" controls preload="metadata" style="margin-top:12px"></audio>
      </div>
    </section>
  `;
}

window.playHelp = function (file, title, desc) {
  const box = $("#playerBox");
  const p = $("#helpPlayer");
  $("#pTitle").textContent = title || "";
  $("#pDesc").textContent = desc || "";
  box.style.display = "block";
  p.src = file;
  p.play().catch(() => {});
  box.scrollIntoView({ behavior: "smooth", block: "start" });
};

function renderProgress() {
  const { done, total, pct } = stats();
  const progressImg =
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=70";

  screen.innerHTML = `
    <section class="card" style="padding:0; overflow:hidden">
      <img src="${progressImg}" style="width:100%;height:180px;object-fit:cover">
      <div style="padding:18px 18px 20px; text-align:center">
        <div style="font-size:54px">🌱</div>
        <h2 class="h2">Tu Transformación</h2>
        <div class="progress-container" style="margin-top:14px"><div class="progress-bar" style="width:${pct}%"></div></div>
        <p class="p" style="margin-top:10px">Has completado <b>${pct}%</b> — ${done}/${total} módulos</p>

        <button class="btn ghost" id="reset" style="margin-top:14px; font-size:12px; opacity:.75">Reiniciar progreso</button>
      </div>
    </section>
  `;

  $("#reset").onclick = () => {
    if (confirm("¿Seguro que quieres borrar tu progreso?")) {
      localStorage.removeItem(STORAGE_KEY);
      state = { done: {}, lastTab: "home" };
      setActiveTab("home");
    }
  };
}

function escapeHtml(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<​", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Arranque
document.querySelectorAll(".tab").forEach((btn) => {
  btn.onclick = () => setActiveTab(btn.dataset.tab);
});
setActiveTab(state.lastTab || "home");