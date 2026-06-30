"use client";

import { useEffect, useState } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { childSchema } from "@/validators";

import { GENDERS } from "@/lib/constants";

import type { RegisterData, ChildData } from "./register.types";

interface Props {
  formData: RegisterData;

  setFormData: React.Dispatch<React.SetStateAction<RegisterData>>;

  nextStep: () => void;

  previousStep: () => void;
}

const CHILD_ORDINALS = [
  "Primer",
  "Segundo",
  "Tercer",
  "Cuarto",
  "Quinto",
] as const;

export default function RegisterStepChild({
  formData,
  setFormData,
  nextStep,
  previousStep,
}: Props) {
  const [error, setError] = useState("");

  const numberOfChildren = Number(formData.numberOfChildren) || 0;

  useEffect(() => {
    if (numberOfChildren < 1) return;

    setFormData((prev) => {
      const children = [...prev.children];

      while (children.length < numberOfChildren) {
        children.push({
          age: "",
          gender: "",
          psychologicalSupport: false,
        });
      }

      if (children.length > numberOfChildren) {
        children.length = numberOfChildren;
      }

      return {
        ...prev,
        children,
      };
    });
  }, [numberOfChildren, setFormData]);

  function updateChild(
    index: number,
    field: keyof ChildData,
    value: string | boolean,
  ) {
    setError("");

    setFormData((prev) => {
      const children = [...prev.children];

      children[index] = {
        ...children[index],
        [field]: value,
      };

      return {
        ...prev,
        children,
      };
    });
  }

  function validateStep() {
    const result = childSchema.safeParse({
      children: formData.children,
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
      <h2 className="step-title">Información de los hijos</h2>
      <p className="step-description">
        Indica la edad, sexo y si han recibido atención psicológica.
      </p>{" "}
      {formData.children.map((child, index) => (
        <div key={`child-${index}`} className="child-card">
          <h3 className="child-title">{CHILD_ORDINALS[index]} hijo/a</h3>

          <div className="child-grid">
            {/* EDAD */}
            <div className="auth-field">
              <label className="auth-label">Edad</label>

              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="auth-input"
                placeholder="Edad"
                value={child.age}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");

                  if (value.length <= 2) {
                    updateChild(index, "age", value);
                  }
                }}
              />
            </div>
            {/* SEXO */}
            <div className="auth-field">
              <label className="auth-label">Sexo</label>

              <select
                className="auth-input"
                value={child.gender}
                onChange={(e) => updateChild(index, "gender", e.target.value)}
              >
                <option value="">Selecciona una opción</option>

                {GENDERS.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>{" "}
            {/* ATENCIÓN PSICOLÓGICA */}
            <div className="auth-field child-full-width">
              <label className="auth-label">
                ¿Ha recibido atención psicológica?
              </label>

              <select
                className="auth-input"
                value={child.psychologicalSupport ? "Sí" : "No"}
                onChange={(e) =>
                  updateChild(
                    index,
                    "psychologicalSupport",
                    e.target.value === "Sí",
                  )
                }
              >
                <option value="No">No</option>

                <option value="Sí">Sí</option>
              </select>
            </div>
          </div>
        </div>
      ))}{" "}
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
