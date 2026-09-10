import { NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ ok: false, error: "Usuario no autenticado." }, { status: 401 });

  const admin = createAdminClient();
  const [{ data: profile, error: profileError }, { data: settings, error: settingsError }] = await Promise.all([
    admin.from("profiles").select("region").eq("id", user.id).maybeSingle(),
    admin.from("questionnaire_settings").select("post_enabled_spain, post_release_at_spain, post_enabled_latam, post_release_at_latam").eq("id", 1).maybeSingle(),
  ]);

  if (profileError || settingsError || !profile?.region) {
    return NextResponse.json({ ok: false, error: "No se ha podido comprobar la disponibilidad del cuestionario." }, { status: 500 });
  }

  const isSpain = profile.region === "España";
  const enabled = isSpain ? Boolean(settings?.post_enabled_spain) : Boolean(settings?.post_enabled_latam);
  const releaseAt = isSpain ? settings?.post_release_at_spain ?? null : settings?.post_release_at_latam ?? null;
  const postAvailable = Boolean(enabled && (!releaseAt || new Date(releaseAt).getTime() <= Date.now()));

  return NextResponse.json({ ok: true, postAvailable, postReleaseAt: releaseAt }, { headers: { "Cache-Control": "no-store" } });
}
