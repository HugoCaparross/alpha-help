"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import RegisterStepAccount from "./RegisterStepAccount";
import RegisterStepParticipant from "./RegisterStepParticipant";
import RegisterStepChild from "./RegisterStepChild";
import RegisterStepFamily from "./RegisterStepFamily";
import RegisterStepSummary from "./RegisterStepSummary";
import RegisterStepSchool from "./RegisterStepSchool";

import "../styles/auth.css";

import { registerSchema } from "@/validators/register";

import type { RegisterData } from "./register.types";

const TOTAL_STEPS = 6;

const STEP_LABELS = [
  "Cuenta",
  "Participante",
  "Familia",
  "Centro",
  "Hijos",
  "Resumen",
] as const;

interface RegisterResponse {
  ok?: boolean;
  error?: string;
}

function getRegistrationErrorMessage(message: string): string {
  const error = message.toLowerCase();

  if (
    error.includes("rate") ||
    error.includes("demasiadas") ||
    error.includes("too many")
  ) {
    return "Se han realizado demasiadas solicitudes recientemente. Inténtalo de nuevo dentro de unos minutos.";
  }

  if (
    error.includes("already registered") ||
    error.includes("already exists") ||
    error.includes("ya existe")
  ) {
    return "Ya existe una cuenta registrada con este correo electrónico.";
  }

  return message;
}

export default function RegisterWizard() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    region: "",
    password: "",
    confirmPassword: "",
    acceptedPolicy: false,
    acceptedInformedConsent: false,

    gender: "",
    age: "",
    educationLevel: "",
    employmentStatus: "",
    maritalStatus: "",

    socioeconomicLevel: "",
    schoolType: "",
    numberOfChildren: "",
    familyStructure: "",
    schoolCenter: "",

    children: [],
  });

  const [loading, setLoading] = useState(false);

  const [submitError, setSubmitError] = useState("");

  function nextStep() {
    setSubmitError("");

    setStep((previous) =>
      Math.min(previous + 1, TOTAL_STEPS),
    );
  }

  function previousStep() {
    if (loading) {
      return;
    }

    setSubmitError("");

    setStep((previous) =>
      Math.max(previous - 1, 1),
    );
  }

  async function handleSubmit() {
    if (loading) {
      return;
    }

    setSubmitError("");

    /*
     * Las validaciones individuales de cada paso
     * protegen la navegación del formulario.
     *
     * Esta validación final protege además el punto
     * de entrada de la petición completa.
     */
    const validation = registerSchema.safeParse(formData);

    if (!validation.success) {
      setSubmitError(
        validation.error.issues[0]?.message ??
        "Revisa los datos introducidos antes de continuar.",
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const result = (await response
        .json()
        .catch(() => null)) as RegisterResponse | null;

      if (!response.ok || !result?.ok) {
        setSubmitError(
          getRegistrationErrorMessage(
            result?.error ??
            "No se ha podido crear la cuenta.",
          ),
        );

        return;
      }

      router.push("/login?registered=true");
    } catch {
      setSubmitError(
        "No se ha podido completar el registro. Inténtalo de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-card">
      <div
        className="register-stepper"
        aria-label="Progreso del registro"
      >
        {STEP_LABELS.map((label, index) => {
          const currentStep = index + 1;

          const isCompleted = step > currentStep;
          const isActive = step === currentStep;

          return (
            <div
              key={label}
              className={`step-item ${isCompleted
                  ? "completed"
                  : isActive
                    ? "active"
                    : ""
                }`}
              aria-current={
                isActive ? "step" : undefined
              }
            >
              {label}
            </div>
          );
        })}
      </div>

      <div className="register-step-content">
        {step === 1 && (
          <RegisterStepAccount
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
          />
        )}

        {step === 2 && (
          <RegisterStepParticipant
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            previousStep={previousStep}
          />
        )}

        {step === 3 && (
          <RegisterStepFamily
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            previousStep={previousStep}
          />
        )}

        {step === 4 && (
          <RegisterStepSchool
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            previousStep={previousStep}
          />
        )}

        {step === 5 && (
          <RegisterStepChild
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            previousStep={previousStep}
          />
        )}

        {step === TOTAL_STEPS && (
          <RegisterStepSummary
            formData={formData}
            previousStep={previousStep}
            handleSubmit={handleSubmit}
            loading={loading}
            submitError={submitError}
          />
        )}
      </div>
    </div>
  );
}