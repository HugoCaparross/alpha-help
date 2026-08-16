import { createServerClient } from "@/lib/supabase/server";

/**
 * Resultado de la comprobación
 * de administrador.
 */
export interface RequireAdminResult {
  readonly ok: boolean;

  readonly status: number;

  readonly message: string;

  readonly userId: string | null;
}

/**
 * Comprueba, desde una Route Handler
 * (App Router), que la petición
 * proviene de un usuario autenticado
 * con rol "admin".
 *
 * Debe utilizarse en TODAS las
 * rutas de /api/admin/* antes de
 * ejecutar cualquier operación
 * con privilegios elevados.
 */
export async function requireAdmin(): Promise<RequireAdminResult> {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      status: 401,
      message: "No autenticado.",
      userId: null,
    };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile || profile.role !== "admin") {
    return {
      ok: false,
      status: 403,
      message: "No autorizado.",
      userId: user.id,
    };
  }

  return {
    ok: true,
    status: 200,
    message: "OK",
    userId: user.id,
  };
}
