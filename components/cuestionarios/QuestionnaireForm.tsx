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
      return DEMOGRAPHIC_FIELDS.every(
        (field) => answers[field.id] !== undefined && answers[field.id] !== "",
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
          <p className="text-slate-500 mt-2">{currentStep.description}</p>

          <span className="text-sm text-slate-500">
            Paso {step + 1} de {QUESTIONNAIRE_STEPS.length}
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
                <label className="block mb-2 font-medium">
                  {field.label} *
                </label>

                {field.type === "text" && (
                  <input
                    type="text"
                    value={answers[field.id] || ""}
                    onChange={(e) => updateAnswer(field.id, e.target.value)}
                    className="w-full border rounded-xl p-3"
                  />
                )}

                {field.id === "age" && (
                  <select
                    value={answers.age || ""}
                    onChange={(e) =>
                      updateAnswer("age", Number(e.target.value))
                    }
                    className="w-full border rounded-xl p-3"
                  >
                    <option value="">Seleccione edad</option>

                    {Array.from({ length: 82 }, (_, i) => i + 18).map((age) => (
                      <option key={age} value={age}>
                        {age}
                      </option>
                    ))}
                  </select>
                )}

                {field.id === "child_age" && (
                  <select
                    value={answers.child_age || ""}
                    onChange={(e) =>
                      updateAnswer("child_age", Number(e.target.value))
                    }
                    className="w-full border rounded-xl p-3"
                  >
                    <option value="">Seleccione edad</option>

                    {Array.from({ length: 18 }, (_, i) => i).map((age) => (
                      <option key={age} value={age}>
                        {age}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === "select" &&
                  field.id !== "age" &&
                  field.id !== "child_age" && (
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
          Debes completar todos los campos obligatorios para continuar.
        </p>
      )}

      {currentStep.id === "demographics" &&
        answers.age &&
        Number(answers.age) < 18 && (
          <p className="mt-2 text-sm text-red-500">
            Debes ser mayor de edad para participar en el estudio.
          </p>
        )}

      <div className="flex items-center justify-between mt-8">
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="px-5 py-3 rounded-xl border disabled:opacity-50"
        >
          Anterior
        </button>

        <button
          type="button"
          onClick={() => {
            if (step < QUESTIONNAIRE_STEPS.length - 1) {
              setStep(step + 1);
            } else {
              console.log("Finalizar cuestionario");
            }
          }}
          disabled={!canContinue}
          className="px-5 py-3 rounded-xl bg-sky-500 text-white disabled:opacity-50"
        >
          {step === QUESTIONNAIRE_STEPS.length - 1
            ? "Finalizar cuestionario"
            : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
