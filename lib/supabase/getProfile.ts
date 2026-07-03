import { supabase } from "./client";
import { getUser } from "./getUser";

import type { UserProfile } from "@/types/user";

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

/**
 * Obtiene el perfil del usuario autenticado.
 *
 * Uso:
 * - Componentes cliente
 * - Servicios cliente
 */
export async function getProfile(): Promise<UserProfile | null> {
  const user = await getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .select(PROFILE_FIELDS)
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      "No se ha podido recuperar el perfil del usuario."
    );
  }

  return data;
}