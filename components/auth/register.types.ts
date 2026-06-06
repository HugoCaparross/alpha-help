export interface ChildData {
  age: string;

  gender: string;

  psychologicalSupport: boolean;
}

export interface RegisterData {
  /* =========================
     CUENTA
  ========================= */

  email: string;

  region: string;

  password: string;

  confirmPassword: string;

  acceptedPolicy: boolean;

  /* =========================
     PARTICIPANTE
  ========================= */

  gender: string;

  age: string;

  educationLevel: string;

  employmentStatus: string;

  maritalStatus: string;

  /* =========================
     FAMILIA
  ========================= */

  socioeconomicLevel: string;

  schoolType: string;

  numberOfChildren: string;

  familyStructure: string;

  schoolCenter: string;

  /* =========================
     HIJOS
  ========================= */

  children: ChildData[];
}