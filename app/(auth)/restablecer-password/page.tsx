"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import Navbar from "@/components/public/landing/NavBar";
import Footer from "@/components/public/landing/Footer";

import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import { resetPasswordSchema } from "@/validators";

import "@/components/styles/reset-password.css";

const SESSION_CHECK_DELAY_MS = 5000;

const REDIRECT_DELAY_MS = 1600;

/**
 * Recupera posibles errores enviados por
 * Supabase mediante query string o hash.
 *
 * Dependiendo del flujo de autenticación,
 * Supabase puede devolver el error en:
 *
 * ?error=...
 * ?error_description=...
 *
 * o en:
 *
 * #error=...
 * #error_description=...
 */
function getUrlErrorMessage(): string {
  const searchParams =
    new URLSearchParams(
      window.location.search,
    );

  const searchError =
    searchParams.get(
      "error_description",
    ) ??
    searchParams.get(
      "error",
    );

  if (searchError) {
    try {
      return decodeURIComponent(
        searchError.replace(
          /\+/g,
          " ",
        ),
      );
    } catch {
      return searchError;
    }
  }

  const hash =
    window.location.hash.replace(
      /^#/,
      "",
    );

  if (!hash) {
    return "";
  }

  const hashParams =
    new URLSearchParams(hash);

  const hashError =
    hashParams.get(
      "error_description",
    ) ??
    hashParams.get("error");

  if (!hashError) {
    return "";
  }

  try {
    return decodeURIComponent(
      hashError.replace(
        /\+/g,
        " ",
      ),
    );
  } catch {
    return hashError;
  }
}

/**
 * Traduce los errores técnicos de Supabase
 * a mensajes comprensibles para el participante.
 */
function getRecoveryErrorMessage(
  rawMessage: string,
): string {
  const message =
    rawMessage.toLowerCase();

  if (
    message.includes("expired") ||
    message.includes("invalid") ||
    message.includes("otp") ||
    message.includes("token")
  ) {
    return "El enlace de recuperación ha caducado o ya no es válido. Solicita un nuevo enlace para cambiar la contraseña.";
  }

  if (
    message.includes("session") ||
    message.includes(
      "auth session missing",
    )
  ) {
    return "No se ha podido validar la sesión de recuperación. Solicita un nuevo enlace e inténtalo de nuevo.";
  }

  return (
    rawMessage ||
    "No se ha podido actualizar la contraseña. Inténtalo de nuevo."
  );
}

