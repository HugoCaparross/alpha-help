"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { supabase } from "@/lib/supabase/client";
import { authService } from "@/services/auth/auth.service";

const SESSION_CONFIG = {
  inactivityMinutes: 5,
  hiddenMinutes: 5,
  storageKey: "alpha-help-last-active",
} as const;

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

export default function SessionTimeout() {
  const pathname = usePathname();

  const isQuestionnaireRoute =
    pathname?.startsWith("/cuestionarios") ?? false;

  const isPasswordRecoveryRoute =
    pathname === "/recuperar-password" ||
    pathname === "/restablecer-password";

  const timeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleTimeoutRef = useRef<(() => void) | null>(null);
  const isLoggingOutRef = useRef(false);

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

  const clearActivityTimestamp = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_CONFIG.storageKey);
    } catch {
      // Ignorar errores del almacenamiento.
    }
  }, []);

  const logout = useCallback(async () => {
    if (isLoggingOutRef.current) return;

    isLoggingOutRef.current = true;

    try {
      await authService.logout();
    } catch {
      // La sesión puede haber expirado previamente.
    } finally {
      clearActivityTimestamp();
      window.location.assign("/");
    }
  }, [clearActivityTimestamp]);

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

    const remaining = Math.max(0, inactivityLimit - elapsed);

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

      // Otra pestaña puede haber registrado actividad.
      if (latestElapsed < inactivityLimit) {
        scheduleTimeoutRef.current?.();
        return;
      }

      void logout();
    }, remaining);
  }, [logout]);

  useEffect(() => {
    scheduleTimeoutRef.current = scheduleTimeout;

    return () => {
      scheduleTimeoutRef.current = null;
    };
  }, [scheduleTimeout]);

  const registerActivity = useCallback(() => {
    if (isLoggingOutRef.current) return;

    saveActivityTimestamp();
    scheduleTimeout();
  }, [saveActivityTimestamp, scheduleTimeout]);

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

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "hidden") return;
    checkInactivity();
  }, [checkInactivity]);

  const handlePageShow = useCallback(() => {
    checkInactivity();
  }, [checkInactivity]);

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
    // No aplicar el temporizador al flujo de recuperación.
    if (isPasswordRecoveryRoute) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      return;
    }

    // Los cuestionarios quedan excluidos del cierre automático.
    if (isQuestionnaireRoute) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      saveActivityTimestamp();
      return;
    }

    let mounted = true;

    const stopMonitoring = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, registerActivity);
      });

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );

      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("storage", handleStorage);
    };

    const startMonitoring = () => {
      if (!mounted || isLoggingOutRef.current) return;

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

      // No reiniciar el contador si la sesión ya ha expirado.
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
        window.addEventListener(event, registerActivity, {
          passive: true,
        });
      });

      document.addEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );

      window.addEventListener("pageshow", handlePageShow);
      window.addEventListener("storage", handleStorage);

      scheduleTimeout();
    };

    const initialize = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (!session) {
        stopMonitoring();
        clearActivityTimestamp();
        return;
      }

      stopMonitoring();
      startMonitoring();
    });

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
    isQuestionnaireRoute,
    isPasswordRecoveryRoute,
  ]);

  return null;
}