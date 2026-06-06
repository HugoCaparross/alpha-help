import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import '../styles/project.css';

export default function ProjectCTA() {
  return (
    <section className="proj-cta-wrap">
      <div className="container-custom">
        <div className="proj-cta">

          {/* ── Left ── */}
          <div>
            <h2 className="proj-cta__title">
              Juntos podemos marcar la diferencia
            </h2>
            <p className="proj-cta__desc">
              Tu participación ayudará a generar conocimiento útil para comprender
              mejor los desafíos emocionales de la adolescencia y desarrollar
              herramientas que beneficien a las familias.
            </p>
          </div>

          {/* ── Right ── */}
          <div className="proj-cta__actions">
            <Link href="/registro" className="btn-primary">
              Participar gratuitamente
              <ArrowRight size={16} style={{ marginLeft: 6 }} />
            </Link>
            <Link href="/contacto" className="btn-secondary">
              <Mail size={16} style={{ marginRight: 6 }} />
              Contactar con el equipo
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}