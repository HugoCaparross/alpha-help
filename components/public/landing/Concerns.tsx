import Image from "next/image";

const CONCERNS = [
  {
    title: "Cambios bruscos de comportamiento",
    icon: "/images/landing/icons/comportamiento.png",
  },
  {
    title: "Ansiedad o tristeza persistente",
    icon: "/images/landing/icons/ansiedad.png",
  },
  {
    title: "Problemas con redes sociales y videojuegos",
    icon: "/images/landing/icons/videojuegos.png",
  },
  {
    title: "Acoso o ciberacoso escolar",
    icon: "/images/landing/icons/acoso.png",
  },
  {
    title: "Consumo de sustancias",
    icon: "/images/landing/icons/medicinas.png",
  },
  {
    title: "Problemas de autoestima e imagen corporal",
    icon: "/images/landing/icons/selfesteem.png",
  },
  {
    title: "Dificultades para comunicarse",
    icon: "/images/landing/icons/communication.png",
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
          {CONCERNS.map((concern) => (
            <article key={concern.title} className="concern-card">
              <div className="concern-icon" aria-hidden="true">
                <Image
                  src={concern.icon}
                  alt=""
                  width={120}
                  height={120}
                  loading="lazy"
                  sizes="120px"
                />
              </div>

              <h3 className="concern-title">{concern.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
