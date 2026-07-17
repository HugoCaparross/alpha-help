import {
  FlaskConical,
  GraduationCap,
  HeartHandshake,
  Search,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";

/**
 * Beneficios principales mostrados
 * en el hero de la página del proyecto.
 */
export const PROJECT_BENEFITS = [
  {
    title: "Seguro y confidencial",
    description:
      "Protección de datos y privacidad garantizada.",
    icon: ShieldCheck,
  },
  {
    title: "Participación gratuita",
    description:
      "Sin coste para las familias participantes.",
    icon: Users,
  },
  {
    title: "Basado en evidencia científica",
    description:
      "Desarrollado a partir de investigación científica y buenas prácticas clínicas.",
    icon: FlaskConical,
  },
  {
    title: "Equipo multidisciplinar",
    description:
      "El proyecto cuenta con profesionales e investigadores especializados en adolescencia, salud mental y educación.",
    icon: Users,
  },
] as const;

/**
 * Objetivos principales del proyecto.
 */
export const PROJECT_PROCESS = [
  {
    title: "Comprender",
    description: "Entender qué está ocurriendo.",
    icon: HeartHandshake,
  },
  {
    title: "Detectar",
    description: "Identificar señales de alerta.",
    icon: Search,
  },
  {
    title: "Actuar",
    description: "Aprender cómo ayudar.",
    icon: Users,
  },
  {
    title: "Prevenir",
    description: "Fortalecer factores protectores.",
    icon: Shield,
  },
] as const;

/**
 * Garantías del proyecto.
 */
export const PROJECT_TRUST = [
  {
    title: "Proyecto universitario",
    description:
      "Investigación desarrollada dentro del ámbito académico.",
    icon: GraduationCap,
  },
  {
    title: "Basado en evidencia científica",
    description:
      "Los contenidos parten de investigación rigurosa y actualizada.",
    icon: FlaskConical,
  },
  {
    title: "Confidencialidad",
    description:
      "Toda la información se trata conforme a la normativa vigente.",
    icon: ShieldCheck,
  },
  {
    title: "Equipo multidisciplinar",
    description:
      "Profesionales especializados en adolescencia, psicología y educación.",
    icon: Users,
  },
] as const;