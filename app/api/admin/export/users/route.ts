import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";
import { fetchAllRows } from "@/lib/supabase/fetchAll";
import { buildCsv, csvResponse } from "@/lib/utils/csv";

/**
 * Número máximo de hijos que puede registrar un participante.
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

function boolToNumber(
  value: boolean | null | undefined,
): number {
  return value ? 1 : 0;
}

function buildChildColumns(): string[] {
  const columns: string[] = [];

  for (let index = 1; index <= MAX_CHILDREN; index += 1) {
    columns.push(
      `child_${index}_age`,
      `child_${index}_gender`,
      `child_${index}_support`,
    );
  }

  return columns;
}

/**
 * GET /api/admin/export/users
 *
 * Exporta todos los participantes registrados.
 *
 * La consulta se pagina automáticamente y continúa hasta que Supabase
 * no devuelve más registros.
 */
export async function GET() {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.message },
      { status: auth.status },
    );
  }

  const admin = createAdminClient();

  const profilesResult = await fetchAllRows<ProfileRow>(
    (from, to) =>
      admin
        .from("profiles")
        .select(SELECT_FIELDS)
        .order("created_at", { ascending: true })
        .order("id", { ascending: true })
        .range(from, to),
  );

  if (profilesResult.error) {
    console.error(
      "Users export error:",
      profilesResult.error,
    );

    return NextResponse.json(
      {
        error:
          "No se han podido exportar los datos de registro.",
      },
      { status: 500 },
    );
  }

  const profiles = profilesResult.data;

  const columns = [
    ...BASE_COLUMNS,
    ...buildChildColumns(),
  ];

  const rows: Record<string, unknown>[] = [];

  for (const profile of profiles) {
    const row: Record<string, unknown> = {
      participant_code: profile.participant_code,
      email: profile.email,
      region: profile.region,
      role: profile.role,
      accepted_policy: boolToNumber(
        profile.accepted_policy,
      ),
      accepted_at: profile.accepted_at ?? "",
      gender: profile.gender ?? "",
      age: profile.age ?? "",
      education_level:
        profile.education_level ?? "",
      employment_status:
        profile.employment_status ?? "",
      marital_status:
        profile.marital_status ?? "",
      socioeconomic_level:
        profile.socioeconomic_level ?? "",
      school_type:
        profile.school_type ?? "",
      school_center:
        profile.school_center ?? "",
      number_of_children:
        profile.number_of_children ?? "",
      family_structure:
        profile.family_structure ?? "",
    };

    const children = Array.isArray(profile.children)
      ? profile.children
      : [];

    for (
      let index = 1;
      index <= MAX_CHILDREN;
      index += 1
    ) {
      const child = children[index - 1];

      row[`child_${index}_age`] =
        child?.age ?? "";

      row[`child_${index}_gender`] =
        child?.gender ?? "";

      row[`child_${index}_support`] =
        child === undefined
          ? ""
          : boolToNumber(
            child.psychologicalSupport,
          );
    }

    rows.push(row);
  }

  const csv = buildCsv(columns, rows);

  return csvResponse(
    csv,
    "registro-participantes.csv",
  );
}