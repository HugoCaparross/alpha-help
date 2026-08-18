import { NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";

import { extractYoutubeId, getYoutubeStatus } from "@/lib/utils/youtube";

const TABLE = "study_sessions";

export async function GET() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      {
        error: "Usuario no autenticado.",
      },
      {
        status: 401,
      },
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("region")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[youtube/sessions-status][PROFILE]", profileError);

    return NextResponse.json(
      {
        error: "No se ha podido recuperar la región del participante.",
      },
      {
        status: 500,
      },
    );
  }

  if (!profile?.region) {
    return NextResponse.json(
      {
        error: "No se ha podido determinar la región del participante.",
      },
      {
        status: 500,
      },
    );
  }

  const admin = createAdminClient();

  const { data: sessions, error: sessionsError } = await admin
    .from(TABLE)
    .select(
      `
        id,
        youtube_url,
        is_live
      `,
    )
    .eq("region", profile.region);

  if (sessionsError) {
    console.error("[youtube/sessions-status][SESSIONS]", sessionsError);

    return NextResponse.json(
      {
        error: "No se han podido recuperar las sesiones.",
      },
      {
        status: 500,
      },
    );
  }

  const updates = await Promise.all(
    (sessions ?? []).map(async (session) => {
      const youtubeId = extractYoutubeId(session.youtube_url);

      if (!youtubeId) {
        return null;
      }

      try {
        const status = await getYoutubeStatus(youtubeId);

        if (session.is_live !== status.isLive) {
          const { error: updateError } = await admin
            .from(TABLE)
            .update({
              is_live: status.isLive,
              updated_at: new Date().toISOString(),
            })
            .eq("id", session.id);

          if (updateError) {
            console.error("[youtube/sessions-status][UPDATE]", updateError);
          }
        }

        return {
          id: session.id,
          isLive: status.isLive,
          status: status.status,
        };
      } catch (error) {
        console.error("[youtube/sessions-status][YOUTUBE]", {
          sessionId: session.id,
          error,
        });

        return {
          id: session.id,
          isLive: session.is_live,
          status: "unknown" as const,
        };
      }
    }),
  );

  return NextResponse.json(
    {
      sessions: updates.filter(
        (item): item is NonNullable<typeof item> => item !== null,
      ),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
