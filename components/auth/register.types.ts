import type { Region } from "@/lib/utils/regions";

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

  /**
   * Valor interno utilizado por la aplicación.
   *
   * La base de datos almacena:
   * - España
   * - Latinoamérica
   *
   * La conversión se realiza en el backend/trigger.
   */
  region: Region | "";

  password: string;

  confirmPassword: string;

  acceptedPolicy: boolean;

  acceptedInformedConsent: boolean;

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
