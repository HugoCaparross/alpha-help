"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ChevronDown, ChevronUp, Search } from "lucide-react";

import { FAQ_SECTIONS } from "./faq.data";

/**
 * Acordeón de preguntas frecuentes.
 */
export default function FaqAccordion() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const normalizedSearch = search.trim().toLowerCase();

  const filteredSections = useMemo(() => {
    return FAQ_SECTIONS.map((section) => ({
      ...section,
      questions: section.questions.filter(
        (item) =>
          normalizedSearch === "" ||
          item.question.toLowerCase().includes(normalizedSearch) ||
          item.answer.toLowerCase().includes(normalizedSearch),
      ),
    })).filter((section) => section.questions.length > 0);
  }, [normalizedSearch]);

  const hasResults = filteredSections.length > 0;

  return (
    <>
      <section className="faq-hero" aria-labelledby="faq-title">
        <h1 id="faq-title" className="faq-title">
          Preguntas frecuentes sobre Alpha-Help
        </h1>

        <p className="faq-subtitle">
          Resolvemos las dudas más habituales sobre la participación en el
          estudio, la privacidad de los datos y el funcionamiento de Alpha-Help.
        </p>

        <div className="faq-search">
          <Search size={18} aria-hidden="true" />

          <input
            type="search"
            placeholder="Buscar una pregunta..."
            aria-label="Buscar preguntas frecuentes"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </section>

      <section className="faq-content">
        {filteredSections.map((section) => (
          <section
            key={section.title}
            className="faq-section"
            aria-labelledby={`section-${section.title}`}
          >
            <div className="faq-category">
              <h2 id={`section-${section.title}`} className="faq-section-title">
                {section.title}
              </h2>
            </div>

            {section.questions.map((item) => {
              const key = `${section.title}-${item.question}`;

              const answerId = `answer-${key}`;

              const isOpen = openItem === key;

              return (
                <article key={key} className="faq-card">
                  <button
                    type="button"
                    className="faq-question"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenItem(isOpen ? null : key)}
                  >
                    <span>{item.question}</span>

                    {isOpen ? (
                      <ChevronUp size={18} aria-hidden="true" />
                    ) : (
                      <ChevronDown size={18} aria-hidden="true" />
                    )}
                  </button>

                  <div
                    id={answerId}
                    className={`faq-answer-wrapper ${isOpen ? "open" : ""}`}
                  >
                    <div className="faq-answer">{item.answer}</div>
                  </div>
                </article>
              );
            })}
          </section>
        ))}

        {!hasResults && normalizedSearch !== "" && (
          <div className="faq-empty">
            <h3>No hemos encontrado resultados</h3>

            <p>
              Intenta utilizar otras palabras o contacta con nuestro equipo para
              resolver tu duda.
            </p>

            <Link href="/contacto" className="btn-primary">
              Contactar
            </Link>
          </div>
        )}
      </section>

      <section className="faq-contact">
        <div className="faq-contact-card">
          <h2>¿Quieres participar en el estudio?</h2>

          <p>
            Forma parte de una investigación centrada en el bienestar emocional
            de adolescentes y familias.
          </p>

          <div className="faq-contact-actions">
            <Link href="/register" className="btn-primary">
              Crear cuenta
            </Link>

            <Link href="/contacto" className="btn-secondary">
              Contactar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
