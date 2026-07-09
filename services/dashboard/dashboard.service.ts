import { getProfile } from "@/lib/supabase/getProfile";

import { getQuestionnaireState } from "@/services/questionnaires/questionnaire.service";

import { getCompletedSessionsCount } from "@/services/sessions/session-progress.service";

import {
  getSessionsWithStatus,
} from "@/services/sessions/study-session.service";

import {
  getStudyMaterialsWithStatus,
} from "@/services/resources/study-material.service";

import {
  getCompletedSessionsCount as getCompletedMaterialsCount,
} from "@/services/resources/material-progress.service";

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
  ] = await Promise.all([
    getQuestionnaireState(),

    getSessionsWithStatus(),

    getStudyMaterialsWithStatus(),

    getCompletedSessionsCount(),

    getCompletedMaterialsCount(),
  ]);

  const {
    preCompleted,
    postCompleted,
  } =
    questionnaireProgress as QuestionnaireProgress;

  const nextSession =
    sessions.find(
      ({ status }) =>
        status === "locked",
    ) ?? null;

  const nextMaterial =
    materials.find(
      ({ status }) =>
        status === "locked",
    ) ?? null;

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