"use client";

import { useState } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { SPAIN_SCHOOLS, LATAM_SCHOOLS } from "@/lib/constants";

import { schoolSchema } from "@/validators";

import type { RegisterData } from "./register.types";

interface Props {
  formData: RegisterData;

  setFormData: React.Dispatch<React.SetStateAction<RegisterData>>;

  nextStep: () => void;

  previousStep: () => void;
}

export default function RegisterStepSchool({
  formData,
  setFormData,
  nextStep,
  previousStep,
}: Props) {
  const [error, setError] = useState("");

  function updateField<K extends keyof RegisterData>(
    field: K,
    value: RegisterData[K],
  ) {
    setError("");

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function validateStep() {
    const result = schoolSchema.safeParse({
      schoolCenter: formData.schoolCenter,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);

      return;
    }

    setError("");

    nextStep();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    validateStep();
  }

  const schools = formData.region === "spain" ? SPAIN_SCHOOLS : LATAM_SCHOOLS;

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="step-title">Centro escolar</h2>
      <p className="step-description">
        Selecciona el centro escolar al que acuden tus hijos.
      </p>
      <div className="auth-field">
        <label className="auth-label">Centro escolar</label>

        <select
          className="auth-input"
          value={formData.schoolCenter}
          onChange={(e) => updateField("schoolCenter", e.target.value)}
        >
          <option value="">Selecciona una opción</option>

          {schools.map((school) => (
            <option key={school} value={school}>
              {school}
            </option>
          ))}
        </select>
      </div>{" "}
      {error && (
        <p className="auth-error" role="alert" aria-live="polite">
          {error}
        </p>
      )}
      <div className="step-actions">
        <button type="button" className="btn-secondary" onClick={previousStep}>
          <ArrowLeft size={18} />
          Atrás
        </button>

        <button type="submit" className="btn-primary">
          Continuar
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
