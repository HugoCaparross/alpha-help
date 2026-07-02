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

import type { QuestionnaireType } from "@/types/questionnaire";

import { submitQuestionnaire } from "@/services/questionnaires/questionnaire.service";

interface QuestionBlockProps {
  questionnaireId: QuestionnaireType;
  onComplete: () => void;
}

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

const REQUIRED_QUESTION_IDS = ALL_QUESTIONS.filter(
  (question) => question.required,
).map((question) => question.id);

const ERROR_MESSAGES = {
  incomplete:
    "Debes responder todas las preguntas antes de finalizar el cuestionario.",

  submit: "Ha ocurrido un error al guardar tus respuestas. Inténtalo de nuevo.",
} as const;

export default function QuestionBlock({
  questionnaireId,
  onComplete,
}: QuestionBlockProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<string, number>>({});

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

  const currentQuestionPosition =
    ALL_QUESTIONS.findIndex((question) => question.id === currentQuestion?.id) +
    1;

  const totalQuestions = ALL_QUESTIONS.length;

  function clearAutoAdvanceTimeout() {
    if (autoAdvanceTimeout.current) {
      window.clearTimeout(autoAdvanceTimeout.current);

      autoAdvanceTimeout.current = null;
    }
  }

  useEffect(() => {
    return () => {
      clearAutoAdvanceTimeout();
    };
  }, []);

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
    } catch {
      setError(ERROR_MESSAGES.submit);

      setIsSubmitting(false);

      setIsTransitioning(false);
    }
  }

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
    }, 350);
  }

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
  return (
    <section className="question-block">
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
              onPrevious={handlePrevious}
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

      <QuestionnaireProgress
        questionnaireTitle={sectionTitle}
        currentStep={currentQuestionPosition}
        totalSteps={totalQuestions}
      />
    </section>
  );
}
