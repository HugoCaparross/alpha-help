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

import type { RegisterData } from "./register.types";

const TOTAL_STEPS = 6;

const STEP_LABELS = [
  "Cuenta",
  "Participante",
  "Familia",
  "Centro",
  "Hijos",
  "Resumen",
];

interface RegisterResponse {
  ok?: boolean;
  error?: string;
}

function getRegistrationErrorMessage(
  message: string,
) {
  const error = message.toLowerCase();

  if (
    error.includes("rate") ||
    error.includes("demasiadas")
  ) {
    return "Se han realizado demasiadas solicitudes recientemente. Inténtalo de nuevo dentro de unos minutos.";
  }

  if (
    error.includes("already registered") ||
    error.includes("ya existe")
  ) {
    return "Ya existe una cuenta registrada con este correo electrónico.";
  }

  return message;
}

export default function RegisterWizard() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [formData, setFormData] =
    useState<RegisterData>({
      /* CUENTA */

      email: "",
      region: "",
      password: "",
      confirmPassword: "",
      acceptedPolicy: false,
      acceptedInformedConsent: false,

      /* PARTICIPANTE */

      gender: "",
      age: "",
      educationLevel: "",
      employmentStatus: "",
      maritalStatus: "",

      /* FAMILIA */

      socioeconomicLevel: "",
      schoolType: "",
      numberOfChildren: "",
      familyStructure: "",
      schoolCenter: "",

      /* HIJOS */

      children: [],
    });

  const [loading, setLoading] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  function nextStep() {
    setStep((prev) =>
      Math.min(
        prev + 1,
        TOTAL_STEPS,
      ),
    );
  }

  function previousStep() {
    setStep((prev) =>
      Math.max(prev - 1, 1),
    );
  }

  async function handleSubmit() {
    if (loading) {
      return;
    }

    setSubmitError("");

    try {
      setLoading(true);

      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            formData,
          ),
        },
      );

      const result =
        (await response
          .json()
          .catch(() => null)) as
        | RegisterResponse
        | null;

      if (!response.ok || !result?.ok) {
        setSubmitError(
          getRegistrationErrorMessage(
            result?.error ??
            "No se ha podido crear la cuenta.",
          ),
        );

        return;
      }

      router.push(
        "/login?registered=true",
      );
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
      <div className="register-stepper">
        {STEP_LABELS.map(
          (label, index) => {
            const currentStep =
              index + 1;

            return (
              <div
                key={label}
                className={`step-item ${step >
                    currentStep
                    ? "completed"
                    : step ===
                      currentStep
                      ? "active"
                      : ""
                  }`}
              >
                {label}
              </div>
            );
          },
        )}
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
            previousStep={
              previousStep
            }
          />
        )}

        {step === 3 && (
          <RegisterStepFamily
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            previousStep={
              previousStep
            }
          />
        )}

        {step === 4 && (
          <RegisterStepSchool
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            previousStep={
              previousStep
            }
          />
        )}

        {step === 5 && (
          <RegisterStepChild
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            previousStep={
              previousStep
            }
          />
        )}

        {step === TOTAL_STEPS && (
          <RegisterStepSummary
            formData={formData}
            previousStep={
              previousStep
            }
            handleSubmit={
              handleSubmit
            }
            loading={loading}
            submitError={
              submitError
            }
          />
        )}
      </div>
    </div>
  );
}