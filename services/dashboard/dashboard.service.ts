import { getProfile } from "@/lib/supabase/getProfile";

import { getQuestionnaireState } from "@/services/questionnaires/questionnaire.service";

import {
  getSessions,
  getNextSession,
} from "@/services/sessions/study-session.service";

import { getCompletedSessionsCount } from "@/services/sessions/session-progress.service";

import {
  getStudyMaterials,
  getNextStudyMaterial,
} from "@/services/resources/study-material.service";

import { getCompletedMaterialsCount } from "@/services/resources/material-progress.service";

import type { SessionWithStatus } from "@/types/study-session";
import type { StudyMaterialWithStatus } from "@/types/study-material";
import type { QuestionnaireProgress } from "@/types/questionnaire";

export interface DashboardData {
  participantCode: string;

  preCompleted: boolean;

  postCompleted: boolean;

  completedSessions: number;

  totalSessions: number;

  completedMaterials: number;

  totalMaterials: number;

  nextSession: SessionWithStatus | null;

  nextMaterial: StudyMaterialWithStatus | null;
}

/**
 * Obtiene toda la información
 * necesaria para el Dashboard.
 */
export async function getDashboardData(): Promise<DashboardData> {
  const profile = await getProfile();

  if (!profile) {
    throw new Error(
      "No se ha podido cargar el perfil del usuario.",
    );
  }

  const [
    questionnaireProgress,
    sessions,
    materials,
    completedSessions,
    completedMaterials,
    nextSession,
    nextMaterial,
  ] = await Promise.all([
    getQuestionnaireState(),

    getSessions(),

    getStudyMaterials(),

    getCompletedSessionsCount(),

    getCompletedMaterialsCount(),

    getNextSession(),

    getNextStudyMaterial(),
  ]);

  const {
    preCompleted,
    postCompleted,
  } =
    questionnaireProgress as QuestionnaireProgress;

  return {
    participantCode:
      profile.participantCode,

    preCompleted,

    postCompleted,

    completedSessions,

    totalSessions:
      sessions.length,

    completedMaterials,

    totalMaterials:
      materials.length,

    nextSession,

    nextMaterial,
  };
}