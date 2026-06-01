"use client";

import { useState } from "react";

import QuestionBlock from "./QuestionBlock";

import {
  QUESTIONNAIRE_STEPS,
  DEMOGRAPHIC_FIELDS,
  CAPSM_QUESTIONS,
  PSOC_QUESTIONS,
  ECPP_QUESTIONS,
  PSS_QUESTIONS,
  KIDSCREEN_QUESTIONS,
} from "@/lib/constants/questionnaires";

export default function QuestionnaireForm() {
  const [step, setStep] = useState(0);

  const [answers, setAnswers] = useState<Record<string, any>>({});

  const currentStep = QUESTIONNAIRE_STEPS[step];

  function updateAnswer(key: string, value: any) {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function isCurrentStepValid() {
    if (currentStep.id === "demographics") {
      return (
        answers.gender && answers.age && answers.education && answers.employment
      );
    }

    if (currentStep.id === "capsm") {
      return CAPSM_QUESTIONS.every((question) => answers[question.id]);
    }

    if (currentStep.id === "psoc") {
      return PSOC_QUESTIONS.every((question) => answers[question.id]);
    }

    if (currentStep.id === "ecpp") {
      return ECPP_QUESTIONS.every((question) => answers[question.id]);
    }

    if (currentStep.id === "pss") {
      return PSS_QUESTIONS.every((question) => answers[question.id]);
    }

    if (currentStep.id === "kidscreen") {
      return KIDSCREEN_QUESTIONS.every((question) => answers[question.id]);
    }

    return false;
  }

  const canContinue = isCurrentStepValid();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <h1 className="text-2xl font-bold">{currentStep.title}</h1>

          <span className="text-sm text-slate-500">
            {step + 1} / {QUESTIONNAIRE_STEPS.length}
          </span>
        </div>

        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-500 transition-all"
            style={{
              width: `${((step + 1) / QUESTIONNAIRE_STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8">
        {currentStep.id === "demographics" && (
          <div className="space-y-6">
            {DEMOGRAPHIC_FIELDS.map((field) => (
              <div key={field.id}>
                <label className="block mb-2 font-medium">{field.label}</label>

                {field.type === "number" && (
                  <input
                    type="number"
                    value={answers[field.id] || ""}
                    onChange={(e) => updateAnswer(field.id, e.target.value)}
                    className="w-full border rounded-xl p-3"
                  />
                )}

                {field.type === "select" && (
                  <select
                    value={answers[field.id] || ""}
                    onChange={(e) => updateAnswer(field.id, e.target.value)}
                    className="w-full border rounded-xl p-3"
                  >
                    <option value="">Seleccione una opción</option>

                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        )}

        {currentStep.id === "capsm" && (
          <QuestionBlock
            questions={CAPSM_QUESTIONS}
            answers={answers}
            updateAnswer={updateAnswer}
          />
        )}

        {currentStep.id === "psoc" && (
          <QuestionBlock
            questions={PSOC_QUESTIONS}
            answers={answers}
            updateAnswer={updateAnswer}
          />
        )}

        {currentStep.id === "ecpp" && (
          <QuestionBlock
            questions={ECPP_QUESTIONS}
            answers={answers}
            updateAnswer={updateAnswer}
          />
        )}

        {currentStep.id === "pss" && (
          <QuestionBlock
            questions={PSS_QUESTIONS}
            answers={answers}
            updateAnswer={updateAnswer}
          />
        )}

        {currentStep.id === "kidscreen" && (
          <QuestionBlock
            questions={KIDSCREEN_QUESTIONS}
            answers={answers}
            updateAnswer={updateAnswer}
          />
        )}
      </div>

      {!canContinue && (
        <p className="mt-4 text-sm text-red-500">
          Debes responder todas las preguntas para continuar.
        </p>
      )}

      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="px-5 py-3 rounded-xl border disabled:opacity-50"
        >
          Anterior
        </button>

        <button
          type="button"
          onClick={() => console.log(answers)}
          className="px-4 py-2 text-sm rounded-xl border border-slate-300 hover:bg-slate-50"
        >
          Ver respuestas
        </button>

        <button
          onClick={() => setStep(step + 1)}
          disabled={step === QUESTIONNAIRE_STEPS.length - 1 || !canContinue}
          className="px-5 py-3 rounded-xl bg-sky-500 text-white disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
