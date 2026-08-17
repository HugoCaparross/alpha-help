"use client";

import {
  useState,
  type FormEvent,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { familySchema } from "@/validators";

import {
  FAMILY_STRUCTURES,
  SCHOOL_TYPES,
  SOCIOECONOMIC_LEVELS,
} from "@/lib/constants";

import type { RegisterData } from "./register.types";

interface Props {
  formData: RegisterData;

  setFormData: React.Dispatch<
    React.SetStateAction<RegisterData>
  >;

  nextStep: () => void;

  previousStep: () => void;
}

export default function RegisterStepFamily({
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
      familySchema.safeParse({
        socioeconomicLevel:
          formData.socioeconomicLevel,
        schoolType:
          formData.schoolType,
        numberOfChildren:
          formData.numberOfChildren,
        familyStructure:
          formData.familyStructure,
      });

    if (!result.success) {
      setError(
        result.error.issues[0]?.message ??
        "Revisa los datos familiares.",
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

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className="step-title">
        Información familiar
      </h2>

      <p className="step-description">
        Queremos conocer mejor el entorno
        familiar para contextualizar la
        participación en el estudio.
      </p>

      <div className="auth-field">
        <label
          htmlFor="socioeconomic-level"
          className="auth-label"
        >
          Nivel socioeconómico familiar
        </label>

        <select
          id="socioeconomic-level"
          className="auth-input"
          aria-invalid={Boolean(error)}
          value={
            formData.socioeconomicLevel
          }
          onChange={(event) =>
            updateField(
              "socioeconomicLevel",
              event.target.value,
            )
          }
        >
          <option value="">
            Selecciona una opción
          </option>

          {SOCIOECONOMIC_LEVELS.map(
            (level) => (
              <option
                key={level}
                value={level}
              >
                {level}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="auth-field">
        <label
          htmlFor="school-type"
          className="auth-label"
        >
          Centro escolar al que acuden
          mis hijos
        </label>

        <select
          id="school-type"
          className="auth-input"
          aria-invalid={Boolean(error)}
          value={formData.schoolType}
          onChange={(event) =>
            updateField(
              "schoolType",
              event.target.value,
            )
          }
        >
          <option value="">
            Selecciona una opción
          </option>

          {SCHOOL_TYPES.map((type) => (
            <option
              key={type}
              value={type}
            >
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="auth-field">
        <label
          htmlFor="number-of-children"
          className="auth-label"
        >
          Número de hijos/as
        </label>

        <input
          id="number-of-children"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="auth-input"
          placeholder="Número de hijos"
          aria-invalid={Boolean(error)}
          value={formData.numberOfChildren}
          onChange={(event) => {
            const value =
              event.target.value.replace(
                /\D/g,
                "",
              );

            if (value.length <= 1) {
              updateField(
                "numberOfChildren",
                value,
              );
            }
          }}
        />
      </div>

      <div className="auth-field">
        <label
          htmlFor="family-structure"
          className="auth-label"
        >
          Tipo de estructura familiar
        </label>

        <select
          id="family-structure"
          className="auth-input"
          aria-invalid={Boolean(error)}
          value={formData.familyStructure}
          onChange={(event) =>
            updateField(
              "familyStructure",
              event.target.value,
            )
          }
        >
          <option value="">
            Selecciona una opción
          </option>

          {FAMILY_STRUCTURES.map(
            (structure) => (
              <option
                key={structure}
                value={structure}
              >
                {structure}
              </option>
            ),
          )}
        </select>
      </div>

      {error && (
        <p
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