import { NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";

import { getDatabaseRegion, type DatabaseRegion } from "@/lib/utils/regions";

const TABLE = "study_sessions";
const PROFILE_TABLE = "profiles";

const SESSION_FIELDS = `
  id,
  is_live,
  youtube_status,
  youtube_checked_at
`;

interface SessionStatusRow {
  readonly id: string;
  readonly is_live: boolean;
  readonly youtube_status: string | null;
  readonly youtube_checked_at: string | null;
}

export async function GET() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        error: "No autenticado.",
      },
      {
        status: 401,
      },
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from(PROFILE_TABLE)
    .select("region")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile?.region) {
    console.error("[youtube/sessions-status][PROFILE]", profileError);

    return NextResponse.json(
      {
        error: "No se ha podido determinar la región del participante.",
      },
      {
        status: 403,
      },
    );
  }

  const applicationRegion = profile.region === "España" ? "spain" : "latam";

  const databaseRegion = getDatabaseRegion(applicationRegion);

  const admin = createAdminClient();

  const { data, error } = await admin
    .from(TABLE)
    .select(SESSION_FIELDS)
    .eq("region", databaseRegion)
    .order("session_order", {
      ascending: true,
    });

  if (error) {
    console.error("[youtube/sessions-status][CACHE]", error);

    return NextResponse.json(
      {
        error: "No se ha podido recuperar el estado de las sesiones.",
      },
      {
        status: 500,
      },
    );
  }

  const sessions = ((data ?? []) as SessionStatusRow[]).map((session) => ({
    id: session.id,

    isLive: session.is_live,

    status: session.youtube_status ?? "unknown",

    checkedAt: session.youtube_checked_at,
  }));

  return NextResponse.json(
    {
      sessions,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
