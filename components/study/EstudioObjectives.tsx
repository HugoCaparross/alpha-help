import { Check } from "lucide-react";

const OBJECTIVES = [
  "Mejorar la comunicación y la gestión emocional dentro de la familia.",
  "Conocer y comprender mejor los riesgos propios de la adolescencia.",
  "Identificar los factores de riesgo y protección.",
  "Conocer las consecuencias de estos riesgos.",
  "Saber qué hacer y qué no hacer ante un problema de este tipo.",
] as const;

/**
 * Objetivos principales del estudio Alpha-Help.
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
            Objetivo del estudio
          </h2>

          <p className="estudio-card-description">
            El objetivo principal del estudio es aplicar un programa online
            orientado a padres, madres y tutores legales de menores de entre 10
            y 16 años de edad (ambos inclusive) y analizar sus posibles efectos
            sobre aspectos relacionados con las competencias parentales.
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
