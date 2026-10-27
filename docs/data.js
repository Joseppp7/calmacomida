window.APP_DATA = {
  name: "CalmaComida",
  subtitle: "Tu refugio para comer en paz",
  coverImage: "images/portada.jpg",

  // ─── COBRO ───────────────────────────────────────────
  price: "47 €",
  // Enlace de pago de Stripe (Payment Link). Mientras esté vacío, el botón de pago avisa de que aún no está activo.
  paymentLink: "",
  supportEmail: "",   // email de contacto para dudas con la compra
  supabaseUrl: "https://annwqcfehdvuhhcqfeix.supabase.co",
  supabaseKey: "sb_publishable_RHH74W6raLPobRAjBHhZPg_fbXAiOZt",   // clave pública: es seguro que esté aquí

  // ─── TEST DE HAMBRE EMOCIONAL ───────────────────────
  // Cada respuesta suma un punto a un tipo. Gana el tipo con más puntos (en empate, el de la primera pregunta).
  quiz: {
    questions: [
      {
        text: "¿Cuándo te pasa más a menudo?",
        options: [
          { text: "Después de un día de estrés", type: "descarga" },
          { text: "Cuando me siento triste o sola", type: "consuelo" },
          { text: "Cuando no tengo nada que hacer", type: "aburrimiento" },
          { text: "Por la noche, cuando todo se calma", type: "nocturna" }
        ]
      },
      {
        text: "¿Qué sientes justo antes de ir a por comida?",
        options: [
          { text: "Tensión, como si fuera a explotar", type: "descarga" },
          { text: "Un vacío, ganas de que alguien me cuide", type: "consuelo" },
          { text: "Inquietud, no sé qué hacer conmigo", type: "aburrimiento" },
          { text: "Cansancio, siento que me merezco un premio", type: "nocturna" }
        ]
      },
      {
        text: "¿Qué te pide el cuerpo en ese momento?",
        options: [
          { text: "Algo crujiente o salado, rápido", type: "descarga" },
          { text: "Algo dulce y reconfortante", type: "consuelo" },
          { text: "Picar un poco de todo lo que hay", type: "aburrimiento" },
          { text: "Un capricho después de cenar, en el sofá", type: "nocturna" }
        ]
      },
      {
        text: "¿Cómo te sientes después?",
        options: [
          { text: "Más tranquila un rato… y luego culpable", type: "descarga" },
          { text: "Reconfortada, pero el vacío sigue ahí", type: "consuelo" },
          { text: "Igual que antes, no me ha llenado", type: "aburrimiento" },
          { text: "Pesada, y duermo peor", type: "nocturna" }
        ]
      },
      {
        text: "¿Qué frase te describe mejor?",
        options: [
          { text: "\"Como para no estallar\"", type: "descarga" },
          { text: "\"Como para sentirme acompañada\"", type: "consuelo" },
          { text: "\"Como porque está ahí\"", type: "aburrimiento" },
          { text: "\"Por la noche pierdo el control\"", type: "nocturna" }
        ]
      }
    ],
    // REVISAR: textos orientativos, ajústalos con tu criterio profesional
    results: {
      descarga: {
        name: "Hambre de descarga",
        icon: "🌊",
        short: "Usas la comida para soltar la tensión acumulada. No es falta de voluntad: es tu cuerpo pidiendo calma de la forma más rápida que conoce.",
        full: "Cuando el estrés se acumula, tu sistema nervioso busca una salida inmediata, y comer la da en segundos. El problema no es la comida, sino que es tu única válvula. En tu plan aprenderás a reconocer la tensión antes de que llegue al pico y a darle otras salidas igual de rápidas. Empieza por el Módulo 1 y por la Ayuda Rápida «Tengo un impulso ahora»."
      },
      consuelo: {
        name: "Hambre de consuelo",
        icon: "🤍",
        short: "La comida te abraza cuando te sientes sola, triste o poco valorada. Es una forma de cuidarte, aunque luego no te sienta bien.",
        full: "Detrás de tu hambre hay una necesidad real: sentirte acompañada y cuidada. La comida la calma un momento, pero no la llena. En tu plan trabajarás cómo darte ese cuidado de otras maneras y cómo hablarte con más cariño. Empieza por el Módulo 1 y por la Ayuda Rápida «Siento culpa después de comer»."
      },
      aburrimiento: {
        name: "Hambre de aburrimiento",
        icon: "🌀",
        short: "Comes para llenar huecos: ratos vacíos, rutina, falta de estímulos. La comida se convierte en algo que hacer.",
        full: "Tu hambre aparece cuando la mente no tiene dónde posarse. No necesitas más disciplina, sino aprender a notar ese momento de vacío y elegir qué hacer con él. En tu plan descubrirás pausas cortas que rompen el piloto automático. Empieza por el Módulo 1, dedicado justo a eso."
      },
      nocturna: {
        name: "Hambre nocturna",
        icon: "🌙",
        short: "De día lo llevas bien, pero por la noche, cansada y por fin tranquila, aparece el picoteo. Es tu momento de premio y desconexión.",
        full: "Después de sostenerlo todo durante el día, la noche es el único momento para ti, y la comida se convierte en tu recompensa. En tu plan aprenderás a cerrar el día con otros rituales que también te descansen. Empieza por el Módulo 1 y por la Ayuda Rápida «Ansiedad nocturna»."
      }
    }
  },

  howItWorks: [
    { icon: "🎧", title: "Escucha tu módulo semanal", desc: "Un audio de fondo que trabaja tu mentalidad desde la raíz. Sin prisa, a tu ritmo." },
    { icon: "🌿", title: "Practica cada día (5 min)", desc: "Un audio corto para mantener la calma en el mundo real: en el coche, en casa, antes de comer." },
    { icon: "✨", title: "Registra tu evolución", desc: "No contamos calorías. Registramos cómo te sientes. Eso es lo que realmente cambia." }
  ],

  testimonials: [
    { name: "Elena, 42 años", text: "Por fin entiendo qué me pasa por las noches. Esta app es mi salvavidas." },
    { name: "Marta, 38 años", text: "Los audios cortos antes de comer han cambiado mi digestión y mi ansiedad." },
    { name: "Susana, 51 años", text: "Llevaba 20 años a dieta. Esto es lo primero que me ha dado paz de verdad." }
  ],

  modules: [
    {
      id: "module-1",
      number: 1,
      free: true,
      title: "El Despertar de la Conciencia",
      desc: "Aprende a diferenciar el hambre del estómago del hambre de la mente.",
      phrase: "Comer con conciencia es el primer acto de amor propio.",
      goal: "Identificar tus señales físicas de hambre y saciedad para dejar de comer en piloto automático.",
      expect: "Empezarás a notar cuándo comes de verdad y cuándo comes por inercia o emoción. Ese momento de pausa lo cambia todo.",
      image: "images/module-1.jpg",
      thumb: "images/m1.jpg",
      audio: "audio/module-1.mp3",
      daily: "audio/module-1-daily.mp3",
      dailyDesc: "Un recordatorio diario de 5 min para escuchar tu cuerpo antes de cada comida."
    },
    {
      id: "module-2",
      number: 2,
      title: "Navegando la Ansiedad",
      desc: "Herramientas reales para el momento del impulso.",
      phrase: "Un impulso es una ola: no tienes que luchar contra ella, solo dejarla pasar.",
      goal: "Darte recursos concretos para surfear las ganas de comer por estrés sin pelearte contigo misma.",
      expect: "Menos atracones por ansiedad. Aprenderás a hacer una pausa de 3 minutos que puede cambiarlo todo.",
      image: "images/module-2.jpg",
      thumb: "images/m2.jpg",
      audio: "premium/module-2.mp3",
      daily: "audio/module-2-daily.mp3",
      dailyDesc: "Pausa de calma de 5 min para usar justo cuando sientas el impulso de comer."
    },
    {
      id: "module-3",
      number: 3,
      title: "El Adiós a la Culpa",
      desc: "Rompe el ciclo de castigo después de comer 'mal'.",
      phrase: "Un exceso no borra todo lo que has construido. Eres mucho más que lo que comiste hoy.",
      goal: "Cortar el ciclo culpa → castigo → atracón que te tiene atrapada desde hace años.",
      expect: "Después de un exceso, en lugar de hundirte, tendrás herramientas para perdonarte y seguir adelante sin drama.",
      image: "images/module-3.jpg",
      thumb: "images/m3.jpg",
      audio: "premium/module-3.mp3",
      daily: "audio/module-3-daily.mp3",
      dailyDesc: "Audio de autocompasión de 5 min para los días difíciles."
    },
    {
      id: "module-4",
      number: 4,
      title: "Reconciliación con tu Cuerpo",
      desc: "Tu cuerpo no es tu enemigo. Es hora de hacer las paces.",
      phrase: "Tu cuerpo ha estado contigo toda la vida. Merece tu respeto, no tu guerra.",
      goal: "Mejorar la imagen corporal que dicta tus decisiones de comida cada día.",
      expect: "Empezarás a tratar a tu cuerpo como un aliado. Menos comparaciones, menos castigos, más cuidado real.",
      image: "images/module-4.jpg",
      thumb: "images/m4.jpg",
      audio: "premium/module-4.mp3",
      daily: "premium/module-4-daily.mp3",
      dailyDesc: "Práctica diaria de 5 min para reconectar con tu cuerpo con amabilidad."
    },
    {
      id: "module-5",
      number: 5,
      title: "Libertad en el Mundo Real",
      desc: "Cenas, eventos, vacaciones: come sin miedo fuera de casa.",
      phrase: "Disfrutar de una cena no es un fracaso. Es vivir.",
      goal: "Prepararte para situaciones sociales con comida sin que se conviertan en una fuente de ansiedad.",
      expect: "Podrás ir a una cena, una boda o unas vacaciones sin el miedo a 'perder el control' ni la culpa del día siguiente.",
      image: "images/module-5.jpg",
      thumb: "images/m5.jpg",
      audio: "premium/module-5.mp3",
      daily: "audio/module-5-daily.mp3",
      dailyDesc: "Audio de 5 min para prepararte mentalmente antes de un evento social."
    },
    {
      id: "module-6",
      number: 6,
      title: "Desmontando la Mentalidad de Dieta",
      desc: "Las reglas rígidas son las que te hacen fallar. Vamos a eliminarlas.",
      phrase: "No eres débil. El sistema de las dietas está roto. Tú no.",
      goal: "Eliminar la clasificación de comida 'buena' y 'mala' que genera el deseo incontrolable de lo prohibido.",
      expect: "La comida dejará de tener poder sobre ti. Sin prohibiciones, sin el efecto rebote mental que te lleva al atracón.",
      image: "images/module-6.jpg",
      thumb: "images/m6.jpg",
      audio: "premium/module-6.mp3",
      daily: "premium/module-6-daily.mp3",
      dailyDesc: "Reflexión diaria de 5 min para desaprender las reglas que te limitan."
    },
    {
      id: "module-7",
      number: 7,
      title: "Tu Nueva Identidad",
      desc: "Integra los cambios para que sean permanentes, no temporales.",
      phrase: "Ya tienes las herramientas. Ahora confía en ti.",
      goal: "Consolidar todo lo aprendido para que forme parte de quién eres, no de lo que 'intentas hacer'.",
      expect: "La comida volverá a su lugar: un placer y un combustible, pero ya no el centro de tus preocupaciones emocionales.",
      image: "images/module-7.jpg",
      thumb: "images/m7.jpg",
      audio: "premium/module-7.mp3",
      daily: "premium/module-7-daily.mp3",
      dailyDesc: "Audio de integración de 5 min para cerrar el día con tu nueva versión."
    }
  ],

  closing: {
    title: "Cierre y Mantenimiento",
    desc: "Terminar el programa no significa que 'ya está todo resuelto'. Significa que ahora tienes un mapa para cuando la vida se complique.",
    goal: "Diseñar tu propio plan de mantenimiento amable para los meses que vienen.",
    expect: "Sabrás exactamente qué hacer cuando recaigas, sin dramas ni empezar de cero.",
    audio: "premium/cierre-mantenimiento.mp3",
    image: "images/portada.jpg"
  },

  audioStates: [
    { id: "s1", title: "Tengo un impulso ahora", desc: "Escúchalo antes de abrir la nevera.", file: "audio/module-2-daily.mp3", thumb: "images/m2.jpg" },
    { id: "s2", title: "Siento culpa después de comer", desc: "Para perdonarte y seguir adelante.", file: "audio/module-3-daily.mp3", thumb: "images/m3.jpg" },
    { id: "s3", title: "Ansiedad nocturna", desc: "Para cerrar el día con paz.", file: "audio/module-5-daily.mp3", thumb: "images/m5.jpg" }
  ]
};