export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSection {
  title: string;
  questions: FAQItem[];
}

/**
 * Preguntas frecuentes organizadas
 * por categorías temáticas.
 */
export const FAQ_SECTIONS: readonly FAQSection[] = [
  {
    title: "Sobre Alpha-Help",
    questions: [
      {
        question: "¿Qué es Alpha-Help?",
        answer:
          "Alpha-Help es una iniciativa de investigación orientada a comprender los factores que influyen en el bienestar emocional de adolescentes y sus familias mediante herramientas de evaluación basadas en evidencia científica.",
      },
      {
        question: "¿Cuál es el objetivo del estudio?",
        answer:
          "El objetivo es analizar variables personales, familiares y educativas para comprender mejor los factores asociados al bienestar emocional durante la adolescencia.",
      },
      {
        question: "¿Quién desarrolla el proyecto?",
        answer:
          "El proyecto está impulsado por profesionales e investigadores especializados en bienestar emocional, educación e intervención psicológica.",
      },
      {
        question: "¿Por qué se realiza esta investigación?",
        answer:
          "La investigación busca generar conocimiento que contribuya a mejorar la prevención, detección e intervención en dificultades emocionales durante la adolescencia.",
      },
    ],
  },
  {
    title: "Participación en el estudio",
    questions: [
      {
        question: "¿Quién puede participar?",
        answer:
          "Padres, madres o tutores legales de adolescentes que cumplan los requisitos establecidos para el estudio.",
      },
      {
        question: "¿Cuánto tiempo requiere participar?",
        answer:
          "El registro inicial requiere únicamente unos minutos. Dependiendo de la evolución del estudio podrían proponerse nuevas evaluaciones de forma voluntaria.",
      },
      {
        question: "¿Tiene algún coste?",
        answer:
          "No. La participación es completamente gratuita.",
      },
      {
        question: "¿Puedo abandonar el estudio cuando quiera?",
        answer:
          "Sí. La participación es totalmente voluntaria y puede interrumpirse en cualquier momento.",
      },
      {
        question: "¿Recibiré alguna compensación económica?",
        answer:
          "No. La participación no contempla compensaciones económicas.",
      },
    ],
  },
  {
    title: "Registro y cuenta",
    questions: [
      {
        question: "¿Por qué debo crear una cuenta?",
        answer:
          "La cuenta permite gestionar de forma segura la participación en el estudio y garantizar la integridad de la información recopilada.",
      },
      {
        question: "¿Qué ocurre después del registro?",
        answer:
          "Recibirás un correo de verificación. Una vez confirmado podrás acceder a tu área personal.",
      },
      {
        question: "¿Cómo verifico mi correo electrónico?",
        answer:
          "Recibirás un correo con un enlace de confirmación. Solo tendrás que pulsarlo para activar tu cuenta.",
      },
      {
        question: "¿Qué hago si no recibo el correo de verificación?",
        answer:
          "Comprueba tu carpeta de spam o correo no deseado. Si el problema persiste, contacta con el equipo del proyecto.",
      },
      {
        question: "¿Qué ocurre si olvido mi contraseña?",
        answer:
          "Podrás utilizar la opción de recuperación de contraseña disponible en la página de inicio de sesión.",
      },
    ],
  },
  {
    title: "Privacidad y protección de datos",
    questions: [
      {
        question: "¿Mis respuestas son confidenciales?",
        answer:
          "Sí. Toda la información se trata de forma confidencial y siguiendo la normativa vigente en materia de protección de datos.",
      },
      {
        question: "¿Qué datos se almacenan?",
        answer:
          "Únicamente se recopilan los datos necesarios para los fines científicos y estadísticos del estudio.",
      },
      {
        question: "¿Cómo se protege mi información?",
        answer:
          "La información se almacena utilizando medidas técnicas y organizativas destinadas a garantizar su seguridad y confidencialidad.",
      },
      {
        question: "¿Se comparten mis datos con terceros?",
        answer:
          "No. Los datos no se venden ni se comparten con organizaciones externas ajenas al proyecto.",
      },
      {
        question: "¿Puedo solicitar la eliminación de mis datos?",
        answer:
          "Sí. Puedes ejercer tus derechos de acceso, rectificación o supresión contactando con el equipo responsable.",
      },
    ],
  },
  {
    title: "Información sobre los menores",
    questions: [
      {
        question: "¿Por qué se solicita información sobre mis hijos?",
        answer:
          "La investigación analiza variables relacionadas con el bienestar emocional adolescente y el contexto familiar.",
      },
      {
        question: "¿Los menores quedan identificados?",
        answer:
          "No. No se recopilan nombres, apellidos ni información que permita identificar personalmente a los menores.",
      },
      {
        question: "¿Qué tipo de información se solicita?",
        answer:
          "Únicamente información general relevante para los objetivos científicos del estudio.",
      },
      {
        question: "¿Qué ocurre si mi hijo ha recibido apoyo psicológico?",
        answer:
          "Esa información se utiliza exclusivamente con fines estadísticos y de investigación.",
      },
    ],
  },
  {
    title: "Resultados e investigación",
    questions: [
      {
        question: "¿Cómo se utilizarán los resultados del estudio?",
        answer:
          "Los resultados se emplearán para generar conocimiento científico sobre el bienestar emocional de adolescentes y familias.",
      },
      {
        question: "¿Los resultados serán públicos?",
        answer:
          "Podrán difundirse resultados agregados y anónimos mediante publicaciones o comunicaciones científicas.",
      },
      {
        question: "¿Podré conocer las conclusiones del estudio?",
        answer:
          "Cuando sea posible se informará a los participantes sobre los principales hallazgos obtenidos.",
      },
      {
        question:
          "¿La participación sustituye la atención psicológica profesional?",
        answer:
          "No. Alpha-Help es un proyecto de investigación y no sustituye la evaluación, el diagnóstico o la intervención realizada por profesionales sanitarios.",
      },
    ],
  },
] as const;