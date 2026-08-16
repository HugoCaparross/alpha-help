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
  is_live,
  created_at,
  updated_at
`;

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
      {
        error: "No se han podido recuperar las sesiones.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    sessions: data ?? [],
  });
}

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
    isLive,
  } = body ?? {};

  if (
    !title ||
    !description ||
    !youtubeUrl ||
    sessionOrder === undefined ||
    sessionOrder === null
  ) {
    return NextResponse.json(
      {
        error: "Faltan campos obligatorios.",
      },
      { status: 400 },
    );
  }

  const numericSessionOrder = Number(sessionOrder);

  if (
    !Number.isInteger(numericSessionOrder) ||
    numericSessionOrder < 0 ||
    numericSessionOrder > 9
  ) {
    return NextResponse.json(
      {
        error: "El orden de la sesión debe estar entre 0 y 9.",
      },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();

  const youtubeId = extractYoutubeId(youtubeUrl);

  const resolvedThumbnail =
    thumbnailUrl || (youtubeId ? getYoutubeThumbnail(youtubeId) : null);

  if (!resolvedThumbnail) {
    return NextResponse.json(
      {
        error: "La URL de YouTube no es válida.",
      },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from(TABLE)
    .select("id")
    .eq("session_order", numericSessionOrder)
    .maybeSingle();

  const payload = {
    title,
    description,
    youtube_url: youtubeUrl,
    thumbnail_url: resolvedThumbnail,
    session_order: numericSessionOrder,
    release_date_spain: releaseDateSpain || now,
    release_date_latam: releaseDateLatam || now,
    is_live: Boolean(isLive),
    updated_at: now,
  };

  const query = existing
    ? admin.from(TABLE).update(payload).eq("id", existing.id)
    : admin.from(TABLE).insert(payload);

  const { error } = await query;

  if (error) {
    return NextResponse.json(
      {
        error: "No se ha podido guardar la sesión.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
  });
}
