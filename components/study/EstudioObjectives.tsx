import { Check } from "lucide-react";

const objectives = [
  "Comprender mejor el bienestar emocional durante la adolescencia.",
  "Identificar factores de protección y situaciones de riesgo.",
  "Ofrecer herramientas y recursos de apoyo a las familias.",
  "Generar evidencia científica útil para futuras intervenciones.",
];

export default function EstudioObjectives() {
  return (
    <section className="estudio-card">
      <div className="estudio-card-header">

        <div>
          <h2 className="estudio-card-title">
            ¿Qué queremos conseguir?
          </h2>

          <p className="estudio-card-description">
            El proyecto Alpha-Help busca generar conocimiento científico y
            proporcionar herramientas útiles para adolescentes y familias.
          </p>
        </div>
      </div>

      <div className="estudio-objectives">
        {objectives.map((objective) => (
          <div
            key={objective}
            className="estudio-objective"
          >
            <div className="estudio-objective-icon">
              <Check size={16} />
            </div>

            <span>
              {objective}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}