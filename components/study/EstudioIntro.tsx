import { BookOpen, Brain, Users } from "lucide-react";

/**
 * Introducción al proyecto de investigación.
 */
export default function EstudioIntro() {
  return (
    <section className="estudio-card" aria-labelledby="estudio-intro-title">
      <div className="estudio-card-header">
        <div>
          <h2 id="estudio-intro-title" className="estudio-card-title">
            ¿Cuál es el objetivo del estudio?
          </h2>

          <p className="estudio-card-description">
            Alpha-Help es un proyecto de investigación que analiza el bienestar
            emocional durante la adolescencia y el papel que desempeñan las
            familias en la prevención, el acompañamiento y el apoyo a los
            adolescentes.
          </p>
        </div>
      </div>

      <div className="estudio-highlights">
        <div className="estudio-highlight">
          <Brain size={20} aria-hidden="true" />

          <span>Bienestar emocional</span>
        </div>

        <div className="estudio-highlight">
          <Users size={20} aria-hidden="true" />

          <span>Entorno familiar</span>
        </div>

        <div className="estudio-highlight">
          <BookOpen size={20} aria-hidden="true" />

          <span>Investigación científica</span>
        </div>
      </div>
    </section>
  );
}
