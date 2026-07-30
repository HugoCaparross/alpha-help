"use client";

import { useEffect, useRef, useState } from "react";

import QuestionCard from "./QuestionCard";
import QuestionnaireProgress from "./QuestionnaireProgress";

import {
  QUESTIONNAIRE_STEPS,
  CAPSM_QUESTIONS,
  PSOC_QUESTIONS,
  ECPP_QUESTIONS,
  PSS_QUESTIONS,
  KIDSCREEN_QUESTIONS,
} from "@/lib/constants/questionnaires";

import {
  submitQuestionnaire,
  type QuestionnaireAnswers,
} from "@/services/questionnaires/questionnaire.service";

import type { QuestionnaireType } from "@/types/questionnaire";

interface QuestionBlockProps {
  questionnaireId: QuestionnaireType;

  onComplete: () => void;
}

const AUTO_ADVANCE_DELAY = 350;

const QUESTIONS_BY_STEP = {
  capsm: CAPSM_QUESTIONS,
  psoc: PSOC_QUESTIONS,
  ecpp: ECPP_QUESTIONS,
  pss: PSS_QUESTIONS,
  kidscreen: KIDSCREEN_QUESTIONS,
} as const;

const ALL_QUESTIONS = [
  ...CAPSM_QUESTIONS,
  ...PSOC_QUESTIONS,
  ...ECPP_QUESTIONS,
  ...PSS_QUESTIONS,
  ...KIDSCREEN_QUESTIONS,
];

const TOTAL_QUESTIONS = ALL_QUESTIONS.length;

/**
 * Longitud de cada bloque del cuestionario.
 */
const QUESTIONNAIRE_SEGMENTS = [
  CAPSM_QUESTIONS.length,
  PSOC_QUESTIONS.length,
  ECPP_QUESTIONS.length,
  PSS_QUESTIONS.length,
  KIDSCREEN_QUESTIONS.length,
] as const;

const QUESTION_INDEX = new Map(
  ALL_QUESTIONS.map((question, index) => [question.id, index + 1]),
);

const REQUIRED_QUESTION_IDS = ALL_QUESTIONS.filter(
  (question) => question.required,
).map((question) => question.id);

const ERROR_MESSAGES = {
  incomplete:
    "Debes responder todas las preguntas antes de finalizar el cuestionario.",

  submit: "Ha ocurrido un error al guardar tus respuestas. Inténtalo de nuevo.",
} as const;

/**
 * Gestiona el flujo completo
 * del cuestionario.
 */
