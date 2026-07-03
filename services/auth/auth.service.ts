import { supabase } from "@/lib/supabase/client";

/**
 * Servicio de autenticación.
 */
export const authService = {
  /**
   * Cierra la sesión del usuario autenticado.
   */
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(
        "No se ha podido cerrar la sesión."
      );
    }
  },
};