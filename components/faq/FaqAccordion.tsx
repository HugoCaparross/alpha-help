"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQSection = {
  title: string;
  questions: FAQItem[];
};

const faqSections: FAQSection[] = [
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
        answer: "No. La participación es completamente gratuita.",
      },
      {
        question: "¿Puedo abandonar el estudio cuando quiera?",
        answer:
          "Sí. La participación es totalmente voluntaria y puede interrumpirse en cualquier momento.",
      },
      {
        question: "¿Recibiré alguna compensación económica?",
        answer: "No. La participación no contempla compensaciones económicas.",
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
          "No. Alpha-Help es un proyecto de investigación y no sustituye la evaluación, diagnóstico o intervención realizada por profesionales sanitarios.",
      },
    ],
  },
];

export default function FaqAccordion() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const hasResults = faqSections.some((section) =>
    section.questions.some(
      (item) =>
        item.question.toLowerCase().includes(search.toLowerCase()) ||
        item.answer.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  return (
    <>
      <section className="faq-hero">
        <h1 className="faq-title">Preguntas frecuentes sobre Alpha-Help</h1>

        <p className="faq-subtitle">
          Resolvemos las dudas más habituales sobre la participación en el
          estudio, la privacidad de los datos y el funcionamiento de Alpha-Help.
        </p>

        <div className="faq-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar una pregunta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="faq-content">
        {faqSections.map((section) => {
          const filteredQuestions = section.questions.filter((item) => {
            const query = search.toLowerCase();

            return (
              item.question.toLowerCase().includes(query) ||
              item.answer.toLowerCase().includes(query)
            );
          });

          if (filteredQuestions.length === 0 && search.trim() !== "") {
            return null;
          }

          return (
            <div key={section.title} className="faq-section">
              <div className="faq-category">
                <h2 className="faq-section-title">{section.title}</h2>
              </div>

              {filteredQuestions.map((item) => {
                const key = `${section.title}-${item.question}`;

                const isOpen = openItem === key;

                return (
                  <div key={key} className="faq-card">
                    <button
                      type="button"
                      className="faq-question"
                      onClick={() => setOpenItem(isOpen ? null : key)}
                    >
                      <span>{item.question}</span>

                      {isOpen ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>

                    <div
                      className={`faq-answer-wrapper ${isOpen ? "open" : ""}`}
                    >
                      <div className="faq-answer">{item.answer}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {!hasResults && search.trim() !== "" && (
          <div className="faq-empty">
            <h3>No hemos encontrado resultados</h3>

            <p>
              Intenta utilizar otras palabras o contacta con nuestro equipo para
              resolver tu duda.
            </p>

            <a href="/contacto" className="btn-primary">
              Contactar
            </a>
          </div>
        )}
      </section>

      <section className="faq-contact">
        <div className="faq-contact-card">
          <h3>¿Quieres participar en el estudio?</h3>

          <p>
            Forma parte de una investigación centrada en el bienestar emocional
            de adolescentes y familias.
          </p>

          <div className="faq-contact-actions">
            <a href="/register" className="btn-primary">
              Crear cuenta
            </a>

            <a href="/contacto" className="btn-secondary">
              Contactar
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
