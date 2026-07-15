"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";

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

function getAuthErrorMessage(message: string) {
  const error = message.toLowerCase();

  if (error.includes("rate limit")) {
    return "Se han realizado demasiadas solicitudes recientemente. Inténtalo de nuevo dentro de unos minutos.";
  }

  if (error.includes("already registered")) {
    return "Ya existe una cuenta registrada con este correo electrónico.";
  }

  return message;
}

export default function RegisterWizard() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<RegisterData>({
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

  const [loading, setLoading] = useState(false);

  const [submitError, setSubmitError] = useState("");

  function nextStep() {
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  }

  function previousStep() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  async function handleSubmit() {
    if (loading) return;

    setSubmitError("");

    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,

        options: {
          data: {
            region: formData.region,

            gender: formData.gender,
            age: formData.age,

            education_level: formData.educationLevel,
            employment_status: formData.employmentStatus,

            marital_status: formData.maritalStatus,

            socioeconomic_level: formData.socioeconomicLevel,

            school_type: formData.schoolType,

            number_of_children: formData.numberOfChildren,

            family_structure: formData.familyStructure,

            school_center: formData.schoolCenter,

            children: formData.children,

            accepted_policy: true,
          },
        },
      });

      if (error) {
        setSubmitError(getAuthErrorMessage(error.message));
        return;
      }

      router.push("/login?registered=true");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Ha ocurrido un error inesperado.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-card">
      <div className="register-stepper">
        {STEP_LABELS.map((label, index) => {
          const currentStep = index + 1;

          return (
            <div
              key={label}
              className={`step-item ${
                step > currentStep
                  ? "completed"
                  : step === currentStep
                    ? "active"
                    : ""
              }`}
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
