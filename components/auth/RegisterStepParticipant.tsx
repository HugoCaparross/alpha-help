"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

import type { RegisterData } from "./register.types";

import { participantSchema } from "@/lib/utils/validators";

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

  return (
    <>
      <h2 className="step-title">Datos del participante</h2>

      <p className="step-description">
        Información básica de la persona que participa en el estudio.
      </p>

      {/* SEXO */}

      <div className="auth-field">
        <label className="auth-label">Soy...</label>

        <select
          className="auth-input"
          value={formData.gender}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              gender: e.target.value,
            }))
          }
        >
          <option value="">Selecciona una opción</option>

          <option value="Mujer">Mujer</option>

          <option value="Hombre">Hombre</option>
        </select>
      </div>

      {/* EDAD */}

      <div className="auth-field">
        <label className="auth-label">Tengo...</label>

        <input
          type="number"
          min="18"
          max="99"
          className="auth-input"
          placeholder="Edad"
          value={formData.age}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              age: e.target.value,
            }))
          }
        />
      </div>

      {/* ESTUDIOS */}

      <div className="auth-field">
        <label className="auth-label">
          Nivel máximo de estudios
        </label>

        <select
          className="auth-input"
          value={formData.educationLevel}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              educationLevel: e.target.value,
            }))
          }
        >
          <option value="">
            Selecciona una opción
          </option>

          <option value="Primarios">
            Primarios
          </option>

          <option value="Secundarios">
            Secundarios
          </option>

          <option value="Universitarios">
            Universitarios
          </option>

          <option value="Doctorado">
            Doctorado
          </option>
        </select>
      </div>

      {/* SITUACIÓN LABORAL */}

      <div className="auth-field">
        <label className="auth-label">
          Situación laboral actual
        </label>

        <select
          className="auth-input"
          value={formData.employmentStatus}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              employmentStatus: e.target.value,
            }))
          }
        >
          <option value="">
            Selecciona una opción
          </option>

          <option value="Estudiante">
            Estudiante
          </option>

          <option value="Trabajo">
            Trabajo
          </option>

          <option value="Parado/a">
            Parado/a
          </option>

          <option value="Gestión doméstica">
            Gestión doméstica
          </option>

          <option value="Jubilado/a">
            Jubilado/a
          </option>

          <option value="Incapacitado/a">
            Incapacitado/a
          </option>
        </select>
      </div>

      {/* ESTADO CIVIL */}

      <div className="auth-field">
        <label className="auth-label">
          Estado civil actual
        </label>

        <select
          className="auth-input"
          value={formData.maritalStatus}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              maritalStatus: e.target.value,
            }))
          }
        >
          <option value="">
            Selecciona una opción
          </option>

          <option value="Soltero/a">
            Soltero/a
          </option>

          <option value="Casado/a">
            Casado/a
          </option>

          <option value="Separado/a, Divorciado/a">
            Separado/a, Divorciado/a
          </option>

          <option value="Viudo/a">
            Viudo/a
          </option>
        </select>
      </div>

      {error && <p className="auth-error">{error}</p>}

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