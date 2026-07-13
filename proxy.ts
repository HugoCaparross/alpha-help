import { NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/recuperar-password",
  "/restablecer-password",
] as const;

const PRIVATE_ROUTES = [
  "/dashboard",
  "/perfil",
  "/cuestionarios",
  "/sesiones",
  "/recursos",
  "/estudio",
] as const;

const ADMIN_ROUTE = "/admin";

/**
 * Middleware principal de la aplicación.
 *
 * Gestiona:
 * - Sincronización de sesión con Supabase SSR.
 * - Protección de rutas privadas.
 * - Protección del área de administración.
 * - Redirección de usuarios autenticados
 *   fuera del área de autenticación.
 */
export async function proxy(
  request: NextRequest,
) {
  const {
    supabase,
    response,
  } = updateSession(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname =
    request.nextUrl.pathname;

  const isAuthRoute =
    AUTH_ROUTES.some((route) =>
      pathname.startsWith(route),
    );

  const isPrivateRoute =
    PRIVATE_ROUTES.some((route) =>
      pathname.startsWith(route),
    );

  const isAdminRoute =
    pathname.startsWith(
      ADMIN_ROUTE,
    );

  /**
   * Usuario no autenticado.
   */
  if (
    !user &&
    (isPrivateRoute ||
      isAdminRoute)
  ) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url,
      ),
    );
  }

  /**
   * Determina el rol del usuario
   * autenticado cuando es necesario
   * para decidir una redirección.
   */
  async function getRole(): Promise<string | null> {
    if (!user) {
      return null;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    return profile?.role ?? null;
  }

  /**
   * Usuario autenticado intentando
   * acceder al área pública
   * de autenticación.
   */
  if (user && isAuthRoute) {
    const role = await getRole();

    return NextResponse.redirect(
      new URL(
        role === "admin" ? "/admin" : "/dashboard",
        request.url,
      ),
    );
  }

  /**
   * Protección del área
   * de administración.
   */
  if (user && isAdminRoute) {
    const role = await getRole();

    if (role !== "admin") {
      return NextResponse.redirect(
        new URL(
          "/dashboard",
          request.url,
        ),
      );
    }
  }

  /**
   * Un administrador no debe operar
   * dentro del área privada de
   * participantes.
   */
  if (user && isPrivateRoute) {
    const role = await getRole();

    if (role === "admin") {
      return NextResponse.redirect(
        new URL(
          "/admin",
          request.url,
        ),
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};