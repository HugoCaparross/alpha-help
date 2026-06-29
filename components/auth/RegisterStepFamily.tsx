"use client";

import { useState } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";

import type { RegisterData } from "./register.types";

import { familySchema } from "@/validators";

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

  return (
    <>
      <h2 className="step-title">
        Información familiar
      </h2>

      <p className="step-description">
        Queremos conocer mejor el entorno familiar para contextualizar la
        participación en el estudio.
      </p>

      {/* NIVEL SOCIOECONÓMICO */}

      <div className="auth-field">
        <label className="auth-label">
          Nivel socioeconómico familiar
        </label>

        <select
          className="auth-input"
          value={formData.socioeconomicLevel}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              socioeconomicLevel: e.target.value,
            }))
          }
        >
          <option value="">
            Selecciona una opción
          </option>

          <option value="Bajo">
            Bajo
          </option>

          <option value="Medio">
            Medio
          </option>

          <option value="Alto">
            Alto
          </option>
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
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              schoolType: e.target.value,
            }))
          }
        >
          <option value="">
            Selecciona una opción
          </option>

          <option value="Público">
            Público
          </option>

          <option value="Concertado">
            Concertado
          </option>

          <option value="Privado">
            Privado
          </option>
        </select>
      </div>

      {/* NÚMERO DE HIJOS */}

      <div className="auth-field">
        <label className="auth-label">
          Número de hijos/as
        </label>

        <input
          type="number"
          min="1"
          max="5"
          className="auth-input"
          value={formData.numberOfChildren}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              numberOfChildren: e.target.value,
            }))
          }
        />
      </div>

      {/* ESTRUCTURA FAMILIAR */}

      <div className="auth-field">
        <label className="auth-label">
          Tipo de estructura familiar
        </label>

        <select
          className="auth-input"
          value={formData.familyStructure}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              familyStructure: e.target.value,
            }))
          }
        >
          <option value="">
            Selecciona una opción
          </option>

          <option value="Biparental">
            Biparental
          </option>

          <option value="Monoparental">
            Monoparental
          </option>

          <option value="Reconstituida">
            Reconstituida
          </option>

          <option value="Otra">
            Otra
          </option>
        </select>
      </div>

      {error && (
        <p className="auth-error">
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
          type="button"
          className="btn-primary"
          onClick={validateStep}
        >
          Continuar
          <ArrowRight size={18} />
        </button>
      </div>
    </>
  );
}