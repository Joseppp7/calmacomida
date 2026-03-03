/* CalmaComida app.js — versión estable */

(function () {
  var screen = document.getElementById("screen");
  var btnReset = document.getElementById("btnReset");

  var STORAGE_KEY = "calmacomida_state_v3";
  var state = { done: {}, lastTab: "home" };

  function loadState() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      if (s) state = JSON.parse(s);
    } catch (e) {}
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function stats() {
    var total = (window.APP_DATA && window.APP_DATA.modules) ? window.APP_DATA.modules.length : 0;
    var done = 0;
    for (var k in (state.done || {})) if (state.done[k]) done++;
    var pct = total ? Math.round((done / total) * 100) : 0;
    return { total: total, done: done, pct: pct };
  }

  function setActiveTab(tab) {
    state.lastTab = tab;
    saveState();

    var tabs = document.querySelectorAll(".tab");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle("active", tabs[i].getAttribute("data-tab") === tab);
    }
    render(tab);
    window.scrollTo(0, 0);
  }

  function render(tab) {
    if (!window.APP_DATA) {
      screen.innerHTML =
        '<div class="card"><h2 class="h2" style="color:#b00020">Error</h2>' +
        '<p class="p">No se cargó <b>data.js</b> (APP_DATA no existe).</p></div>';
      return;
    }
    if (tab === "home") renderHome();
    else if (tab === "modules") renderModules();
    else if (tab === "audio") renderAudios();
    else if (tab === "progress") renderProgress();
    else renderHome();
  }

  function renderHome() {
    var s = stats();
    var intro = findAudio("intro");
    var cierre = findAudio("cierre");

    screen.innerHTML =
      '<section class="card">' +
        '<h2 class="h2">Cómo usar CalmaComida</h2>' +
        '<p class="p">Sigue este orden para que funcione sin esfuerzo:</p>' +

        '<div class="list">' +
          audioCard(intro, "1) Empieza por la Introducción (una vez).") +
          '<div class="item" onclick="window.__goModules()">' +
            '<div style="flex:1">' +
              '<div class="itemTitle">2) Haz los 7 módulos</div>' +
              '<div class="p" style="font-size:12px;margin-top:4px">En cada módulo: escucha la sesión principal y luego usa la práctica diaria durante la semana.</div>' +
            '</div><div>📚</div>' +
          '</div>' +
          '<div class="item" onclick="window.__goAudios()">' +
            '<div style="flex:1">' +
              '<div class="itemTitle">3) Si tienes un impulso, ve a “Audios”</div>' +
              '<div class="p" style="font-size:12px;margin-top:4px">Ahí tienes Introducción, prácticas diarias y cierre. Úsalos cuando lo necesites.</div>' +
            '</div><div>🆘</div>' +
          '</div>' +
          audioCard(cierre, "4) Al final escucha el Cierre/Mantenimiento.") +
        '</div>' +

        '<div style="margin-top:14px">' +
          '<div class="progress-container"><div class="progress-bar" style="width:' + s.pct + '%"></div></div>' +
          '<p class="p" style="margin-top:10px">Progreso: <b>' + s.done + '/' + s.total + '</b> módulos (' + s.pct + '%)</p>' +
        '</div>' +
      '</section>';

    window.__goModules = function(){ setActiveTab("modules"); };
    window.__goAudios  = function(){ setActiveTab("audio"); };
    window.__play = function(file){
      var a = document.getElementById("homePlayer");
      if (!a) return;
      a.src = file;
      a.play && a.play();
    };
  }

  function renderModules() {
    var mods = window.APP_DATA.modules || [];
    var html = '<section class="card"><h2 class="h2">Módulos</h2><p class="p">Entra en un módulo para ver: objetivo, cómo practicar y los 2 audios.</p><div class="list">';

    for (var i = 0; i < mods.length; i++) {
      var m = mods[i];
      var done = !!(state.done && state.done[m.id]);
      html +=
        '<div class="item" onclick="window.__openModule(\'' + esc(m.id) + '\')">' +
          '<img class="audioThumb" src="' + esc(m.image || "") + '" style="width:64px;height:64px" />' +
          '<div style="flex:1">' +
            '<div class="itemTitle">' + esc(m.title) + '</div>' +
            '<div class="p" style="font-size:12px;margin-top:4px">' + esc(m.goal || "") + '</div>' +
          '</div>' +
          '<div style="font-size:20px">' + (done ? "✅" : "⚪") + '</div>' +
        '</div>';
    }

    html += '</div></section>';
    screen.innerHTML = html;

    window.__openModule = function (id) {
      for (var j = 0; j < mods.length; j++) if (mods[j].id === id) return openModule(mods[j]);
    };
  }

  function openModule(m) {
    var done = !!(state.done && state.done[m.id]);

    screen.innerHTML =
      '<section class="card">' +
        '<button class="chip" onclick="window.__backMods()">← Volver</button>' +
        '<img src="' + esc(m.image || "") + '" style="width:100%;height:180px;object-fit:cover;border-radius:14px;margin:12px 0" />' +
        '<h2 class="h2">' + esc(m.title) + '</h2>' +

        (m.goal ? '<p class="p"><b>Objetivo:</b> ' + esc(m.goal) + '</p>' : '') +
        (m.practice ? '<p class="p" style="margin-top:10px"><b>Cómo usar la práctica diaria:</b> ' + esc(m.practice) + '</p>' : '') +
        (m.expect ? '<p class="p" style="margin-top:10px"><b>Qué puedes esperar:</b> ' + esc(m.expect) + '</p>' : '') +

        '<div style="margin-top:16px; background:#fdf6ee; border:1px solid #eadfd6; padding:14px; border-radius:14px">' +
          '<div style="font-weight:900;color:var(--brand);margin-bottom:8px">🎧 Audio del módulo</div>' +
          '<audio controls preload="metadata" src="' + esc(m.audio || "") + '" style="width:100%"></audio>' +
        '</div>' +

        '<div style="margin-top:12px; background:#fdf6ee; border:1px solid #eadfd6; padding:14px; border-radius:14px">' +
          '<div style="font-weight:900;color:var(--brand);margin-bottom:8px">🧘 Práctica diaria</div>' +
          '<div class="p" style="font-size:12px;margin-bottom:8px">Úsala 1 vez al día (o antes de una comida) durante la semana del módulo.</div>' +
          '<audio controls preload="metadata" src="' + esc(m.daily || "") + '" style="width:100%"></audio>' +
        '</div>' +

        '<button class="btn" id="btnDone" style="margin-top:16px">' + (done ? "✅ Módulo completado" : "Marcar módulo como hecho") + '</button>' +
      '</section>';

    window.__backMods = function(){ setActiveTab("modules"); };

    var b = document.getElementById("btnDone");
    b.onclick = function () {
      state.done = state.done || {};
      state.done[m.id] = !state.done[m.id];
      saveState();
      openModule(m);
    };
  }

  function renderAudios() {
    var list = window.APP_DATA.audios || [];
    var html =
      '<section class="card">' +
        '<h2 class="h2">Audios</h2>' +
        '<p class="p">Aquí tienes la introducción, todos los módulos (sesión y práctica) y el cierre. Si estás en un momento difícil, usa una “práctica diaria”.</p>' +
        '<div class="list">';

    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      html +=
        '<div class="item" onclick="window.__playAudio(\'' + esc(a.file) + '\', \'' + esc(a.title) + '\')">' +
          '<div style="flex:1">' +
            '<div class="itemTitle">' + esc(a.title) + '</div>' +
            '<div class="p" style="font-size:12px;margin-top:4px">Toca para reproducir.</div>' +
          '</div>' +
          '<div style="background:var(--brand);color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center">▶</div>' +
        '</div>';
    }

    html +=
        '</div>' +
        '<div id="audioBox" style="display:none; margin-top:14px; background:#fdf6ee; border:1px solid #eadfd6; padding:14px; border-radius:14px">' +
          '<div id="audioTitle" style="font-weight:900;color:var(--brand)"></div>' +
          '<audio id="audioPlayer" controls preload="metadata" style="width:100%;margin-top:10px"></audio>' +
        '</div>' +
      '</section>';

    screen.innerHTML = html;

    window.__playAudio = function (file, title) {
      var box = document.getElementById("audioBox");
      var t = document.getElementById("audioTitle");
      var p = document.getElementById("audioPlayer");
      t.textContent = title;
      box.style.display = "block";
      p.src = file;
      p.play && p.play();
      box.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  }

  function renderProgress() {
    var s = stats();
    screen.innerHTML =
      '<section class="card" style="padding:0; overflow:hidden">' +
        '<img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=70" style="width:100%;height:180px;object-fit:cover" />' +
        '<div style="padding:18px 18px 20px; text-align:center">' +
          '<div style="font-size:54px">🌱</div>' +
          '<h2 class="h2">Tu Transformación</h2>' +
          '<div class="progress-container" style="margin-top:14px"><div class="progress-bar" style="width:' + s.pct + '%"></div></div>' +
          '<p class="p" style="margin-top:10px">Has completado <b>' + s.done + '/' + s.total + '</b> módulos (' + s.pct + '%)</p>' +
        '</div>' +
      '</section>';
  }

  function findAudio(id) {
    var list = (window.APP_DATA && window.APP_DATA.audios) ? window.APP_DATA.audios : [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function audioCard(a, hint) {
    if (!a) return "";
    return '' +
      '<div class="item" onclick="window.__play(\'' + esc(a.file) + '\')">' +
        '<div style="flex:1">' +
          '<div class="itemTitle">' + esc(a.title) + '</div>' +
          '<div class="p" style="font-size:12px;margin-top:4px">' + esc(hint || "") + '</div>' +
        '</div>' +
        '<div style="background:var(--brand);color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center">▶</div>' +
      '</div>' +
      '<audio id="homePlayer" controls preload="metadata" style="width:100%;margin-top:10px"></audio>';
  }

  function wireReset() {
    if (!btnReset) return;
    btnReset.onclick = function () {
      if (confirm("¿Reiniciar progreso?")) {
        localStorage.removeItem(STORAGE_KEY);
        state = { done: {}, lastTab: "home" };
        setActiveTab("home");
      }
    };
  }

  function wireTabs() {
    var tabs = document.querySelectorAll(".tab");
    for (var i = 0; i < tabs.length; i++) {
      (function (btn) {
        btn.onclick = function () {
          setActiveTab(btn.getAttribute("data-tab"));
        };
      })(tabs[i]);
    }
  }

  // Init
  loadState();
  wireReset();
  wireTabs();
  setActiveTab(state.lastTab || "home");
})();