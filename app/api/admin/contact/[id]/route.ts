import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";
import { getClientIp, isAllowedByRateLimit } from "@/lib/utils/rateLimit";

const TABLE = "contact_messages";

const idSchema = z.string().uuid();

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const ip = getClientIp(request);

  if (
    !isAllowedByRateLimit(
      `admin-contact-delete:${auth.user.id}:${ip}`,
      30,
      60_000,
    )
  ) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes." },
      { status: 429 },
    );
  }

  const { id } = await params;

  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
    return NextResponse.json(
      { error: "Identificador no válido." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  const { error } = await admin.from(TABLE).delete().eq("id", parsedId.data);

  if (error) {
    return NextResponse.json(
      {
        error: "No se ha podido eliminar el mensaje.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
  });
}
