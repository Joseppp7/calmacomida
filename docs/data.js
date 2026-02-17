// VERSION: DATA_ES5_OK

// CDN estable para Android (sirve MP3 bien)
var AUDIO_CDN = "https://github.com/Joseppp7/calmacomida/releases/download/audio-v1/";
var AUDIO_QS = "?raw=1";


window.APP_DATA = {
  modules: [
    { id: "module-1", title: "Módulo 1 · Calma al comenzar",    audio: AUDIO_CDN + "module-1.mp3" + AUDIO_QS,      daily: AUDIO_CDN + "module-1-daily.mp3" + AUDIO_QS },
    { id: "module-2", title: "Módulo 2 · Hambre emocional",     audio: AUDIO_CDN + "module-2.mp3" + AUDIO_QS,      daily: AUDIO_CDN + "module-2-daily.mp3" + AUDIO_QS },
    { id: "module-3" + AUDIO_QS, title: "Módulo 3 · Impulsos",             audio: AUDIO_CDN + "module-3.mp3" + AUDIO_QS,      daily: AUDIO_CDN + "module-3-daily.mp3" + AUDIO_QS },
    { id: "module-4", title: "Módulo 4 · Saciedad",             audio: AUDIO_CDN + "module-4.mp3" + AUDIO_QS,      daily: AUDIO_CDN + "module-4-daily.mp3" + AUDIO_QS },
    { id: "module-5", title: "Módulo 5 · Ansiedad",             audio: AUDIO_CDN + "module-5.mp3" + AUDIO_QS,      daily: AUDIO_CDN + "module-5-daily.mp3" + AUDIO_QS },
    { id: "module-6", title: "Módulo 6 · Hábitos",              audio: AUDIO_CDN + "module-6.mp3" + AUDIO_QS,      daily: AUDIO_CDN + "module-6-daily.mp3" + AUDIO_QS },
    { id: "module-7", title: "Módulo 7 · Mantenimiento",        audio: AUDIO_CDN + "module-7.mp3" + AUDIO_QS,      daily: AUDIO_CDN + "module-7-daily.mp3" + AUDIO_QS }
  ],

  audios: [
    { id: "intro",  title: "Introducción",                 file: AUDIO_CDN + "intro-curso.mp3" + AUDIO_QS },
    { id: "m1",     title: "Módulo 1 · Sesión principal",  file: AUDIO_CDN + "module-1.mp3" + AUDIO_QS },
    { id: "m1d",    title: "Módulo 1 · Práctica diaria",   file: AUDIO_CDN + "module-1-daily.mp3" + AUDIO_QS },
    { id: "m2",     title: "Módulo 2 · Sesión principal",  file: AUDIO_CDN + "module-2.mp3" + AUDIO_QS },
    { id: "m2d",    title: "Módulo 2 · Práctica diaria",   file: AUDIO_CDN + "module-2-daily.mp3" + AUDIO_QS },
    { id: "m3",     title: "Módulo 3 · Sesión principal",  file: AUDIO_CDN + "module-3.mp3" + AUDIO_QS },
    { id: "m3d",    title: "Módulo 3 · Práctica diaria",   file: AUDIO_CDN + "module-3-daily.mp3" + AUDIO_QS },
    { id: "m4",     title: "Módulo 4 · Sesión principal",  file: AUDIO_CDN + "module-4.mp3" + AUDIO_QS },
    { id: "m4d",    title: "Módulo 4 · Práctica diaria",   file: AUDIO_CDN + "module-4-daily.mp3" + AUDIO_QS },
    { id: "m5",     title: "Módulo 5 · Sesión principal",  file: AUDIO_CDN + "module-5.mp3" + AUDIO_QS },
    { id: "m5d",    title: "Módulo 5 · Práctica diaria",   file: AUDIO_CDN + "module-5-daily.mp3" + AUDIO_QS },
    { id: "m6",     title: "Módulo 6 · Sesión principal",  file: AUDIO_CDN + "module-6.mp3" + AUDIO_QS },
    { id: "m6d",    title: "Módulo 6 · Práctica diaria",   file: AUDIO_CDN + "module-6-daily.mp3" + AUDIO_QS },
    { id: "m7",     title: "Módulo 7 · Sesión principal",  file: AUDIO_CDN + "module-7.mp3" + AUDIO_QS },
    { id: "m7d",    title: "Módulo 7 · Práctica diaria",   file: AUDIO_CDN + "module-7-daily.mp3" + AUDIO_QS },
    { id: "cierre", title: "Cierre mantenimiento",         file: AUDIO_CDN + "cierre-mantenimiento.mp3" + AUDIO_QS }
  ]
};

// Alias para app.js
var APP_DATA = window.APP_DATA;
