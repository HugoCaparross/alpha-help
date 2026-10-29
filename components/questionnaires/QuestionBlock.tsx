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

const ERROR_MESSAGES = {
  submit: "Ha ocurrido un error al guardar tus respuestas. Inténtalo de nuevo.",
} as const;

export default function QuestionBlock({
  questionnaireId,
  onComplete,
}: QuestionBlockProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
  const answersRef = useRef<QuestionnaireAnswers>({});
  const isSubmittingRef = useRef(false);
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

  const currentQuestionPosition = currentQuestion
    ? (QUESTION_INDEX.get(currentQuestion.id) ?? 1)
    : 1;

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

  async function finishQuestionnaire(
    answersToSubmit = answersRef.current,
  ) {
    if (isSubmittingRef.current) {
      return;
    }

    try {
      isSubmittingRef.current = true;
      setIsSubmitting(true);
      setIsTransitioning(false);

      await submitQuestionnaire(questionnaireId, answersToSubmit);

      onComplete();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }

      setError(ERROR_MESSAGES.submit);
      setIsSubmitting(false);
      isSubmittingRef.current = false;
      setIsTransitioning(false);
    }
  }

  async function goToNextQuestion(
    answersToSubmit = answersRef.current,
  ) {
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

    await finishQuestionnaire(answersToSubmit);
  }

  function handleAnswerChange(questionId: string, value: number) {
    if (isSubmitting || isTransitioning || isSubmittingRef.current) {
      return;
    }

    const nextAnswers = {
      ...answersRef.current,
      [questionId]: value,
    };

    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);
    setError(null);
    clearAutoAdvanceTimeout();

    if (isLastStep && isLastQuestionInStep) {
      void finishQuestionnaire(nextAnswers);
      return;
    }

    setIsTransitioning(true);

    autoAdvanceTimeout.current = window.setTimeout(() => {
      void goToNextQuestion(answersRef.current);
    }, AUTO_ADVANCE_DELAY);
  }

  function handlePrevious() {
    if (isSubmitting || isTransitioning || isSubmittingRef.current) {
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

  function handleNext() {
    if (
      !currentQuestion ||
      isSubmitting ||
      isTransitioning ||
      answersRef.current[currentQuestion.id] === undefined
    ) {
      return;
    }

    clearAutoAdvanceTimeout();
    void goToNextQuestion(answersRef.current);
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
          className={`question-block__questions ${isTransitioning ? "question-block__questions--transition" : ""
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