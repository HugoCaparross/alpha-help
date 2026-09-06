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
 * Este estado se calcula exclusivamente
 * a partir de las condiciones de acceso:
 *
 * 1. Evaluación inicial completada.
 * 2. Fecha de liberación alcanzada.
 */
export type MaterialStatus =
  | "available"
  | "locked";

/**
 * Motivo por el que un material
 * permanece bloqueado.
 */
export type MaterialLockReason =
  | "initial-evaluation"
  | "release-date";

/**
 * Modelo de dominio de un material.
 */
export interface StudyMaterial {
  readonly id: string;

  readonly title: string;

  readonly description: string;

  /**
   * URL del PDF.
   *
   * Importante:
   * si el material está bloqueado,
   * el servidor NO debe proporcionar
   * esta URL al cliente.
   */
  readonly pdfUrl: string;

  /**
   * URL de la miniatura.
   *
   * Esta URL puede mantenerse disponible
   * aunque el PDF esté bloqueado.
   */
  readonly thumbnailUrl: string;

  /**
   * Número de sesión al que pertenece.
   *
   * 0 = introducción.
   * 1-9 = sesiones del programa.
   */
  readonly materialOrder: number;

  /**
   * Tipo de material.
   *
   * support  = versión reducida / material de apoyo.
   * extended = versión extendida.
   */
  readonly materialType: MaterialType;

  /**
   * Fecha de liberación calculada
   * para España.
   *
   * Es el día siguiente a la sesión
   * correspondiente.
   */
  readonly releaseDateSpain: string;

  /**
   * Fecha de liberación calculada
   * para Latinoamérica.
   *
   * Es el día siguiente a la sesión
   * correspondiente.
   */
  readonly releaseDateLatam: string;
}

/**
 * Modelo utilizado por la interfaz.
 *
 * El servidor determina el estado final
 * antes de enviarlo al cliente.
 */
export interface StudyMaterialWithStatus
  extends StudyMaterial {
  /**
   * Fecha efectiva de liberación
   * según la región del participante.
   */
  readonly releaseDate: string;

  /**
   * Estado final calculado por el servidor.
   */
  readonly status: MaterialStatus;

  /**
   * Motivo del bloqueo.
   *
   * null cuando el material está disponible.
   */
  readonly lockReason:
  | MaterialLockReason
  | null;
}