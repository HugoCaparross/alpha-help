/**
 * Región del usuario, tal y como se almacena en profiles.region.
 * Determina qué fecha de publicación (release_date_spain / release_date_latam)
 * se resuelve para cada sesión.
 */
export type Region = 'spain' | 'latam';

/**
 * Estado de una sesión una vez resuelto contra la fecha de la región.
 * No existen estados intermedios (completada, en progreso, etc.).
 */
export type SessionStatus = 'available' | 'locked';

/**
 * Modelo de sesión tal y como se mapea desde la tabla `sessions`.
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
 * Sesión con la fecha de publicación y el estado ya resueltos
 * según la región del usuario. Es lo que consumen los componentes
 * de presentación: nunca eligen entre releaseDateSpain/releaseDateLatam.
 */
export interface SessionWithStatus extends Session {
  /** Fecha de publicación ya resuelta para la región del usuario. */
  releaseDate: string;
  /** Estado resuelto: disponible o bloqueada. */
  status: SessionStatus;
}