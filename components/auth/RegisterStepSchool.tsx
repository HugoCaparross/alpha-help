"use client";

import { useState } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";

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
  const [error, setError] = useState("");

  function validateStep() {
    if (!formData.schoolCenter) {
      setError(
        "Selecciona un centro escolar"
      );

      return;
    }

    setError("");

    nextStep();
  }

  const schools =
    formData.region === "spain"
      ? [
          "Nuestra Señora del Pilar (Jerez de la Frontera)",
          'Jesús María "El Cuco" (Jerez de la Frontera)',
          "C. E. Marni (Rascanya)",
          "Otro centro",
        ]
      : [
          "Innovación Educativa Montessori",
          'Escuela Telesecundaria "5 de mayo"',
          'Escuela Telesecundaria "Guadalupe Victoria"',
          'Escuela Telesecundaria "Leona Vicario"',
          'Escuela Telesecundaria "Manuel C. Tello"',
          'Escuela Telesecundaria "Rafael Ramírez"',
          "Otro centro",
        ];

  return (
    <>
      <h2 className="step-title">
        Centro escolar
      </h2>

      <p className="step-description">
        Selecciona el centro escolar al
        que acuden tus hijos.
      </p>

      <div className="auth-field">
        <label className="auth-label">
          Centro escolar
        </label>

        <select
          className="auth-input"
          value={formData.schoolCenter}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              schoolCenter:
                e.target.value,
            }))
          }
        >
          <option value="">
            Selecciona una opción
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