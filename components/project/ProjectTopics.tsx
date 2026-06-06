import {
  Brain,
  MessageCircle,
  Users,
  Smartphone,
  Pill,
  CloudRain,
  Bandage,
  Apple,
  Heart,
} from "lucide-react";
import "../styles/project.css";

const TOPICS = [
  {
    month: "Septiembre",
    icon: <Brain size={28} />,
    label: "Salud mental, emociones y familia",
  },
  {
    month: "Octubre",
    icon: <MessageCircle size={28} />,
    label: "Relación y comunicación familiar",
  },
  {
    month: "Noviembre",
    icon: <Users size={28} />,
    label: "Acoso escolar",
  },
  {
    month: "Diciembre",
    icon: <Smartphone size={28} />,
    label: "Bienestar digital",
  },
  {
    month: "Enero",
    icon: <Pill size={28} />,
    label: "Adicciones a sustancias",
  },
  {
    month: "Febrero",
    icon: <CloudRain size={28} />,
    label: "Ansiedad y depresión",
  },
  {
    month: "Marzo",
    icon: <Bandage size={28} />,
    label: "Autolesiones",
  },
  {
    month: "Abril",
    icon: <Apple size={28} />,
    label: "Riesgos de la conducta alimentaria",
  },
  {
    month: "Mayo",
    icon: <Heart size={28} />,
    label: "Relaciones, sexualidad y pornografía",
  },
] as const;

export default function ProjectTopics() {
  return (
    <section className="section proj-section--alt">
      <div className="container-custom">
        <div className="section-header">
          <span className="section-badge">
            Contenidos
          </span>

          <h2 className="section-title">
            Temas que abordaremos
          </h2>
        </div>

        <div className="proj-topics__grid">
          {TOPICS.map((topic) => (
            <article
              key={topic.month}
              className="proj-topic-card"
            >
              <div
                className="proj-topic-card__icon"
                aria-hidden="true"
              >
                {topic.icon}
              </div>

              <div className="proj-topic-card__content">
                <span className="proj-topic-card__month">
                  {topic.month}
                </span>

                <h3 className="proj-topic-card__label">
                  {topic.label}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}