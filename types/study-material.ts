import type { Region } from "@/lib/utils/regions";

/**
 * Estado de un material dentro del programa.
 * Un material únicamente puede estar disponible
 * o bloqueado según su fecha de publicación.
 */
export type MaterialStatus = "available" | "locked";

/**
 * Modelo de un material tal y como se consume
 * dentro de la aplicación.
 *
 * Todos los nombres utilizan camelCase, independientemente
 * del formato utilizado en la base de datos.
 */
export interface StudyMaterial {
  id: string;

  title: string;

  description: string;

  pdfUrl: string;

  thumbnailUrl: string;

  materialOrder: number;

  releaseDateSpain: string;

  releaseDateLatam: string;
}

/**
 * Material con la fecha de publicación ya resuelta
 * según la región del usuario.
 *
 * Los componentes nunca deben decidir qué fecha utilizar.
 * Esa lógica pertenece exclusivamente al servicio.
 */
export interface StudyMaterialWithStatus
  extends StudyMaterial {
  /**
   * Fecha de publicación correspondiente
   * a la región del usuario.
   */
  releaseDate: string;

  /**
   * Estado calculado automáticamente.
   */
  status: MaterialStatus;
}

export type { Region };