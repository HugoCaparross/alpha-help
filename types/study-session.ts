/**
 * Estado de disponibilidad de una sesión.
 *
 * Este estado se calcula exclusivamente
 * a partir de la fecha de publicación
 * correspondiente a la región del usuario.
 *
 * No representa el progreso del participante.
 */
export type SessionStatus =
  | "available"
  | "locked";

/**
 * Modelo de dominio de una sesión.
 *
 * Representa la información almacenada en la
 * base de datos independientemente de la región
 * o del estado del participante.
 *
 * Todas las propiedades utilizan camelCase.
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
 * Modelo utilizado por la interfaz.
 *
 * Extiende una sesión resolviendo la fecha
 * de publicación correspondiente a la región
 * del participante y calculando su estado
 * de disponibilidad.
 *
 * El progreso del participante (completada o no)
 * pertenece al servicio de progreso y no forma
 * parte de este modelo.
 */
export interface SessionWithStatus
  extends Session {
  /**
   * Fecha de publicación resuelta
   * según la región del participante.
   */
  readonly releaseDate: string;

  /**
   * Estado de disponibilidad calculado
   * automáticamente por el servicio.
   */
  readonly status: SessionStatus;
}