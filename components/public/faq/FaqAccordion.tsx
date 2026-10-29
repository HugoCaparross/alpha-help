"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

import { FAQ_SECTIONS } from "./faq.data";

/**
 * Convierte un texto en un id HTML válido.
 */
function createSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Renderiza las respuestas del FAQ respetando:
 *
 * - Párrafos separados mediante saltos de línea.
 * - Listas marcadas con "•".
 * - Negrita en las etiquetas iniciales con formato "Etiqueta: contenido".
 *
 * El texto original no se modifica.
 */
function FaqAnswer({ answer }: { answer: string }) {
  const normalizedAnswer = answer.replace(/\r\n/g, "\n").trim();

  const blocks = normalizedAnswer
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="faq-answer-content">
      {blocks.map((block, index) => {
        const firstBulletIndex = block.indexOf("•");

        if (firstBulletIndex !== -1) {
          const introduction = block
            .slice(0, firstBulletIndex)
            .trim();

          const listItems = block
            .slice(firstBulletIndex)
            .split("•")
            .map((item) => item.replace(/\s+/g, " ").trim())
            .filter(Boolean);

          if (listItems.length > 0) {
            return (
              <div
                className="faq-answer-block"
                key={`${index}-${block.slice(0, 24)}`}
              >
                {introduction && <p>{introduction}</p>}

                <ul className="faq-answer-list">
                  {listItems.map((item, itemIndex) => {
                    const separator = item.indexOf(":");

                    if (separator > 0) {
                      const label = item.slice(0, separator + 1);
                      const content = item.slice(separator + 1).trim();

                      return (
                        <li key={`${itemIndex}-${item}`}>
                          <strong>{label}</strong>
                          {content && <> {content}</>}
                        </li>
                      );
                    }

                    return (
                      <li key={`${itemIndex}-${item}`}>
                        {item}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          }
        }

        return (
          <p key={`${index}-${block.slice(0, 24)}`}>
            {block.replace(/\s*\n\s*/g, " ")}
          </p>
        );
      })}
    </div>
  );
}

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
        {filteredSections.map((section) => {
          const sectionId = `section-${createSlug(section.title)}`;

          return (
            <section
              key={section.title}
              className="faq-section"
              aria-labelledby={sectionId}
            >
              <div className="faq-category">
                <h2 id={sectionId} className="faq-section-title">
                  {section.title}
                </h2>
              </div>

              {section.questions.map((item) => {
                const key = `${createSlug(section.title)}-${createSlug(
                  item.question,
                )}`;

                const answerId = `answer-${key}`;

                // La pregunta solo permanece abierta mientras coincida
                // la búsqueda con la que se abrió.
                const scopedOpenItem = `${normalizedSearch}::${key}`;
                const isOpen = openItem === scopedOpenItem;

                return (
                  <article key={key} className="faq-card">
                    <button
                      type="button"
                      className="faq-question"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() =>
                        setOpenItem(isOpen ? null : scopedOpenItem)
                      }
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
                      className={`faq-answer-wrapper ${isOpen ? "open" : ""
                        }`}
                      hidden={!isOpen}
                      aria-hidden={!isOpen}
                    >
                      <div className="faq-answer">
                        <FaqAnswer answer={item.answer} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          );
        })}

        {!hasResults && normalizedSearch !== "" && (
          <div className="faq-empty">
            <h3>No hemos encontrado resultados</h3>

            <p>
              Intenta utilizar otras palabras o contacta con nuestro equipo
              para resolver tu duda.
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