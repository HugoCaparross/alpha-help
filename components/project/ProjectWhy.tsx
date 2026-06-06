import { TrendingUp, Database, Zap, Layers } from "lucide-react";
import "../styles/project.css";

const CARDS = [
  {
    icon: <TrendingUp size={22} />,
    title: "Mayor prevalencia",
    desc: "Aumentan los problemas emocionales durante la adolescencia.",
  },
  {
    icon: <Database size={22} />,
    title: "Necesidad de datos",
    desc: "Faltan estudios longitudinales de calidad en nuestro entorno.",
  },
  {
    icon: <Zap size={22} />,
    title: "Impacto real",
    desc: "Queremos transformar el conocimiento en herramientas útiles.",
  },
  {
    icon: <Layers size={22} />,
    title: "Enfoque integral",
    desc: "Adolescentes, familias y profesionales trabajando juntos.",
  },
] as const;

export default function ProjectWhy() {
  return (
    <section className="section proj-section--alt">
      <div className="container-custom">
        <div className="proj-grid-2">
          {/* ── Left ── */}
          <div>
            <span className="proj-eyebrow">¿Por qué nace Alpha-Help?</span>
            <h2 className="proj-h2">
              Un proyecto nacido de la <em>necesidad real</em>
            </h2>
            <p className="proj-body">
              La adolescencia es una etapa de cambios intensos. Es habitual que
              las familias se enfrenten a situaciones que generan dudas,
              preocupación o incertidumbre: cambios emocionales, problemas de
              autoestima, dificultades en el uso de internet y redes sociales,
              conflictos familiares o conductas de riesgo.
            </p>
            <p className="proj-body">
              Sin embargo, muchas veces los padres y madres no saben si lo que
              están observando forma parte del desarrollo normal o si puede ser
              una señal de alarma que requiere atención.
            </p>
            <p className="proj-body">
              <strong>
                Alpha-Help nace para ayudar a las familias a comprender mejor
                estas situaciones y ofrecerles herramientas prácticas para
                afrontarlas con mayor seguridad.
              </strong>
            </p>
          </div>

          {/* ── Right: 2×2 cards ── */}
          <div className="proj-why__cards">
            {CARDS.map((c) => (
              <div key={c.title} className="card proj-why-card">
                <div className="proj-why-card__icon" aria-hidden="true">
                  {c.icon}
                </div>
                <p className="proj-why-card__title">{c.title}</p>
                <p className="proj-why-card__desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
