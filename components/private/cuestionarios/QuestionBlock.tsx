"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
  type QuestionnaireType,
} from "@/services/supabase/questionnaire.service";

interface QuestionBlockProps {
  questionnaireId: string;
  onComplete: () => void;
}

export default function QuestionBlock({
  questionnaireId,
  onComplete,
}: QuestionBlockProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<string, number>>({});

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const autoAdvanceTimeout = useRef<number | null>(null);

  const currentStep = QUESTIONNAIRE_STEPS[currentStepIndex];

  const sectionTitle = currentStep.title;

  const isFirstStep = currentStepIndex === 0;

  const isLastStep = currentStepIndex === QUESTIONNAIRE_STEPS.length - 1;

  const questions = useMemo(() => {
    switch (currentStep.id) {
      case "capsm":
        return CAPSM_QUESTIONS;

      case "psoc":
        return PSOC_QUESTIONS;

      case "ecpp":
        return ECPP_QUESTIONS;

      case "pss":
        return PSS_QUESTIONS;

      case "kidscreen":
        return KIDSCREEN_QUESTIONS;

      default:
        return [];
    }
  }, [currentStep.id]);

  const questionsByStep = useMemo(
    () => ({
      capsm: CAPSM_QUESTIONS,
      psoc: PSOC_QUESTIONS,
      ecpp: ECPP_QUESTIONS,
      pss: PSS_QUESTIONS,
      kidscreen: KIDSCREEN_QUESTIONS,
    }),
    [],
  );

  const currentQuestion = questions[currentQuestionIndex];

  const isFirstQuestion = currentQuestionIndex === 0;

  const isLastQuestionInStep = currentQuestionIndex === questions.length - 1;

  const allQuestions = [
    ...CAPSM_QUESTIONS,
    ...PSOC_QUESTIONS,
    ...ECPP_QUESTIONS,
    ...PSS_QUESTIONS,
    ...KIDSCREEN_QUESTIONS,
  ];

  const requiredQuestionIds = allQuestions
    .filter((question) => question.required)
    .map((question) => question.id);

  const isQuestionnaireCompleted = requiredQuestionIds.every(
    (questionId) => answers[questionId] !== undefined,
  );

  const currentQuestionPosition =
    allQuestions.findIndex((question) => question.id === currentQuestion?.id) +
    1;

  const totalQuestions = allQuestions.length;

  useEffect(() => {
    return () => {
      if (autoAdvanceTimeout.current) {
        window.clearTimeout(autoAdvanceTimeout.current);
      }
    };
  }, []);

  const goToNextQuestion = async () => {
    if (!currentQuestion || isSubmitting) {
      return;
    }

    if (!isLastQuestionInStep) {
      setCurrentQuestionIndex((prev) => prev + 1);

      setIsTransitioning(false);

      return;
    }

    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);

      setCurrentQuestionIndex(0);

      setIsTransitioning(false);

      return;
    }

    if (!isQuestionnaireCompleted) {
      setError(
        "Debes completar todas las preguntas del cuestionario antes de finalizar la evaluación.",
      );

      setIsTransitioning(false);

      return;
    }

    try {
      setIsSubmitting(true);

      await submitQuestionnaire(questionnaireId as QuestionnaireType, answers);

      onComplete();
    } catch {
      setError(
        "Ha ocurrido un error al guardar las respuestas. Inténtalo de nuevo.",
      );

      setIsSubmitting(false);
      setIsTransitioning(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: number) => {
    if (isSubmitting || isTransitioning) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    setError("");

    setIsTransitioning(true);

    if (autoAdvanceTimeout.current) {
      window.clearTimeout(autoAdvanceTimeout.current);
    }

    autoAdvanceTimeout.current = window.setTimeout(() => {
      void goToNextQuestion();
    }, 350);
  };

  const handlePrevious = () => {
    if (isSubmitting || isTransitioning) {
      return;
    }

    if (autoAdvanceTimeout.current) {
      window.clearTimeout(autoAdvanceTimeout.current);
    }

    setError("");

    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);

      return;
    }

    if (!isFirstStep) {
      const previousStepIndex = currentStepIndex - 1;

      const previousStep = QUESTIONNAIRE_STEPS[previousStepIndex];

      const previousQuestions =
        questionsByStep[previousStep.id as keyof typeof questionsByStep];

      setCurrentStepIndex(previousStepIndex);

      setCurrentQuestionIndex(previousQuestions.length - 1);
    }
  };

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
              showError={!!error}
              disabled={isTransitioning}
              showPrevious={!(isFirstStep && isFirstQuestion)}
              onPrevious={handlePrevious}
              onChange={handleAnswerChange}
            />
          )}
        </div>

        {error && (
          <div className="question-block__error">
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
