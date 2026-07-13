import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";
import { buildCsv, csvResponse } from "@/lib/utils/csv";

const COLUMNS = [
  "id",
  "email",
  "participant_code",
  "role",
  "region",
  "accepted_policy",
  "accepted_at",
  "gender",
  "age",
  "marital_status",
  "education_level",
  "employment_status",
  "socioeconomic_level",
  "school_type",
  "school_center",
  "number_of_children",
  "family_structure",
  "children",
  "created_at",
  "updated_at",
] as const;

/**
 * GET /api/admin/export/users
 *
 * Exporta el registro completo de
 * participantes, una fila por usuario,
 * con toda su información de perfil.
 */
export async function GET() {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("profiles")
    .select(COLUMNS.join(","))
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "No se han podido exportar los datos de registro." },
      { status: 500 },
    );
  }

  const rows = ((data ?? []) as unknown as Record<string, unknown>[]).map(
    (row) => ({
      ...row,
      children: row.children ? JSON.stringify(row.children) : "",
    }),
  );

  const csv = buildCsv(COLUMNS, rows);

  return csvResponse(csv, "registro-participantes.csv");
}