import { Users } from "lucide-react";
import Image from "next/image";

import TeamMemberCard from "@/components/shared/TeamMemberCard";

import { LEAD_RESEARCHER, TEAM_MEMBERS } from "@/lib/constants/team";

import "@/components/styles/about.css";

/**
 * Página institucional con información
 * sobre el equipo investigador.
 */
export default function QuienesSomosPage() {
  return (
    <main className="about-page section-small">
      <div className="container-custom about-container">
        <header className="section-header about-header">
          <span className="section-badge">Investigación científica</span>

          <h1 className="section-title about-title">¿Quiénes somos?</h1>

          <p className="section-description about-description">
            Conoce al equipo multidisciplinar responsable del proyecto
            Alpha-Help y su compromiso con la investigación sobre el bienestar
            emocional de adolescentes y familias.
          </p>
        </header>

        <section
          className="card card-padding about-hero"
          aria-labelledby="about-hero-title"
        >
          <div className="about-hero-content">
            <div className="card-icon about-hero-icon" aria-hidden="true">
              <Users size={36} />
            </div>

            <h2 id="about-hero-title" className="about-hero-title">
              Un equipo comprometido con la investigación y el bienestar
              emocional
            </h2>

            <p className="about-hero-text">
              Alpha-Help reúne a profesionales especializados en psicología,
              investigación y desarrollo de programas dirigidos a adolescentes y
              familias.
            </p>

            <p className="about-hero-text">
              Nuestro objetivo es transformar la evidencia científica en
              herramientas útiles que contribuyan a mejorar el bienestar
              emocional y favorecer el acompañamiento familiar.
            </p>
          </div>

          <aside className="card card-padding about-lead-card">
            <div className="about-lead-avatar" aria-hidden="true">
              {LEAD_RESEARCHER.photoUrl ? (
                <Image
                  src={LEAD_RESEARCHER.photoUrl}
                  alt=""
                  fill
                  sizes="80px"
                />
              ) : (
                LEAD_RESEARCHER.initials
              )}
            </div>

            <div>
              <p className="about-lead-name">{LEAD_RESEARCHER.name}</p>

              <p className="about-lead-role">
                {LEAD_RESEARCHER.studies} · {LEAD_RESEARCHER.role}
              </p>
            </div>
          </aside>
        </section>

        <section className="about-team" aria-labelledby="about-team-title">
          <h2 id="about-team-title" className="about-team-title">
            Nuestro equipo
          </h2>

          <div className="about-team-list">
            {TEAM_MEMBERS.map((member) => (
              <TeamMemberCard
                key={member.name}
                name={member.name}
                studies={member.studies}
                role={member.role}
                description={member.description}
                initials={member.initials}
                photoUrl={member.photoUrl}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
