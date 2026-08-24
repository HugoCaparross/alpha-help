import { NextResponse } from "next/server";

import { createServerClient } from "@/lib/supabase/server";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";

import { getDatabaseRegion } from "@/lib/utils/regions";

import { extractYoutubeId, getYoutubeStatus } from "@/lib/utils/youtube";

const TABLE = "study_sessions";

/**
 * Comprueba y sincroniza el estado real
 * de las sesiones de YouTube del
 * participante autenticado.
 *
 * Esta ruta NO puede ser exclusiva de
 * administradores porque la página de
 * sesiones la utiliza el participante
 * para refrescar el estado de YouTube.
 */
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

  /**
   * Recuperamos únicamente la región
   * del participante autenticado.
   */
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
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

  const databaseRegion = getDatabaseRegion(profile.region);

  /**
   * Utilizamos Service Role únicamente
   * en servidor para sincronizar is_live.
   *
   * La consulta queda limitada a la
   * región del participante.
   */
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
    .eq("region", databaseRegion);

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
        /**
         * YouTube es la fuente de verdad.
         *
         * Aquí obtenemos:
         * - live
         * - upcoming
         * - completed
         * - video
         */
        const status = await getYoutubeStatus(youtubeId);

        const isLive = status.isLive;

        /**
         * Sincronizamos la base de datos
         * únicamente si ha cambiado.
         */
        if (session.is_live !== isLive) {
          await admin
            .from(TABLE)
            .update({
              is_live: isLive,
              updated_at: new Date().toISOString(),
            })
            .eq("id", session.id)
            .eq("region", databaseRegion);
        }

        return {
          id: session.id,
          isLive,
          status: status.status,
        };
      } catch (error) {
        const youtubeError = error as {
          code?: string;
          message?: string;
        };

        console.warn("[youtube/sessions-status][YOUTUBE]", {
          sessionId: session.id,
          videoId: youtubeId,
          code: youtubeError.code,
          message: youtubeError.message,
        });

        /**
         * MUY IMPORTANTE:
         *
         * NO utilizamos /live/ de la URL
         * para determinar si actualmente
         * está en directo.
         *
         * Una emisión terminada puede
         * seguir teniendo una URL /live/.
         *
         * Si YouTube ya no encuentra el
         * vídeo, dejamos de considerarlo
         * directo.
         */
        const isLive =
          youtubeError.code === "not_found" ? false : session.is_live;

        if (session.is_live !== isLive) {
          await admin
            .from(TABLE)
            .update({
              is_live: isLive,
              updated_at: new Date().toISOString(),
            })
            .eq("id", session.id)
            .eq("region", databaseRegion);
        }

        return {
          id: session.id,
          isLive,
          status:
            youtubeError.code === "not_found"
              ? ("completed" as const)
              : ("unknown" as const),
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
