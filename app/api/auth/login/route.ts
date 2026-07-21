import { NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";
import { isAdminLoginInput } from "@/lib/constants/admin";
import { resolveLoginEmail } from "@/lib/auth/adminEmail.server";

interface LoginRequestBody {
  identifier?: unknown;
  password?: unknown;
}

const ERRORS = {
  invalidBody: "Debes indicar tu correo/usuario y contraseña.",

  emailVerification:
    "Debes verificar tu correo electrónico antes de iniciar sesión.",

  rateLimit:
    "Se han realizado demasiados intentos. Inténtalo de nuevo dentro de unos minutos.",

  invalidCredentials: "Correo o contraseña incorrectos.",

  unexpected: "Se ha producido un error inesperado. Inténtalo de nuevo.",
} as const;

/**
 * POST /api/auth/login
 *
 * Autentica al usuario en el servidor
 * y establece las cookies de sesión de
 * Supabase directamente en la respuesta.
 *
 * Existe para poder resolver el alias
 * de administrador ("admin" -> correo
 * real) sin que ese correo real tenga
 * que viajar nunca al navegador, algo
 * que sí ocurría cuando la resolución
 * se hacía en el cliente con una
 * variable NEXT_PUBLIC_*.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as LoginRequestBody;

    const identifier =
      typeof body.identifier === "string" ? body.identifier.trim() : "";

    const password = typeof body.password === "string" ? body.password : "";

    if (!identifier || !password) {
      return NextResponse.json(
        { ok: false, error: ERRORS.invalidBody },
        { status: 400 },
      );
    }

    const isAdminInput = isAdminLoginInput(identifier);

    const email = resolveLoginEmail(identifier);

    const supabase = await createServerClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const message = error.message.toLowerCase();

      if (message.includes("email") || message.includes("confirm")) {
        return NextResponse.json(
          { ok: false, error: ERRORS.emailVerification },
          { status: 401 },
        );
      }

      if (message.includes("rate")) {
        return NextResponse.json(
          { ok: false, error: ERRORS.rateLimit },
          { status: 429 },
        );
      }

      return NextResponse.json(
        { ok: false, error: ERRORS.invalidCredentials },
        { status: 401 },
      );
    }

    return NextResponse.json({ ok: true, isAdmin: isAdminInput });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }

    return NextResponse.json(
      { ok: false, error: ERRORS.unexpected },
      { status: 500 },
    );
  }
}