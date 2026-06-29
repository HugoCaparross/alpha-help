import { notFound } from "next/navigation";

import QuestionnaireFlow from "@/components/questionnaires/QuestionnaireFlow";

interface QuestionnairePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function QuestionnairePage({
  params,
}: QuestionnairePageProps) {
  const { id } = await params;

  const isValidQuestionnaire = id === "pre" || id === "post";

  if (!isValidQuestionnaire) {
    notFound();
  }

  return <QuestionnaireFlow questionnaireId={id} />;
}
