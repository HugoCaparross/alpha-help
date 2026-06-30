import { notFound } from "next/navigation";

import QuestionnaireFlow from "@/components/questionnaires/QuestionnaireFlow";

const VALID_QUESTIONNAIRES = [
  "pre",
  "post",
] as const;

type QuestionnaireId =
  (typeof VALID_QUESTIONNAIRES)[number];

interface QuestionnairePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function QuestionnairePage({
  params,
}: QuestionnairePageProps) {
  const { id } = await params;

  if (
    !VALID_QUESTIONNAIRES.includes(
      id as QuestionnaireId,
    )
  ) {
    notFound();
  }

  return (
    <QuestionnaireFlow
      questionnaireId={
        id as QuestionnaireId
      }
    />
  );
}