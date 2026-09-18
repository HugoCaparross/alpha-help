import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";

const TABLE = "study_sessions";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  const { id } = await params;
  const admin = createAdminClient();
  const { data, error } = await admin.from(TABLE).select("id,title,description,zoom_url,zoom_recording_url,thumbnail_url,session_order,region,release_date_spain,release_date_latam,live_ended_at,created_at,updated_at").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: "No se ha podido recuperar la sesión." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "La sesión no existe." }, { status: 404 });
  return NextResponse.json({ session: data });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  const { id } = await params;
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "La petición contiene datos inválidos." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || typeof (body as Record<string, unknown>).liveEnded !== "boolean") {
    return NextResponse.json({ error: "El estado del directo no es válido." }, { status: 400 });
  }
  const liveEnded = (body as Record<string, unknown>).liveEnded as boolean;
  const admin = createAdminClient();
  const { error } = await admin.from(TABLE).update({ live_ended_at: liveEnded ? new Date().toISOString() : null, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) {
    console.error("[admin/sessions][PATCH]", error);
    return NextResponse.json({ error: "No se ha podido actualizar el estado de la sesión." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  const { id } = await params;
  const admin = createAdminClient();
  const { error } = await admin.from(TABLE).delete().eq("id", id);
  if (error) {
    console.error("[admin/sessions][DELETE]", error);
    return NextResponse.json({ error: "No se ha podido eliminar la sesión." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
