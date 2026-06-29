import type { Region } from "@/lib/utils/regions";

/**
 * Estado de una sesión dentro del programa.
 * Una sesión únicamente puede estar disponible
 * o bloqueada según su fecha de publicación.
 */
export type SessionStatus = "available" | "locked";

/**
 * Modelo de una sesión tal y como se consume
 * dentro de la aplicación.
 *
 * Todos los nombres utilizan camelCase,
 * independientemente del formato utilizado
 * en la base de datos.
 */
export interface Session {
  id: string;

  title: string;

  description: string;

  youtubeUrl: string;

  thumbnailUrl: string;

  sessionOrder: number;

  releaseDateSpain: string;

  releaseDateLatam: string;
}

/**
 * Sesión con la fecha de publicación ya resuelta
 * según la región del usuario.
 *
 * Los componentes nunca deben decidir
 * qué fecha utilizar.
 * Esa lógica pertenece exclusivamente al servicio.
 */
export interface SessionWithStatus extends Session {
  /**
   * Fecha de publicación correspondiente
   * a la región del usuario.
   */
  releaseDate: string;

  /**
   * Estado calculado automáticamente.
   */
  status: SessionStatus;
}