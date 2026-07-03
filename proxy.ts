import { NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/recuperar-password",
  "/restablecer-password",
];

export async function proxy(request: NextRequest) {
  const { supabase, response } = updateSession(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isAdminRoute = pathname.startsWith("/admin");

  const isPrivateRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/cuestionarios") ||
    pathname.startsWith("/sesiones") ||
    pathname.startsWith("/recursos") ||
    pathname.startsWith("/estudio");

  // Usuario no autenticado
  if (!user && (isPrivateRoute || isAdminRoute)) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // Usuario autenticado intentando acceder al login
  if (user && isAuthRoute) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  // Protección del área de administración
  if (user && isAdminRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.role !== "admin") {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Ejecutar en todas las rutas excepto:
     * - API
     * - _next
     * - favicon
     * - archivos estáticos
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};