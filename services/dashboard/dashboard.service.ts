import { getProfile } from "@/lib/supabase/getProfile";

import { getQuestionnaireState } from "@/services/questionnaires/questionnaire.service";
import { getCompletedSessionsCount } from "@/services/sessions/session-progress.service";
import {
  getSessionsWithStatus,
  TOTAL_STUDY_SESSIONS,
} from "@/services/sessions/study-session.service";
import {
  getStudyMaterialsWithStatus,
  TOTAL_STUDY_MATERIALS,
} from "@/services/resources/study-material.service";
import { getCompletedSessionsCount as getCompletedMaterialsCount } from "@/services/resources/material-progress.service";

import type { SessionWithStatus } from "@/types/study-session";
import type { StudyMaterialWithStatus } from "@/types/study-material";

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
 * Obtiene la información necesaria para el Dashboard.
 *
 * Los totales representan los 10 contenidos del programa
 * (Introducción + 9 sesiones), no el número de filas que
 * la RLS devuelva en ese momento.
 */
export async function getDashboardData(): Promise<DashboardData> {
  const profile = await getProfile();

  if (!profile) {
    throw new Error("No se ha podido cargar el perfil del usuario.");
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

  const nextSession =
    sessions.find(({ status }) => status === "locked") ?? null;

  const nextMaterial =
    materials.find(({ status }) => status === "locked") ?? null;

  return {
    participantCode: profile.participantCode,
    preCompleted: questionnaireProgress.preCompleted,
    postCompleted: questionnaireProgress.postCompleted,
    completedSessions: Math.min(completedSessions, TOTAL_STUDY_SESSIONS),
    totalSessions: TOTAL_STUDY_SESSIONS,
    completedMaterials: Math.min(completedMaterials, TOTAL_STUDY_MATERIALS),
    totalMaterials: TOTAL_STUDY_MATERIALS,
    nextSession,
    nextMaterial,
  };
}
