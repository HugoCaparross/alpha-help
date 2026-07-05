"use client";

import { useState, type FormEvent } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { participantSchema } from "@/validators";

import {
  EDUCATION_LEVELS,
  EMPLOYMENT_STATUS,
  GENDERS,
  MARITAL_STATUS,
} from "@/lib/constants";

import type { RegisterData } from "./register.types";

interface Props {
  formData: RegisterData;

  setFormData: React.Dispatch<React.SetStateAction<RegisterData>>;

  nextStep: () => void;

  previousStep: () => void;
}

export default function RegisterStepParticipant({
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

    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function validateStep(): boolean {
    const result = participantSchema.safeParse({
      gender: formData.gender,
      age: formData.age,
      educationLevel: formData.educationLevel,
      employmentStatus: formData.employmentStatus,
      maritalStatus: formData.maritalStatus,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);

      return false;
    }

    return true;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateStep()) {
      return;
    }

    nextStep();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="step-title">Datos del participante</h2>

      <p className="step-description">
        Información básica de la persona que participa en el estudio.
      </p>

      {/* SEXO */}

      <div className="auth-field">
        <label htmlFor="gender" className="auth-label">
          Soy...
        </label>

        <select
          id="gender"
          className="auth-input"
          autoComplete="sex"
          aria-invalid={!!error}
          value={formData.gender}
          onChange={(event) => updateField("gender", event.target.value)}
        >
          <option value="">Selecciona una opción</option>

          {GENDERS.map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>
      </div>

      {/* EDAD */}

      <div className="auth-field">
        <label htmlFor="age" className="auth-label">
          Tengo...
        </label>

        <input
          id="age"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="bday-year"
          className="auth-input"
          placeholder="Edad"
          aria-invalid={!!error}
          value={formData.age}
          onChange={(event) => {
            const value = event.target.value.replace(/\D/g, "");

            if (value.length <= 2) {
              updateField("age", value);
            }
          }}
        />
      </div>

      {/* ESTUDIOS */}

      <div className="auth-field">
        <label htmlFor="education-level" className="auth-label">
          Nivel máximo de estudios
        </label>

        <select
          id="education-level"
          className="auth-input"
          aria-invalid={!!error}
          value={formData.educationLevel}
          onChange={(event) =>
            updateField("educationLevel", event.target.value)
          }
        >
          <option value="">Selecciona una opción</option>

          {EDUCATION_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* SITUACIÓN LABORAL */}

      <div className="auth-field">
        <label htmlFor="employment-status" className="auth-label">
          Situación laboral actual
        </label>

        <select
          id="employment-status"
          className="auth-input"
          aria-invalid={!!error}
          value={formData.employmentStatus}
          onChange={(event) =>
            updateField("employmentStatus", event.target.value)
          }
        >
          <option value="">Selecciona una opción</option>

          {EMPLOYMENT_STATUS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* ESTADO CIVIL */}

      <div className="auth-field">
        <label htmlFor="marital-status" className="auth-label">
          Estado civil actual
        </label>

        <select
          id="marital-status"
          className="auth-input"
          aria-invalid={!!error}
          value={formData.maritalStatus}
          onChange={(event) => updateField("maritalStatus", event.target.value)}
        >
          <option value="">Selecciona una opción</option>

          {MARITAL_STATUS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

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
