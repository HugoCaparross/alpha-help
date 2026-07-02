const TOPICS = [
  "Salud mental",
  "Bienestar emocional",
  "Relaciones familiares",
  "Uso responsable de la tecnología",
  "Educación digital",
  "Conductas de riesgo",
  "Ansiedad y depresión",
  "Autolesiones",
  "Prevención",
] as const;

/**
 * Principales áreas de estudio del proyecto Alpha-Help.
 */
export default function EstudioTopics() {
  return (
    <section className="estudio-card" aria-labelledby="estudio-topics-title">
      <div className="estudio-card-header">
        <div>
          <h2 id="estudio-topics-title" className="estudio-card-title">
            ¿Qué temas abordamos?
          </h2>

          <p className="estudio-card-description">
            El estudio analiza distintas áreas relacionadas con el bienestar
            emocional durante la adolescencia, el contexto familiar y los
            factores que pueden influir en su desarrollo.
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
