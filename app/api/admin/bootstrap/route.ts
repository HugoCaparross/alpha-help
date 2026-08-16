import { NextResponse } from "next/server";

import { ADMIN_LOGIN_EMAIL } from "@/lib/auth/adminEmail.server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";
import { getClientIp, isAllowedByRateLimit } from "@/lib/utils/rateLimit";

const BOOTSTRAP_RATE_LIMIT = 3;
const BOOTSTRAP_RATE_WINDOW = 15 * 60 * 1000;

const MAX_BODY_SIZE = 10_000;

function isValidPassword(password: unknown): password is string {
  if (typeof password !== "string") {
    return false;
  }

  return (
    password.length >= 12 &&
    password.length <= 128 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  );
}

/**
 * POST /api/admin/bootstrap
 *
 * Endpoint temporal para crear el
 * primer administrador.
 *
 * Debe eliminarse una vez inicializada
 * la cuenta administrativa.
 */
export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (
    !isAllowedByRateLimit(
      `admin-bootstrap:${ip}`,
      BOOTSTRAP_RATE_LIMIT,
      BOOTSTRAP_RATE_WINDOW,
    )
  ) {
    return NextResponse.json(
      { error: "Demasiados intentos. Inténtalo más tarde." },
      { status: 429 },
    );
  }

  const existingAdminAuth = await requireAdmin();

  if (existingAdminAuth.ok) {
    return NextResponse.json(
      {
        error:
          "El administrador ya está configurado. Este endpoint debe eliminarse.",
      },
      { status: 409 },
    );
  }

  const secret = process.env.ADMIN_BOOTSTRAP_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Endpoint de bootstrap no disponible." },
      { status: 503 },
    );
  }

  const providedSecret = request.headers.get("x-bootstrap-secret");

  if (!providedSecret || providedSecret !== secret) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");

  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_SIZE) {
    return NextResponse.json(
      { error: "Solicitud demasiado grande." },
      { status: 413 },
    );
  }

  const body = await request.json().catch(() => null);

  const password = body?.password;

  if (!isValidPassword(password)) {
    return NextResponse.json(
      {
        error:
          "La contraseña debe tener entre 12 y 128 caracteres e incluir mayúsculas, minúsculas y números.",
      },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  const { count: existingAdminCount, error: existingAdminError } = await admin
    .from("profiles")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("role", "admin");

  if (existingAdminError) {
    return NextResponse.json(
      { error: "No se ha podido comprobar el estado del administrador." },
      { status: 500 },
    );
  }

  if ((existingAdminCount ?? 0) > 0) {
    return NextResponse.json(
      {
        error: "La cuenta administrativa ya está configurada.",
      },
      { status: 409 },
    );
  }

  const { data: created, error: createError } =
    await admin.auth.admin.createUser({
      email: ADMIN_LOGIN_EMAIL,
      password,
      email_confirm: true,
    });

  if (createError || !created.user) {
    return NextResponse.json(
      { error: "No se ha podido crear el administrador." },
      { status: 500 },
    );
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: created.user.id,
    email: ADMIN_LOGIN_EMAIL,
    region: "España",
    role: "admin",
    accepted_policy: true,
    accepted_at: new Date().toISOString(),
    participant_code: "ADMIN",
  });

  if (profileError) {
    return NextResponse.json(
      {
        error: "No se ha podido completar la configuración administrativa.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
  });
}
