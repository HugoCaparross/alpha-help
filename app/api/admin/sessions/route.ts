import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";

import {
  extractYoutubeId,
  getYoutubeStatus,
  getYoutubeThumbnail,
  type YoutubeBroadcastStatus,
} from "@/lib/utils/youtube";

const TABLE = "study_sessions";

const REGIONS = ["España", "Latinoamérica"] as const;

const MIN_SESSION_ORDER = 0;
const MAX_SESSION_ORDER = 9;

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
  youtube_status,
  youtube_checked_at,
  created_at,
  updated_at
`;

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

  const title = typeof data.title === "string" ? data.title.trim() : "";

  const description =
    typeof data.description === "string" ? data.description.trim() : "";

  const youtubeUrl =
    typeof data.youtubeUrl === "string" ? data.youtubeUrl.trim() : "";

  const thumbnailUrl =
    typeof data.thumbnailUrl === "string" ? data.thumbnailUrl.trim() : "";

  const region = data.region;

  const sessionOrder = Number(data.sessionOrder);

  const releaseDateSpain =
    typeof data.releaseDateSpain === "string" ? data.releaseDateSpain : "";

  const releaseDateLatam =
    typeof data.releaseDateLatam === "string" ? data.releaseDateLatam : "";

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

  if (!REGIONS.includes(region as "España" | "Latinoamérica")) {
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
    .select(
      `
          id,
          youtube_url,
          is_live,
          youtube_status
        `,
    )
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

  let isLive = false;

  let youtubeStatus: YoutubeBroadcastStatus = "unknown";

  let youtubeCheckedAt: string | null = null;

  let youtubeStatusSource: "youtube-api" | "pending-sync" = "pending-sync";

  try {
    const status = await getYoutubeStatus(youtubeId);

    isLive = status.isLive;

    youtubeStatus = status.status;

    youtubeCheckedAt = now;

    youtubeStatusSource = "youtube-api";
  } catch (error) {
    const youtubeError = error as {
      code?: string;
      message?: string;
    };

    console.warn("[admin/sessions][YOUTUBE_STATUS]", {
      videoId: youtubeId,
      code: youtubeError.code,
      message: youtubeError.message,
    });

    /**
     * No usamos /live/ como fuente de verdad.
     *
     * Si estamos editando el mismo vídeo y ya existe
     * un estado cacheado, conservamos ese último estado
     * confirmado hasta que el sincronizador vuelva a consultar.
     *
     * Si es un vídeo nuevo, queda como unknown y el cron
     * lo comprobará automáticamente en el siguiente ciclo.
     */
    const existingYoutubeUrl = existing?.youtube_url;

    const isSameYoutubeVideo = existingYoutubeUrl === youtubeUrl;

    if (isSameYoutubeVideo && existing?.youtube_status) {
      youtubeStatus = existing.youtube_status as YoutubeBroadcastStatus;

      isLive = Boolean(existing.is_live);
    }
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
    youtube_status: youtubeStatus,
    youtube_checked_at: youtubeCheckedAt,
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
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({
    ok: true,

    isLive,

    youtubeStatus,

    youtubeStatusSource,

    youtubeCheckedAt,
  });
}
