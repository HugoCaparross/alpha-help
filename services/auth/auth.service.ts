import { supabase } from "@/lib/supabase/client";

const ERROR_LOGOUT =
  "No se ha podido cerrar la sesión.";

/**
 * Servicio de autenticación.
 *
 * Centraliza todas las operaciones
 * relacionadas con la autenticación
 * del participante.
 */
export const authService = {
  /**
   * Cierra la sesión
   * del usuario autenticado.
   */
  async logout(): Promise<void> {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      if (
        process.env.NODE_ENV ===
        "development"
      ) {
        console.error(error);
      }

      throw new Error(
        ERROR_LOGOUT,
      );
    }
  },
} as const;