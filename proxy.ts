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
 *
 * IMPORTANTE:
 *
 * Las rutas de recuperación y restablecimiento
 * de contraseña quedan fuera de la lógica normal
 * de autenticación.
 *
 * Supabase utiliza una sesión temporal durante
 * el proceso de recuperación. Esa sesión no debe
 * confundirse con una sesión normal de participante.
 */
export async function proxy(
  request: NextRequest,
) {
  const pathname =
    request.nextUrl.pathname;

  const isPasswordRecoveryRoute =
    pathname === "/recuperar-password" ||
    pathname === "/restablecer-password";

  /**
   * Creamos siempre el cliente SSR para mantener
   * disponible la sincronización de cookies.
   */
  const {
    supabase,
    response,
  } = updateSession(request);

  /**
   * El flujo de recuperación de contraseña de
   * Supabase es independiente de la autenticación
   * normal de la aplicación.
   *
   * No:
   * - consultamos getUser()
   * - consultamos profiles
   * - comprobamos roles
   * - redirigimos al dashboard
   * - redirigimos al login
   * - protegemos la ruta como privada
   *
   * Esto permite que el proceso de recuperación
   * funcione aunque:
   *
   * - no exista perfil todavía
   * - la sesión normal haya caducado
   * - exista una sesión temporal de recuperación
   * - el dashboard tenga algún problema
   * - el usuario acceda directamente al enlace
   *
   * Sí mantenemos updateSession() para conservar
   * el comportamiento SSR de cookies cuando sea
   * necesario.
   */
  if (isPasswordRecoveryRoute) {
    return response;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

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

    const { data: profile } =
      await supabase
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
   *
   * Las rutas de recuperación ya han sido
   * excluidas anteriormente y nunca llegan
   * a este punto.
   */
  if (user && isAuthRoute) {
    const role =
      await getRole();

    return NextResponse.redirect(
      new URL(
        role === "admin"
          ? "/admin"
          : "/dashboard",
        request.url,
      ),
    );
  }

  /**
   * Protección del área
   * de administración.
   */
  if (user && isAdminRoute) {
    const role =
      await getRole();

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
    const role =
      await getRole();

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
    "/api/questionnaires/:path*",
  ],
};