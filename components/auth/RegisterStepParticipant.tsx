"use client";

import { useState } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { participantSchema } from "@/validators";

import {
  GENDERS,
  EDUCATION_LEVELS,
  EMPLOYMENT_STATUS,
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

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function validateStep() {
    const result = participantSchema.safeParse({
      gender: formData.gender,
      age: formData.age,
      educationLevel: formData.educationLevel,
      employmentStatus: formData.employmentStatus,
      maritalStatus: formData.maritalStatus,
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

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="step-title">Datos del participante</h2>
      <p className="step-description">
        Información básica de la persona que participa en el estudio.
      </p>
      {/* SEXO */}
      <div className="auth-field">
        <label className="auth-label">Soy...</label>

        <select
          className="auth-input"
          autoComplete="sex"
          value={formData.gender}
          onChange={(e) => updateField("gender", e.target.value)}
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
        <label className="auth-label">Tengo...</label>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="bday-year"
          className="auth-input"
          placeholder="Edad"
          value={formData.age}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");

            if (value.length <= 2) {
              updateField("age", value);
            }
          }}
        />
      </div>{" "}
      {/* ESTUDIOS */}
      <div className="auth-field">
        <label className="auth-label">Nivel máximo de estudios</label>

        <select
          className="auth-input"
          value={formData.educationLevel}
          onChange={(e) => updateField("educationLevel", e.target.value)}
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
        <label className="auth-label">Situación laboral actual</label>

        <select
          className="auth-input"
          value={formData.employmentStatus}
          onChange={(e) => updateField("employmentStatus", e.target.value)}
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
        <label className="auth-label">Estado civil actual</label>

        <select
          className="auth-input"
          value={formData.maritalStatus}
          onChange={(e) => updateField("maritalStatus", e.target.value)}
        >
          <option value="">Selecciona una opción</option>

          {MARITAL_STATUS.map((status) => (
            <option key={status} value={status}>
              {status}
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
