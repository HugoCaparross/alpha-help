import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="final-cta-section">
      <div className="container-custom">
        <div className="final-cta-card">
          <span className="final-cta-badge">Participación gratuita</span>

          <h2 className="final-cta-title">
            Empiece hoy a formar parte de ALPHA-HELP
          </h2>

          <p className="final-cta-description">
            Únase a un proyecto basado en evidencia científica y
            acceda a recursos diseñados para ayudar a las familias a afrontar
            los desafíos emocionales de la adolescencia.
          </p>

          <div className="final-cta-actions">
            <Link href="/register" className="btn-primary final-cta-button">
              Crear cuenta gratuita
            </Link>

            <Link href="/contacto" className="btn-secondary final-cta-button">
              Contactar con el equipo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
