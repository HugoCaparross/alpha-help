import { Users } from "lucide-react";

import TeamMemberCard from "@/components/shared/TeamMemberCard";
import "@/components/styles/about.css";

const leadResearcher = {
  name: "Dra. Elena Martínez García",
  role: "Directora de Investigación",
  initials: "EM",
};

const teamMembers = [
  {
    name: "Dr. Carlos López Ruiz",
    role: "Psicólogo Clínico",
    description:
      "Especialista en adolescencia con más de 15 años de experiencia en evaluación psicológica.",
    initials: "CR",
  },
  {
    name: "Dra. María Sánchez Díaz",
    role: "Investigadora Senior",
    description:
      "Experta en metodología de investigación y análisis de datos en estudios longitudinales.",
    initials: "MS",
  },
  {
    name: "Dr. Juan Rodríguez Pérez",
    role: "Psicólogo Educativo",
    description:
      "Especializado en intervención familiar y programas de bienestar en contextos educativos.",
    initials: "JR",
  },
  {
    name: "Dra. Ana Fernández López",
    role: "Coordinadora de Participantes",
    description:
      "Gestión de protocolos éticos y coordinación de participantes en el estudio.",
    initials: "AF",
  },
  {
    name: "Dr. Pedro García Moreno",
    role: "Especialista en Adolescencia",
    description:
      "Investigador en temas de salud mental adolescente y bienestar familiar.",
    initials: "PG",
  },
  {
    name: "Dra. Laura Jiménez Romero",
    role: "Psicóloga del Desarrollo",
    description:
      "Enfoque en dinámicas familiares y apoyo emocional durante la adolescencia.",
    initials: "LJ",
  },
];

export default function QuienesSomosPage() {
  return (
    <main className="about-page section-small">
      <div className="container-custom about-container">
        {/* HEADER */}

        <header className="section-header about-header">
          <span className="section-badge">Investigación científica</span>

          <h1 className="section-title about-title">¿Quiénes somos?</h1>

          <p className="section-description about-description">
            Conoce al equipo multidisciplinar que hace posible el proyecto
            Alpha-Help y trabaja para mejorar el bienestar emocional de
            adolescentes y familias.
          </p>
        </header>

        {/* HERO */}

        <section className="card card-padding about-hero">
          <div className="about-hero-content">
            <div className="card-icon about-hero-icon">
              <Users size={36} />
            </div>

            <h2 className="about-hero-title">
              Un equipo comprometido con la salud emocional y la investigación
            </h2>

            <p className="about-hero-text">
              Somos un grupo de profesionales especializados en psicología,
              investigación y desarrollo de programas de prevención e
              intervención dirigidos a adolescentes y familias.
            </p>

            <p className="about-hero-text">
              Nuestro propósito es transformar la evidencia científica en
              herramientas prácticas que contribuyan a mejorar el bienestar
              emocional y la calidad de vida de las personas.
            </p>
          </div>

          <aside className="card card-padding about-lead-card">
            <div className="about-lead-avatar">{leadResearcher.initials}</div>

            <div>
              <p className="about-lead-name">{leadResearcher.name}</p>

              <p className="about-lead-role">{leadResearcher.role}</p>
            </div>

            <a href="/perfil" className="about-lead-link">
              Ver perfil completo
            </a>
          </aside>
        </section>

        {/* TEAM */}

        <section className="about-team">
          <h2 className="about-team-title">Nuestro equipo</h2>

          <div className="about-team-list">
            {teamMembers.map((member) => (
              <TeamMemberCard
                key={member.name}
                name={member.name}
                role={member.role}
                description={member.description}
                initials={member.initials}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
