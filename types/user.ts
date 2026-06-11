export interface UserProfile {
  id: string;
  email: string;

  role?: "admin" | "user";
  region?: string;

  accepted_policy?: boolean;
  accepted_at?: string;

  gender?: string;
  age?: number;

  education_level?: string;
  employment_status?: string;
  marital_status?: string;
  socioeconomic_level?: string;

  school_type?: string;
  school_center?: string;

  number_of_children?: number;
  family_structure?: string;

  children?: unknown;

  created_at?: string;
  updated_at?: string;
}