export const GENDERS = [
  "Mujer",
  "Hombre",
] as const;

export type Gender =
  (typeof GENDERS)[number];

export const EDUCATION_LEVELS = [
  "Primarios",
  "Secundarios",
  "Universitarios",
  "Doctorado",
] as const;

export type EducationLevel =
  (typeof EDUCATION_LEVELS)[number];

export const EMPLOYMENT_STATUS = [
  "Estudiante",
  "Trabajo",
  "Parado/a",
  "Gestión doméstica",
  "Jubilado/a",
  "Incapacitado/a",
] as const;

export type EmploymentStatus =
  (typeof EMPLOYMENT_STATUS)[number];

export const MARITAL_STATUS = [
  "Soltero/a",
  "Casado/a",
  "Separado/a, Divorciado/a",
  "Viudo/a",
] as const;

export type MaritalStatus =
  (typeof MARITAL_STATUS)[number];

export const SOCIOECONOMIC_LEVELS = [
  "Bajo",
  "Medio-bajo",
  "Medio",
  "Medio-alto",
  "Alto",
] as const;

export type SocioeconomicLevel =
  (typeof SOCIOECONOMIC_LEVELS)[number];

export const SCHOOL_TYPES = [
  "Público",
  "Concertado",
  "Privado",
] as const;

export type SchoolType =
  (typeof SCHOOL_TYPES)[number];

export const FAMILY_STRUCTURES = [
  "Biparental",
  "Monoparental",
  "Reconstituida",
  "Acogimiento",
  "Otra",
] as const;

export type FamilyStructure =
  (typeof FAMILY_STRUCTURES)[number];