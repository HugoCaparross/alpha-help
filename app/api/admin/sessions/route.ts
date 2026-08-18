import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";
import { extractYoutubeId, getYoutubeThumbnail } from "@/lib/utils/youtube";

const TABLE = "study_sessions";

const REGIONS = ["España", "Latinoamérica"] as const;

type AdminRegion = (typeof REGIONS)[number];

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

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeRegion(value: unknown): AdminRegion | null {
  const region = normalizeString(value);

  if (region === "España" || region === "ES") {
    return "España";
  }

  if (region === "Latinoamérica" || region === "LATAM") {
    return "Latinoamérica";
  }

  return null;
}

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json(
      {
        error: auth.message,
      },
      {
        status: auth.status,
      },
    );
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
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({
    sessions: data ?? [],
  });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json(
      {
        error: auth.message,
      },
      {
        status: auth.status,
      },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "La petición contiene datos inválidos.",
      },
      {
        status: 400,
      },
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      {
        error: "La petición contiene datos inválidos.",
      },
      {
        status: 400,
      },
    );
  }

  const data = body as Record<string, unknown>;

  const title = normalizeString(data.title);

  const description = normalizeString(data.description);

  const youtubeUrl = normalizeString(data.youtubeUrl);

  const thumbnailUrl = normalizeString(data.thumbnailUrl);

  const region = normalizeRegion(data.region);

  const sessionOrder = Number(data.sessionOrder);

  const releaseDateSpain = normalizeString(data.releaseDateSpain);

  const releaseDateLatam = normalizeString(data.releaseDateLatam);

  const isLive = Boolean(data.isLive);

  if (!title) {
    return NextResponse.json(
      {
        error: "El título de la sesión es obligatorio.",
      },
      {
        status: 400,
      },
    );
  }

  if (!description) {
    return NextResponse.json(
      {
        error: "La descripción de la sesión es obligatoria.",
      },
      {
        status: 400,
      },
    );
  }

  if (!youtubeUrl) {
    return NextResponse.json(
      {
        error: "La URL de YouTube es obligatoria.",
      },
      {
        status: 400,
      },
    );
  }

  if (!region) {
    return NextResponse.json(
      {
        error: "La región de la sesión no es válida.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    !Number.isInteger(sessionOrder) ||
    sessionOrder < MIN_SESSION_ORDER ||
    sessionOrder > MAX_SESSION_ORDER
  ) {
    return NextResponse.json(
      {
        error: "El orden de la sesión no es válido.",
      },
      {
        status: 400,
      },
    );
  }

  const youtubeId = extractYoutubeId(youtubeUrl);

  if (!youtubeId) {
    return NextResponse.json(
      {
        error: "La URL de YouTube no es válida.",
      },
      {
        status: 400,
      },
    );
  }

  const resolvedThumbnail = thumbnailUrl || getYoutubeThumbnail(youtubeId);

  const now = new Date().toISOString();

  const admin = createAdminClient();

  const { data: existing, error: existingError } = await admin
    .from(TABLE)
    .select("id")
    .eq("region", region)
    .eq("session_order", sessionOrder)
    .maybeSingle();

  if (existingError) {
    console.error("[admin/sessions][CHECK_EXISTING]", existingError);

    return NextResponse.json(
      {
        error: "No se ha podido comprobar la sesión existente.",
      },
      {
        status: 500,
      },
    );
  }

  const payload = {
    title,
    description,
    youtube_url: youtubeUrl,
    thumbnail_url: resolvedThumbnail,
    session_order: sessionOrder,
    region,
    release_date_spain: releaseDateSpain || now,
    release_date_latam: releaseDateLatam || now,
    is_live: isLive,
    updated_at: now,
  };

  let error;

  if (existing) {
    const result = await admin
      .from(TABLE)
      .update(payload)
      .eq("id", existing.id);

    error = result.error;
  } else {
    const result = await admin.from(TABLE).insert(payload);

    error = result.error;
  }

  if (error) {
    console.error("[admin/sessions][SAVE]", {
      error,
      payload,
    });

    return NextResponse.json(
      {
        error: "No se ha podido guardar la sesión.",
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({
    ok: true,
  });
}
