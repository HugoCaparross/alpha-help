export const REGIONS = [
  "España",
  "Latinoamérica",
] as const;

export type Region = (typeof REGIONS)[number];

/**
 * Región por defecto del sistema.
 */
export const DEFAULT_REGION: Region = "España";

/**
 * Comprueba si la región pertenece a España.
 */
export function isSpain(region: Region): boolean {
  return region === "España";
}

/**
 * Comprueba si la región pertenece a Latinoamérica.
 */
export function isLatam(region: Region): boolean {
  return region === "Latinoamérica";
}