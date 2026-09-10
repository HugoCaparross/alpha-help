"use client";

import { useEffect, useState } from "react";
import { CalendarDays, LockKeyhole, UnlockKeyhole } from "lucide-react";

interface RegionSettings {
  post_enabled: boolean;
  post_release_at: string | null;
}

interface SettingsPayload {
  España: RegionSettings;
  Latinoamérica: RegionSettings;
}

const REGIONS = ["España", "Latinoamérica"] as const;
type Region = (typeof REGIONS)[number];

function toDatetimeLocal(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (number: number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function emptySettings(): SettingsPayload {
  return {
    España: { post_enabled: false, post_release_at: null },
    Latinoamérica: { post_enabled: false, post_release_at: null },
  };
}

export default function QuestionnaireUnlockPanel() {
  const [settings, setSettings] = useState<SettingsPayload>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [savingRegion, setSavingRegion] = useState<Region | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function load(): Promise<void> {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/questionnaires", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || !payload?.ok) throw new Error(payload?.error ?? "No se ha podido cargar la configuración.");
      setSettings(payload.settings as SettingsPayload);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  function updateRegion(region: Region, patch: Partial<RegionSettings>) {
    setSettings((current) => ({ ...current, [region]: { ...current[region], ...patch } }));
    setSuccess("");
    setError("");
  }

  async function save(region: Region): Promise<void> {
    const current = settings[region];
    setSavingRegion(region);
    setError("");
    setSuccess("");
    try {
      let normalizedReleaseAt: string | null = null;
      if (current.post_release_at) {
        const date = new Date(current.post_release_at);
        if (Number.isNaN(date.getTime())) throw new Error(`La fecha de ${region} no es válida.`);
        normalizedReleaseAt = date.toISOString();
      }

      const response = await fetch("/api/admin/questionnaires", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, postEnabled: current.post_enabled, postReleaseAt: normalizedReleaseAt }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.ok) throw new Error(payload?.error ?? "No se ha podido guardar la configuración.");
      setSuccess(`Configuración de ${region} guardada correctamente.`);
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Error inesperado.");
    } finally {
      setSavingRegion(null);
    }
  }

  if (loading) {
    return <section className="admin-questionnaire-settings" aria-busy="true"><h2 className="admin-section-title">Evaluación final</h2><p className="admin-muted">Cargando configuración...</p></section>;
  }

  return (
    <section className="admin-questionnaire-settings">
      <div className="admin-questionnaire-settings__header">
        <div>
          <h2 className="admin-section-title">Desbloqueo de la evaluación final</h2>
          <p className="admin-muted">España y Latinoamérica se gestionan por separado. Cada región puede tener una fecha y hora diferente.</p>
        </div>
      </div>

      <div className="admin-questionnaire-region-grid">
        {REGIONS.map((region) => {
          const current = settings[region];
          const saving = savingRegion === region;
          return (
            <article key={region} className="admin-questionnaire-region-card">
              <div className="admin-questionnaire-region-card__header">
                <div>
                  <span className="admin-questionnaire-region-card__eyebrow">Región</span>
                  <h3>{region}</h3>
                </div>
                <span className={`admin-status-pill ${current.post_enabled ? "admin-status-pill--active" : "admin-status-pill--inactive"}`}>
                  {current.post_enabled ? "Desbloqueada" : "Bloqueada"}
                </span>
              </div>

              <button
                type="button"
                className={current.post_enabled ? "admin-unlock-button admin-unlock-button--active" : "admin-unlock-button"}
                onClick={() => updateRegion(region, { post_enabled: !current.post_enabled })}
                disabled={saving}
              >
                {current.post_enabled ? <UnlockKeyhole size={16} /> : <LockKeyhole size={16} />}
                {current.post_enabled ? "Bloquear evaluación final" : "Desbloquear evaluación final"}
              </button>

              <label className="admin-field">
                <span><CalendarDays size={15} /> Fecha y hora de desbloqueo</span>
                <input
                  type="datetime-local"
                  value={toDatetimeLocal(current.post_release_at)}
                  onChange={(event) => updateRegion(region, { post_release_at: event.target.value || null })}
                  disabled={saving}
                />
              </label>

              <p className="admin-muted">Si se activa sin fecha, queda disponible inmediatamente para esta región.</p>

              <button type="button" className="btn-primary" onClick={() => void save(region)} disabled={saving}>
                {saving ? "Guardando..." : `Guardar ${region}`}
              </button>
            </article>
          );
        })}
      </div>

      {error && <p className="admin-feedback admin-feedback--error" role="alert">{error}</p>}
      {success && <p className="admin-feedback admin-feedback--success" role="status">{success}</p>}
    </section>
  );
}
