"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";

import LegalModal from "@/components/legal/LegalModal";
import PrivacyContent from "@/components/legal/PrivacyContent";
import LegalContent from "@/components/legal/LegalContent";
import CookiesContent from "@/components/legal/CookiesContent";
import InformedConsentContent from "@/components/legal/InformedConsentContent";

import { accountSchema } from "@/validators";

import type { RegisterData } from "./register.types";

interface Props {
  formData: RegisterData;

  setFormData: React.Dispatch<React.SetStateAction<RegisterData>>;

  nextStep: () => void;
}

export default function RegisterStepAccount({
  formData,
  setFormData,
  nextStep,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const [openPrivacy, setOpenPrivacy] = useState(false);

  const [openLegal, setOpenLegal] = useState(false);

  const [openCookies, setOpenCookies] = useState(false);

  const [openInformedConsent, setOpenInformedConsent] = useState(false);

  function updateField<K extends keyof RegisterData>(
    field: K,
    value: RegisterData[K],
  ) {
    setError("");

    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function validateStep(): boolean {
    const result = accountSchema.safeParse({
      email: formData.email,
      region: formData.region,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      acceptedPolicy: formData.acceptedPolicy,
      acceptedInformedConsent: formData.acceptedInformedConsent,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);

      return false;
    }

    return true;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateStep()) {
      return;
    }

    nextStep();
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <div className="register-header">
          <h1 className="register-title">Crear cuenta</h1>
        </div>

        {/* EMAIL */}

        <div className="auth-field">
          <label htmlFor="email" className="auth-label">
            Correo electrónico
          </label>

          <div className="auth-input-wrapper">
            <Mail size={18} className="auth-input-icon" />

            <input
              id="email"
              type="email"
              autoComplete="email"
              className="auth-input auth-input-with-icon"
              placeholder="Correo electrónico"
              value={formData.email.trimStart()}
              aria-invalid={!!error}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </div>
        </div>

        {/* REGIÓN */}

        <div
          className="region-selector"
          role="radiogroup"
          aria-label="Selecciona tu región"
        >
          <button
            type="button"
            aria-pressed={formData.region === "spain"}
            className={`region-card ${
              formData.region === "spain" ? "active" : ""
            }`}
            onClick={() => updateField("region", "spain")}
          >
            <span className="region-card-title">España</span>

            <span className="region-card-description">
              Participantes residentes en España
            </span>
          </button>

          <button
            type="button"
            aria-pressed={formData.region === "latam"}
            className={`region-card ${
              formData.region === "latam" ? "active" : ""
            }`}
            onClick={() => updateField("region", "latam")}
          >
            <span className="region-card-title">Latinoamérica</span>

            <span className="region-card-description">
              Participantes residentes en Latinoamérica
            </span>
          </button>
        </div>

        {/* CONTRASEÑA */}

        <div className="auth-field">
          <label htmlFor="password" className="auth-label">
            Contraseña
          </label>

          <div className="auth-input-wrapper">
            <Lock size={18} className="auth-input-icon" />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className="auth-input auth-input-with-icon"
              placeholder="Contraseña"
              value={formData.password}
              aria-invalid={!!error}
              onChange={(event) => updateField("password", event.target.value)}
            />

            <button
              type="button"
              className="auth-toggle"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              onClick={() => setShowPassword((previous) => !previous)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* CONFIRMAR CONTRASEÑA */}

        <div className="auth-field">
          <label htmlFor="confirm-password" className="auth-label">
            Confirmar contraseña
          </label>

          <div className="auth-input-wrapper">
            <Lock size={18} className="auth-input-icon" />

            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              className="auth-input auth-input-with-icon"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              aria-invalid={!!error}
              onChange={(event) =>
                updateField("confirmPassword", event.target.value)
              }
            />

            <button
              type="button"
              className="auth-toggle"
              aria-label={
                showConfirmPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
              onClick={() => setShowConfirmPassword((previous) => !previous)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <label className="auth-checkbox">
          <input
            type="checkbox"
            checked={formData.acceptedPolicy}
            onChange={(event) =>
              updateField("acceptedPolicy", event.target.checked)
            }
          />

          <span>
            He leído y acepto la{" "}
            <button
              type="button"
              className="auth-legal-link"
              onClick={() => setOpenPrivacy(true)}
            >
              Política de Privacidad
            </button>
            , el{" "}
            <button
              type="button"
              className="auth-legal-link"
              onClick={() => setOpenLegal(true)}
            >
              Aviso Legal
            </button>{" "}
            y la{" "}
            <button
              type="button"
              className="auth-legal-link"
              onClick={() => setOpenCookies(true)}
            >
              Política de Cookies
            </button>
            .
          </span>
        </label>

        <label className="auth-checkbox">
          <input
            type="checkbox"
            checked={formData.acceptedInformedConsent}
            onChange={(event) =>
              updateField("acceptedInformedConsent", event.target.checked)
            }
          />

          <span>
            He leído y acepto el{" "}
            <button
              type="button"
              className="auth-legal-link"
              onClick={() => setOpenInformedConsent(true)}
            >
              Registro Informado
            </button>{" "}
            para participar en el estudio.
          </span>
        </label>

        {error && (
          <p className="auth-error" role="alert" aria-live="polite">
            {error}
          </p>
        )}

        <div className="register-login-link">
          <span>¿Ya tienes cuenta?</span>

          <Link href="/login">Iniciar sesión</Link>
        </div>

        <div className="step-actions step-actions-full">
          <button type="submit" className="btn-primary btn-full">
            Continuar
            <ArrowRight size={18} />
          </button>
        </div>
      </form>

      <LegalModal
        open={openPrivacy}
        title="Política de Privacidad"
        onClose={() => setOpenPrivacy(false)}
      >
        <PrivacyContent />
      </LegalModal>

      <LegalModal
        open={openLegal}
        title="Aviso Legal"
        onClose={() => setOpenLegal(false)}
      >
        <LegalContent />
      </LegalModal>

      <LegalModal
        open={openCookies}
        title="Política de Cookies"
        onClose={() => setOpenCookies(false)}
      >
        <CookiesContent />
      </LegalModal>

      <LegalModal
        open={openInformedConsent}
        title="Registro Informado"
        onClose={() => setOpenInformedConsent(false)}
      >
        <InformedConsentContent />
      </LegalModal>
    </>
  );
}
