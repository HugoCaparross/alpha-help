"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";
import { authService } from "@/services/auth/auth.service";

/**
 * Configuración global de la sesión.
 *
 * La sesión se considera inactiva cuando no existe
 * ninguna actividad del usuario durante 5 minutos.
 */
const SESSION_CONFIG = {
  /**
   * Tiempo máximo de inactividad antes de
   * cerrar automáticamente la sesión.
   */
  inactivityMinutes: 5,

  /**
   * Tiempo máximo que puede permanecer la
   * aplicación en segundo plano sin actividad.
   *
   * Se mantiene alineado con el tiempo de
   * inactividad para evitar que una pestaña
   * oculta conserve una sesión indefinidamente.
   */
  hiddenMinutes: 5,

  /**
   * Clave utilizada para sincronizar la
   * última actividad entre pestañas.
   */
  storageKey: "alpha-help-last-active",
} as const;

/**
 * Eventos que se consideran actividad real
 * del usuario dentro de la aplicación.
 */
const ACTIVITY_EVENTS: readonly (keyof WindowEventMap)[] = [
  "mousemove",
  "mousedown",
  "pointerdown",
  "pointermove",
  "keydown",
  "scroll",
  "touchstart",
  "wheel",
];

/**
 * Gestiona automáticamente el cierre de sesión
 * por inactividad.
 *
 * Características:
 *
 * - Cierre tras 5 minutos sin actividad.
 * - El mismo límite se aplica con la pestaña oculta.
 * - Sincronización de actividad entre pestañas.
 * - Evita múltiples intentos de cierre de sesión.
 * - Solo monitoriza sesiones autenticadas.
 */
