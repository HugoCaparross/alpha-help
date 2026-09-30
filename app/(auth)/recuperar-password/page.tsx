"use client";

import { useState } from "react";
import Link from "next/link";

import Navbar from "@/components/public/landing/NavBar";
import Footer from "@/components/public/landing/Footer";

import {
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  LoaderCircle,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";

import { recoverPasswordSchema } from "@/validators";

import "@/components/styles/reset-password.css";

/**
 * Obtiene la URL absoluta que Supabase utilizará
 * para devolver al usuario después de enviar el
 * correo de recuperación.
 *
 * En producción se recomienda definir:
 *
 * NEXT_PUBLIC_SITE_URL=https://alpha-help.org
 *
 * El fallback al origin actual permite que el flujo
 * siga funcionando durante desarrollo local siempre
 * que localhost esté incluido en las Redirect URLs
 * de Supabase.
 */
function getRecoveryRedirectUrl(): string {
  const configuredSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredSiteUrl) {
    return new URL(
      "/restablecer-password",
      configuredSiteUrl.endsWith("/")
        ? configuredSiteUrl
        : `${configuredSiteUrl}/`,
    ).toString();
  }

  return new URL(
    "/restablecer-password",
    window.location.origin,
  ).toString();
}

export default function RecoverPassword() {
  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  function updateEmail(
    value: string,
  ) {
    setError("");
    setEmail(value);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const result =
      recoverPasswordSchema.safeParse({
        email: normalizedEmail,
      });

    if (!result.success) {
      setError(
        result.error.issues[0]?.message ??
        "Introduce un correo electrónico válido.",
      );

      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error } =
        await supabase.auth.resetPasswordForEmail(
          normalizedEmail,
          {
            redirectTo:
              getRecoveryRedirectUrl(),
          },
        );

      if (error) {
        const message =
          error.message.toLowerCase();

        /**
         * Supabase puede devolver distintos
         * mensajes dependiendo de la configuración
         * y del proveedor de correo.
         */
        if (
          message.includes("rate") ||
          message.includes("too many") ||
          message.includes("limit")
        ) {
          setError(
            "Se han realizado demasiadas solicitudes. Espera unos minutos antes de volver a solicitar otro enlace.",
          );

          return;
        }

        /**
         * Error típico cuando redirectTo no está
         * incluido en las Redirect URLs permitidas
         * en Supabase.
         */
        if (
          message.includes("redirect") ||
          message.includes("url")
        ) {
          setError(
            "El servicio de recuperación no tiene configurada correctamente la dirección de retorno. Contacta con el equipo de soporte.",
          );

          return;
        }

        setError(
          "No hemos podido procesar tu solicitud. Inténtalo de nuevo más tarde.",
        );

        return;
      }

      /**
       * No revelamos si el correo existe o no.
       *
       * Esto evita enumeración de usuarios.
       */
      setSuccess(true);
    } catch {
      setError(
        "No hemos podido procesar tu solicitud. Comprueba tu conexión e inténtalo de nuevo.",
      );
    } finally {
      setLoading(false);
    }
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
                  <CheckCircle
                    size={30}
                    aria-hidden="true"
                  />
                </div>

                <h1 className="recover-password-title">
                  Revisa tu correo
                </h1>

                <p className="recover-password-description">
                  Si existe una cuenta asociada a este correo electrónico,
                  recibirás un enlace para restablecer tu contraseña.
                </p>

                <Link
                  href="/login"
                  className="btn-primary btn-full"
                >
                  Volver al inicio de sesión
                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            ) : (
              <>
                <div className="recover-password-header">
                  <h1 className="recover-password-title">
                    Recuperar contraseña
                  </h1>

                  <p
                    id="recover-password-description"
                    className="recover-password-description"
                  >
                    Introduce tu correo electrónico y te enviaremos un enlace
                    para restablecer tu contraseña.
                  </p>
                </div>

                <form
                  onSubmit={
                    handleSubmit
                  }
                  className="recover-password-form"
                >
                  <div className="recover-password-input-wrapper">
                    <Mail
                      size={18}
                      className="recover-password-icon"
                      aria-hidden="true"
                    />

                    <input
                      type="email"
                      autoFocus
                      autoComplete="email"
                      required
                      disabled={loading}
                      aria-describedby="recover-password-description"
                      placeholder="Correo electrónico"
                      className="recover-password-input"
                      value={email}
                      onChange={(
                        event,
                      ) =>
                        updateEmail(
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  {error && (
                    <p
                      className="recover-password-error"
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
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                          aria-hidden="true"
                        />

                        Enviando enlace...
                      </>
                    ) : (
                      "Enviar enlace"
                    )}
                  </button>
                </form>

                <div className="recover-password-footer">
                  <Link href="/login">
                    <ArrowLeft
                      size={16}
                      aria-hidden="true"
                    />

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