"use client";

import { ArrowLeft, CheckCircle, LoaderCircle } from "lucide-react";

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

interface SummaryItem {
  label: string;
  value: string;
}

function SummarySection({
  title,
  items,
}: {
  title: string;
  items: SummaryItem[];
}) {
  return (
    <>
      <h3 className="summary-section-title">{title}</h3>

      {items.map((item) => (
        <div key={`${title}-${item.label}`} className="summary-item">
          <span>{item.label}</span>

          <strong>{item.value}</strong>
        </div>
      ))}
    </>
  );
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
          <SummarySection
            title="Cuenta"
            items={[
              {
                label: "Email",
                value: formData.email,
              },
              {
                label: "Región",
                value: formData.region === "spain" ? "España" : "Latinoamérica",
              },
            ]}
          />

          <SummarySection
            title="Participante"
            items={[
              {
                label: "Sexo",
                value: formData.gender,
              },
              {
                label: "Edad",
                value: `${formData.age} años`,
              },
              {
                label: "Estudios",
                value: formData.educationLevel,
              },
              {
                label: "Situación laboral",
                value: formData.employmentStatus,
              },
              {
                label: "Estado civil",
                value: formData.maritalStatus,
              },
            ]}
          />

          <SummarySection
            title="Familia"
            items={[
              {
                label: "Nivel socioeconómico",
                value: formData.socioeconomicLevel,
              },
              {
                label: "Tipo de centro",
                value: formData.schoolType,
              },
              {
                label: "Número de hijos",
                value: formData.numberOfChildren,
              },
              {
                label: "Estructura familiar",
                value: formData.familyStructure,
              },
            ]}
          />

          <SummarySection
            title="Centro escolar"
            items={[
              {
                label: "Centro",
                value: formData.schoolCenter,
              },
            ]}
          />

          <h3 className="summary-section-title">Hijos</h3>

          {formData.children.map((child, index) => (
            <div key={`summary-child-${index}`} className="summary-item">
              <span>{CHILD_ORDINALS[index]} hijo/a</span>

              <strong>
                Edad: {child.age} años · Sexo: {child.gender} ·{" "}
                {child.psychologicalSupport
                  ? "Con atención psicológica"
                  : "Sin atención psicológica"}
              </strong>
            </div>
          ))}
        </div>

        <aside className="summary-notice">
          <p className="summary-notice-text">
            <CheckCircle size={18} aria-hidden="true" />
            Toda la información recogida en este estudio será tratada de forma
            confidencial y utilizada exclusivamente con fines de investigación
            científica. Las respuestas estarán asociadas a un identificador
            interno para preservar la privacidad de los participantes.
          </p>
        </aside>
      </div>

      {submitError && (
        <p className="auth-error" role="alert" aria-live="polite">
          {submitError}
        </p>
      )}

      <div className="step-actions">
        <button
          type="button"
          className="btn-secondary"
          disabled={loading}
          onClick={previousStep}
        >
          <ArrowLeft size={18} />
          Atrás
        </button>

        <button
          type="button"
          className="btn-primary"
          disabled={loading}
          onClick={() => {
            void handleSubmit();
          }}
        >
          {loading ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
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
