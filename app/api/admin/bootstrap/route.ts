import { NextResponse } from "next/server";

import { createServerClient as createAdminClient } from "@/lib/supabase/admin";
import { ADMIN_LOGIN_EMAIL } from "@/lib/constants/admin";

/**
 * POST /api/admin/bootstrap
 *
 * Endpoint de un solo uso para crear
 * la cuenta de administración.
 *
 * Protegido mediante la cabecera
 * "x-bootstrap-secret", que debe
 * coincidir con la variable de
 * entorno ADMIN_BOOTSTRAP_SECRET.
 *
 * Una vez creado el administrador,
 * se recomienda eliminar este archivo
 * o la variable de entorno.
 */
export async function POST(request: Request) {
  const secret = process.env.ADMIN_BOOTSTRAP_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "ADMIN_BOOTSTRAP_SECRET no está configurada." },
      { status: 500 },
    );
  }

  if (request.headers.get("x-bootstrap-secret") !== secret) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  const password = body?.password;

  if (!password || typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "Debes indicar una contraseña de al menos 8 caracteres." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  const { data: created, error: createError } =
    await admin.auth.admin.createUser({
      email: ADMIN_LOGIN_EMAIL,
      password,
      email_confirm: true,
    });

  if (createError || !created.user) {
    return NextResponse.json(
      { error: createError?.message ?? "No se ha podido crear el administrador." },
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
      { error: "Usuario creado, pero no se ha podido crear el perfil de administrador." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, email: ADMIN_LOGIN_EMAIL });
}