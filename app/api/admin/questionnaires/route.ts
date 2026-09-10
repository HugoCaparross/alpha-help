import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";

const REGIONS = ["España", "Latinoamérica"] as const;
type Region = (typeof REGIONS)[number];

const REGION_FIELDS: Record<Region, { enabled: string; release: string }> = {
  España: { enabled: "post_enabled_spain", release: "post_release_at_spain" },
  Latinoamérica: { enabled: "post_enabled_latam", release: "post_release_at_latam" },
};

function isRegion(value: unknown): value is Region {
  return typeof value === "string" && REGIONS.includes(value as Region);
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.message }, { status: auth.status });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("questionnaire_settings")
    .select("post_enabled_spain, post_release_at_spain, post_enabled_latam, post_release_at_latam, updated_at")
    .eq("id", 1)
    .maybeSingle();

  if (error) return NextResponse.json({ ok: false, error: "No se ha podido recuperar la configuración." }, { status: 500 });

  return NextResponse.json({
    ok: true,
    settings: {
      España: {
        post_enabled: Boolean(data?.post_enabled_spain),
        post_release_at: data?.post_release_at_spain ?? null,
      },
      Latinoamérica: {
        post_enabled: Boolean(data?.post_enabled_latam),
        post_release_at: data?.post_release_at_latam ?? null,
      },
    },
    updated_at: data?.updated_at ?? null,
  });
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.message }, { status: auth.status });

  const body = await request.json().catch(() => null);
  const region = body?.region;
  const enabled = body?.postEnabled;
  const releaseAt = body?.postReleaseAt;

  if (!isRegion(region) || typeof enabled !== "boolean") {
    return NextResponse.json({ ok: false, error: "Configuración no válida." }, { status: 400 });
  }

  let normalizedReleaseAt: string | null = null;
  if (releaseAt !== null && releaseAt !== "" && releaseAt !== undefined) {
    if (typeof releaseAt !== "string") return NextResponse.json({ ok: false, error: "Fecha de desbloqueo no válida." }, { status: 400 });
    const parsed = new Date(releaseAt);
    if (Number.isNaN(parsed.getTime())) return NextResponse.json({ ok: false, error: "Fecha de desbloqueo no válida." }, { status: 400 });
    normalizedReleaseAt = parsed.toISOString();
  }

  const fields = REGION_FIELDS[region];
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("questionnaire_settings")
    .upsert({
      id: 1,
      [fields.enabled]: enabled,
      [fields.release]: normalizedReleaseAt,
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" })
    .select("post_enabled_spain, post_release_at_spain, post_enabled_latam, post_release_at_latam, updated_at")
    .single();

  if (error) return NextResponse.json({ ok: false, error: "No se ha podido guardar la configuración." }, { status: 500 });

  return NextResponse.json({
    ok: true,
    settings: {
      España: { post_enabled: Boolean(data.post_enabled_spain), post_release_at: data.post_release_at_spain ?? null },
      Latinoamérica: { post_enabled: Boolean(data.post_enabled_latam), post_release_at: data.post_release_at_latam ?? null },
    },
    updated_at: data.updated_at,
  });
}
