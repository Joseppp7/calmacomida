// ===== CALMACOMIDA · DATA v703 (con imágenes locales) =====

const AUDIO_CDN = 'https://drive.google.com/uc?export=download&id=';
const AUDIO_QS = '';

const APP_DATA = {
  modules: [
    {
      id: 'mod1',
      title: 'El poder sobre los impulsos',
      subtitle: 'Recupera el control sin luchar contra ti misma',
      image: './images/module-1.jpg',
      audio: AUDIO_CDN + '1aBcDeFgHiJkLmNoPqRsTuVwXyZ' + AUDIO_QS,
      daily: AUDIO_CDN + '1aBcDeFgHiJkLmNoPqRsTuVwXyZ' + AUDIO_QS,
      goal: 'Aprender a reconocer y gestionar los impulsos de comer sin hambre física, recuperando tu capacidad de elección consciente.',
      practice: 'Técnica de pausa de 90 segundos antes de comer. Respiración consciente para observar el impulso sin actuar automáticamente.',
      expect: 'Sentirás que recuperas el control. Los impulsos seguirán apareciendo, pero ya no te arrastrarán. Empezarás a elegir en lugar de reaccionar.'
    },
    {
      id: 'mod2',
      title: 'Reconocer el hambre real',
      subtitle: 'Distingue hambre física de hambre emocional',
      image: './images/module-2.jpg',
      audio: AUDIO_CDN + '2aBcDeFgHiJkLmNoPqRsTuVwXyZ' + AUDIO_QS,
      daily: AUDIO_CDN + '2aBcDeFgHiJkLmNoPqRsTuVwXyZ' + AUDIO_QS,
      goal: 'Desarrollar la capacidad de diferenciar entre hambre física y emocional, conectando con las señales reales de tu cuerpo.',
      practice: 'Escaneo corporal antes de cada comida. Escala de hambre del 1 al 10. Registro de sensaciones físicas vs emocionales.',
      expect: 'Empezarás a notar la diferencia entre "tengo hambre" y "necesito calmarme". Tu cuerpo volverá a ser tu aliado, no tu enemigo.'
    },
    {
      id: 'mod3',
      title: 'Calmar la ansiedad sin comer',
      subtitle: 'Herramientas reales para gestionar emociones',
      image: './images/module-3.jpg',
      audio: AUDIO_CDN + '3aBcDeFgHiJkLmNoPqRsTuVwXyZ' + AUDIO_QS,
      daily: AUDIO_CDN + '3aBcDeFgHiJkLmNoPqRsTuVwXyZ' + AUDIO_QS,
      goal: 'Aprender técnicas efectivas para regular la ansiedad sin recurrir a la comida como única vía de escape.',
      practice: 'Respiración 4-7-8. Técnica de anclaje sensorial. Movimiento consciente de 5 minutos. Lista de recursos alternativos.',
      expect: 'Descubrirás que puedes calmarte sin comer. La ansiedad dejará de ser una amenaza y se convertirá en una señal que puedes gestionar.'
    },
    {
      id: 'mod4',
      title: 'Romper con la culpa',
      subtitle: 'Libérate del ciclo de restricción y exceso',
      image: './images/module-4.jpg',
      audio: AUDIO_CDN + '4aBcDeFgHiJkLmNoPqRsTuVwXyZ' + AUDIO_QS,
      daily: AUDIO_CDN + '4aBcDeFgHiJkLmNoPqRsTuVwXyZ' + AUDIO_QS,
      goal: 'Desactivar el mecanismo de culpa que perpetúa el ciclo de restricción-atracón, cultivando la autocompasión.',
      practice: 'Diálogo interno compasivo. Técnica de la "amiga sabia". Registro de pensamientos automáticos y reformulación.',
      expect: 'La culpa perderá su poder sobre ti. Podrás comer sin castigarte después. El ciclo de restricción-exceso empezará a romperse.'
    },
    {
      id: 'mod5',
      title: 'Construir una relación sana',
      subtitle: 'De la guerra a la paz con la comida',
      image: './images/module-5.jpg',
      audio: AUDIO_CDN + '5aBcDeFgHiJkLmNoPqRsTuVwXyZ' + AUDIO_QS,
      daily: AUDIO_CDN + '5aBcDeFgHiJkLmNoPqRsTuVwXyZ' + AUDIO_QS,
      goal: 'Transformar tu relación con la comida de una lucha constante a una experiencia de nutrición y placer equilibrados.',
      practice: 'Comida consciente: comer sin distracciones. Práctica de gratitud hacia los alimentos. Permiso incondicional para comer.',
      expect: 'Comer dejará de ser un campo de batalla. Podrás disfrutar de la comida sin miedo, culpa o descontrol. Sentirás paz.'
    },
    {
      id: 'mod6',
      title: 'Gestionar emociones difíciles',
      subtitle: 'Siente sin necesidad de escapar',
      image: './images/module-6.jpg',
      audio: AUDIO_CDN + '6aBcDeFgHiJkLmNoPqRsTuVwXyZ' + AUDIO_QS,
      daily: AUDIO_CDN + '6aBcDeFgHiJkLmNoPqRsTuVwXyZ' + AUDIO_QS,
      goal: 'Desarrollar la capacidad de estar presente con emociones difíciles sin necesidad de evadirlas con comida.',
      practice: 'Técnica RAIN (Reconocer, Aceptar, Investigar, Nutrir). Escritura emocional. Validación de emociones.',
      expect: 'Las emociones difíciles dejarán de asustarte. Podrás sentir tristeza, soledad o frustración sin necesidad de "taparlas" comiendo.'
    },
    {
      id: 'mod7',
      title: 'Mantener el cambio',
      subtitle: 'Integra lo aprendido en tu vida real',
      image: './images/module-7.jpg',
      audio: AUDIO_CDN + '7aBcDeFgHiJkLmNoPqRsTuVwXyZ' + AUDIO_QS,
      daily: AUDIO_CDN + '7aBcDeFgHiJkLmNoPqRsTuVwXyZ' + AUDIO_QS,
      goal: 'Consolidar los cambios y crear un plan sostenible para mantener tu nueva relación con la comida a largo plazo.',
      practice: 'Plan de prevención de recaídas. Red de apoyo. Rituales de autocuidado. Revisión semanal de progreso.',
      expect: 'Tendrás herramientas para toda la vida. Los momentos difíciles seguirán apareciendo, pero sabrás cómo gestionarlos sin volver atrás.'
    }
  ],

  audios: [
    {
      id: 'intro',
      title: 'Bienvenida a tu proceso',
      category: 'INICIO',
      duration: '8 min',
      file: AUDIO_CDN + 'intro-curso' + AUDIO_QS
    },
    {
      id: 'cierre',
      title: 'Cierre y mantenimiento',
      category: 'CIERRE',
      duration: '12 min',
      file: AUDIO_CDN + 'cierre-mantenimiento' + AUDIO_QS
    }
  ]
};