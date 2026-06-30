"use client";

import { useState } from "react";
import Link from "next/link";

import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";

import LegalModal from "@/components/legal/LegalModal";
import PrivacyContent from "@/components/legal/PrivacyContent";
import LegalContent from "@/components/legal/LegalContent";
import CookiesContent from "@/components/legal/CookiesContent";

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

  function updateField<K extends keyof RegisterData>(
    field: K,
    value: RegisterData[K],
  ) {
    setError("");

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function validateStep() {
    const result = accountSchema.safeParse({
      email: formData.email,
      region: formData.region,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      acceptedPolicy: formData.acceptedPolicy,
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
    <>
      <form onSubmit={handleSubmit}>
        <div className="register-header">
          <h1 className="register-title">Crear cuenta</h1>
        </div>

        <div className="auth-field">
          <div className="auth-input-wrapper">
            <Mail size={18} className="auth-input-icon" />

            <input
              type="email"
              autoComplete="email"
              className="auth-input auth-input-with-icon"
              placeholder="Correo electrónico"
              value={formData.email.trimStart()}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>
        </div>

        <div className="region-selector">
          <button
            type="button"
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

        <div className="auth-field">
          <div className="auth-input-wrapper">
            <Lock size={18} className="auth-input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className="auth-input auth-input-with-icon"
              placeholder="Contraseña"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
            />

            <button
              type="button"
              className="auth-toggle"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className="auth-field">
          <div className="auth-input-wrapper">
            <Lock size={18} className="auth-input-icon" />

            <input
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              className="auth-input auth-input-with-icon"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
            />

            <button
              type="button"
              className="auth-toggle"
              aria-label={
                showConfirmPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <label className="auth-checkbox">
          <input
            type="checkbox"
            checked={formData.acceptedPolicy}
            onChange={(e) => updateField("acceptedPolicy", e.target.checked)}
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

        {error && <p className="auth-error">{error}</p>}

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
    </>
  );
}
