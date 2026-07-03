import Image from "next/image";
import Link from "next/link";

import { PROJECT_BENEFITS } from "@/lib/constants/project";

/**
 * Hero principal de la página del proyecto.
 *
 * Introduce Alpha-Help y resume los principales
 * beneficios para las familias participantes.
 */
export default function ProjectHero() {
  return (
    <section className="project-hero" aria-labelledby="project-hero-title">
      <div className="container-custom">
        <div className="project-hero-grid">
          <div className="project-hero-content">
            <span className="section-badge">Proyecto de investigación</span>

            <h1 id="project-hero-title" className="section-title">
              Conoce Alpha-Help
            </h1>

            <p className="section-description">
              Alpha-Help es un proyecto de investigación orientado a comprender
              mejor el bienestar emocional durante la adolescencia y ofrecer a
              las familias herramientas basadas en evidencia científica para
              afrontar esta etapa con mayor seguridad.
            </p>

            <div className="project-actions">
              <Link href="/register" className="btn-primary">
                Participar gratuitamente
              </Link>

              <Link href="/contacto" className="btn-secondary">
                Contactar con el equipo
              </Link>
            </div>

            <div className="project-benefits">
              {PROJECT_BENEFITS.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <article key={benefit.title} className="project-benefit">
                    <div className="project-benefit-icon" aria-hidden="true">
                      <Icon size={22} />
                    </div>

                    <div className="project-benefit-content">
                      <h2>{benefit.title}</h2>

                      <p>{benefit.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="project-hero-image">
            <Image
              src="/images/familia_v2.png"
              alt="Familia participando en el proyecto Alpha-Help"
              width={900}
              height={700}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
