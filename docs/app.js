// ===== CALMACOMIDA · APP v702 (con gradientes) =====
(function () {
  'use strict';

  // ── Estado ──────────────────────────────────────────────
  var STORAGE_KEY = 'calmacomida_v3';
  var state = load();

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) {}
  }

  // ── Referencias DOM ─────────────────────────────────────
  var screen   = document.getElementById('screen');
  var tabs     = document.querySelectorAll('.tab');
  var btnReset = document.getElementById('btnReset');

  // ── Navegación ──────────────────────────────────────────
  var currentTab = 'home';

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      render(currentTab);
    });
  });

  btnReset.addEventListener('click', function () {
    if (confirm('¿Reiniciar todo el progreso?')) {
      state = {};
      save();
      render(currentTab);
    }
  });

  // ── Gradientes por módulo ───────────────────────────────
  var gradients = [
    'linear-gradient(135deg, #7D9D85 0%, #A8C5B0 100%)',
    'linear-gradient(135deg, #D4A373 0%, #E8C9A0 100%)',
    'linear-gradient(135deg, #2C3E3A 0%, #5A6F68 100%)',
    'linear-gradient(135deg, #A8C5B0 0%, #7D9D85 100%)',
    'linear-gradient(135deg, #E8C9A0 0%, #D4A373 100%)',
    'linear-gradient(135deg, #7D9D85 0%, #D4A373 100%)',
    'linear-gradient(135deg, #5A6F68 0%, #7D9D85 100%)'
  ];

  function getGradient(index) {
    return gradients[index % gradients.length];
  }

  // ── Render principal ────────────────────────────────────
  function render(tab) {
    screen.innerHTML = '';
    if (tab === 'home')     renderHome();
    if (tab === 'modules')  renderModules();
    if (tab === 'audio')    renderAudios();
    if (tab === 'progress') renderProgress();
  }

  // ── INICIO ──────────────────────────────────────────────
  function renderHome() {
    var done = Object.keys(state).filter(function (k) { return state[k] && state[k].done; }).length;
    var total = APP_DATA.modules.length;

    screen.innerHTML =
      '<div class="hero">' +
        '<div class="heroContent">' +
          '<h2 class="heroTitle">Recupera la paz<br>con la comida</h2>' +
          '<p class="heroText">Sin dietas. Sin culpa. Solo comprensión y herramientas reales para ti.</p>' +
        '</div>' +
      '</div>' +

      '<div class="grid2">' +
        '<div class="kpi"><b>' + done + ' / ' + total + '</b><small>Módulos completados</small></div>' +
        '<div class="kpi"><b>' + (done > 0 ? '🌱 En camino' : '✨ Empieza hoy') + '</b><small>Tu progreso personal</small></div>' +
      '</div>' +

      '<p class="section-title">Continúa tu camino</p>' +
      '<div class="list" id="homeModuleList"></div>';

    var list = document.getElementById('homeModuleList');
    var modules = APP_DATA.modules.slice(0, 3);
    modules.forEach(function (m, idx) {
      var isDone = state[m.id] && state[m.id].done;
      var el = document.createElement('div');
      el.className = 'item';
      el.innerHTML =
        '<div class="itemThumb" style="background: ' + getGradient(idx) + '"></div>' +
        '<div class="itemInfo">' +
          '<div class="itemTitle">' + m.title + '</div>' +
          '<div class="itemSub">' + m.subtitle + '</div>' +
        '</div>' +
        '<span class="badge' + (isDone ? ' done' : '') + '">' + (isDone ? '✓ Hecho' : 'Ver') + '</span>';
      el.addEventListener('click', function () { openModule(m, idx); });
      list.appendChild(el);
    });
  }

  // ── MÓDULOS ─────────────────────────────────────────────
  function renderModules() {
    screen.innerHTML = '<p class="section-title">Tus 7 módulos</p><div class="list" id="moduleList"></div>';
    var list = document.getElementById('moduleList');
    APP_DATA.modules.forEach(function (m, idx) {
      var isDone = state[m.id] && state[m.id].done;
      var el = document.createElement('div');
      el.className = 'item';
      el.innerHTML =
        '<div class="itemThumb" style="background: ' + getGradient(idx) + '"></div>' +
        '<div class="itemInfo">' +
          '<div class="itemTitle">' + m.title + '</div>' +
          '<div class="itemSub">' + m.subtitle + '</div>' +
        '</div>' +
        '<span class="badge' + (isDone ? ' done' : '') + '">' + (isDone ? '✓' : '→') + '</span>';
      el.addEventListener('click', function () { openModule(m, idx); });
      list.appendChild(el);
    });
  }

  // ── DETALLE MÓDULO ──────────────────────────────────────
  function openModule(m, idx) {
    var isDone = state[m.id] && state[m.id].done;
    screen.innerHTML =
      '<div class="moduleHero" style="background: ' + getGradient(idx) + '"></div>' +
      '<div class="card"><div class="card-body">' +
        '<h2 class="h2">' + m.title + '</h2>' +
        '<p class="p">' + m.subtitle + '</p>' +
      '</div></div>' +

      '<div class="moduleInfo">' +
        '<p class="h3">🎯 Objetivo</p>' +
        '<p class="p">' + m.goal + '</p>' +
      '</div>' +
      '<div class="moduleInfo">' +
        '<p class="h3">🌿 Práctica</p>' +
        '<p class="p">' + m.practice + '</p>' +
      '</div>' +
      '<div class="moduleInfo">' +
        '<p class="h3">💛 Qué esperar</p>' +
        '<p class="p">' + m.expect + '</p>' +
      '</div>' +

      '<div class="audioBox">' +
        '<div class="audioLabel">🎧 Sesión principal</div>' +
        '<audio controls preload="none" src="' + m.audio + '"></audio>' +
      '</div>' +
      '<div class="audioBox">' +
        '<div class="audioLabel">🌱 Práctica diaria</div>' +
        '<audio controls preload="none" src="' + m.daily + '"></audio>' +
      '</div>' +

      '<div class="row mt">' +
        '<button class="btn ghost" id="btnBack">← Volver</button>' +
        '<button class="btn' + (isDone ? ' accent' : '') + '" id="btnDone">' +
          (isDone ? '✓ Completado' : 'Marcar como hecho') +
        '</button>' +
      '</div>';

    document.getElementById('btnBack').addEventListener('click', function () {
      render(currentTab);
    });
    document.getElementById('btnDone').addEventListener('click', function () {
      if (!state[m.id]) state[m.id] = {};
      state[m.id].done = !state[m.id].done;
      save();
      openModule(m, idx);
    });
  }

  // ── AUDIOS ──────────────────────────────────────────────
  function renderAudios() {
    screen.innerHTML = '<p class="section-title">Sesiones de calma</p><div class="list" id="audioList"></div>';
    var list = document.getElementById('audioList');
    APP_DATA.audios.forEach(function (a, idx) {
      var el = document.createElement('div');
      el.className = 'item';
      el.innerHTML =
        '<div class="itemThumb" style="background: ' + getGradient(idx) + '"></div>' +
        '<div class="itemInfo">' +
          '<div class="audioCategory">' + a.category + '</div>' +
          '<div class="itemTitle">' + a.title + '</div>' +
          '<div class="itemSub">⏱ ' + a.duration + '</div>' +
        '</div>' +
        '<span class="badge">▶</span>';
      el.addEventListener('click', function () { openAudio(a, idx); });
      list.appendChild(el);
    });
  }

  // ── REPRODUCTOR AUDIO ────────────────────────────────────
  function openAudio(a, idx) {
    screen.innerHTML =
      '<div class="moduleHero" style="background: ' + getGradient(idx) + '"></div>' +
      '<div class="card"><div class="card-body">' +
        '<div class="audioCategory">' + a.category + '</div>' +
        '<h2 class="h2">' + a.title + '</h2>' +
        '<p class="p">⏱ Duración: ' + a.duration + '</p>' +
      '</div></div>' +
      '<div class="audioBox">' +
        '<div class="audioLabel">🎧 Reproduciendo</div>' +
        '<audio controls autoplay preload="auto" src="' + a.file + '"></audio>' +
      '</div>' +
      '<div class="row mt">' +
        '<button class="btn ghost" id="btnBackAudio">← Volver</button>' +
      '</div>';

    document.getElementById('btnBackAudio').addEventListener('click', function () {
      render('audio');
    });
  }

  // ── PROGRESO ────────────────────────────────────────────
  function renderProgress() {
    var total = APP_DATA.modules.length;
    var done  = APP_DATA.modules.filter(function (m) { return state[m.id] && state[m.id].done; }).length;
    var pct   = Math.round((done / total) * 100);

    screen.innerHTML =
      '<p class="section-title">Mi Viaje</p>' +
      '<div class="card"><div class="card-body">' +
        '<p class="h3">Tu progreso general</p>' +
        '<p class="p">' + done + ' de ' + total + ' módulos completados</p>' +
        '<div class="progressBar"><div class="progressFill" style="width:' + pct + '%"></div></div>' +
        '<p class="p mt" style="text-align:center; font-size:22px; margin-top:12px">' +
          (pct === 100 ? '🎉 ¡Lo has conseguido!' : pct >= 50 ? '🌱 Vas muy bien' : '✨ Cada paso cuenta') +
        '</p>' +
      '</div></div>' +

      '<div class="list mt" id="progressList"></div>';

    var list = document.getElementById('progressList');
    APP_DATA.modules.forEach(function (m, idx) {
      var isDone = state[m.id] && state[m.id].done;
      var el = document.createElement('div');
      el.className = 'item';
      el.innerHTML =
        '<div class="itemThumb" style="background: ' + getGradient(idx) + '"></div>' +
        '<div class="itemInfo">' +
          '<div class="itemTitle">' + m.title + '</div>' +
          '<div class="itemSub">' + m.subtitle + '</div>' +
        '</div>' +
        '<span class="badge' + (isDone ? ' done' : '') + '">' + (isDone ? '✓' : '○') + '</span>';
      list.appendChild(el);
    });
  }

  // ── Arranque ─────────────────────────────────────────────
  render('home');

})();