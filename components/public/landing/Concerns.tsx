import {
  Brain,
  Gamepad2,
  Heart,
  MessageCircle,
  Pill,
  ShieldAlert,
  Smartphone,
  UsersRound,
} from "lucide-react";

const CONCERNS = [
  {
    title: "Gestión emocional",
    icon: Brain,
  },
  {
    title: "Ansiedad o malestar emocional",
    icon: Heart,
  },
  {
    title: "Uso problemático de dispositivos electrónicos y redes sociales",
    icon: Gamepad2,
  },
  {
    title: "Acoso o ciberacoso escolar",
    icon: ShieldAlert,
  },
  {
    title: "Consumo de sustancias",
    icon: Pill,
  },
  {
    title: "Problemas de autoestima e imagen corporal",
    icon: UsersRound,
  },
  {
    title: "Problemas de comunicación",
    icon: MessageCircle,
  },
  {
    title: "Relaciones, sexualidad y pornografía",
    icon: MessageCircle,
  },
] as const;

/**
 * Situaciones frecuentes que pueden preocupar
 * a las familias durante la adolescencia.
 */
export default function Concerns() {
  return (
    <section className="concerns-section" aria-labelledby="concerns-title">
      <div className="container-custom">
        <header className="section-header">
          <span className="section-badge">Situaciones frecuentes</span>

          <h2 id="concerns-title" className="section-title">
            ¿Le preocupa alguna de estas situaciones?
          </h2>

          <p className="section-description">
            No todas estas situaciones indican un problema grave, pero
            conocerlas y detectarlas a tiempo puede marcar una gran diferencia.
          </p>
        </header>

        <div className="concerns-grid">
          {CONCERNS.map((concern) => {
            const Icon = concern.icon;

            return (
              <article key={concern.title} className="concern-card">
                <div className="concern-icon" aria-hidden="true">
                  <Icon size={34} strokeWidth={1.9} />
                </div>

                <h3 className="concern-title">{concern.title}</h3>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}