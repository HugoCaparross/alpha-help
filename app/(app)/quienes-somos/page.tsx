import { Users, Heart, Microscope } from "lucide-react";
import TeamMemberCard from "@/components/private/about/TeamMemberCard";
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
    <div className="about-page">
      <div className="about-container">
        {/* HEADER */}
        <header className="about-header">
          <h1 className="about-title">¿Quiénes somos?</h1>
          <p className="about-description">
            Conoce al equipo que hace posible el estudio Alpha-Help.
          </p>
        </header>

        {/* HERO SECTION */}
        <section className="about-hero">
          <div className="about-hero-content">
            <div className="about-hero-icon">
              <Users size={48} />
            </div>
            <h2 className="about-hero-title">
              Un equipo multidisciplinario dedicado al bienestar adolescente
            </h2>
            <p className="about-hero-text">
              Somos un grupo de profesionales apasionados por la investigación en
              salud mental y bienestar familiar. Nuestro objetivo es entender
              mejor los desafíos emocionales de los adolescentes y ofrecer
              herramientas prácticas a las familias.
            </p>
          </div>

          {/* LEAD RESEARCHER CARD */}
          <aside className="about-lead-card">
            <div className="about-lead-avatar">
              {leadResearcher.initials}
            </div>
            <div>
              <p className="about-lead-name">{leadResearcher.name}</p>
              <p className="about-lead-role">{leadResearcher.role}</p>
            </div>
            <a href="/perfil" className="about-lead-link">
              Ver perfil completo
            </a>
          </aside>
        </section>

        {/* TEAM SECTION */}
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

        {/* FOOTER CARD */}
        <section className="about-footer-card">
          <div>
            <div className="about-footer-icon">
              <Heart size={24} />
            </div>
            <p className="about-footer-text">
              <strong>Compromiso</strong>
              <br />
              Dedicados a mejorar la salud emocional y el bienestar de las
              familias.
            </p>
          </div>

          <div>
            <div className="about-footer-icon">
              <Microscope size={24} />
            </div>
            <p className="about-footer-text">
              <strong>Investigación</strong>
              <br />
              Basamos nuestro trabajo en evidencia científica rigurosa y
              metodologías validadas.
            </p>
          </div>

          <div>
            <div className="about-footer-icon">
              <Users size={24} />
            </div>
            <p className="about-footer-text">
              <strong>Familia</strong>
              <br />
              Entendemos que el apoyo familiar es fundamental en la adolescencia.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
