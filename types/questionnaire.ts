export type QuestionnaireStatus =
  | "pending"
  | "completed";

export interface Questionnaire {
  id: string;
  title: string;
  description: string;
  blocks: number;
  estimatedMinutes: number;
  status: QuestionnaireStatus;
}