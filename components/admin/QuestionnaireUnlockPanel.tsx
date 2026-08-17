"use client";

import { useEffect, useState } from "react";

interface Settings {
  post_enabled: boolean;
  post_release_at: string | null;
}

function toDatetimeLocal(value: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (number: number): string => String(number).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function QuestionnaireUnlockPanel() {
  const [enabled, setEnabled] = useState(false);
  const [releaseAt, setReleaseAt] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function load(): Promise<void> {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/questionnaires", {
        cache: "no-store",
      });

      const payload = await response.json();

      if (!response.ok || !payload?.ok) {
        throw new Error(
          payload?.error ??
            "No se ha podido cargar la configuración.",
        );
      }

      const settings = payload.settings as Settings;

      setEnabled(Boolean(settings.post_enabled));
      setReleaseAt(toDatetimeLocal(settings.post_release_at));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Error inesperado.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(): Promise<void> {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let normalizedReleaseAt: string | null = null;

      if (releaseAt) {
        const date = new Date(releaseAt);

        if (Number.isNaN(date.getTime())) {
          throw new Error(
            "La fecha y hora de desbloqueo no son válidas.",
          );
        }

        normalizedReleaseAt = date.toISOString();
      }

      const response = await fetch("/api/admin/questionnaires", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postEnabled: enabled,
          postReleaseAt: normalizedReleaseAt,
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload?.ok) {
        throw new Error(
          payload?.error ??
            "No se ha podido guardar la configuración.",
        );
      }

      setSuccess("Configuración guardada correctamente.");

      await load();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Error inesperado.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleToggle(): void {
    setEnabled((current) => !current);
    setSuccess("");
    setError("");
  }

  if (loading) {
    return (
      <section
        className="admin-questionnaire-settings"
        aria-busy="true"
      >
        <h2 className="admin-section-title">
          Evaluación final
        </h2>

        <p className="admin-muted">
          Cargando configuración...
        </p>
      </section>
    );
  }

  return (
    <section className="admin-questionnaire-settings">
      <div className="admin-questionnaire-settings__header">
        <div>
          <h2 className="admin-section-title">
            Evaluación final
          </h2>

          <p className="admin-muted">
            Controla cuándo puede acceder el participante a la
            evaluación final.
          </p>
        </div>

        <span
          className={`admin-status-pill ${
            enabled
              ? "admin-status-pill--active"
              : "admin-status-pill--inactive"
          }`}
        >
          {enabled ? "Desbloqueada" : "Bloqueada"}
        </span>
      </div>

      <div className="admin-questionnaire-settings__form">
        <button
          type="button"
          className={
            enabled
              ? "admin-unlock-button admin-unlock-button--active"
              : "admin-unlock-button"
          }
          onClick={handleToggle}
          aria-pressed={enabled}
          disabled={saving}
        >
          {enabled
            ? "Bloquear evaluación final"
            : "Desbloquear evaluación final"}
        </button>

        <label className="admin-field">
          <span>Fecha y hora de desbloqueo</span>

          <input
            type="datetime-local"
            value={releaseAt}
            onChange={(event) => {
              setReleaseAt(event.target.value);
              setSuccess("");
              setError("");
            }}
            disabled={saving}
          />
        </label>

        <p className="admin-muted">
          Si la fecha está vacía y el desbloqueo está activo, la
          evaluación queda disponible inmediatamente.
        </p>

        {error && (
          <p
            className="admin-feedback admin-feedback--error"
            role="alert"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            className="admin-feedback admin-feedback--success"
            role="status"
          >
            {success}
          </p>
        )}

        <div className="admin-questionnaire-settings__actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => void save()}
            disabled={saving}
          >
            {saving
              ? "Guardando..."
              : "Guardar configuración"}
          </button>
        </div>
      </div>
    </section>
  );
}