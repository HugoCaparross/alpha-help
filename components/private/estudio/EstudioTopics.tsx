const topics = [
  "Salud mental",
  "Bienestar emocional",
  "Relaciones familiares",
  "Uso de tecnología",
  "Educación digital",
  "Conductas de riesgo",
  "Ansiedad y depresión",
  "Autolesiones",
  "Prevención",
];

export default function EstudioTopics() {
  return (
    <section className="estudio-card">
      <div className="estudio-card-header">
        <div>
          <h2 className="estudio-card-title">¿Qué temas abordamos?</h2>

          <p className="estudio-card-description">
            El estudio analiza diferentes dimensiones relacionadas con el
            bienestar emocional, la adolescencia y el entorno familiar.
          </p>
        </div>
      </div>

      <div className="estudio-topics">
        {topics.map((topic) => (
          <div key={topic} className="estudio-topic">
            {topic}
          </div>
        ))}
      </div>
    </section>
  );
}
