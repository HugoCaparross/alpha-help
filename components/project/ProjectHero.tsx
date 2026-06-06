import Link from 'next/link';
import { ShieldCheck, Users, FlaskConical, ArrowRight } from 'lucide-react';
import '../styles/project.css';

export default function ProjectHero() {
  return (
    <section className="proj-hero">
      <div className="container-custom">
        <div className="proj-hero__grid">

          {/* ── Copy ── */}
          <div className="proj-hero__copy">
            <span className="section-badge">Sobre el proyecto</span>

            <h1 className="proj-hero__heading">
              Conocer el proyecto{' '}
              <em>Alpha-Help</em>
            </h1>

            <p className="proj-hero__desc">
              Conozca qué es Alpha-Help, por qué hemos creado
              este programa y cómo puede ayudar a su familia.
            </p>

            <div className="proj-hero__actions">
              <Link href="/registro" className="btn-primary">
                Participar gratuitamente
                <ArrowRight size={16} style={{ marginLeft: 6 }} />
              </Link>
              <Link href="/contacto" className="btn-secondary">
                Contactar con el equipo
              </Link>
            </div>

            {/* Trust bar */}
            <div className="proj-hero__trust">
              <div className="proj-hero__trust-item">
                <ShieldCheck size={16} />
                Seguro y confidencial
              </div>
              <div className="proj-hero__trust-item">
                <Users size={16} />
                Participación gratuita
              </div>
              <div className="proj-hero__trust-item">
                <FlaskConical size={16} />
                Basado en evidencias científicas
              </div>
            </div>
          </div>

          {/* ── Image ── */}
          <div className="proj-hero__media">
            <div className="proj-hero__img-wrap">
              {/*
                Swap placeholder with:
                <Image
                  src="/images/project-hero.jpg"
                  alt="Familia participando en Alpha-Help"
                  fill
                  priority
                />
              */}
              <div className="proj-hero__img-placeholder">
                <Users size={96} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}