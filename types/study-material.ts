/**
 * Estado de un material dentro del programa.
 *
 * Un material únicamente puede estar
 * disponible o bloqueado según
 * su fecha de publicación.
 */
export type MaterialStatus =
  | "available"
  | "locked";

/**
 * Modelo de un material tal y como
 * se utiliza dentro de la aplicación.
 *
 * Todas las propiedades utilizan
 * camelCase independientemente
 * del formato utilizado por la base
 * de datos.
 */
export interface StudyMaterial {
  readonly id: string;

  readonly title: string;

  readonly description: string;

  readonly pdfUrl: string;

  readonly thumbnailUrl: string;

  readonly materialOrder: number;

  readonly releaseDateSpain: string;

  readonly releaseDateLatam: string;
}

/**
 * Material listo para ser utilizado
 * por la interfaz de usuario.
 *
 * El servicio resuelve automáticamente
 * la fecha correspondiente a la región
 * del participante y calcula su estado.
 */
export interface StudyMaterialWithStatus
  extends StudyMaterial {
  /**
   * Fecha correspondiente
   * a la región del usuario.
   */
  readonly releaseDate: string;

  /**
   * Estado calculado automáticamente.
   */
  readonly status: MaterialStatus;
}