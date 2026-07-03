import type { Region } from "@/lib/utils/regions";

/**
 * Perfil del participante almacenado
 * en la tabla `profiles`.
 */
export interface UserProfile {
  /* =========================
     IDENTIFICACIÓN
  ========================= */

  id: string;

  email: string;

  role: UserRole;

  /* =========================
     CONSENTIMIENTO
  ========================= */

  accepted_policy: boolean;

  accepted_at: string | null;

  /* =========================
     INFORMACIÓN PERSONAL
  ========================= */

  region: Region;

  gender: string | null;

  age: number | null;

  marital_status: string | null;

  /* =========================
     INFORMACIÓN ACADÉMICA
  ========================= */

  education_level: string | null;

  employment_status: string | null;

  socioeconomic_level: string | null;

  school_type: string | null;

  school_center: string | null;

  /* =========================
     INFORMACIÓN FAMILIAR
  ========================= */

  number_of_children: number | null;

  family_structure: string | null;

  /* =========================
     SISTEMA
  ========================= */

  created_at: string;

  updated_at: string;
}

/**
 * Roles disponibles dentro de la plataforma.
 */
export type UserRole =
  | "admin"
  | "user";