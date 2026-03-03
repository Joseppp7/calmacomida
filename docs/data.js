// ===== CALMACOMIDA · DATA v700 =====
var AUDIO_CDN = "https://github.com/Joseppp7/calmacomida/releases/download/audio-v1/";
var AUDIO_QS  = "?raw=1";

window.APP_DATA = {

  modules: [
    {
      id: "module-1",
      title: "Calma al comenzar",
      subtitle: "El primer paso hacia la consciencia",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
      audio: AUDIO_CDN + "module-1.mp3" + AUDIO_QS,
      daily: AUDIO_CDN + "module-1-daily.mp3" + AUDIO_QS,
      goal: "Aprender a bajar la velocidad mental y física al empezar a comer. El objetivo no es comer menos todavía, sino que el cerebro salga del modo automático y entre en modo consciente.",
      practice: "Escucha el audio principal en un momento tranquilo. Después, durante el día, usa la práctica diaria antes de una comida real. Solo tienes que parar 30 segundos antes de empezar, respirar lento y observar la comida sin juzgar.",
      expect: "Al principio no notarás grandes cambios en la cantidad de comida. Lo normal es sentir simplemente más calma y menos prisa. Ese es el primer signo de que el programa está funcionando."
    },
    {
      id: "module-2",
      title: "Hambre real vs. hambre emocional",
      subtitle: "Aprende a escuchar tu cuerpo de verdad",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
      audio: AUDIO_CDN + "module-2.mp3" + AUDIO_QS,
      daily: AUDIO_CDN + "module-2-daily.mp3" + AUDIO_QS,
      goal: "Aprender a diferenciar hambre física de hambre emocional. El objetivo es que el cerebro deje de usar la comida como respuesta automática a cualquier emoción.",
      practice: "Antes de comer algo fuera de horario, detente 10 segundos y pregúntate: ¿esto es hambre en el cuerpo o necesidad emocional? No hay que prohibir comer, solo identificarlo.",
      expect: "Descubrirás que muchas ganas de comer duran solo unos minutos. No desaparecen por fuerza de voluntad, desaparecen porque eran una emoción."
    },
    {
      id: "module-3",
      title: "El poder sobre los impulsos",
      subtitle: "Recupera el control sin luchar",
      image: "https://images.unsplash.com/photo-1499209974431-9ddd3e6f944a?auto=format&fit=crop&w=800&q=80",
      audio: AUDIO_CDN + "module-3.mp3" + AUDIO_QS,
      daily: AUDIO_CDN + "module-3-daily.mp3" + AUDIO_QS,
      goal: "Reducir los impulsos repentinos. El objetivo no es resistirse, sino retrasar la reacción automática.",
      practice: "Cuando aparezca un impulso fuerte, espera dos minutos antes de comer. Puedes comer después si quieres. Solo retrasarlo ya cambia el patrón cerebral.",
      expect: "Notarás que algunos impulsos bajan solos. Esto es el cerebro recuperando control."
    },
    {
      id: "module-4",
      title: "Reconectar con la saciedad",
      subtitle: "Tu cuerpo sabe cuándo parar",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
      audio: AUDIO_CDN + "module-4.mp3" + AUDIO_QS,
      daily: AUDIO_CDN + "module-4-daily.mp3" + AUDIO_QS,
      goal: "Reconectar con la sensación real de saciedad.",
      practice: "Durante una comida, a mitad de plato, deja el cubierto 20 segundos y observa tu estómago y respiración.",
      expect: "Empezarás a notar que puedes parar antes sin sentir frustración."
    },
    {
      id: "module-5",
      title: "Libérate de la ansiedad",
      subtitle: "Herramientas para calmar sin comer",
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
      audio: AUDIO_CDN + "module-5.mp3" + AUDIO_QS,
      daily: AUDIO_CDN + "module-5-daily.mp3" + AUDIO_QS,
      goal: "Aprender a regular la ansiedad sin usar comida.",
      practice: "Cuando haya nervios o tensión, usa la respiración lenta 4-6: cuatro segundos inhalar y seis exhalar durante un minuto antes de decidir comer.",
      expect: "El hambre emocional pierde intensidad cuando la activación baja."
    },
    {
      id: "module-6",
      title: "Construye tus nuevos hábitos",
      subtitle: "El cambio real viene de la repetición",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      audio: AUDIO_CDN + "module-6.mp3" + AUDIO_QS,
      daily: AUDIO_CDN + "module-6-daily.mp3" + AUDIO_QS,
      goal: "Crear hábitos automáticos saludables.",
      practice: "Elige una sola rutina fija, por ejemplo beber agua antes de cenar, y repítela cada día.",
      expect: "El cambio real aparece por repetición, no por motivación."
    },
    {
      id: "module-7",
      title: "Tu nueva vida sin depender de la app",
      subtitle: "La libertad que mereces",
      image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80",
      audio: AUDIO_CDN + "module-7.mp3" + AUDIO_QS,
      daily: AUDIO_CDN + "module-7-daily.mp3" + AUDIO_QS,
      goal: "Mantener los cambios sin depender de la app.",
      practice: "Usa los audios solo cuando lo necesites, no por obligación. La meta es autonomía.",
      expect: "Comerás más por elección que por impulso."
    }
  ],

  audios: [
    { id: "intro",  title: "Bienvenida al programa",          category: "Inicio",    duration: "5 min",  image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=200&q=80", file: AUDIO_CDN + "intro-curso.mp3" + AUDIO_QS },
    { id: "m1",     title: "Calma al comenzar · Sesión",      category: "Módulo 1",  duration: "12 min", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=200&q=80", file: AUDIO_CDN + "module-1.mp3" + AUDIO_QS },
    { id: "m1d",    title: "Calma al comenzar · Práctica",    category: "Módulo 1",  duration: "5 min",  image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=200&q=80", file: AUDIO_CDN + "module-1-daily.mp3" + AUDIO_QS },
    { id: "m2",     title: "Hambre emocional · Sesión",       category: "Módulo 2",  duration: "14 min", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80", file: AUDIO_CDN + "module-2.mp3" + AUDIO_QS },
    { id: "m2d",    title: "Hambre emocional · Práctica",     category: "Módulo 2",  duration: "5 min",  image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80", file: AUDIO_CDN + "module-2-daily.mp3" + AUDIO_QS },
    { id: "m3",     title: "Impulsos · Sesión",               category: "Módulo 3",  duration: "13 min", image: "https://images.unsplash.com/photo-1499209974431-9ddd3e6f944a?auto=format&fit=crop&w=200&q=80", file: AUDIO_CDN + "module-3.mp3" + AUDIO_QS },
    { id: "m3d",    title: "Impulsos · Práctica",             category: "Módulo 3",  duration: "5 min",  image: "https://images.unsplash.com/photo-1499209974431-9ddd3e6f944a?auto=format&fit=crop&w=200&q=80", file: AUDIO_CDN + "module-3-daily.mp3" + AUDIO_QS },
    { id: "m4",     title: "Saciedad · Sesión",               category: "Módulo 4",  duration: "12 min", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=200&q=80", file: AUDIO_CDN + "module-4.mp3" + AUDIO_QS },
    { id: "m4d",    title: "Saciedad · Práctica",             category: "Módulo 4",  duration: "5 min",  image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=200&q=80", file: AUDIO_CDN + "module-4-daily.mp3" + AUDIO_QS },
    { id: "m5",     title: "Ansiedad · Sesión",               category: "Módulo 5",  duration: "15 min", image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=200&q=80", file: AUDIO_CDN + "module-5.mp3" + AUDIO_QS },
    { id: "m5d",    title: "Ansiedad · Práctica",             category: "Módulo 5",  duration: "5 min",  image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=200&q=80", file: AUDIO_CDN + "module-5-daily.mp3" + AUDIO_QS },
    { id: "m6",     title: "Hábitos · Sesión",                category: "Módulo 6",  duration: "13 min", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=200&q=80", file: AUDIO_CDN + "module-6.mp3" + AUDIO_QS },
    { id: "m6d",    title: "Hábitos · Práctica",              category: "Módulo 6",  duration: "5 min",  image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=200&q=80", file: AUDIO_CDN + "module-6-daily.mp3" + AUDIO_QS },
    { id: "m7",     title: "Mantenimiento · Sesión",          category: "Módulo 7",  duration: "14 min", image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=200&q=80", file: AUDIO_CDN + "module-7.mp3" + AUDIO_QS },
    { id: "m7d",    title: "Mantenimiento · Práctica",        category: "Módulo 7",  duration: "5 min",  image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=200&q=80", file: AUDIO_CDN + "module-7-daily.mp3" + AUDIO_QS },
    { id: "cierre", title: "Cierre · Tu nueva libertad",      category: "Final",     duration: "8 min",  image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=200&q=80", file: AUDIO_CDN + "cierre-mantenimiento.mp3" + AUDIO_QS }
  ]
};

var APP_DATA = window.APP_DATA;