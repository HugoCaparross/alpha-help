import {
  Brain,
  Heart,
  ShieldCheck,
  Smartphone,
  Users,
  School,
  MessageCircle,
  BookOpen,
} from "lucide-react";

/**
 * Principales ámbitos de estudio
 * abordados por Alpha-Help.
 */
const PROJECT_TOPICS = [
  {
    title: "Bienestar emocional",
    icon: Brain,
  },
  {
    title: "Ansiedad y estado de ánimo",
    icon: Heart,
  },
  {
    title: "Autoestima",
    icon: ShieldCheck,
  },
  {
    title: "Relaciones familiares",
    icon: Users,
  },
  {
    title: "Comunicación familiar",
    icon: MessageCircle,
  },
  {
    title: "Entorno educativo",
    icon: School,
  },
  {
    title: "Redes sociales y tecnología",
    icon: Smartphone,
  },
  {
    title: "Prevención y promoción de la salud",
    icon: BookOpen,
  },
] as const;

export default function ProjectTopics() {
  return (
    <section className="project-section" aria-labelledby="project-topics-title">
      <div className="container-custom">
        <div className="project-section-heading">
          <span className="project-section-number" aria-hidden="true">
            3
          </span>

          <h2 id="project-topics-title" className="section-title">
            Ámbitos de estudio
          </h2>
        </div>

        <p className="section-description">
          Alpha-Help aborda diferentes factores que pueden influir en el
          bienestar emocional durante la adolescencia, analizando tanto el
          contexto familiar como el educativo y social.
        </p>

        <div className="project-topics-grid">
          {PROJECT_TOPICS.map((topic) => {
            const Icon = topic.icon;

            return (
              <article key={topic.title} className="project-topic-card">
                <div className="project-topic-icon" aria-hidden="true">
                  <Icon size={30} />
                </div>

                <h3>{topic.title}</h3>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
