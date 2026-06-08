"use client";

import { ArrowLeft, CheckCircle } from "lucide-react";

import type { RegisterData } from "./register.types";

interface Props {
  formData: RegisterData;

  previousStep: () => void;

  handleSubmit: () => Promise<void>;

  loading: boolean;

  submitError: string;
}

export default function RegisterStepSummary({
  formData,
  previousStep,
  handleSubmit,
  loading,
  submitError,
}: Props) {
  return (
    <>
      <h2 className="step-title">Revisar información</h2>

      <p className="step-description">
        Revisa la información antes de completar el registro.
      </p>

      <div className="summary-layout">
        <div className="register-summary">
          {/* CUENTA */}

          <div className="summary-item">
            <span>Email</span>

            <strong>{formData.email}</strong>
          </div>

          <div className="summary-item">
            <span>Región</span>

            <strong>
              {formData.region === "spain" ? "España" : "Latinoamérica"}
            </strong>
          </div>

          {/* PARTICIPANTE */}

          <div className="summary-item">
            <span>Sexo</span>

            <strong>{formData.gender}</strong>
          </div>

          <div className="summary-item">
            <span>Edad</span>

            <strong>{formData.age} años</strong>
          </div>

          <div className="summary-item">
            <span>Estudios</span>

            <strong>{formData.educationLevel}</strong>
          </div>

          <div className="summary-item">
            <span>Situación laboral</span>

            <strong>{formData.employmentStatus}</strong>
          </div>

          <div className="summary-item">
            <span>Estado civil</span>

            <strong>{formData.maritalStatus}</strong>
          </div>

          {/* FAMILIA */}

          <div className="summary-item">
            <span>Nivel socioeconómico</span>

            <strong>{formData.socioeconomicLevel}</strong>
          </div>

          <div className="summary-item">
            <span>Tipo de centro</span>

            <strong>{formData.schoolType}</strong>
          </div>

          <div className="summary-item">
            <span>Número de hijos</span>

            <strong>{formData.numberOfChildren}</strong>
          </div>

          <div className="summary-item">
            <span>Estructura familiar</span>

            <strong>{formData.familyStructure}</strong>
          </div>

          {/* CENTRO ESCOLAR */}

          <div className="summary-item">
            <span>Centro escolar</span>

            <strong>{formData.schoolCenter}</strong>
          </div>

          {/* HIJOS */}

          {formData.children.map((child, index) => (
            <div key={index} className="summary-item">
              <span>
                {["Primer", "Segundo", "Tercer", "Cuarto", "Quinto"][index]}{" "}
                hijo/a
              </span>

              <strong>
                {child.age} años · {child.gender} ·{" "}
                {child.psychologicalSupport
                  ? "Con atención psicológica"
                  : "Sin atención psicológica"}
              </strong>
            </div>
          ))}
        </div>

        <div className="summary-notice">
          <p className="summary-notice-text">
            <CheckCircle size={18} />
            Toda la información será tratada de forma confidencial y utilizada
            exclusivamente para investigación científica.
          </p>
        </div>
      </div>

      {submitError && <p className="auth-error">{submitError}</p>}

      <div className="step-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={previousStep}
          disabled={loading}
        >
          <ArrowLeft size={18} />
          Atrás
        </button>

        <button
          type="button"
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </div>
    </>
  );
}