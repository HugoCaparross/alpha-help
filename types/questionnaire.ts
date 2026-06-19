export type QuestionnaireStatus =
  | "pending"
  | "completed"
  | "locked";

export interface Questionnaire {
  id: "pre" | "post";
  title: string;
  description: string;
  blocks: number;
  estimatedMinutes: number;
  status: QuestionnaireStatus;
}