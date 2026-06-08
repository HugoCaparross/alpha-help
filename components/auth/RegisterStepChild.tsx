"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { RegisterData, ChildData } from "./register.types";
import { childSchema } from "@/lib/utils/validators";

interface Props {
  formData: RegisterData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterData>>;
  nextStep: () => void;
  previousStep: () => void;
}

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

      return {
        ...prev,
        children: children.slice(0, numberOfChildren),
      };
    });
  }, [numberOfChildren, setFormData]);

  function updateChild(
    index: number,
    field: keyof ChildData,
    value: string | boolean,
  ) {
    setFormData((prev) => {
      const updatedChildren = [...prev.children];

      updatedChildren[index] = {
        ...updatedChildren[index],
        [field]: value,
      };

      return {
        ...prev,
        children: updatedChildren,
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

  return (
    <>
      <h2 className="step-title">Información de los hijos</h2>

      <p className="step-description">
        Indica la edad, sexo y si han recibido atención psicológica.
      </p>

      {formData.children.map((child, index) => (
        <div key={index} className="child-card">
          <h3 className="child-title">
            {["Primer", "Segundo", "Tercer", "Cuarto", "Quinto"][index]} hijo/a
          </h3>

          <div className="child-grid">
            <div className="auth-field">
              <label className="auth-label">Edad</label>

              <input
                type="number"
                min="10"
                max="17"
                className="auth-input"
                value={child.age}
                onChange={(e) => updateChild(index, "age", e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Sexo</label>

              <select
                className="auth-input"
                value={child.gender}
                onChange={(e) => updateChild(index, "gender", e.target.value)}
              >
                <option value="">Selecciona una opción</option>
                <option value="Mujer">Mujer</option>
                <option value="Hombre">Hombre</option>
              </select>
            </div>

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
      ))}

      {error && <p className="auth-error">{error}</p>}

      <div className="step-actions">
        <button type="button" className="btn-secondary" onClick={previousStep}>
          <ArrowLeft size={18} />
          Atrás
        </button>

        <button type="button" className="btn-primary" onClick={validateStep}>
          Continuar
          <ArrowRight size={18} />
        </button>
      </div>
    </>
  );
}
