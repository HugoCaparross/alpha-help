"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { Edit3, LoaderCircle, Plus, Trash2 } from "lucide-react";

import { SPAIN_SESSION_DATES } from "@/lib/constants/study-calendar";

import {
  deleteAdminSession,
  listAdminSessions,
  saveAdminSession,
  type AdminRegion,
  type AdminSessionRow,
} from "@/services/admin/admin-session.service";

const REGIONS: { id: AdminRegion; label: string }[] = [
  { id: "España", label: "España" },
  { id: "Latinoamérica", label: "Latinoamérica" },
];

const TOTAL_SLOTS = 10;

const SLOTS = Array.from(
  { length: TOTAL_SLOTS },
  (_, index) => index,
);

interface FormState {
  title: string;
  description: string;
  youtubeUrl: string;
  sessionDate: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  youtubeUrl: "",
  sessionDate: "",
};

function toDatetimeLocal(
  iso: string | null | undefined,
): string {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value: number) =>
    String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(
    date.getDate(),
  )}T${pad(
    date.getHours(),
  )}:${pad(
    date.getMinutes(),
  )}`;
}

export default function AdminSessionsPage() {
  const [sessions, setSessions] =
    useState<AdminSessionRow[]>([]);

  const [activeRegion, setActiveRegion] =
    useState<AdminRegion>("España");

  const [selectedOrder, setSelectedOrder] =
    useState<number>(0);

  const [mode, setMode] =
    useState<"create" | "edit">("create");

  const [form, setForm] =
    useState<FormState>(EMPTY_FORM);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const loadSessions =
    useCallback(async () => {
      setLoading(true);
      setError("");

      try {
        const data =
          await listAdminSessions();

        setSessions(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error inesperado.",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  const visibleSessions =
    useMemo(
      () =>
        sessions.filter(
          (session) =>
            session.region ===
            activeRegion,
        ),
      [sessions, activeRegion],
    );

  const sessionByOrder =
    useMemo(() => {
      const map =
        new Map<
          number,
          AdminSessionRow
        >();

      visibleSessions.forEach(
        (session) => {
          map.set(
            session.session_order,
            session,
          );
        },
      );

      return map;
    }, [visibleSessions]);

  const selectSlot =
    useCallback(
      (order: number) => {
        setSelectedOrder(order);
        setError("");
        setSuccess("");

        const existing =
          sessionByOrder.get(order);

        if (existing) {
          setMode("edit");
          setForm({
            title: existing.title,
            description: existing.description,
            youtubeUrl: existing.youtube_url,
            sessionDate: toDatetimeLocal(
              activeRegion === "España"
                ? existing.release_date_spain
                : existing.release_date_latam,
            ),
          });
        } else {
          setMode("create");
          const suggestedDate =
            activeRegion === "España"
              ? SPAIN_SESSION_DATES[order]
              : undefined;
          setForm({
            ...EMPTY_FORM,
            sessionDate: suggestedDate ? `${suggestedDate}T19:00` : "",
          });
        }
      },
      [activeRegion, sessionByOrder],
    );

  function selectRegion(
    region: AdminRegion,
  ) {
    setActiveRegion(region);
    setSelectedOrder(0);
    setMode("create");
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result =
        await saveAdminSession({
          title: form.title,
          description:
            form.description,
          youtubeUrl:
            form.youtubeUrl,
          sessionOrder:
            selectedOrder,
          region:
            activeRegion,
          sessionDate: form.sessionDate
            ? new Date(form.sessionDate).toISOString()
            : undefined,
        });

      const statusText =
        result.isLive
          ? "en directo"
          : "en diferido";

      setSuccess(
        `Sesión guardada correctamente. YouTube la ha detectado como ${statusText}.`,
      );

      await loadSessions();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error inesperado.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const existing =
      sessionByOrder.get(
        selectedOrder,
      );

    if (!existing) {
      return;
    }

    if (
      !window.confirm(
        "¿Eliminar esta sesión?",
      )
    ) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await deleteAdminSession(
        existing.id,
      );

      setForm(EMPTY_FORM);
      setSuccess(
        "Sesión eliminada.",
      );

      await loadSessions();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error inesperado.",
      );
    } finally {
      setSaving(false);
    }
  }

  const existing =
    sessionByOrder.get(
      selectedOrder,
    );

  return (
    <section>
      <header className="admin-header">
        <h1 className="admin-header__title">
          Sesiones (vídeos)
        </h1>

        <p className="admin-header__description">
          Configura de forma independiente las sesiones de España y Latinoamérica. Cada región dispone de una introducción y nueve sesiones.
        </p>

        <p className="admin-header__description">
          La fecha que indiques aquí es la fecha de la sesión. Los materiales asociados se abrirán automáticamente al día siguiente, después de completar la evaluación inicial.
        </p>
      </header>

      <div className="admin-tabs">
        {REGIONS.map((region) => (
          <button
            key={region.id}
            type="button"
            className={`admin-tab ${activeRegion === region.id
              ? "admin-tab--active"
              : ""
              }`}
            onClick={() =>
              selectRegion(
                region.id,
              )
            }
          >
            {region.label}
          </button>
        ))}
      </div>

      <div className="admin-content-mode" role="tablist" aria-label="Modo de gestión de sesiones">
        <button
          type="button"
          className={`admin-content-mode__button ${mode === "create" ? "admin-content-mode__button--active" : ""}`}
          onClick={() => {
            const firstEmpty = SLOTS.find((slot) => !sessionByOrder.has(slot)) ?? 0;
            setMode("create");
            selectSlot(firstEmpty);
            setError("");
            setSuccess("");
          }}
        >
          <Plus size={17} />
          Crear desde cero
        </button>
        <button
          type="button"
          className={`admin-content-mode__button ${mode === "edit" ? "admin-content-mode__button--active" : ""}`}
          onClick={() => {
            const firstExisting = visibleSessions[0]?.session_order ?? 0;
            setMode("edit");
            selectSlot(firstExisting);
            setError("");
            setSuccess("");
          }}
          disabled={!visibleSessions.length}
        >
          <Edit3 size={17} />
          Editar existente
        </button>
      </div>

      <div className="admin-content-mode__hint">
        {mode === "create"
          ? "Selecciona un hueco todavía sin configurar para crear una nueva sesión."
          : "Selecciona una sesión ya configurada para modificar sus datos."}
      </div>

      <div className="admin-slots-grid">
        {SLOTS.map((order) => {
          const item =
            sessionByOrder.get(
              order,
            );

          const releaseDate =
            activeRegion === "España"
              ? item?.release_date_spain
              : item?.release_date_latam;

          return (
            <button
              key={order}
              type="button"
              onClick={() => selectSlot(order)}
              disabled={mode === "create" ? Boolean(item) : !item}
              className={`admin-slot ${item
                ? "admin-slot--filled"
                : ""
                } ${selectedOrder === order
                  ? "admin-slot--active"
                  : ""
                }`}
            >
              <span className="admin-slot__number">
                {order === 0
                  ? "Introducción"
                  : `Sesión ${order}`}
              </span>

              <span className="admin-slot__title">
                {item
                  ? item.title
                  : "Sin configurar"}
              </span>

              {item?.is_live && (
                <span className="admin-slot__live-badge">
                  EN DIRECTO
                </span>
              )}

              <span className="admin-slot__status">
                {item
                  ? mode === "edit" ? "Editar" : "Ya configurada"
                  : mode === "create" ? "Disponible para crear" : "Sin configurar"}
              </span>

              {item && releaseDate && (
                <span className="admin-slot__date">
                  {new Intl.DateTimeFormat("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(
                    new Date(releaseDate),
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p>
          Cargando sesiones...
        </p>
      ) : (
        <form
          className="admin-form"
          onSubmit={handleSubmit}
        >
          <div className="admin-form__context">
            <div>
              <span className="admin-form__context-label">{mode === "create" ? "Nueva sesión" : "Editando sesión existente"}</span>
              <strong>{selectedOrder === 0 ? "Introducción" : `Sesión ${selectedOrder}`} · {activeRegion}</strong>
            </div>
          </div>

          <div className="admin-form__row">
            <label htmlFor="title">
              Título de{" "}
              {selectedOrder === 0
                ? "la introducción"
                : `la sesión ${selectedOrder}`}
            </label>

            <input
              id="title"
              type="text"
              required
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  title:
                    event.target.value,
                }))
              }
            />
          </div>

          <div className="admin-form__row">
            <label htmlFor="description">
              Descripción
            </label>

            <textarea
              id="description"
              required
              value={
                form.description
              }
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  description:
                    event.target.value,
                }))
              }
            />
          </div>

          <div className="admin-form__row">
            <label htmlFor="youtubeUrl">
              URL de YouTube
            </label>

            <input
              id="youtubeUrl"
              type="url"
              required
              placeholder="https://www.youtube.com/watch?v=..."
              value={
                form.youtubeUrl
              }
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  youtubeUrl:
                    event.target.value,
                }))
              }
            />

            <span className="admin-form__hint">
              El estado del vídeo se determina automáticamente a partir de YouTube.
            </span>
          </div>

          <div className="admin-form__row">
            <label htmlFor="sessionDate">
              Fecha de la sesión — {activeRegion}
            </label>

            <input
              id="sessionDate"
              type="datetime-local"
              required
              value={form.sessionDate}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  sessionDate: event.target.value,
                }))
              }
            />

            <span className="admin-form__hint">
              Esta es la fecha real de la sesión en {activeRegion}. El material correspondiente se abrirá automáticamente al día siguiente.
            </span>
          </div>

          {error && (
            <p
              className="admin-form__error"
              role="alert"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              className="admin-form__success"
              role="status"
            >
              {success}
            </p>
          )}

          <div className="admin-form__actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                  />
                  Guardando...
                </>
              ) : (
                mode === "create" ? "Crear sesión" : "Guardar cambios"
              )}
            </button>

            {existing && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleDelete}
                disabled={saving}
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}