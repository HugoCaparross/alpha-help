import QuestionnaireIntroduction from "@/components/private/cuestionarios/QuestionnaireIntroduction";

interface QuestionnairePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function QuestionnairePage({
  params,
}: QuestionnairePageProps) {
  const { id } = await params;

  return (
    <QuestionnaireIntroduction
      questionnaireId={id}
    />
  );
}