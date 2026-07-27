export interface FAQItem {
  readonly question: string;

  readonly answer: string;
}

export interface FAQSection {
  readonly title: string;

  readonly questions: readonly FAQItem[];
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
          "Alpha-Help es un estudio de investigación dirigido a padres, madres y tutores legales de preadolescentes y adolescentes con edades comprendidas entre los 10 y los 16 años (ambos inclusive).\n\nAdemás de contribuir a una investigación, los padres, madres y tutores participantes tendrán acceso a contenidos, recursos y materiales elaborados por expertos en salud mental infanto-juvenil y basados en evidencias científicas.\n\nDichos materiales abordarán algunos de los principales desafíos y riesgos que pueden aparecer durante esta etapa del desarrollo, como la comunicación familiar, la gestión emocional, el acoso y el ciberacoso escolar, el bienestar digital, el consumo de sustancias, la ansiedad y la depresión, las autolesiones, los riesgos relacionados con la conducta alimentaria y las relaciones afectivas, la sexualidad y el consumo de pornografía.\n\nLa participación en el estudio incluye dos evaluaciones online (antes y después de tener acceso a los contenidos) de 15 minutos de duración.",
      },
      {
        question: "¿Cuál es el objetivo del estudio?",
        answer:
          "Los objetivos del estudio son implantar una intervención psicoeducativa online orientada a padres, madres y tutores legales de menores de entre 10 y 16 años de edad (ambos inclusive) y analizar sus posibles efectos sobre aspectos relacionados con las estrategias parentales de los participantes (conocimiento de la salud mental infanto-juvenil, competencias parentales, estrés familiar) y el bienestar de sus hijos.",
      },
      {
        question: "¿Quién desarrolla el proyecto?",
        answer:
          "El proyecto está impulsado por profesionales e investigadores especializados en bienestar emocional, educación e intervención psicológica de la Universidad Internacional de La Rioja (UNIR).",
      },
      {
        question: "¿Por qué se realiza esta investigación?",
        answer:
          "La investigación busca ayudar a las familias y generar conocimiento que contribuya a mejorar la prevención, detección e intervención en dificultades emocionales durante la adolescencia.",
      },
    ],
  },
  {
    title: "Participación en el estudio",
    questions: [
      {
        question: "¿Quién puede participar?",
        answer:
          "Pueden participar en el estudio padres, madres o tutores legales de preadolescentes y adolescentes con edades comprendidas entre los 10 y los 16 años (ambos inclusive).",
      },
      {
        question: "¿Cuánto tiempo dura el estudio?",
        answer:
          "El estudio tiene una duración de 10 meses. Empezará en septiembre de 2026 y finalizará en junio de 2027.",
      },
      {
        question: "¿Cuáles son las fases del estudio?",
        answer:
          "La primera fase consistirá en el reclutamiento y evaluación online inicial de los participantes. Esta fase tendrá lugar durante el mes de septiembre de 2026.\n\nLa segunda fase será la aplicación del programa de intervención. Dicho programa consistirá en 9 sesiones online y el acceso a contenidos y materiales de las diferentes temáticas de interés. Esta fase tendrá lugar durante los meses de septiembre de 2026 a mayo de 2027.\n\nLa tercera fase consistirá en una nueva evaluación de los participantes. Esta fase tendrá lugar en el mes de junio de 2027.",
      },
      {
        question: "¿En qué consiste la intervención?",
        answer:
          "La intervención está compuesta por 9 sesiones online de 60 minutos de duración cada una y el acceso a materiales didácticos desarrollados por expertos en salud mental infanto-juvenil.\n\nLas sesiones serán mensuales y serán impartidas por profesionales de diferentes ámbitos relacionados con la terapia familiar y la salud mental infanto-juvenil.\n\nLos temas de la intervención serán:\n\n• Septiembre: Salud mental, emociones y familia.\n• Octubre: Relación y comunicación familiar.\n• Noviembre: Acoso escolar.\n• Diciembre: Bienestar digital.\n• Enero: Adicciones a sustancias.\n• Febrero: Ansiedad y depresión.\n• Marzo: Autolesiones.\n• Abril: Riesgos de la conducta alimentaria.\n• Mayo: Relaciones, sexualidad y pornografía.\n\nCada mes los participantes recibirán un capítulo del manual de riesgos y bienestar emocional del programa referido a los contenidos que se tratarán en la sesión mensual. Estos materiales incluyen una versión reducida, de fácil lectura, y una versión extendida con contenidos adicionales (ejercicios, enlaces y tests de autoevaluación).",
      },
      {
        question: "¿Las sesiones quedarán grabadas?",
        answer:
          "Sí. Las sesiones quedarán grabadas y podrán ser consultadas por los participantes en diferido cuando lo deseen, tantas veces como quieran.",
      },
      {
        question: "¿Es obligatorio acudir a todas las sesiones?",
        answer:
          "No. Los participantes no están obligados a acudir a todas las sesiones. Sí pedimos que acudan a tantas como les sea posible para poder evaluar los verdaderos efectos de la intervención.",
      },
      {
        question: "¿Hay que participar de manera activa en las sesiones?",
        answer:
          "No necesariamente. La persona que imparta las sesiones puede lanzar preguntas a los asistentes de manera general. Igualmente, los asistentes podrán participar a través del chat de la sesión. La participación es voluntaria.",
      },
      {
        question:
          "¿Podré plantear consultas personales para que estas sean atendidas de manera individual?",
        answer:
          "No. La participación en el estudio no implica un acompañamiento o atención psicológica individualizada del participante.",
      },
      {
        question: "¿Hay que realizar alguna tarea o entregar actividades?",
        answer:
          "No. Los participantes recibirán los materiales de la intervención, pero en ningún momento se hará seguimiento de su evolución o del programa.",
      },
      {
        question: "¿Qué tipo de información se solicita?",
        answer:
          "Durante el registro en la página web se solicitará información de carácter sociodemográfico (edad, género, estado civil, situación laboral, número de hijos, edades de los hijos, etc.).\n\nEn las evaluaciones antes y después de la intervención (septiembre de 2026 y junio de 2027, respectivamente) se evaluará a los participantes con los siguientes cuestionarios:\n\n• Cuestionario de alfabetización parental en salud mental infanto-juvenil (CAPSM-IJ) (23 preguntas).\n• Escala de sentido de competencia parental (PSOC) (16 preguntas).\n• Escala de competencia parental percibida (ECPP-p) (17 preguntas).\n• Escala de estrés parental (PSS) (17 preguntas).\n• Escala KIDSCREEN-27 (15 preguntas).",
      },
      {
        question:
          "¿Cuál es el tiempo estimado que se requiere para contestar a las preguntas?",
        answer:
          "Depende del participante. En base a nuestra experiencia, consideramos que un tiempo razonable puede situarse entre los 15 y los 25 minutos.",
      },
      {
        question: "¿Tiene algún coste participar en el estudio?",
        answer:
          "No. La participación es completamente gratuita.",
      },
      {
        question: "¿Puedo abandonar el estudio cuando quiera?",
        answer:
          "Sí. La participación es totalmente voluntaria y puede interrumpirse en cualquier momento sin necesidad de dar ninguna explicación.",
      },
      {
        question:
          "¿Recibiré alguna compensación económica por participar?",
        answer:
          "No. La participación en el estudio no contempla compensaciones económicas.",
      },
      {
        question: "¿La participación en el estudio es segura?",
        answer:
          "Sí. El estudio es completamente seguro y no implica riesgo alguno para los participantes. Ha sido evaluado por un Comité de Ética de Investigación (CEI) independiente, que ha emitido un informe favorable certificando la idoneidad y seguridad del estudio.",
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
          "Una vez confirmado el registro podrás acceder a tu área personal con las credenciales (usuario y contraseña) que has indicado.",
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
          "No. No se recopilan nombres, apellidos ni información que permita identificar personalmente ni a los participantes ni a los menores.",
      },
      {
        question: "¿Qué ocurre si mi hijo ha recibido apoyo psicológico?",
        answer:
          "Esa información se utiliza exclusivamente con fines estadísticos y de investigación para poder realizar análisis secundarios. No es objetivo, ni interés del estudio, conocer los detalles de dicha atención.",
      },
    ],
  },
  {
    title: "Resultados e investigación",
    questions: [
      {
        question: "¿Cómo se utilizarán los resultados del estudio?",
        answer:
          "Los resultados de cada participante se tratarán de manera confidencial y anonimizada siguiendo la normativa vigente. Dichos resultados formarán parte de una base de datos general a la que solo tendrá acceso el investigador principal del estudio. La base de datos será analizada estadísticamente con el objetivo de generar conocimiento científico sobre el bienestar emocional de adolescentes y familias.",
      },
      {
        question: "¿Los resultados serán públicos?",
        answer:
          "Podrán difundirse resultados agregados y anónimos mediante publicaciones o comunicaciones científicas. Nunca se publicarán datos individuales o que puedan identificar a una persona en concreto.",
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