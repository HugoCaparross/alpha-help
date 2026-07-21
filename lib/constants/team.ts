/**
 * Información de un miembro del equipo investigador.
 *
 * `photoUrl` es opcional: si se indica una ruta
 * (por ejemplo "/images/team/nombre.jpg"), se muestra
 * la fotografía en lugar de las iniciales.
 */
export interface TeamMember {
  name: string;
  studies: string;
  role: string;
  description: string;
  initials: string;
  photoUrl?: string;
}

/**
 * Investigador principal del proyecto.
 */
export const LEAD_RESEARCHER: TeamMember = {
  name: "Eduardo González Fraile",
  studies: "Dr. en Psicología",
  role: "Investigador principal",
  description:
    "Docente universitario (UNIR) y especialista en intervenciones psicoeducativas. Su labor se centra en la dirección y coordinación del proyecto.",
  initials: "EG",
  photoUrl: "/images/public/team/eduardo-gonzalez-fraile.jpg.webp",
};

/**
 * Resto del equipo investigador (colaboradores).
 */
export const TEAM_MEMBERS: readonly TeamMember[] = [
  {
    name: "Ana Ordoñez López",
    studies: "Dra. en Psicología",
    role: "Colaboradora",
    description:
      "Psicóloga clínica y docente universitaria (UNIR). Su labor se centra en la elaboración de materiales psicoeducativos y en la adaptación de contenidos científicos para facilitar su aplicación en el contexto familiar.",
    initials: "AO",
    photoUrl: "/images/public/team/ana-ordonez.jpg",
  },
  {
    name: "Daniela Gabriela Baridon Chauvie",
    studies: "Dra. en Desarrollo Psicológico, Aprendizaje y Educación",
    role: "Colaboradora",
    description:
      "Docente universitaria (UNIR) y profesora de secundaria. Su labor se centra en la impartición y adaptación de los contenidos del programa Alpha-Help al contexto latinoamericano.",
    initials: "DB",
    photoUrl: "/images/public/team/daniela-baridon.jpg",
  },
  {
    name: "Eden Jaramillo Mar",
    studies: "Dra. en Educación",
    role: "Colaboradora",
    description:
      "Docente universitaria (UNIR México). Su labor se centra en la adaptación de los contenidos del programa Alpha-Help al contexto latinoamericano.",
    initials: "EJ",
    photoUrl: "/images/team/eden-jaramillo.jpeg",
  },
  {
    name: "Hugo Alberto Xochicale Rojas",
    studies: "Máster en Ciencias en Ciencias Computacionales",
    role: "Colaborador",
    description:
      "Docente universitario (UNIR México). Su labor se centra en el tratamiento y análisis de resultados.",
    initials: "HX",
    photoUrl: "/images/team/hugo-xochicale.jpg",
  },
  {
    name: "Laura Victoria Jácome Rincón",
    studies: "Máster en Neuropsicología y Educación",
    role: "Colaboradora",
    description:
      "Docente universitaria (Fundación UNIR Colombia). Su labor se centra en la adaptación de los contenidos del programa Alpha-Help al contexto latinoamericano.",
    initials: "LJ",
    photoUrl: "/images/team/laura-victoria-jacome.jpg",
  },
  {
    name: "María Aranzazu Basterra González",
    studies: "Dra. en Ciencias de la Educación",
    role: "Colaboradora",
    description: "",
    initials: "MB",
    photoUrl: "/images/public/team/maria-aranzazu-basterra.jpg",
  },
  {
    name: "María Clara Villa Orozco",
    studies: "Máster en Psicología Clínica",
    role: "Colaboradora",
    description:
      "Docente y coordinadora universitaria (Fundación UNIR Colombia). Su labor se centra en la adaptación de los contenidos del programa Alpha-Help al contexto latinoamericano.",
    initials: "MC",
    photoUrl: "/images/team/maria-clara-villa.jpeg",
  },
  {
    name: "María José Arroyo González",
    studies: "Dra. en Pedagogía",
    role: "Colaboradora",
    description:
      "Docente universitaria (UNED). Experta en orientación educativa en centros escolares a niños, adolescentes y familias. Su labor se centra en el desarrollo e implementación del programa y análisis de resultados.",
    initials: "MJ",
    photoUrl: "/images/public/team/maria-jose-arroyo.png",
  },
  {
    name: "Pilar Berzosa Grande",
    studies: "Dra. en Ciencias de la Educación",
    role: "Colaboradora",
    description:
      "Psicóloga clínica, terapeuta familiar y de pareja, y docente universitaria (UNIR). Especialista en programas de intervención y prevención infanto-juvenil. Participa en el diseño y desarrollo de los contenidos formativos dirigidos a las familias. Impartidora de contenidos.",
    initials: "PB",
    photoUrl: "/images/public/team/pilar-berzosa.png",
  },
] as const;