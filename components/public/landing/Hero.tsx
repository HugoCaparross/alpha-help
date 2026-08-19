import Image from "next/image";
import Link from "next/link";

/**
 * Sección principal de la landing.
 *
 * Hero a pantalla completa con imagen de fondo,
 * overlay y contenido superpuesto.
 */
export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-background" aria-hidden="true">
        <Image
          src="/images/familia_v2.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
      </div>

      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-content-container">
        <div className="container-custom">
          <div className="hero-content">

            <h1 id="hero-title" className="hero-title">
              Ayudamos a las familias en los{" "}
              <span className="text-accent">
                desafíos emocionales
              </span>{" "}
              de la adolescencia
            </h1>

            <p className="hero-description">
              Alpha-Help ayuda a madres y padres a comprender,
              detectar y actuar ante situaciones que pueden
              afectar al bienestar emocional de sus hijos e hijas
              durante la preadolescencia y la adolescencia.
            </p>

            <div className="hero-actions">
              <Link
                href="/register"
                className="btn-primary hero-btn"
              >
                Crear cuenta gratuita
              </Link>

              <Link
                href="/proyecto"
                className="btn-secondary hero-btn"
              >
                Conocer el proyecto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}