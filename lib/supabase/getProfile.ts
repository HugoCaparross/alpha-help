import { supabase } from "./client";
import { getUser } from "./getUser";

import type { UserProfile, ChildProfile } from "@/types/user";

const PROFILES_TABLE = "profiles";

const PROFILE_FIELDS = `
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

interface ProfileRow {
  id: string;

  email: string;

  participant_code: string;

  role: "admin" | "user";

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

  children: ChildProfile[] | null;

  created_at: string;

  updated_at: string;
}

/**
 * Convierte la región almacenada
 * en la base de datos al modelo
 * utilizado por la aplicación.
 */
function mapRegion(
  region: string,
): UserProfile["region"] {
  return region === "Latinoamérica"
    ? "latam"
    : "spain";
}

/**
 * Convierte una fila de Supabase
 * al modelo de dominio.
 */
function mapProfile(
  row: ProfileRow,
): UserProfile {
  return {
    id: row.id,

    email: row.email,

    participantCode:
      row.participant_code,

    role: row.role,

    acceptedPolicy:
      row.accepted_policy,

    acceptedAt:
      row.accepted_at,

    region: mapRegion(
      row.region,
    ),

    gender: row.gender,

    age: row.age,

    maritalStatus:
      row.marital_status,

    educationLevel:
      row.education_level,

    employmentStatus:
      row.employment_status,

    socioeconomicLevel:
      row.socioeconomic_level,

    schoolType:
      row.school_type,

    schoolCenter:
      row.school_center,

    numberOfChildren:
      row.number_of_children,

    familyStructure:
      row.family_structure,

    children:
      row.children ?? [],

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  };
}

/**
 * Devuelve el perfil
 * del usuario autenticado.
 *
 * Uso exclusivo en cliente.
 */
export async function getProfile(): Promise<UserProfile | null> {
  const user = await getUser();

  if (!user) {
    return null;
  }

  const {
    data,
    error,
  } = await supabase
    .from(PROFILES_TABLE)
    .select(PROFILE_FIELDS)
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      "No se ha podido recuperar el perfil del usuario.",
    );
  }

  if (!data) {
    return null;
  }

  return mapProfile(
    data as ProfileRow,
  );
}