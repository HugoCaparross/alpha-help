import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";

const TABLE = "contact_messages";

const SELECT_FIELDS = `
  id,
  name,
  email,
  category,
  subject,
  message,
  created_at
`;

/**
 * GET /api/admin/contact
 *
 * Devuelve todos los mensajes
 * recibidos a través del
 * formulario de contacto,
 * más recientes primero.
 */
export async function GET() {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const admin = createAdminClient();

  const { data, error } = await admin
    .from(TABLE)
    .select(SELECT_FIELDS)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "No se han podido recuperar los mensajes." },
      { status: 500 },
    );
  }

  return NextResponse.json({ messages: data ?? [] });
}