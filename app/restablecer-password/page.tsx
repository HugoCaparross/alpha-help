"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/public/landing/NavBar";
import Footer from "@/components/public/landing/Footer";

import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

import { supabase } from "@/lib/supabase/client";

import "@/components/styles/reset-password.css";

export default function ResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");

      setLoading(false);

      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");

      setLoading(false);

      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Error al restablecer la contraseña.");

      return;
    }

    setSuccess(true);

    setTimeout(() => {
      router.push("/login");
    }, 3000);
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
                  <CheckCircle size={32} className="text-green-600" />
                </div>

                <h1 className="reset-password-title">
                  ¡Contraseña actualizada!
                </h1>

                <p className="reset-password-description">
                  Tu contraseña se ha restablecido correctamente. Serás
                  redirigido al inicio de sesión en unos segundos.
                </p>
              </div>
            ) : (
              <>
                <div className="reset-password-header">
                  <h1 className="reset-password-title">Nueva contraseña</h1>

                  <p className="reset-password-description">
                    Introduce tu nueva contraseña para acceder a Alpha-Help.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="reset-password-form">
                  <div className="reset-password-input-wrapper">
                    <Lock size={18} className="reset-password-icon" />

                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Nueva contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="reset-password-input"
                    />

                    <button
                      type="button"
                      className="reset-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="reset-password-input-wrapper">
                    <Lock size={18} className="reset-password-icon" />

                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Confirmar contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="reset-password-input"
                    />
                  </div>

                  {error && <p className="reset-password-error">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary btn-full"
                  >
                    {loading ? "Guardando..." : "Guardar contraseña"}
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
