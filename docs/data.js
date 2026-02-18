// VERSION: DATA_ES5_OK

// CDN estable para Android (sirve MP3 bien)
var AUDIO_CDN = "https://github.com/Joseppp7/calmacomida/releases/download/audio-v1/";
var AUDIO_QS = "?raw=1";


window.APP_DATA = {
  modules: [

{
  id: "module-1",
  title: "Módulo 1 · Calma al comenzar",
  image: "./img/module-1.jpg",
  audio: AUDIO_CDN + "module-1.mp3" + AUDIO_QS,
  daily: AUDIO_CDN + "module-1-daily.mp3" + AUDIO_QS,

  goal: "Aprender a bajar la velocidad mental y física al empezar a comer. El objetivo no es comer menos todavía, sino que el cerebro salga del modo automático y entre en modo consciente.",

  practice: "Escucha el audio principal en un momento tranquilo. Después, durante el día, usa la práctica diaria antes de una comida real. Solo tienes que parar 30 segundos antes de empezar, respirar lento y observar la comida sin juzgar.",

  expect: "Al principio no notarás grandes cambios en la cantidad de comida. Lo normal es sentir simplemente más calma y menos prisa. Ese es el primer signo de que el programa está funcionando."
},

{
  id: "module-2",
  title: "Módulo 2 · Hambre emocional",
  image: "./img/module-2.jpg",
  audio: AUDIO_CDN + "module-2.mp3" + AUDIO_QS,
  daily: AUDIO_CDN + "module-2-daily.mp3" + AUDIO_QS,

  goal: "Aprender a diferenciar hambre física de hambre emocional. El objetivo es que el cerebro deje de usar la comida como respuesta automática a cualquier emoción.",

  practice: "Antes de comer algo fuera de horario, detente 10 segundos y pregúntate: ¿esto es hambre en el cuerpo o necesidad emocional? No hay que prohibir comer, solo identificarlo.",

  expect: "Descubrirás que muchas ganas de comer duran solo unos minutos. No desaparecen por fuerza de voluntad, desaparecen porque eran una emoción."
},

{
  id: "module-3",
  title: "Módulo 3 · Impulsos",
  image: "./img/module-3.jpg",
  audio: AUDIO_CDN + "module-3.mp3" + AUDIO_QS,
  daily: AUDIO_CDN + "module-3-daily.mp3" + AUDIO_QS,

  goal: "Reducir los impulsos repentinos. El objetivo no es resistirse, sino retrasar la reacción automática.",

  practice: "Cuando aparezca un impulso fuerte, espera dos minutos antes de comer. Puedes comer después si quieres. Solo retrasarlo ya cambia el patrón cerebral.",

  expect: "Notarás que algunos impulsos bajan solos. Esto es el cerebro recuperando control."
},

{
  id: "module-4",
  title: "Módulo 4 · Saciedad",
  image: "./img/module-4.jpg",
  audio: AUDIO_CDN + "module-4.mp3" + AUDIO_QS,
  daily: AUDIO_CDN + "module-4-daily.mp3" + AUDIO_QS,

  goal: "Reconectar con la sensación real de saciedad.",

  practice: "Durante una comida, a mitad de plato, deja el cubierto 20 segundos y observa tu estómago y respiración.",

  expect: "Empezarás a notar que puedes parar antes sin sentir frustración."
},

{
  id: "module-5",
  title: "Módulo 5 · Ansiedad",
  image: "./img/module-5.jpg",
  audio: AUDIO_CDN + "module-5.mp3" + AUDIO_QS,
  daily: AUDIO_CDN + "module-5-daily.mp3" + AUDIO_QS,

  goal: "Aprender a regular la ansiedad sin usar comida.",

  practice: "Cuando haya nervios o tensión, usa la respiración lenta 4-6: cuatro segundos inhalar y seis exhalar durante un minuto antes de decidir comer.",

  expect: "El hambre emocional pierde intensidad cuando la activación baja."
},

{
  id: "module-6",
  title: "Módulo 6 · Hábitos",
  image: "./img/module-6.jpg",
  audio: AUDIO_CDN + "module-6.mp3" + AUDIO_QS,
  daily: AUDIO_CDN + "module-6-daily.mp3" + AUDIO_QS,

  goal: "Crear hábitos automáticos saludables.",

  practice: "Elige una sola rutina fija, por ejemplo beber agua antes de cenar, y repítela cada día.",

  expect: "El cambio real aparece por repetición, no por motivación."
},

{
  id: "module-7",
  title: "Módulo 7 · Mantenimiento",
  image: "./img/module-7.jpg",
  audio: AUDIO_CDN + "module-7.mp3" + AUDIO_QS,
  daily: AUDIO_CDN + "module-7-daily.mp3" + AUDIO_QS,

  goal: "Mantener los cambios sin depender de la app.",

  practice: "Usa los audios solo cuando lo necesites, no por obligación. La meta es autonomía.",

  expect: "Comerás más por elección que por impulso."
}

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
