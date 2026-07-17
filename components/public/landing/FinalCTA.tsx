import Link from "next/link";

/**
 * Llamada final a la acción de la Landing.
 */
export default function FinalCTA() {
  return (
    <section className="final-cta-section" aria-labelledby="final-cta-title">
      <div className="container-custom">
        <div className="final-cta-card">
          <span className="final-cta-badge">Participación gratuita</span>

          <h2 id="final-cta-title" className="final-cta-title">
            Empiece hoy a formar parte de Alpha-Help
          </h2>

          <p className="final-cta-description">
            Únase a Alpha-Help, acceda a recursos diseñados para ayudar a las
            familias a afrontar los desafíos emocionales de la preadolescencia y
            la adolescencia, y colabore en un estudio científico que contribuirá
            a mejorar el conocimiento sobre el bienestar emocional de los
            adolescentes y sus familias.
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
