import { supabase } from "@/lib/supabase/client";
import { getUser } from "@/lib/supabase/getUser";

export type QuestionnaireType =
  | "pre"
  | "post";

export interface QuestionnaireAnswers {
  [questionId: string]: number;
}

export async function submitQuestionnaire(
  questionnaireType: QuestionnaireType,
  answers: QuestionnaireAnswers,
) {
  const user = await getUser();

  if (!user) {
    throw new Error(
      "Usuario no autenticado.",
    );
  }

  if (Object.keys(answers).length === 0) {
    throw new Error(
      "No se han proporcionado respuestas.",
    );
  }

  const alreadyCompleted =
    await hasCompletedQuestionnaire(
      questionnaireType,
    );

  if (alreadyCompleted) {
    throw new Error(
      "Este cuestionario ya ha sido completado.",
    );
  }

  if (questionnaireType === "post") {
    const preCompleted =
      await hasCompletedQuestionnaire(
        "pre",
      );

    if (!preCompleted) {
      throw new Error(
        "Debes completar primero la evaluación inicial.",
      );
    }
  }

  const {
    data: submission,
    error: submissionError,
  } = await supabase
    .from(
      "questionnaire_submissions",
    )
    .insert({
      user_id: user.id,
      questionnaire_type:
        questionnaireType,
    })
    .select()
    .single();

  if (submissionError) {
    throw submissionError;
  }

  const responses = Object.entries(
    answers,
  ).map(
    ([questionKey, answer]) => ({
      submission_id:
        submission.id,
      user_id: user.id,
      questionnaire_type:
        questionnaireType,
      question_key:
        questionKey,
      answer,
    }),
  );

  const {
    error: responsesError,
  } = await supabase
    .from(
      "questionnaire_responses",
    )
    .insert(responses);

  if (responsesError) {
    await supabase
      .from(
        "questionnaire_submissions",
      )
      .delete()
      .eq(
        "id",
        submission.id,
      );

    throw responsesError;
  }

  return submission;
}

export async function hasCompletedQuestionnaire(
  questionnaireType: QuestionnaireType,
) {
  const user = await getUser();

  if (!user) {
    return false;
  }

  const { data, error } =
    await supabase
      .from(
        "questionnaire_submissions",
      )
      .select("id")
      .eq(
        "user_id",
        user.id,
      )
      .eq(
        "questionnaire_type",
        questionnaireType,
      )
      .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

export async function getCompletedQuestionnaires() {
  const user = await getUser();

  if (!user) {
    return [];
  }

  const { data, error } =
    await supabase
      .from(
        "questionnaire_submissions",
      )
      .select(
        "questionnaire_type",
      )
      .eq(
        "user_id",
        user.id,
      );

  if (error) {
    throw error;
  }

  return data.map(
    (item) =>
      item.questionnaire_type,
  ) as QuestionnaireType[];
}