export default function ResetPassword() {
  const router =
    useRouter();

  const redirectTimeout =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const recoveryCheckTimeout =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [
    checkingSession,
    setCheckingSession,
  ] = useState(true);

  const [
    hasRecoverySession,
    setHasRecoverySession,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    const urlError =
      getUrlErrorMessage();

    if (urlError) {
      setError(
        getRecoveryErrorMessage(
          urlError,
        ),
      );
    }

    const finishSessionCheck = (
      hasSession: boolean,
    ) => {
      if (!mounted) {
        return;
      }

      setHasRecoverySession(
        hasSession,
      );

      setCheckingSession(false);
    };

    /**
     * Comprueba si Supabase ya ha establecido
     * la sesión de recuperación.
     *
     * Con PKCE, el intercambio del código
     * puede producirse de forma asíncrona
     * al inicializar el cliente.
     */
    const initializeRecoverySession =
      async () => {
        try {
          const {
            data: { session },
          } =
            await supabase.auth.getSession();

          if (!mounted) {
            return;
          }

          if (session) {
            finishSessionCheck(
              true,
            );

            return;
          }

          /**
           * Damos tiempo al cliente de Supabase
           * para completar el intercambio PKCE
           * antes de considerar inválido el enlace.
           */
          recoveryCheckTimeout.current =
            setTimeout(
              async () => {
                const {
                  data: {
                    session:
                    delayedSession,
                  },
                } =
                  await supabase.auth.getSession();

                finishSessionCheck(
                  Boolean(
                    delayedSession,
                  ),
                );
              },
              SESSION_CHECK_DELAY_MS,
            );
        } catch {
          finishSessionCheck(
            false,
          );
        }
      };

    /**
     * Escuchamos explícitamente el evento
     * PASSWORD_RECOVERY.
     *
     * Este es el evento que Supabase genera
     * cuando el enlace de recuperación ha
     * establecido correctamente la sesión
     * temporal.
     */
    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (
          event,
          session,
        ) => {
          if (!mounted) {
            return;
          }

          if (
            event ===
            "PASSWORD_RECOVERY"
          ) {
            setHasRecoverySession(
              Boolean(
                session,
              ),
            );

            setCheckingSession(
              false,
            );

            setError("");

            return;
          }

          /**
           * También aceptamos una sesión que
           * llegue mediante el intercambio PKCE
           * antes del evento PASSWORD_RECOVERY.
           */
          if (session) {
            setHasRecoverySession(
              true,
            );

            setCheckingSession(
              false,
            );
          }
        },
      );

    void initializeRecoverySession();

    return () => {
      mounted = false;

      subscription.unsubscribe();

      if (
        redirectTimeout.current
      ) {
        clearTimeout(
          redirectTimeout.current,
        );
      }

      if (
        recoveryCheckTimeout.current
      ) {
        clearTimeout(
          recoveryCheckTimeout.current,
        );
      }
    };
  }, []);

  function updatePassword(
    value: string,
  ) {
    setError("");
    setPassword(value);
  }

  function updateConfirmPassword(
    value: string,
  ) {
    setError("");
    setConfirmPassword(value);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      loading ||
      checkingSession ||
      !hasRecoverySession
    ) {
      return;
    }

    const result =
      resetPasswordSchema.safeParse({
        password,
        confirmPassword,
      });

    if (!result.success) {
      setError(
        result.error.issues[0]
          ?.message ??
        "Comprueba los datos introducidos.",
      );

      return;
    }

    setLoading(true);
    setError("");

    try {
      /**
       * updateUser() solo se ejecuta después
       * de comprobar que existe una sesión
       * válida de recuperación.
       */
      const {
        error: updateError,
      } =
        await supabase.auth.updateUser({
          password,
        });

      if (updateError) {
        setError(
          getRecoveryErrorMessage(
            updateError.message,
          ),
        );

        return;
      }

      setSuccess(true);

      /**
       * Cerramos únicamente la sesión local
       * después de actualizar correctamente
       * la contraseña.
       *
       * De esta forma el usuario deberá iniciar
       * sesión nuevamente con su nueva contraseña.
       */
      await supabase.auth.signOut({
        scope: "local",
      });

      redirectTimeout.current =
        setTimeout(() => {
          router.replace(
            "/login?reset=true",
          );
        }, REDIRECT_DELAY_MS);
    } catch {
      setError(
        "No se ha podido actualizar la contraseña. Comprueba tu conexión e inténtalo de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  }

  const formDisabled =
    loading ||
    checkingSession ||
    !hasRecoverySession;

  return (
    <div className="reset-password-page">
      <Navbar />

      <main className="reset-password-main">
        <div className="reset-password-container">
          <div className="reset-password-card">
            {success ? (
              <div className="reset-password-success">
                <div className="reset-password-success-icon">
                  <CheckCircle
                    size={32}
                    aria-hidden="true"
                  />
                </div>

                <h1 className="reset-password-title">
                  ¡Contraseña actualizada!
                </h1>

                <p className="reset-password-description">
                  Tu contraseña se ha actualizado correctamente. Serás
                  redirigido al inicio de sesión en unos segundos.
                </p>
              </div>
            ) : checkingSession ? (
              <div
                className="reset-password-state"
                role="status"
                aria-live="polite"
              >
                <div className="reset-password-state-icon">
                  <LoaderCircle
                    size={30}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                </div>

                <h1 className="reset-password-title">
                  Validando el enlace
                </h1>

                <p className="reset-password-description">
                  Estamos validando de forma segura el enlace de recuperación.
                </p>
              </div>
            ) : !hasRecoverySession ? (
              <div className="reset-password-state">
                <div className="reset-password-state-icon reset-password-state-icon--error">
                  <Lock
                    size={30}
                    aria-hidden="true"
                  />
                </div>

                <h1 className="reset-password-title">
                  Enlace no válido
                </h1>

                <p className="reset-password-description">
                  {error ||
                    "El enlace de recuperación no es válido o ha caducado. Solicita un nuevo enlace para cambiar tu contraseña."}
                </p>

                <button
                  type="button"
                  className="btn-primary btn-full"
                  onClick={() =>
                    router.replace(
                      "/recuperar-password",
                    )
                  }
                >
                  Solicitar un nuevo enlace
                </button>
              </div>
            ) : (
              <>
                <div className="reset-password-header">
                  <div className="reset-password-security">
                    <ShieldCheck
                      size={16}
                      aria-hidden="true"
                    />

                    <span>
                      Sesión de recuperación verificada
                    </span>
                  </div>

                  <h1 className="reset-password-title">
                    Nueva contraseña
                  </h1>

                  <p className="reset-password-description">
                    Introduce una nueva contraseña para volver a acceder a
                    Alpha-Help.
                  </p>
                </div>

                <form
                  onSubmit={
                    handleSubmit
                  }
                  className="reset-password-form"
                >
                  <div className="reset-password-input-wrapper">
                    <Lock
                      size={18}
                      className="reset-password-icon"
                      aria-hidden="true"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      className="reset-password-input"
                      placeholder="Nueva contraseña"
                      autoComplete="new-password"
                      autoFocus
                      required
                      disabled={
                        formDisabled
                      }
                      value={password}
                      onChange={(
                        event,
                      ) =>
                        updatePassword(
                          event.target.value,
                        )
                      }
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
                      onClick={() =>
                        setShowPassword(
                          (
                            previous,
                          ) =>
                            !previous,
                        )
                      }
                    >
                      {showPassword ? (
                        <EyeOff
                          size={18}
                          aria-hidden="true"
                        />
                      ) : (
                        <Eye
                          size={18}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </div>

                  <div className="reset-password-input-wrapper">
                    <Lock
                      size={18}
                      className="reset-password-icon"
                      aria-hidden="true"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      className="reset-password-input"
                      placeholder="Confirmar contraseña"
                      autoComplete="new-password"
                      required
                      disabled={
                        formDisabled
                      }
                      value={
                        confirmPassword
                      }
                      onChange={(
                        event,
                      ) =>
                        updateConfirmPassword(
                          event.target.value,
                        )
                      }
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
                    disabled={
                      formDisabled
                    }
                    className="btn-primary btn-full"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                          aria-hidden="true"
                        />

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