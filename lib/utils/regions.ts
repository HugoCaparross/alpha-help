/**
 * Valores internos utilizados
 * por la aplicación.
 *
 * La base de datos utiliza las etiquetas:
 * - España
 * - Latinoamérica
 *
 * La aplicación utiliza:
 * - spain
 * - latam
 */
export const REGIONS = ["spain", "latam"] as const;

export type Region = (typeof REGIONS)[number];

/**
 * Valores de región almacenados
 * en las tablas de Supabase.
 */
export const DATABASE_REGIONS = ["España", "Latinoamérica"] as const;

export type DatabaseRegion = (typeof DATABASE_REGIONS)[number];

/**
 * Región utilizada cuando
 * no se especifica ninguna.
 */
export const DEFAULT_REGION: Region = "spain";

/**
 * Etiquetas visibles para el usuario.
 */
export const REGION_LABELS: Readonly<Record<Region, string>> = {
  spain: "España",
  latam: "Latinoamérica",
};

/**
 * Convierte una región interna
 * de la aplicación al valor utilizado
 * por la base de datos.
 */
export function getDatabaseRegion(region: Region): DatabaseRegion {
  switch (region) {
    case "spain":
      return "España";

    case "latam":
      return "Latinoamérica";
  }
}

/**
 * Convierte un valor de región de la
 * base de datos al valor interno
 * utilizado por la aplicación.
 */
export function getAppRegion(region: DatabaseRegion): Region {
  switch (region) {
    case "España":
      return "spain";

    case "Latinoamérica":
      return "latam";
  }
}

/**
 * Devuelve el nombre visible
 * de una región.
 */
export function getRegionLabel(region: Region): string {
  return REGION_LABELS[region];
}

/**
 * Comprueba si la región
 * corresponde a España.
 */
export function isSpain(region: Region): boolean {
  return region === "spain";
}

/**
 * Comprueba si la región
 * corresponde a Latinoamérica.
 */
export function isLatam(region: Region): boolean {
  return region === "latam";
}
