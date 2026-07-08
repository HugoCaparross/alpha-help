"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/services/auth/auth.service";

/**
 * Configuración global de la sesión.
 */
const SESSION_CONFIG = {
  /**
   * Tiempo máximo de inactividad.
   */
  inactivityMinutes: 60,

  /**
   * Tiempo máximo permitido
   * con la pestaña oculta.
   */
  hiddenMinutes: 30,

  /**
   * Clave utilizada para
   * almacenar la última actividad.
   */
  storageKey: "alpha-help-last-active",
} as const;

/**
 * Eventos considerados
 * como actividad del usuario.
 */
const ACTIVITY_EVENTS: readonly (keyof WindowEventMap)[] = [
  "mousemove",
  "mousedown",
  "pointerdown",
  "pointermove",
  "keydown",
  "scroll",
  "touchstart",
  "focus",
];

/**
 * Gestiona automáticamente
 * el cierre de sesión por seguridad.
 *
 * Características:
 *
 * - Inactividad.
 * - Pestaña oculta.
 * - Cierre del navegador.
 * - Protección frente a múltiples logout.
 */
export default function SessionTimeout() {
  const router = useRouter();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLoggingOutRef = useRef(false);

  /**
   * Guarda la fecha de la
   * última actividad.
   */
  const saveActivityTimestamp = useCallback(() => {
    try {
      localStorage.setItem(SESSION_CONFIG.storageKey, Date.now().toString());
    } catch {
      // Ignorar errores del almacenamiento.
    }
  }, []);

  /**
   * Cierra la sesión.
   *
   * Evita múltiples ejecuciones
   * simultáneas.
   */
  const logout = useCallback(async () => {
    if (isLoggingOutRef.current) {
      return;
    }

    isLoggingOutRef.current = true;

    try {
      await authService.logout();
    } catch {
      // La sesión puede haber expirado previamente.
    }

    router.replace("/");
    router.refresh();
  }, [router]);

  /**
   * Reinicia el temporizador
   * de inactividad.
   */
  const resetTimeout = useCallback(() => {
    saveActivityTimestamp();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(
      () => {
        void logout();
      },
      SESSION_CONFIG.inactivityMinutes * 60 * 1000,
    );
  }, [logout, saveActivityTimestamp]);

  /**
   * Comprueba cuánto tiempo
   * ha permanecido el usuario
   * fuera de la aplicación.
   */
  const checkHiddenTime = useCallback(() => {
    let lastActivity: string | null = null;

    try {
      lastActivity = localStorage.getItem(SESSION_CONFIG.storageKey);
    } catch {
      return;
    }

    if (!lastActivity) {
      return;
    }

    const elapsed = Date.now() - Number(lastActivity);

    if (elapsed >= SESSION_CONFIG.hiddenMinutes * 60 * 1000) {
      void logout();

      return;
    }

    resetTimeout();
  }, [logout, resetTimeout]);

  /**
   * Detecta cambios de
   * visibilidad de la pestaña.
   */
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "hidden") {
      saveActivityTimestamp();

      return;
    }

    checkHiddenTime();
  }, [checkHiddenTime, saveActivityTimestamp]);

  /**
   * La página pasa a segundo plano
   * o va a cerrarse.
   */
  const handlePageHide = useCallback(() => {
    saveActivityTimestamp();
  }, [saveActivityTimestamp]);

  /**
   * La página vuelve
   * a mostrarse.
   */
  const handlePageShow = useCallback(() => {
    checkHiddenTime();
  }, [checkHiddenTime]);

  useEffect(() => {
    saveActivityTimestamp();

    resetTimeout();

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, resetTimeout, {
        passive: true,
      });
    });

    document.addEventListener("visibilitychange", handleVisibilityChange);

    window.addEventListener("pagehide", handlePageHide);

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, resetTimeout);
      });

      document.removeEventListener("visibilitychange", handleVisibilityChange);

      window.removeEventListener("pagehide", handlePageHide);

      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [
    resetTimeout,
    saveActivityTimestamp,
    handleVisibilityChange,
    handlePageHide,
    handlePageShow,
  ]);

  return null;
}
