import type { Region } from "@/lib/utils/regions";

/**
 * Roles disponibles dentro de la plataforma.
 */
export type UserRole = "admin" | "user";

/**
 * Información de cada hijo participante.
 */
export interface ChildProfile {
  readonly age: number;

  readonly gender: string;

  readonly psychologicalSupport: boolean;
}

/**
 * Modelo de dominio del participante.
 *
 * Este modelo nunca depende directamente
 * del formato de la base de datos.
 */
export interface UserProfile {
  /* =========================
     IDENTIFICACIÓN
  ========================= */

  readonly id: string;

  readonly email: string;

  readonly participantCode: string;

  readonly role: UserRole;

  /* =========================
     CONSENTIMIENTO
  ========================= */

  readonly acceptedPolicy: boolean;

  readonly acceptedAt: string | null;

  /* =========================
     INFORMACIÓN PERSONAL
  ========================= */

  readonly region: Region;

  readonly gender: string | null;

  readonly age: number | null;

  readonly maritalStatus: string | null;

  /* =========================
     INFORMACIÓN ACADÉMICA
  ========================= */

  readonly educationLevel: string | null;

  readonly employmentStatus: string | null;

  readonly socioeconomicLevel: string | null;

  readonly schoolType: string | null;

  readonly schoolCenter: string | null;

  /* =========================
     INFORMACIÓN FAMILIAR
  ========================= */

  readonly numberOfChildren: number | null;

  readonly familyStructure: string | null;

  readonly children: readonly ChildProfile[];

  /* =========================
     SISTEMA
  ========================= */

  readonly createdAt: string;

  readonly updatedAt: string;
}