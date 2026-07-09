/**
 * Tipos de materiales disponibles
 * dentro del programa.
 *
 * Cada sesión dispone de dos documentos:
 * - Material de apoyo.
 * - Guía ampliada.
 */
export type MaterialType =
  | "support"
  | "extended";

/**
 * Estado de disponibilidad
 * de un material.
 *
 * Este estado se calcula
 * exclusivamente a partir
 * de la fecha de publicación
 * correspondiente a la región
 * del participante.
 *
 * No representa el progreso
 * del participante.
 */
export type MaterialStatus =
  | "available"
  | "locked";

/**
 * Modelo de dominio
 * de un material.
 *
 * Representa la información
 * almacenada en la base de datos,
 * independientemente de la región
 * o del estado del participante.
 *
 * Todas las propiedades utilizan
 * camelCase.
 */
export interface StudyMaterial {
  readonly id: string;

  readonly title: string;

  readonly description: string;

  readonly pdfUrl: string;

  readonly thumbnailUrl: string;

  /**
   * Número de sesión al que
   * pertenece el material.
   *
   * Ambos documentos
   * (support y extended)
   * comparten el mismo valor.
   */
  readonly materialOrder: number;

  /**
   * Tipo de documento.
   */
  readonly materialType: MaterialType;

  readonly releaseDateSpain: string;

  readonly releaseDateLatam: string;
}

/**
 * Modelo utilizado
 * por la interfaz.
 *
 * Extiende un material
 * resolviendo la fecha
 * correspondiente a la región
 * del participante y calculando
 * su estado de disponibilidad.
 *
 * El progreso del participante
 * pertenece al servicio
 * material-progress.service
 * y no forma parte de este modelo.
 */
export interface StudyMaterialWithStatus
  extends StudyMaterial {
  /**
   * Fecha de publicación
   * resuelta según la región
   * del participante.
   */
  readonly releaseDate: string;

  /**
   * Estado calculado
   * automáticamente por
   * el servicio.
   */
  readonly status: MaterialStatus;
}