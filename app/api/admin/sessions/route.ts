import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";

const TABLE = "study_sessions";
const REGIONS = ["España", "Latinoamérica"] as const;
const MIN_SESSION_ORDER = 0;
const MAX_SESSION_ORDER = 9;

const SELECT_FIELDS = `
  id,
  title,
  description,
  zoom_url,
  zoom_recording_url,
  thumbnail_url,
  session_order,
  region,
  release_date_spain,
  release_date_latam,
  created_at,
  updated_at
`;

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const admin = createAdminClient();
  const { data, error } = await admin.from(TABLE).select(SELECT_FIELDS).order("region", { ascending: true }).order("session_order", { ascending: true });

  if (error) {
    console.error("[admin/sessions][GET]", error);
    return NextResponse.json({ error: "No se han podido recuperar las sesiones." }, { status: 500 });
  }

  return NextResponse.json({ sessions: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "La petición contiene datos inválidos." }, { status: 400 });
  }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "La petición contiene datos inválidos." }, { status: 400 });

  const data = body as Record<string, unknown>;
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const description = typeof data.description === "string" ? data.description.trim() : "";
  const zoomUrl = typeof data.zoomUrl === "string" ? data.zoomUrl.trim() : "";
  const zoomRecordingUrl = typeof data.zoomRecordingUrl === "string" ? data.zoomRecordingUrl.trim() : "";
  const thumbnailUrl = typeof data.thumbnailUrl === "string" ? data.thumbnailUrl.trim() : "";
  const region = data.region;
  const sessionOrder = Number(data.sessionOrder);
  const sessionDate = typeof data.sessionDate === "string" ? data.sessionDate.trim() : "";

  if (!title) return NextResponse.json({ error: "El título de la sesión es obligatorio." }, { status: 400 });
  if (!description) return NextResponse.json({ error: "La descripción de la sesión es obligatoria." }, { status: 400 });
  if (!zoomUrl) return NextResponse.json({ error: "La URL de Zoom es obligatoria." }, { status: 400 });
  try { new URL(zoomUrl); } catch { return NextResponse.json({ error: "La URL de Zoom no es válida." }, { status: 400 }); }
  if (zoomRecordingUrl) {
    try { new URL(zoomRecordingUrl); } catch { return NextResponse.json({ error: "La URL de la grabación de Zoom no es válida." }, { status: 400 }); }
  }
  if (!sessionDate) return NextResponse.json({ error: "La fecha de la sesión es obligatoria." }, { status: 400 });
  const sessionTimestamp = Date.parse(sessionDate);
  if (!Number.isFinite(sessionTimestamp)) return NextResponse.json({ error: "La fecha de la sesión no es válida." }, { status: 400 });
  if (!REGIONS.includes(region as (typeof REGIONS)[number])) return NextResponse.json({ error: "La región de la sesión no es válida." }, { status: 400 });
  if (!Number.isInteger(sessionOrder) || sessionOrder < MIN_SESSION_ORDER || sessionOrder > MAX_SESSION_ORDER) return NextResponse.json({ error: "El orden de la sesión no es válido." }, { status: 400 });

  const normalizedSessionDate = new Date(sessionTimestamp).toISOString();
  const admin = createAdminClient();
  const { data: existing, error: existingError } = await admin.from(TABLE).select("id, release_date_spain, release_date_latam").eq("region", region).eq("session_order", sessionOrder).maybeSingle();
  if (existingError) {
    console.error("[admin/sessions][CHECK_EXISTING]", existingError);
    return NextResponse.json({ error: "No se ha podido comprobar la sesión existente." }, { status: 500 });
  }

  const now = new Date().toISOString();
  const payload = {
    title,
    description,
    zoom_url: zoomUrl,
    zoom_recording_url: zoomRecordingUrl || null,
    thumbnail_url: thumbnailUrl,
    session_order: sessionOrder,
    region,
    release_date_spain: region === "España" ? normalizedSessionDate : existing?.release_date_spain ?? null,
    release_date_latam: region === "Latinoamérica" ? normalizedSessionDate : existing?.release_date_latam ?? null,
    updated_at: now,
  };

  const query = existing ? admin.from(TABLE).update(payload).eq("id", existing.id) : admin.from(TABLE).insert(payload);
  const { error } = await query;
  if (error) {
    console.error("[admin/sessions][SAVE]", { error, payload });
    return NextResponse.json({ error: "No se ha podido guardar la sesión." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