export default function SessionTimeout() {
  const router = useRouter();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLoggingOutRef = useRef(false);

  /**
   * Guarda la fecha de la última actividad
   * para poder calcular el tiempo real de
   * inactividad incluso si el navegador
   * permanece en segundo plano.
   */
  const saveActivityTimestamp = useCallback(() => {
    try {
      localStorage.setItem(
        SESSION_CONFIG.storageKey,
        Date.now().toString(),
      );
    } catch {
      // Ignorar errores del almacenamiento.
    }
  }, []);

  /**
   * Elimina el timestamp de actividad al
   * quedar la sesión completamente cerrada.
   */
  const clearActivityTimestamp = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_CONFIG.storageKey);
    } catch {
      // Ignorar errores del almacenamiento.
    }
  }, []);

  /**
   * Cierra la sesión.
   *
   * El cierre se realiza mediante Supabase para
   * invalidar la sesión local y sincronizar el
   * estado de autenticación con el resto de la app.
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
    } finally {
      clearActivityTimestamp();

      router.replace("/");
      router.refresh();
    }
  }, [clearActivityTimestamp, router]);

  /**
   * Programa el cierre exactamente al alcanzar
   * el límite de inactividad.
   */
  const scheduleTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    let lastActivity: string | null = null;

    try {
      lastActivity = localStorage.getItem(
        SESSION_CONFIG.storageKey,
      );
    } catch {
      lastActivity = null;
    }

    const inactivityLimit =
      SESSION_CONFIG.inactivityMinutes * 60 * 1000;

    const elapsed = lastActivity
      ? Math.max(0, Date.now() - Number(lastActivity))
      : 0;

    const remaining = Math.max(
      0,
      inactivityLimit - elapsed,
    );

    timeoutRef.current = setTimeout(() => {
      let latestActivity: string | null = null;

      try {
        latestActivity = localStorage.getItem(
          SESSION_CONFIG.storageKey,
        );
      } catch {
        latestActivity = null;
      }

      const latestElapsed = latestActivity
        ? Date.now() - Number(latestActivity)
        : inactivityLimit;

      /**
       * Si otra pestaña registró actividad antes
       * de que este temporizador se ejecutara,
       * no se cierra la sesión.
       */
      if (latestElapsed < inactivityLimit) {
        scheduleTimeout();

        return;
      }

      void logout();
    }, remaining);
  }, [logout]);

  /**
   * Registra actividad y vuelve a programar
   * el cierre automático.
   */
  const registerActivity = useCallback(() => {
    if (isLoggingOutRef.current) {
      return;
    }

    saveActivityTimestamp();
    scheduleTimeout();
  }, [saveActivityTimestamp, scheduleTimeout]);

  /**
   * Comprueba el tiempo transcurrido desde la
   * última actividad registrada.
   */
  const checkInactivity = useCallback(() => {
    let lastActivity: string | null = null;

    try {
      lastActivity = localStorage.getItem(
        SESSION_CONFIG.storageKey,
      );
    } catch {
      lastActivity = null;
    }

    if (!lastActivity) {
      registerActivity();

      return;
    }

    const elapsed = Date.now() - Number(lastActivity);

    if (
      elapsed >=
      SESSION_CONFIG.hiddenMinutes * 60 * 1000
    ) {
      void logout();

      return;
    }

    scheduleTimeout();
  }, [logout, registerActivity, scheduleTimeout]);

  /**
   * Detecta cambios de visibilidad de la pestaña.
   */
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "hidden") {
      return;
    }

    checkInactivity();
  }, [checkInactivity]);

  /**
   * La página vuelve a mostrarse después de
   * haber estado en segundo plano o restaurada.
   */
  const handlePageShow = useCallback(() => {
    checkInactivity();
  }, [checkInactivity]);

  /**
   * Sincroniza la actividad entre pestañas.
   *
   * Si el usuario está utilizando otra pestaña
   * de ALPHA-HELP, esta pestaña no debe cerrar
   * una sesión que sigue activa.
   */
  const handleStorage = useCallback(
    (event: StorageEvent) => {
      if (
        event.key !== SESSION_CONFIG.storageKey ||
        !event.newValue
      ) {
        return;
      }

      scheduleTimeout();
    },
    [scheduleTimeout],
  );

  useEffect(() => {
    let mounted = true;

    const stopMonitoring = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(
          event,
          registerActivity,
        );
      });

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );

      window.removeEventListener(
        "pageshow",
        handlePageShow,
      );

      window.removeEventListener(
        "storage",
        handleStorage,
      );
    };

    const startMonitoring = () => {
      if (!mounted || isLoggingOutRef.current) {
        return;
      }

      let lastActivity: string | null = null;

      try {
        lastActivity = localStorage.getItem(
          SESSION_CONFIG.storageKey,
        );
      } catch {
        lastActivity = null;
      }

      const inactivityLimit =
        SESSION_CONFIG.inactivityMinutes * 60 * 1000;

      /**
       * Si existe una marca anterior y ya han pasado
       * 5 minutos, la sesión se cierra inmediatamente.
       * Esto evita que una recarga o reapertura de la web
       * reinicie artificialmente el contador.
       */
      if (
        lastActivity &&
        Date.now() - Number(lastActivity) >= inactivityLimit
      ) {
        void logout();

        return;
      }

      if (!lastActivity) {
        saveActivityTimestamp();
      }

      ACTIVITY_EVENTS.forEach((event) => {
        window.addEventListener(
          event,
          registerActivity,
          {
            passive: true,
          },
        );
      });

      document.addEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );

      window.addEventListener(
        "pageshow",
        handlePageShow,
      );

      window.addEventListener(
        "storage",
        handleStorage,
      );

      scheduleTimeout();
    };

    const initialize = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (!session) {
        stopMonitoring();
        clearActivityTimestamp();

        return;
      }

      startMonitoring();
    };

    void initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) {
          return;
        }

        if (!session) {
          stopMonitoring();
          clearActivityTimestamp();

          return;
        }

        stopMonitoring();
        startMonitoring();
      },
    );

    return () => {
      mounted = false;

      stopMonitoring();
      subscription.unsubscribe();
    };
  }, [
    clearActivityTimestamp,
    handlePageShow,
    handleStorage,
    handleVisibilityChange,
    logout,
    registerActivity,
    saveActivityTimestamp,
    scheduleTimeout,
  ]);

  return null;
}