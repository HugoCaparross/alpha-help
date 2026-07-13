import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";
import { extractYoutubeId, getYoutubeThumbnail } from "@/lib/utils/youtube";

const TABLE = "study_sessions";

const SELECT_FIELDS = `
  id,
  title,
  description,
  youtube_url,
  thumbnail_url,
  session_order,
  release_date_spain,
  release_date_latam,
  created_at,
  updated_at
`;

/**
 * GET /api/admin/sessions
 *
 * Devuelve todas las sesiones del
 * estudio, sin filtrar por región
 * ni estado de disponibilidad.
 */
export async function GET() {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const admin = createAdminClient();

  const { data, error } = await admin
    .from(TABLE)
    .select(SELECT_FIELDS)
    .order("session_order", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "No se han podido recuperar las sesiones." },
      { status: 500 },
    );
  }

  return NextResponse.json({ sessions: data ?? [] });
}

/**
 * POST /api/admin/sessions
 *
 * Crea o actualiza (por session_order)
 * una sesión del estudio. Si el vídeo
 * no incluye fechas de publicación,
 * se libera de inmediato para que el
 * participante pueda acceder en cuanto
 * el administrador suba la URL.
 */
export async function POST(request: Request) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const body = await request.json();

  const {
    title,
    description,
    youtubeUrl,
    thumbnailUrl,
    sessionOrder,
    releaseDateSpain,
    releaseDateLatam,
  } = body ?? {};

  if (!title || !description || !youtubeUrl || !sessionOrder) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios." },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();

  const youtubeId = extractYoutubeId(youtubeUrl);

  const resolvedThumbnail =
    thumbnailUrl ||
    (youtubeId ? getYoutubeThumbnail(youtubeId) : null);

  if (!resolvedThumbnail) {
    return NextResponse.json(
      { error: "La URL de YouTube no es válida." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from(TABLE)
    .select("id")
    .eq("session_order", sessionOrder)
    .maybeSingle();

  const payload = {
    title,
    description,
    youtube_url: youtubeUrl,
    thumbnail_url: resolvedThumbnail,
    session_order: sessionOrder,
    release_date_spain: releaseDateSpain || now,
    release_date_latam: releaseDateLatam || now,
    updated_at: now,
  };

  const query = existing
    ? admin.from(TABLE).update(payload).eq("id", existing.id)
    : admin.from(TABLE).insert(payload);

  const { error } = await query;

  if (error) {
    return NextResponse.json(
      { error: "No se ha podido guardar la sesión." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}