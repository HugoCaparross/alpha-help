/**
 * Valores internos utilizados
 * por la aplicación y la base de datos.
 */
export const REGIONS = [
  "spain",
  "latam",
] as const;

export type Region =
  (typeof REGIONS)[number];

/**
 * Región por defecto.
 */
export const DEFAULT_REGION: Region =
  "spain";

/**
 * Etiquetas visibles para el usuario.
 */
export const REGION_LABELS: Record<
  Region,
  string
> = {
  spain: "España",
  latam: "Latinoamérica",
};

/**
 * Devuelve el nombre visible
 * de una región.
 */
export function getRegionLabel(
  region: Region,
): string {
  return REGION_LABELS[region];
}

/**
 * Comprueba si la región
 * corresponde a España.
 */
export function isSpain(
  region: Region,
): boolean {
  return region === "spain";
}

/**
 * Comprueba si la región
 * corresponde a Latinoamérica.
 */
export function isLatam(
  region: Region,
): boolean {
  return region === "latam";
}