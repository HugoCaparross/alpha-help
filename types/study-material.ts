/**
 * Tipos de materiales disponibles dentro del programa.
 */
export type MaterialType = "support" | "extended";

/** Estado de disponibilidad calculado por el servidor. */
export type MaterialStatus = "available" | "locked";

/** Motivo por el que un material permanece bloqueado. */
export type MaterialLockReason =
  | "initial-evaluation"
  | "release-date";

/** Modelo de dominio de un material. */
export interface StudyMaterial {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly pdfUrl: string;
  readonly thumbnailUrl: string;
  readonly materialOrder: number;
  readonly materialType: MaterialType;
  readonly releaseDateSpain: string;
  readonly releaseDateLatam: string;
}

/** Modelo preparado para la interfaz. */
export interface StudyMaterialWithStatus extends StudyMaterial {
  readonly releaseDate: string | null;
  readonly status: MaterialStatus;
  readonly lockReason: MaterialLockReason | null;
}
