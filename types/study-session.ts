/**
 * Estado de una sesión dentro del programa.
 *
 * Una sesión únicamente puede estar
 * disponible o bloqueada según
 * su fecha de publicación.
 */
export type SessionStatus =
  | "available"
  | "locked";

/**
 * Modelo de una sesión tal y como
 * se utiliza dentro de la aplicación.
 *
 * Todas las propiedades utilizan
 * camelCase independientemente
 * del formato utilizado por la base
 * de datos.
 */
export interface Session {
  readonly id: string;

  readonly title: string;

  readonly description: string;

  readonly youtubeUrl: string;

  readonly thumbnailUrl: string;

  readonly sessionOrder: number;

  readonly releaseDateSpain: string;

  readonly releaseDateLatam: string;
}

/**
 * Sesión con la fecha de publicación
 * ya resuelta para la región del usuario.
 *
 * Los componentes nunca deben decidir
 * qué fecha utilizar.
 * Esa responsabilidad pertenece
 * exclusivamente al servicio.
 */
export interface SessionWithStatus
  extends Session {
  /**
   * Fecha correspondiente
   * a la región del usuario.
   */
  readonly releaseDate: string;

  /**
   * Estado calculado automáticamente.
   */
  readonly status: SessionStatus;
}