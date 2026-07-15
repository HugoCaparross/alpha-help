import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";
import { buildCsv, csvResponse } from "@/lib/utils/csv";

/**
 * Número máximo de hijos que puede
 * registrar un participante (ver
 * validators/register.ts, MAX_CHILDREN).
 */
const MAX_CHILDREN = 5;

interface ChildRecord {
  age?: string | number;
  gender?: string;
  psychologicalSupport?: boolean;
}

interface ProfileRow {
  id: string;
  email: string;
  participant_code: string;
  role: string;
  region: string;
  accepted_policy: boolean;
  accepted_at: string | null;
  gender: string | null;
  age: number | null;
  marital_status: string | null;
  education_level: string | null;
  employment_status: string | null;
  socioeconomic_level: string | null;
  school_type: string | null;
  school_center: string | null;
  number_of_children: number | null;
  family_structure: string | null;
  children: ChildRecord[] | null;
  created_at: string;
  updated_at: string;
}

const SELECT_FIELDS = `
  id,
  email,
  participant_code,
  role,
  region,
  accepted_policy,
  accepted_at,
  gender,
  age,
  marital_status,
  education_level,
  employment_status,
  socioeconomic_level,
  school_type,
  school_center,
  number_of_children,
  family_structure,
  children,
  created_at,
  updated_at
`;

/**
 * Columnas base, en un orden lógico
 * estable pensado para SPSS/R/JASP.
 */
const BASE_COLUMNS = [
  "participant_code",
  "email",
  "region",
  "role",
  "accepted_policy",
  "accepted_at",
  "gender",
  "age",
  "education_level",
  "employment_status",
  "marital_status",
  "socioeconomic_level",
  "school_type",
  "school_center",
  "number_of_children",
  "family_structure",
] as const;

/**
 * Convierte un booleano a 1/0
 * numérico (más cómodo para SPSS
 * que TRUE/FALSE).
 */
function boolToNumber(value: boolean | null | undefined): number {
  return value ? 1 : 0;
}

/**
 * Genera las columnas child_1_age,
 * child_1_gender, child_1_support,
 * child_2_..., hasta MAX_CHILDREN,
 * siempre presentes aunque estén
 * vacías.
 */
function buildChildColumns(): string[] {
  const columns: string[] = [];

  for (let i = 1; i <= MAX_CHILDREN; i += 1) {
    columns.push(`child_${i}_age`, `child_${i}_gender`, `child_${i}_support`);
  }

  return columns;
}

/**
 * GET /api/admin/export/users
 *
 * Exporta el registro completo de
 * participantes, una fila por usuario,
 * en formato compatible con SPSS/R/
 * JASP/Excel (RFC 4180, UTF-8 con BOM,
 * separador por comas, una columna por
 * variable, hijos desnormalizados en
 * columnas child_N_*).
 */
export async function GET() {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("profiles")
    .select(SELECT_FIELDS)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "No se han podido exportar los datos de registro." },
      { status: 500 },
    );
  }

  const profiles = (data ?? []) as unknown as ProfileRow[];

  const columns = [...BASE_COLUMNS, ...buildChildColumns()];

  const rows = profiles.map((profile) => {
    const row: Record<string, unknown> = {
      participant_code: profile.participant_code,
      email: profile.email,
      region: profile.region,
      role: profile.role,
      accepted_policy: boolToNumber(profile.accepted_policy),
      accepted_at: profile.accepted_at ?? "",
      gender: profile.gender ?? "",
      age: profile.age ?? "",
      education_level: profile.education_level ?? "",
      employment_status: profile.employment_status ?? "",
      marital_status: profile.marital_status ?? "",
      socioeconomic_level: profile.socioeconomic_level ?? "",
      school_type: profile.school_type ?? "",
      school_center: profile.school_center ?? "",
      number_of_children: profile.number_of_children ?? "",
      family_structure: profile.family_structure ?? "",
    };

    const children = Array.isArray(profile.children) ? profile.children : [];

    for (let i = 1; i <= MAX_CHILDREN; i += 1) {
      const child = children[i - 1];

      row[`child_${i}_age`] = child?.age ?? "";
      row[`child_${i}_gender`] = child?.gender ?? "";
      row[`child_${i}_support`] =
        child === undefined ? "" : boolToNumber(child.psychologicalSupport);
    }

    return row;
  });

  const csv = buildCsv(columns, rows);

  return csvResponse(csv, "registro-participantes.csv");
}