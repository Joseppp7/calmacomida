window.APP_DATA = {
  name: "CalmaComida",
  subtitle: "Tu refugio para comer en paz",
  buyUrl: "https://TU-WEB.com/comprar", // CAMBIA ESTO POR TU ENLACE
  coverImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",

  // Testimonios para generar confianza inmediata
  testimonials: [
    { name: "Elena", text: "Por fin entiendo qué me pasa por las noches. Esta app es mi salvavidas." },
    { name: "Carlos", text: "Los audios cortos antes de comer han cambiado mi digestión y mi ansiedad." }
  ],

  modules: [
    { id: "module-1", title: "Día 1 · Calma al comenzar", desc: "Baja las revoluciones antes de la primera bocado.", phrase: "Comer con calma es un acto de amor propio.", goal: "Reducir la velocidad al comer.", expect: "Sentirte más ligero y presente.", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=60", audio: "audio/module-1.mp3", daily: "audio/module-1-daily.mp3" },
    { id: "module-2", title: "Día 2 · Hambre emocional", desc: "¿Hambre real o hambre de afecto?", phrase: "Tu cuerpo sabe lo que necesita, escúchalo.", goal: "Identificar el hambre emocional.", expect: "Menos culpa tras las comidas.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=60", audio: "audio/module-2.mp3", daily: "audio/module-2-daily.mp3" },
    { id: "module-3", title: "Día 3 · Los impulsos", desc: "Ese momento donde pierdes el control tiene solución.", phrase: "Un impulso es una ola: déjala pasar.", goal: "Surfear las ganas de comer por ansiedad.", expect: "Mayor autocontrol sin esfuerzo.", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=500&q=60", audio: "audio/module-3.mp3", daily: "audio/module-3-daily.mp3" },
    { id: "module-4", title: "Día 4 · La saciedad", desc: "Aprende a parar cuando tu cuerpo dice 'basta'.", phrase: "No necesitas terminar el plato, necesitas estar satisfecha.", goal: "Reconocer la señal de plenitud.", expect: "Digestiones mucho más fáciles.", image: "https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=500&q=60", audio: "audio/module-4.mp3", daily: "audio/module-4-daily.mp3" },
    { id: "module-5", title: "Día 5 · Ansiedad", desc: "Herramientas para cuando el día te supera.", phrase: "La comida no calma la mente, la respiración sí.", goal: "Regular el sistema nervioso.", expect: "Paz mental duradera.", image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=500&q=60", audio: "audio/module-5.mp3", daily: "audio/module-5-daily.mp3" },
    { id: "module-6", title: "Día 6 · Nuevos hábitos", desc: "Pequeños cambios, resultados gigantes.", phrase: "La constancia amable vence a la perfección.", goal: "Crear rutinas sostenibles.", expect: "Un nuevo estilo de vida sin dietas.", image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=500&q=60", audio: "audio/module-6.mp3", daily: "audio/module-6-daily.mp3" },
    { id: "module-7", title: "Día 7 · Mantenimiento", desc: "Cómo seguir brillando a partir de ahora.", phrase: "Ya tienes las herramientas. Confía en ti.", goal: "Integrar lo aprendido.", expect: "Libertad total frente a la comida.", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=500&q=60", audio: "audio/module-7.mp3", daily: "audio/module-7-daily.mp3" }
  ],

  // Sección de ayuda rápida por estados (Lo que más valorarán tus clientes)
  audioStates: [
    { id: "s1", title: "Tengo un impulso ahora", desc: "Escúchalo antes de abrir la nevera.", file: "audio/module-3-daily.mp3", image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=150&q=60" },
    { id: "s2", title: "Ansiedad nocturna", desc: "Para cerrar el día con paz.", file: "audio/module-5-daily.mp3", image: "https://images.unsplash.com/photo-1505489435671-80a165c62611?auto=format&fit=crop&w=300&q=60" },
    { id: "s3", title: "Siento culpa", desc: "Para perdonarte y seguir adelante.", file: "audio/module-7-daily.mp3", image: "https://images.unsplash.com/photo-1516589174184-c685266d430c?auto=format&fit=crop&w=300&q=60" }
  ],

  audios: [
    { id: "intro", title: "Bienvenida · Cómo usar CalmaComida", file: "audio/intro-curso.mp3" },
    { id: "m1", title: "Módulo 1 · Sesión principal", file: "audio/module-1.mp3" },
    { id: "m1d", title: "Módulo 1 · Práctica diaria", file: "audio/module-1-daily.mp3" },
    { id: "m2", title: "Módulo 2 · Sesión principal", file: "audio/module-2.mp3" },
    { id: "m2d", title: "Módulo 2 · Práctica diaria", file: "audio/module-2-daily.mp3" },
    { id: "m3", title: "Módulo 3 · Sesión principal", file: "audio/module-3.mp3" },
    { id: "m3d", title: "Módulo 3 · Práctica diaria", file: "audio/module-3-daily.mp3" },
    { id: "m4", title: "Módulo 4 · Sesión principal", file: "audio/module-4.mp3" },
    { id: "m4d", title: "Módulo 4 · Práctica diaria", file: "audio/module-4-daily.mp3" },
    { id: "m5", title: "Módulo 5 · Sesión principal", file: "audio/module-5.mp3" },
    { id: "m5d", title: "Módulo 5 · Práctica diaria", file: "audio/module-5-daily.mp3" },
    { id: "m6", title: "Módulo 6 · Sesión principal", file: "audio/module-6.mp3" },
    { id: "m6d", title: "Módulo 6 · Práctica diaria", file: "audio/module-6-daily.mp3" },
    { id: "m7", title: "Módulo 7 · Sesión principal", file: "audio/module-7.mp3" },
    { id: "m7d", title: "Módulo 7 · Práctica diaria", file: "audio/module-7-daily.mp3" }
  ]
};