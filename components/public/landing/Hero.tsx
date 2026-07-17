import Image from "next/image";
import Link from "next/link";

/**
 * Sección principal de la landing.
 */
export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-content-container">
          <div className="container-custom">
            <div className="hero-content">
              <h1 id="hero-title" className="hero-title">
                Ayudamos a
                <br />
                las familias
                <br />
                en los <span className="text-accent">desafíos emocionales</span>
                <br />
                de la adolescencia
              </h1>

              <p className="hero-description">
                Alpha-Help ayuda a madres y padres a comprender, detectar y
                actuar ante situaciones que pueden afectar al bienestar
                emocional de sus hijos e hijas durante la preadolescencia y la
                adolescencia.
              </p>

              <div className="hero-actions">
                <Link href="/register" className="btn-primary hero-btn">
                  Crear cuenta gratuita
                </Link>

                <Link href="/proyecto" className="btn-secondary hero-btn">
                  Conocer el proyecto
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-image-wrapper" aria-hidden="true">
          <Image
            src="/images/familia_v2.png"
            alt="Madre y adolescente compartiendo un momento de conversación y apoyo"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="hero-image"
          />
        </div>
      </div>
    </section>
  );
}
