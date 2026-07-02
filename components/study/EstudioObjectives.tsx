import { Check } from "lucide-react";

const OBJECTIVES = [
  "Comprender mejor el bienestar emocional durante la adolescencia.",
  "Identificar factores de protección y situaciones de riesgo.",
  "Ofrecer herramientas y recursos de apoyo a las familias.",
  "Generar evidencia científica útil para futuras intervenciones.",
] as const;

/**
 * Objetivos principales del proyecto Alpha-Help.
 */
export default function EstudioObjectives() {
  return (
    <section
      className="estudio-card"
      aria-labelledby="estudio-objectives-title"
    >
      <div className="estudio-card-header">
        <div>
          <h2 id="estudio-objectives-title" className="estudio-card-title">
            ¿Qué queremos conseguir?
          </h2>

          <p className="estudio-card-description">
            Alpha-Help tiene como objetivo generar conocimiento científico y
            ofrecer herramientas útiles para fortalecer el bienestar emocional
            de los adolescentes y apoyar a sus familias.
          </p>
        </div>
      </div>

      <ul className="estudio-objectives">
        {OBJECTIVES.map((objective) => (
          <li key={objective} className="estudio-objective">
            <div className="estudio-objective-icon" aria-hidden="true">
              <Check size={16} />
            </div>

            <span>{objective}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