export default function QuestionBlock({
  questionnaireId,
  onComplete,
}: QuestionBlockProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});

  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const autoAdvanceTimeout = useRef<number | null>(null);

  const currentStep = QUESTIONNAIRE_STEPS[currentStepIndex];

  const currentStepQuestions =
    QUESTIONS_BY_STEP[currentStep.id as keyof typeof QUESTIONS_BY_STEP];

  const currentQuestion = currentStepQuestions[currentQuestionIndex];

  const sectionTitle = currentStep.title;

  const isFirstStep = currentStepIndex === 0;

  const isLastStep = currentStepIndex === QUESTIONNAIRE_STEPS.length - 1;

  const isFirstQuestion = currentQuestionIndex === 0;

  const isLastQuestionInStep =
    currentQuestionIndex === currentStepQuestions.length - 1;

  const questionnaireCompleted = REQUIRED_QUESTION_IDS.every(
    (questionId) => answers[questionId] !== undefined,
  );

  const currentQuestionPosition = currentQuestion
    ? (QUESTION_INDEX.get(currentQuestion.id) ?? 1)
    : 1;

  /**
   * Cancela cualquier avance automático
   * pendiente.
   */
  function clearAutoAdvanceTimeout() {
    if (autoAdvanceTimeout.current !== null) {
      window.clearTimeout(autoAdvanceTimeout.current);

      autoAdvanceTimeout.current = null;
    }
  }

  useEffect(() => {
    return () => {
      clearAutoAdvanceTimeout();
    };
  }, []);

  /**
   * Envía el cuestionario
   * al servidor.
   */
  async function finishQuestionnaire() {
    if (!questionnaireCompleted) {
      setError(ERROR_MESSAGES.incomplete);

      setIsTransitioning(false);

      return;
    }

    try {
      setIsSubmitting(true);

      await submitQuestionnaire(questionnaireId, answers);

      onComplete();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }

      setError(ERROR_MESSAGES.submit);

      setIsSubmitting(false);

      setIsTransitioning(false);
    }
  }

  /**
   * Avanza automáticamente
   * a la siguiente pregunta
   * o bloque.
   */
  async function goToNextQuestion() {
    if (!currentQuestion || isSubmitting) {
      return;
    }

    if (!isLastQuestionInStep) {
      setCurrentQuestionIndex((previous) => previous + 1);

      setIsTransitioning(false);

      return;
    }

    if (!isLastStep) {
      setCurrentStepIndex((previous) => previous + 1);

      setCurrentQuestionIndex(0);

      setIsTransitioning(false);

      return;
    }

    await finishQuestionnaire();
  }

  /**
   * Guarda una respuesta y
   * programa el avance automático.
   */
  function handleAnswerChange(questionId: string, value: number) {
    if (isSubmitting || isTransitioning) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));

    setError(null);

    setIsTransitioning(true);

    clearAutoAdvanceTimeout();

    autoAdvanceTimeout.current = window.setTimeout(() => {
      void goToNextQuestion();
    }, AUTO_ADVANCE_DELAY);
  }
  /**
   * Regresa a la pregunta
   * anterior.
   */
  function handlePrevious() {
    if (isSubmitting || isTransitioning) {
      return;
    }

    clearAutoAdvanceTimeout();

    setError(null);

    if (!isFirstQuestion) {
      setCurrentQuestionIndex((previous) => previous - 1);

      return;
    }

    if (!isFirstStep) {
      const previousStepIndex = currentStepIndex - 1;

      const previousStep = QUESTIONNAIRE_STEPS[previousStepIndex];

      const previousQuestions =
        QUESTIONS_BY_STEP[previousStep.id as keyof typeof QUESTIONS_BY_STEP];

      setCurrentStepIndex(previousStepIndex);

      setCurrentQuestionIndex(previousQuestions.length - 1);
    }
  }

  /**
   * Avanza manualmente a la
   * siguiente pregunta.
   */
  function handleNext() {
    if (
      !currentQuestion ||
      isSubmitting ||
      isTransitioning ||
      answers[currentQuestion.id] === undefined
    ) {
      return;
    }

    clearAutoAdvanceTimeout();

    void goToNextQuestion();
  }

  const canGoNext =
    currentQuestion &&
    answers[currentQuestion.id] !== undefined &&
    !(isSubmitting || isTransitioning);

  return (
    <section className="question-block">
      <QuestionnaireProgress
        questionnaireTitle={sectionTitle}
        currentStep={currentQuestionPosition}
        totalSteps={TOTAL_QUESTIONS}
        segments={QUESTIONNAIRE_SEGMENTS}
      />

      <div className="question-block__body">
        <div
          className={`question-block__questions ${
            isTransitioning ? "question-block__questions--transition" : ""
          }`}
        >
          {currentQuestion && (
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              questionNumber={currentQuestionPosition}
              selectedValue={answers[currentQuestion.id]}
              showError={Boolean(error)}
              disabled={isSubmitting || isTransitioning}
              showPrevious={!(isFirstStep && isFirstQuestion)}
              showNext={canGoNext}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onChange={handleAnswerChange}
            />
          )}
        </div>

        {error && (
          <div
            className="question-block__error"
            role="alert"
            aria-live="polite"
          >
            <p>{error}</p>
          </div>
        )}
      </div>
    </section>
  );
}
