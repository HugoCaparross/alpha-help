import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.message },
      { status: auth.status },
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("questionnaire_settings")
    .select("post_enabled, post_release_at, updated_at")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { ok: false, error: "No se ha podido recuperar la configuración." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    settings: data ?? {
      post_enabled: false,
      post_release_at: null,
      updated_at: null,
    },
  });
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.message },
      { status: auth.status },
    );
  }

  const body = await request.json().catch(() => null);
  const enabled = body?.postEnabled;
  const releaseAt = body?.postReleaseAt;

  if (typeof enabled !== "boolean") {
    return NextResponse.json(
      { ok: false, error: "Configuración no válida." },
      { status: 400 },
    );
  }

  let normalizedReleaseAt: string | null = null;

  if (releaseAt !== null && releaseAt !== "" && releaseAt !== undefined) {
    if (typeof releaseAt !== "string") {
      return NextResponse.json(
        { ok: false, error: "Fecha de desbloqueo no válida." },
        { status: 400 },
      );
    }

    const parsed = new Date(releaseAt);

    if (Number.isNaN(parsed.getTime())) {
      return NextResponse.json(
        { ok: false, error: "Fecha de desbloqueo no válida." },
        { status: 400 },
      );
    }

    normalizedReleaseAt = parsed.toISOString();
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("questionnaire_settings")
    .upsert(
      {
        id: 1,
        post_enabled: enabled,
        post_release_at: normalizedReleaseAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select("post_enabled, post_release_at, updated_at")
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, error: "No se ha podido guardar la configuración." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, settings: data });
}
