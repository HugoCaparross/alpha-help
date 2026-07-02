export interface UserProfile {
  /* =========================
     IDENTIFICACIÓN
  ========================= */

  id: string;
  email: string;

  role?: "admin" | "user";

  /* =========================
     CONSENTIMIENTO
  ========================= */

  accepted_policy?: boolean;
  accepted_at?: string;

  /* =========================
     INFORMACIÓN PERSONAL
  ========================= */

  region?: string;
  gender?: string;
  age?: number;
  marital_status?: string;

  /* =========================
     INFORMACIÓN ACADÉMICA
  ========================= */

  education_level?: string;
  employment_status?: string;
  socioeconomic_level?: string;
  school_type?: string;
  school_center?: string;

  /* =========================
     INFORMACIÓN FAMILIAR
  ========================= */

  number_of_children?: number;
  family_structure?: string;

  /* =========================
     SISTEMA
  ========================= */

  created_at?: string;
  updated_at?: string;
}