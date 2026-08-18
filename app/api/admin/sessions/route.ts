import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";
import { extractYoutubeId, getYoutubeThumbnail } from "@/lib/utils/youtube";

const TABLE = "study_sessions";

const REGIONS = ["España", "Latinoamérica"] as const;

const MIN_SESSION_ORDER = 0;
const MAX_SESSION_ORDER = 10;

const SELECT_FIELDS = `
  id,
  title,
  description,
  youtube_url,
  thumbnail_url,
  session_order,
  region,
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
    .order("region", {
      ascending: true,
    })
    .order("session_order", {
      ascending: true,
    });

  if (error) {
    console.error("[admin/sessions][GET]", error);

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

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "La petición contiene un JSON inválido.",
      },
      { status: 400 },
    );
  }

  const {
    title,
    description,
    youtubeUrl,
    thumbnailUrl,
    sessionOrder,
    region,
    releaseDateSpain,
    releaseDateLatam,
    isLive,
  } = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  const normalizedOrder = Number(sessionOrder);

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof description !== "string" ||
    !description.trim() ||
    typeof youtubeUrl !== "string" ||
    !youtubeUrl.trim() ||
    !REGIONS.includes(region as (typeof REGIONS)[number]) ||
    !Number.isInteger(normalizedOrder) ||
    normalizedOrder < MIN_SESSION_ORDER ||
    normalizedOrder > MAX_SESSION_ORDER
  ) {
    return NextResponse.json(
      {
        error: "Faltan campos obligatorios o son inválidos.",
      },
      { status: 400 },
    );
  }

  const normalizedRegion = region as (typeof REGIONS)[number];

  const youtubeId = extractYoutubeId(youtubeUrl);

  const resolvedThumbnail =
    typeof thumbnailUrl === "string" && thumbnailUrl.trim()
      ? thumbnailUrl.trim()
      : youtubeId
        ? getYoutubeThumbnail(youtubeId)
        : null;

  if (!resolvedThumbnail) {
    return NextResponse.json(
      {
        error: "La URL de YouTube no es válida.",
      },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();

  const admin = createAdminClient();

  /*
   * Buscamos exclusivamente la sesión
   * correspondiente a la región y orden
   * seleccionados.
   */
  const { data: existing, error: existingError } = await admin
    .from(TABLE)
    .select("id")
    .eq("region", normalizedRegion)
    .eq("session_order", normalizedOrder)
    .maybeSingle();

  if (existingError) {
    console.error("[admin/sessions][CHECK_EXISTING]", existingError);

    return NextResponse.json(
      {
        error: "No se ha podido comprobar la sesión existente.",
      },
      { status: 500 },
    );
  }

  const payload = {
    title: title.trim(),
    description: description.trim(),
    youtube_url: youtubeUrl.trim(),
    thumbnail_url: resolvedThumbnail,
    session_order: normalizedOrder,
    region: normalizedRegion,
    release_date_spain:
      typeof releaseDateSpain === "string" && releaseDateSpain.trim()
        ? releaseDateSpain
        : now,
    release_date_latam:
      typeof releaseDateLatam === "string" && releaseDateLatam.trim()
        ? releaseDateLatam
        : now,
    is_live: Boolean(isLive),
    updated_at: now,
  };

  const query = existing
    ? admin.from(TABLE).update(payload).eq("id", existing.id)
    : admin.from(TABLE).insert(payload);

  const { error } = await query;

  if (error) {
    console.error("[admin/sessions][SAVE]", {
      error,
      payload,
    });

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
