"use client";

import {
  ArrowLeft,
  CheckCircle,
  LoaderCircle,
} from "lucide-react";

import type { RegisterData } from "./register.types";

interface Props {
  formData: RegisterData;

  previousStep: () => void;

  handleSubmit: () => Promise<void>;

  loading: boolean;

  submitError: string;
}

const CHILD_ORDINALS = [
  "Primer",
  "Segundo",
  "Tercer",
  "Cuarto",
  "Quinto",
] as const;

export default function RegisterStepSummary({
  formData,
  previousStep,
  handleSubmit,
  loading,
  submitError,
}: Props) {
  return (
    <>
      <h2 className="step-title">
        Revisar información
      </h2>

      <p className="step-description">
        Revisa la información antes de completar el registro.
      </p>

      <div className="summary-layout">
        <div className="register-summary">
          {/* CUENTA */}

          <h3 className="summary-section-title">
            Cuenta
          </h3>

          <div className="summary-item">
            <span>Email</span>

            <strong>{formData.email}</strong>
          </div>

          <div className="summary-item">
            <span>Región</span>

            <strong>
              {formData.region === "spain"
                ? "España"
                : "Latinoamérica"}
            </strong>
          </div>

          {/* PARTICIPANTE */}

          <h3 className="summary-section-title">
            Participante
          </h3>

          <div className="summary-item">
            <span>Sexo</span>

            <strong>{formData.gender}</strong>
          </div>

          <div className="summary-item">
            <span>Edad</span>

            <strong>
              {formData.age} años
            </strong>
          </div>

          <div className="summary-item">
            <span>Estudios</span>

            <strong>
              {formData.educationLevel}
            </strong>
          </div>

          <div className="summary-item">
            <span>
              Situación laboral
            </span>

            <strong>
              {formData.employmentStatus}
            </strong>
          </div>

          <div className="summary-item">
            <span>Estado civil</span>

            <strong>
              {formData.maritalStatus}
            </strong>
          </div>

          {/* FAMILIA */}

          <h3 className="summary-section-title">
            Familia
          </h3>

          <div className="summary-item">
            <span>
              Nivel socioeconómico
            </span>

            <strong>
              {
                formData.socioeconomicLevel
              }
            </strong>
          </div>

          <div className="summary-item">
            <span>
              Tipo de centro
            </span>

            <strong>
              {formData.schoolType}
            </strong>
          </div>

          <div className="summary-item">
            <span>
              Número de hijos
            </span>

            <strong>
              {
                formData.numberOfChildren
              }
            </strong>
          </div>

          <div className="summary-item">
            <span>
              Estructura familiar
            </span>

            <strong>
              {
                formData.familyStructure
              }
            </strong>
          </div>

          {/* CENTRO */}

          <h3 className="summary-section-title">
            Centro escolar
          </h3>

          <div className="summary-item">
            <span>Centro</span>

            <strong>
              {formData.schoolCenter}
            </strong>
          </div>

          {/* HIJOS */}

          <h3 className="summary-section-title">
            Hijos
          </h3>

          {formData.children.map(
            (child, index) => (
              <div
                key={`summary-child-${index}`}
                className="summary-item"
              >
                <span>
                  {
                    CHILD_ORDINALS[
                      index
                    ]
                  }{" "}
                  hijo/a
                </span>

                <strong>
                  Edad: {child.age} años ·
                  Sexo: {child.gender} ·{" "}
                  {child.psychologicalSupport
                    ? "Con atención psicológica"
                    : "Sin atención psicológica"}
                </strong>
              </div>
            ),
          )}
        </div>

        <div className="summary-notice">
          <p className="summary-notice-text">
            <CheckCircle size={18} />

            Toda la información será tratada
            de forma confidencial y utilizada
            exclusivamente para
            investigación científica. Las
            respuestas estarán asociadas a
            un identificador interno para
            preservar la privacidad de los
            participantes.
          </p>
        </div>
      </div>

      {submitError && (
        <p
          className="auth-error"
          role="alert"
          aria-live="polite"
        >
          {submitError}
        </p>
      )}

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
          {loading ? (
            <>
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
              Creando cuenta...
            </>
          ) : (
            "Crear cuenta"
          )}
        </button>
      </div>
    </>
  );
}