"use client";

import { useState } from "react";
import Link from "next/link";

import Navbar from "@/components/public/landing/NavBar";
import Footer from "@/components/public/landing/Footer";

import { Mail, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

import { supabase } from "@/lib/supabase/client";

import "@/components/styles/reset-password.css";

export default function RecoverPassword() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/restablecer-password`,
    });

    setLoading(false);

    if (error) {
      const message = error.message.toLowerCase();

      if (message.includes("rate limit")) {
        setError(
          "Se han realizado demasiadas solicitudes. Inténtalo de nuevo dentro de unos minutos.",
        );
      } else {
        setError(
          "No hemos podido procesar tu solicitud. Inténtalo de nuevo más tarde.",
        );
      }

      return;
    }

    setSuccess(true);
  }

  return (
    <div className="recover-password-page">
      <Navbar />

      <main className="recover-password-main">
        <div className="recover-password-container">
          <div className="recover-password-card">
            {success ? (
              <div className="recover-password-success">
                <div className="recover-password-success-icon">
                  <CheckCircle size={30} />
                </div>

                <h1 className="recover-password-title">Revisa tu correo</h1>

                <p className="recover-password-description">
                  Si existe una cuenta asociada a este correo electrónico,
                  recibirás un enlace para restablecer tu contraseña.
                </p>

                <Link href="/login" className="btn-primary btn-full">
                  Volver al inicio de sesión
                  <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              <>
                <div className="recover-password-header">
                  <h1 className="recover-password-title">
                    Recuperar contraseña
                  </h1>

                  <p className="recover-password-description">
                    Introduce tu correo electrónico y te enviaremos un enlace
                    para crear una nueva contraseña.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="recover-password-form">
                  <div className="recover-password-input-wrapper">
                    <Mail size={18} className="recover-password-icon" />

                    <input
                      type="email"
                      required
                      placeholder="Correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="recover-password-input"
                    />
                  </div>

                  {error && <p className="recover-password-error">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary btn-full"
                  >
                    {loading ? "Enviando..." : "Enviar enlace"}
                  </button>
                </form>

                <div className="recover-password-footer">
                  <Link href="/login">
                    <ArrowLeft size={16} />
                    Volver a iniciar sesión
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
