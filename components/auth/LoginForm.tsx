"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";

import { supabase } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Correo o contraseña incorrectos.");

      setLoading(false);

      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleLogin}>
      <div className="register-header">
        <h1 className="register-title">Iniciar sesión</h1>

        <p className="register-description">
          Accede a tu cuenta para continuar.
        </p>
      </div>

      {/* EMAIL */}

      <div className="auth-field">
        <div className="auth-input-wrapper">
          <Mail size={18} className="auth-input-icon" />

          <input
            type="email"
            required
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input auth-input-with-icon"
          />
        </div>
      </div>

      {/* PASSWORD */}

      <div className="auth-field">
        <div className="auth-input-wrapper">
          <Lock size={18} className="auth-input-icon" />

          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input auth-input-with-icon"
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

      <div className="login-links">
        <Link href="/recuperar-password">¿Has olvidado tu contraseña?</Link>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary btn-full">
        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>

      <div className="login-footer">
        <span>¿No tienes cuenta?</span>

        <a href="/register">Crear cuenta</a>
      </div>
    </form>
  );
}
