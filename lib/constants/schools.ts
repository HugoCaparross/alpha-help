import type { Region } from "@/lib/utils/regions";

export const SCHOOLS: Readonly<
  Record<Region, readonly string[]>
> = {
spain: [
  "Nuestra Señora del Pilar",
  "Jesús María El Cuco",
  "Las Colinas",
  "Colegio Santa María del Puig",
  "Marni. Grupo Colegios Siglo XXI",
  "Colegio Educrea el Mirador",
  "Colegio Montesión Palma",
  "Base International School",
  "Otro centro",
],

  latam: [
    "Innovación Educativa Montessori",
    'Escuela Telesecundaria "5 de mayo"',
    'Escuela Telesecundaria "Guadalupe Victoria"',
    'Escuela Telesecundaria "Leona Vicario"',
    'Escuela Telesecundaria "Manuel C. Tello"',
    'Escuela Telesecundaria "Rafael Ramírez"',
    "Otro centro",
  ],
};

export function getSchools(
  region: Region,
): readonly string[] {
  return SCHOOLS[region];
}