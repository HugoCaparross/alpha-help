const TOPICS = [
  "Salud mental, emociones y familia",
  "Relación y comunicación familiar",
  "Acoso escolar",
  "Bienestar digital",
  "Adicciones a sustancias",
  "Ansiedad y depresión",
  "Autolesiones",
  "Riesgos de la conducta alimentaria",
  "Relaciones, sexualidad y pornografía",
] as const;

/**
 * Principales temáticas abordadas
 * durante el programa Alpha-Help.
 */
export default function EstudioTopics() {
  return (
    <section className="estudio-card" aria-labelledby="estudio-topics-title">
      <div className="estudio-card-header">
        <div>
          <h2 id="estudio-topics-title" className="estudio-card-title">
            Contenidos del programa
          </h2>

          <p className="estudio-card-description">
            Durante el estudio las familias participantes tendrán acceso a
            contenidos relacionados con la prevención de riesgos asociados a la
            adolescencia y el bienestar emocional del menor.
          </p>
        </div>
      </div>

      <ul className="estudio-topics">
        {TOPICS.map((topic) => (
          <li key={topic} className="estudio-topic">
            {topic}
          </li>
        ))}
      </ul>
    </section>
  );
}
