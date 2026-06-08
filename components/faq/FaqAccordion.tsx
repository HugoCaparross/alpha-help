"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { faqSections } from "./faq.data";

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
