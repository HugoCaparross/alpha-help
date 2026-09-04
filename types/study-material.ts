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
 * de las condiciones de acceso:
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
 * Modelo de dominio
 * de un material.
 *
 * Representa la información
 * almacenada y procesada por
 * la aplicación.
 *
 * Todas las propiedades utilizan
 * camelCase.
 */
export interface StudyMaterial {
  readonly id: string;

  readonly title: string;

  readonly description: string;

  /**
   * URL firmada del PDF cuando
   * el material está disponible.
   *
   * Cuando está bloqueado debe
   * permanecer vacía.
   */
  readonly pdfUrl: string;

  /**
   * URL de la miniatura.
   *
   * Puede ser una URL firmada
   * independiente del estado del PDF.
   */
  readonly thumbnailUrl: string;

  /**
   * Número de sesión al que
   * pertenece el material.
   *
   * 0 = introducción.
   * 1-9 = sesiones.
   */
  readonly materialOrder: number;

  /**
   * Tipo de documento.
   */
  readonly materialType: MaterialType;

  /**
   * Fecha de liberación calculada
   * para España.
   *
   * Se mantiene por compatibilidad
   * con la información administrativa.
   */
  readonly releaseDateSpain: string;

  /**
   * Fecha de liberación calculada
   * para Latinoamérica.
   *
   * Se mantiene por compatibilidad
   * con la información administrativa.
   */
  readonly releaseDateLatam: string;
}

/**
 * Modelo utilizado por la interfaz.
 *
 * Añade el estado de disponibilidad
 * y la fecha efectiva de liberación
 * para la región del participante.
 */
export interface StudyMaterialWithStatus
  extends StudyMaterial {
  /**
   * Fecha efectiva de liberación
   * del material para la región
   * del participante.
   *
   * Corresponde al día siguiente
   * de la sesión.
   */
  readonly releaseDate: string;

  /**
   * Estado calculado por el servidor.
   */
  readonly status: MaterialStatus;

  /**
   * Motivo del bloqueo.
   *
   * null cuando el material
   * está disponible.
   */
  readonly lockReason:
    | MaterialLockReason
    | null;
}