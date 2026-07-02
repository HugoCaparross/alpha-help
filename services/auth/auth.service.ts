import { supabase } from "@/lib/supabase/client";

/**
 * Cierra la sesión del usuario autenticado.
 */
export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(
      "No se ha podido cerrar la sesión.",
    );
  }
}