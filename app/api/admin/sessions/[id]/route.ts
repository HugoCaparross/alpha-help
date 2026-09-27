import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";

const STORAGE_BUCKET = "study-session-images";

function getStoragePathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;

  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return decodeURIComponent(url.slice(index + marker.length));
}

async function removeManagedImage(
  supabase: ReturnType<typeof createAdminClient>,
  url: string | null | undefined,
): Promise<void> {
  if (!url) {
    return;
  }

  const path = getStoragePathFromUrl(url);

  if (!path) {
    return;
  }

  await supabase.storage.from(STORAGE_BUCKET).remove([path]);
}

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("study_sessions")
      .select(
        `
                id,
                title,
                description,
                zoom_url,
                zoom_recording_url,
                thumbnail_url,
                session_order,
                live_ended_at,
                region,
                release_date_spain,
                release_date_latam
                `,
      )
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: "No se ha podido cargar la sesión.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      session: data,
    });
  } catch (error) {
    console.error("[GET /api/admin/sessions/:id]", error);

    return NextResponse.json(
      {
        error: "No autorizado.",
      },
      {
        status: 401,
      },
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    const body = await request.json();

    if (typeof body.liveEnded !== "boolean") {
      return NextResponse.json(
        {
          error: "El estado indicado no es válido.",
        },
        {
          status: 400,
        },
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("study_sessions")
      .update({
        live_ended_at: body.liveEnded
          ? new Date().toISOString()
          : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error(
        "[PATCH /api/admin/sessions/:id]",
        error,
      );

      return NextResponse.json(
        {
          error:
            "No se ha podido actualizar el estado de la sesión.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("[PATCH /api/admin/sessions/:id]", error);

    return NextResponse.json(
      {
        error: "No se ha podido actualizar la sesión.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    const supabase = createAdminClient();

    const { data: session, error: fetchError } = await supabase
      .from("study_sessions")
      .select("id, thumbnail_url")
      .eq("id", id)
      .single();

    if (fetchError || !session) {
      return NextResponse.json(
        {
          error: "La sesión no existe.",
        },
        {
          status: 404,
        },
      );
    }

    const { error: deleteError } = await supabase
      .from("study_sessions")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(
        "[DELETE /api/admin/sessions/:id]",
        deleteError,
      );

      return NextResponse.json(
        {
          error: "No se ha podido eliminar la sesión.",
        },
        {
          status: 500,
        },
      );
    }

    if (session.thumbnail_url) {
      await removeManagedImage(
        supabase,
        session.thumbnail_url,
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("[DELETE /api/admin/sessions/:id]", error);

    return NextResponse.json(
      {
        error: "No se ha podido eliminar la sesión.",
      },
      {
        status: 500,
      },
    );
  }
}