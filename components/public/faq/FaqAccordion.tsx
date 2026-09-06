"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
 * Renderiza las respuestas respetando los saltos de párrafo y los listados
 * presentes en los contenidos originales. El texto no se modifica: solo se
 * transforma su estructura visual para facilitar la lectura.
 */
function FaqAnswer({ answer }: { answer: string }) {
  const blocks = answer
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="faq-answer">
      {blocks.map((block, index) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        const isList = lines.length > 1 && lines.every((line) => line.startsWith("•"));

        if (isList) {
          return (
            <ul key={`${index}-${block.slice(0, 20)}`} className="faq-answer-list">
              {lines.map((line) => (
                <li key={line}>{line.replace(/^•\s*/, "")}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`${index}-${block.slice(0, 20)}`} className="faq-answer-paragraph">
            {lines.map((line, lineIndex) => (
              <span key={`${lineIndex}-${line.slice(0, 20)}`}>
                {line}
                {lineIndex < lines.length - 1 ? <br /> : null}
              </span>
            ))}
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

  /**
   * Cierra cualquier pregunta abierta
   * cuando cambia la búsqueda.
   */
  useEffect(() => {
    setOpenItem(null);
  }, [normalizedSearch]);

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
                      hidden={!isOpen}
                      aria-hidden={!isOpen}
                    >
                      <FaqAnswer answer={item.answer} />
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
