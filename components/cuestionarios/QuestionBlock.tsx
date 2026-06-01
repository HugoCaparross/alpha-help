import LikertQuestion from "./LikertQuestion";

import { SCALES } from "@/lib/constants/questionnaires";

interface Props {
  questions: {
    id: string;
    question: string;
    scaleType: keyof typeof SCALES;
  }[];

  answers: Record<string, any>;

  updateAnswer: (key: string, value: number) => void;
}

export default function QuestionBlock({
  questions,
  answers,
  updateAnswer,
}: Props) {
  return (
    <div className="space-y-8">
      {questions.map((question) => (
        <LikertQuestion
          key={question.id}
          question={question.question}
          options={SCALES[question.scaleType]}
          value={answers[question.id]}
          onChange={(value) => updateAnswer(question.id, value)}
        />
      ))}
    </div>
  );
}
