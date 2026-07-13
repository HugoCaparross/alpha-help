import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";

const TABLE = "study_sessions";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * DELETE /api/admin/sessions/:id
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const { id } = await params;

  const admin = createAdminClient();

  const { error } = await admin.from(TABLE).delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "No se ha podido eliminar la sesión." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}