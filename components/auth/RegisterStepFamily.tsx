"use client";

import { useState } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { familySchema } from "@/validators";

import {
  SOCIOECONOMIC_LEVELS,
  SCHOOL_TYPES,
  FAMILY_STRUCTURES,
} from "@/lib/constants";

import type { RegisterData } from "./register.types";

interface Props {
  formData: RegisterData;

  setFormData: React.Dispatch<React.SetStateAction<RegisterData>>;

  nextStep: () => void;

  previousStep: () => void;
}

export default function RegisterStepFamily({
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
    const result = familySchema.safeParse({
      socioeconomicLevel: formData.socioeconomicLevel,

      schoolType: formData.schoolType,

      numberOfChildren: formData.numberOfChildren,

      familyStructure: formData.familyStructure,
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
      <h2 className="step-title">Información familiar</h2>
      <p className="step-description">
        Queremos conocer mejor el entorno familiar para contextualizar la
        participación en el estudio.
      </p>
      {/* NIVEL SOCIOECONÓMICO */}
      <div className="auth-field">
        <label className="auth-label">Nivel socioeconómico familiar</label>

        <select
          className="auth-input"
          value={formData.socioeconomicLevel}
          onChange={(e) => updateField("socioeconomicLevel", e.target.value)}
        >
          <option value="">Selecciona una opción</option>

          {SOCIOECONOMIC_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>
      {/* TIPO DE CENTRO */}
      <div className="auth-field">
        <label className="auth-label">
          Centro escolar al que acuden mis hijos
        </label>

        <select
          className="auth-input"
          value={formData.schoolType}
          onChange={(e) => updateField("schoolType", e.target.value)}
        >
          <option value="">Selecciona una opción</option>

          {SCHOOL_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>{" "}
      {/* NÚMERO DE HIJOS */}
      <div className="auth-field">
        <label className="auth-label">Número de hijos/as</label>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="auth-input"
          placeholder="Número de hijos"
          value={formData.numberOfChildren}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");

            if (value.length <= 1) {
              updateField("numberOfChildren", value);
            }
          }}
        />
      </div>
      {/* ESTRUCTURA FAMILIAR */}
      <div className="auth-field">
        <label className="auth-label">Tipo de estructura familiar</label>

        <select
          className="auth-input"
          value={formData.familyStructure}
          onChange={(e) => updateField("familyStructure", e.target.value)}
        >
          <option value="">Selecciona una opción</option>

          {FAMILY_STRUCTURES.map((structure) => (
            <option key={structure} value={structure}>
              {structure}
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
