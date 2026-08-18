import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";
import { extractYoutubeId, getYoutubeStatus } from "@/lib/utils/youtube";

const TABLE = "study_sessions";

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

  const { data: sessions, error: sessionsError } = await admin
    .from(TABLE)
    .select(
      `
        id,
        youtube_url,
        is_live
      `,
    );

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
          await admin
            .from(TABLE)
            .update({
              is_live: status.isLive,
              updated_at: new Date().toISOString(),
            })
            .eq("id", session.id);
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

  return NextResponse.json({
    sessions: updates.filter(
      (item): item is NonNullable<typeof item> => item !== null,
    ),
  });
}
