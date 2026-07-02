/**
 * Información de un miembro del equipo investigador.
 */
export interface TeamMember {
  name: string;
  role: string;
  description: string;
  initials: string;
}

/**
 * Investigadora principal del proyecto.
 */
export const LEAD_RESEARCHER: TeamMember = {
  name: "Dra. Elena Martínez García",
  role: "Directora de Investigación",
  description:
    "Responsable científica del proyecto Alpha-Help y de la coordinación general de la investigación.",
  initials: "EM",
};

/**
 * Equipo investigador.
 */
export const TEAM_MEMBERS: readonly TeamMember[] = [
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
      "Responsable de la coordinación de participantes y del seguimiento de los protocolos éticos del estudio.",
    initials: "AF",
  },
  {
    name: "Dr. Pedro García Moreno",
    role: "Especialista en Adolescencia",
    description:
      "Investigador en salud mental adolescente y bienestar familiar.",
    initials: "PG",
  },
  {
    name: "Dra. Laura Jiménez Romero",
    role: "Psicóloga del Desarrollo",
    description:
      "Especialista en dinámicas familiares y acompañamiento emocional durante la adolescencia.",
    initials: "LJ",
  },
] as const;