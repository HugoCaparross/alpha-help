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
    setStep((prev) => Math.min(prev + 1, 6));
  }

  function previousStep() {
    setStep((prev) => Math.max(prev - 1, 1));
  }

  async function handleSubmit() {
    if (loading) return;

    setSubmitError("");

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
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
        console.error("SUPABASE ERROR:", error);

        setSubmitError(error.message);

        return;
      }

      router.push("/verify-email");
    } catch (error) {
      console.error("CATCH ERROR:", error);

      setSubmitError(
        error instanceof Error ? error.message : JSON.stringify(error),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-card">
      <div className="register-stepper">
        <div
          className={`step-item ${
            step > 1 ? "completed" : step === 1 ? "active" : ""
          }`}
        >
          Cuenta
        </div>

        <div
          className={`step-item ${
            step > 2 ? "completed" : step === 2 ? "active" : ""
          }`}
        >
          Participante
        </div>

        <div
          className={`step-item ${
            step > 3 ? "completed" : step === 3 ? "active" : ""
          }`}
        >
          Familia
        </div>

        <div
          className={`step-item ${
            step > 4 ? "completed" : step === 4 ? "active" : ""
          }`}
        >
          Centro
        </div>

        <div
          className={`step-item ${
            step > 5 ? "completed" : step === 5 ? "active" : ""
          }`}
        >
          Hijos
        </div>

        <div className={`step-item ${step === 6 ? "active" : ""}`}>Resumen</div>
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

        {step === 6 && (
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
