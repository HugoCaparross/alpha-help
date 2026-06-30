"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/public/landing/NavBar";
import Footer from "@/components/public/landing/Footer";

import { Lock, Eye, EyeOff, CheckCircle, LoaderCircle } from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import { resetPasswordSchema } from "@/validators";

import "@/components/styles/reset-password.css";

export default function ResetPassword() {
  const router = useRouter();

  const redirectTimeout = useRef<NodeJS.Timeout | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    return () => {
      if (redirectTimeout.current) {
        clearTimeout(redirectTimeout.current);
      }
    };
  }, []);

  function updatePassword(value: string) {
    setError("");
    setPassword(value);
  }

  function updateConfirmPassword(value: string) {
    setError("");
    setConfirmPassword(value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = resetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error.message || "No se ha podido actualizar la contraseña.");
        return;
      }

      setSuccess(true);

      redirectTimeout.current = setTimeout(() => {
        router.replace("/login");
      }, 2000);
    } catch (error) {
      console.error(error);

      setError("Se ha producido un error inesperado. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="reset-password-page">
      <Navbar />

      <main className="reset-password-main">
        <div className="reset-password-container">
          <div className="reset-password-card">
            {success ? (
              <div className="reset-password-success">
                <div className="reset-password-success-icon">
                  <CheckCircle size={32} />
                </div>

                <h1 className="reset-password-title">
                  ¡Contraseña actualizada!
                </h1>

                <p className="reset-password-description">
                  Tu contraseña se ha actualizado correctamente. Serás
                  redirigido automáticamente al inicio de sesión en unos
                  segundos.
                </p>
              </div>
            ) : (
              <>
                <div className="reset-password-header">
                  <h1 className="reset-password-title">Nueva contraseña</h1>

                  <p className="reset-password-description">
                    Introduce una nueva contraseña para volver a acceder a
                    Alpha-Help.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="reset-password-form">
                  <div className="reset-password-input-wrapper">
                    <Lock size={18} className="reset-password-icon" />

                    <input
                      type={showPassword ? "text" : "password"}
                      className="reset-password-input"
                      placeholder="Nueva contraseña"
                      autoComplete="new-password"
                      disabled={loading}
                      value={password}
                      onChange={(e) => updatePassword(e.target.value)}
                    />

                    <button
                      type="button"
                      className="reset-password-toggle"
                      disabled={loading}
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="reset-password-input-wrapper">
                    <Lock size={18} className="reset-password-icon" />

                    <input
                      type={showPassword ? "text" : "password"}
                      className="reset-password-input"
                      placeholder="Confirmar contraseña"
                      autoComplete="new-password"
                      disabled={loading}
                      value={confirmPassword}
                      onChange={(e) => updateConfirmPassword(e.target.value)}
                    />
                  </div>

                  {error && (
                    <p
                      className="reset-password-error"
                      role="alert"
                      aria-live="polite"
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary btn-full"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle size={18} className="animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar contraseña"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
