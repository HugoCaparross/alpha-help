"use client";

import LegalModal from "@/components/legal/LegalModal";
import PrivacyContent from "@/components/legal/PrivacyContent";
import LegalContent from "@/components/legal/LegalContent";
import CookiesContent from "@/components/legal/CookiesContent";

import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import type { RegisterData } from "./register.types";

import { accountSchema } from "@/validators";

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

  return (
    <>
      {/* HEADER */}

      <div className="register-header">
        <h1 className="register-title">Crear cuenta</h1>
      </div>

      {/* EMAIL */}

      <div className="auth-field">
        <div className="auth-input-wrapper">
          <Mail size={18} className="auth-input-icon" />

          <input
            type="email"
            className="auth-input auth-input-with-icon"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="region-selector">
        <button
          type="button"
          className={`region-card ${
            formData.region === "spain" ? "active" : ""
          }`}
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              region: "spain",
            }))
          }
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
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              region: "latam",
            }))
          }
        >
          <span className="region-card-title">Latinoamérica</span>

          <span className="region-card-description">
            Participantes residentes en Latinoamérica
          </span>
        </button>
      </div>

      {/* PASSWORD */}

      <div className="auth-field">
        <div className="auth-input-wrapper">
          <Lock size={18} className="auth-input-icon" />

          <input
            type={showPassword ? "text" : "password"}
            className="auth-input auth-input-with-icon"
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />

          <button
            type="button"
            className="auth-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* CONFIRMAR */}

      <div className="auth-field">
        <div className="auth-input-wrapper">
          <Lock size={18} className="auth-input-icon" />

          <input
            type={showConfirmPassword ? "text" : "password"}
            className="auth-input auth-input-with-icon"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
          />

          <button
            type="button"
            className="auth-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* PRIVACIDAD */}

      <label className="auth-checkbox">
        <input
          type="checkbox"
          checked={formData.acceptedPolicy}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              acceptedPolicy: e.target.checked,
            }))
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

      {error && <p className="auth-error">{error}</p>}

      <div className="register-login-link">
        <span>¿Ya tienes cuenta?</span>

        <Link href="/login">Iniciar sesión</Link>
      </div>

      <div className="step-actions step-actions-full">
        <button
          type="button"
          className="btn-primary btn-full"
          onClick={validateStep}
        >
          Continuar
          <ArrowRight size={18} />
        </button>
      </div>

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
