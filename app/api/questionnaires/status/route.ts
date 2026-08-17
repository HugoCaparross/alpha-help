import { NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Usuario no autenticado." },
      { status: 401 },
    );
  }

  const { data, error } = await supabase
    .from("questionnaire_settings")
    .select("post_enabled, post_release_at")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "No se ha podido comprobar la disponibilidad del cuestionario.",
      },
      { status: 500 },
    );
  }

  const releaseAt = data?.post_release_at ?? null;
  const postAvailable = Boolean(
    data?.post_enabled &&
    (!releaseAt || new Date(releaseAt).getTime() <= Date.now()),
  );

  return NextResponse.json(
    {
      ok: true,
      postAvailable,
      postReleaseAt: releaseAt,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
