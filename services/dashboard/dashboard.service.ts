import { supabase } from "@/lib/supabase/client";
import { getProfile } from "@/lib/supabase/getProfile";

import {
  getAvailableSessions,
  getNextSession,
} from "@/services/sessions/study-session.service";

import {
  getAvailableStudyMaterials,
  getNextStudyMaterial,
} from "@/services/resources/study-material.service";

import type { Region } from "@/lib/utils/regions";
import type { SessionWithStatus } from "@/types/study-session";
import type { StudyMaterialWithStatus } from "@/types/study-material";

export interface DashboardData {
  participantName: string;

  questionnaireCompleted: boolean;

  sessionsCompleted: boolean;

  materialsCompleted: boolean;

  postCompleted: boolean;

  nextSession: SessionWithStatus | null;

  nextMaterial: StudyMaterialWithStatus | null;
}

/**
 * Obtiene toda la información necesaria
 * para renderizar el Dashboard.
 */
export async function getDashboardData(): Promise<DashboardData> {
  const profile = await getProfile();

  if (!profile) {
    throw new Error("No se ha podido cargar el perfil.");
  }

  const region = profile.region as Region;

  const [
    questionnaireResult,
    availableSessions,
    availableMaterials,
    nextSession,
    nextMaterial,
  ] = await Promise.all([
    supabase
      .from("questionnaire_submissions")
      .select("id")
      .eq("user_id", profile.id)
      .eq("questionnaire_type", "pre")
      .maybeSingle(),

    getAvailableSessions(region),

    getAvailableStudyMaterials(region),

    getNextSession(region),

    getNextStudyMaterial(region),
  ]);

  return {
    participantName:
      profile.email.split("@")[0],

    questionnaireCompleted:
      questionnaireResult.data !== null,

    /**
     * Temporal.
     *
     * Cuando exista una tabla que registre
     * el progreso del participante deberá
     * sustituirse esta lógica.
     */
    sessionsCompleted:
      availableSessions.length > 0,

    /**
     * Temporal.
     */
    materialsCompleted:
      availableMaterials.length > 0,

    /**
     * Pendiente de implementar cuando
     * exista el flujo del cuestionario POST.
     */
    postCompleted: false,

    nextSession,

    nextMaterial,
  };
}