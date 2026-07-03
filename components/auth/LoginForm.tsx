"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";

import { Eye, EyeOff, LoaderCircle, Lock, Mail } from "lucide-react";

import { supabase } from "@/lib/supabase/client";

import { loginSchema } from "@/validators";

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

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = loginSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);

      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        const message = error.message.toLowerCase();

        if (message.includes("email") || message.includes("confirm")) {
          setError(
            "Debes verificar tu correo electrónico antes de iniciar sesión.",
          );

          return;
        }

        if (message.includes("rate")) {
          setError(
            "Se han realizado demasiados intentos. Inténtalo de nuevo dentro de unos minutos.",
          );

          return;
        }

        setError("Correo o contraseña incorrectos.");

        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);

      setError("Se ha producido un error inesperado. Inténtalo de nuevo.");
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

      {/* EMAIL */}

      <div className="auth-field">
        <label htmlFor="email" className="auth-label">
          Correo electrónico
        </label>

        <div className="auth-input-wrapper">
          <Mail size={18} className="auth-input-icon" />

          <input
            id="email"
            name="email"
            type="email"
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
            onChange={(e) => updateEmail(e.target.value)}
          />
        </div>
      </div>

      {/* PASSWORD */}

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
            onChange={(e) => updatePassword(e.target.value)}
          />

          <button
            type="button"
            className="auth-toggle"
            disabled={loading}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            onClick={() => setShowPassword(!showPassword)}
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
