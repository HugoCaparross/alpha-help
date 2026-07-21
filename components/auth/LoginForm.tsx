"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Eye, EyeOff, LoaderCircle, Lock, Mail } from "lucide-react";

import { loginSchema } from "@/validators";

import { isAdminLoginInput } from "@/lib/constants/admin";

const ERROR_MESSAGES = {
  emailVerification:
    "Debes verificar tu correo electrónico antes de iniciar sesión.",

  rateLimit:
    "Se han realizado demasiados intentos. Inténtalo de nuevo dentro de unos minutos.",

  invalidCredentials: "Correo o contraseña incorrectos.",

  unexpected: "Se ha producido un error inesperado. Inténtalo de nuevo.",
} as const;

/**
 * Formulario de inicio de sesión.
 */
export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  function updateEmail(value: string) {
    setError("");
    setEmail(value);
  }

  function updatePassword(value: string) {
    setError("");
    setPassword(value);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isAdminInput = isAdminLoginInput(email);

    if (!isAdminInput) {
      const result = loginSchema.safeParse({
        email,
        password,
      });

      if (!result.success) {
        setError(result.error.issues[0].message);

        return;
      }
    } else if (password.length === 0) {
      setError("Introduce la contraseña.");

      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data?.error ?? ERROR_MESSAGES.unexpected);

        return;
      }

      router.replace(data.isAdmin ? "/admin" : "/dashboard");

      router.refresh();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }

      setError(ERROR_MESSAGES.unexpected);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin} noValidate>
      <div className="register-header">
        <h1 className="register-title">Iniciar sesión</h1>

        <p className="register-description">
          Accede a tu cuenta para continuar.
        </p>
      </div>

      <div className="auth-field">
        <label htmlFor="email" className="auth-label">
          Correo electrónico
        </label>

        <div className="auth-input-wrapper">
          <Mail size={18} className="auth-input-icon" />

          <input
            id="email"
            name="email"
            type="text"
            required
            value={email}
            disabled={loading}
            placeholder="Correo electrónico"
            className="auth-input auth-input-with-icon"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            aria-invalid={!!error}
            aria-describedby={error ? "login-error" : undefined}
            onChange={(event) => updateEmail(event.target.value)}
          />
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="password" className="auth-label">
          Contraseña
        </label>

        <div className="auth-input-wrapper">
          <Lock size={18} className="auth-input-icon" />

          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            disabled={loading}
            placeholder="Contraseña"
            className="auth-input auth-input-with-icon"
            autoComplete="current-password"
            aria-invalid={!!error}
            aria-describedby={error ? "login-error" : undefined}
            onChange={(event) => updatePassword(event.target.value)}
          />

          <button
            type="button"
            className="auth-toggle"
            disabled={loading}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            onClick={() => setShowPassword((previous) => !previous)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="login-links">
        <Link href="/recuperar-password">¿Has olvidado tu contraseña?</Link>
      </div>

      {error && (
        <p
          id="login-error"
          className="auth-error"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary btn-full">
        {loading ? (
          <>
            <LoaderCircle size={18} className="animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          "Iniciar sesión"
        )}
      </button>

      <div className="login-footer">
        <span>¿No tienes cuenta?</span>

        <Link href="/register">Crear cuenta</Link>
      </div>
    </form>
  );
}
