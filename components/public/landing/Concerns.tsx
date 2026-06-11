import Image from "next/image";

const concerns = [
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
];

export default function Concerns() {
  return (
    <section className="concerns-section">
      <div className="container-custom">
        <div className="section-header">
          <span className="section-badge">Situaciones frecuentes</span>

          <h2 className="section-title">
            ¿Le preocupa alguna de estas situaciones?
          </h2>

          <p className="section-description">
            No todas estas situaciones indican un problema grave, pero
            conocerlas y detectarlas a tiempo puede marcar una gran diferencia.
          </p>
        </div>

        <div className="concerns-grid">
          {concerns.map((item) => (
            <article key={item.title} className="concern-card">
              <div className="concern-icon">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={120}
                  height={120}
                />
              </div>

              <h3 className="concern-title">{item.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
