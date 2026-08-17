"use client";

import {
  useState,
  type FormEvent,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { getSchools } from "@/lib/constants";
import { schoolSchema } from "@/validators";

import type { RegisterData } from "./register.types";

interface Props {
  formData: RegisterData;

  setFormData: React.Dispatch<
    React.SetStateAction<RegisterData>
  >;

  nextStep: () => void;

  previousStep: () => void;
}

export default function RegisterStepSchool({
  formData,
  setFormData,
  nextStep,
  previousStep,
}: Props) {
  const [error, setError] =
    useState("");

  function updateField<K extends keyof RegisterData>(
    field: K,
    value: RegisterData[K],
  ) {
    setError("");

    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function validateStep(): boolean {
    const result =
      schoolSchema.safeParse({
        schoolCenter:
          formData.schoolCenter,
      });

    if (!result.success) {
      setError(
        result.error.issues[0]?.message ??
        "Selecciona un centro escolar.",
      );

      return false;
    }

    return true;
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!validateStep()) {
      return;
    }

    nextStep();
  }

  const schools = formData.region
    ? getSchools(formData.region)
    : [];

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className="step-title">
        Centro escolar
      </h2>

      <p className="step-description">
        Selecciona el centro escolar al que
        acuden tus hijos.
      </p>

      <div className="auth-field">
        <label
          htmlFor="school-center"
          className="auth-label"
        >
          Centro escolar
        </label>

        <select
          id="school-center"
          className="auth-input"
          value={formData.schoolCenter}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? "school-center-error"
              : undefined
          }
          disabled={!formData.region}
          onChange={(event) =>
            updateField(
              "schoolCenter",
              event.target.value,
            )
          }
        >
          <option value="">
            {formData.region
              ? "Selecciona una opción"
              : "Selecciona primero tu región"}
          </option>

          {schools.map((school) => (
            <option
              key={school}
              value={school}
            >
              {school}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p
          id="school-center-error"
          className="auth-error"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}

      <div className="step-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={previousStep}
        >
          <ArrowLeft size={18} />
          Atrás
        </button>

        <button
          type="submit"
          className="btn-primary"
        >
          Continuar
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}