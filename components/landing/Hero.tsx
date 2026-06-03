import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-content-container">
          <div className="container-custom">
            <div className="hero-content">
              <h1 className="hero-title">
                Acompañamos a
                <br />
                las familias
                <br />
                en los <span className="text-accent">desafíos emocionales</span>
                <br />
                de la adolescencia
              </h1>

              <p className="hero-description">
                ALPHA-HELP ayuda a madres y padres a comprender, detectar y
                actuar ante situaciones que pueden afectar al bienestar
                emocional de sus hijos e hijas.
              </p>

              <div className="hero-actions">
                <Link href="/register" className="btn-primary hero-btn">
                  Crear cuenta gratuita
                </Link>

                <Link href="#proyecto" className="btn-secondary hero-btn">
                  Conocer el proyecto
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <Image
            src="/images/familia_v2.png"
            alt="Familia participando en ALPHA-HELP"
            fill
            priority
            className="hero-image"
          />
        </div>
      </div>
    </section>
  );
}
