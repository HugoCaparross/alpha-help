"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { Edit3, LoaderCircle, Plus, Trash2 } from "lucide-react";

import { SPAIN_SESSION_DATES } from "@/lib/constants/study-calendar";

import {
  deleteAdminSession,
  listAdminSessions,
  setAdminSessionLiveEnded,
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
  zoomUrl: string;
  zoomRecordingUrl: string;
  thumbnailUrl: string;
  sessionDate: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  zoomUrl: "",
  zoomRecordingUrl: "",
  thumbnailUrl: "",
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

function getAdminLiveState(session: AdminSessionRow | undefined): "upcoming" | "live" | "ended" | "none" {
  if (!session) return "none";
  if (session.live_ended_at) return "ended";
  const releaseDate = activeDateForSession(session);
  const timestamp = Date.parse(releaseDate ?? "");
  if (!Number.isFinite(timestamp)) return "upcoming";
  return Date.now() >= timestamp - 15 * 60_000 ? "live" : "upcoming";
}

function activeDateForSession(session: AdminSessionRow): string | null {
  return session.region === "España" ? session.release_date_spain : session.release_date_latam;
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
            zoomUrl: existing.zoom_url,
            zoomRecordingUrl: existing.zoom_recording_url ?? "",
            thumbnailUrl: existing.thumbnail_url ?? "",
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
          zoomUrl:
            form.zoomUrl,
          zoomRecordingUrl:
            form.zoomRecordingUrl,
          thumbnailUrl:
            form.thumbnailUrl,
          sessionOrder:
            selectedOrder,
          region:
            activeRegion,
          sessionDate: form.sessionDate
            ? new Date(form.sessionDate).toISOString()
            : undefined,
        });

      setSuccess(
        "Sesión guardada correctamente.",
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

  async function handleLiveStateChange() {
    if (!existing) return;
    const currentlyEnded = Boolean(existing.live_ended_at);
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await setAdminSessionLiveEnded(existing.id, !currentlyEnded);
      setSuccess(currentlyEnded ? "Acceso en directo reabierto." : "Acceso en directo cerrado. Ahora la sesión se mostrará como diferida.");
      await loadSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <header className="admin-header">
        <h1 className="admin-header__title">
          Sesiones por Zoom
        </h1>

        <p className="admin-header__description">
          Configura de forma independiente las sesiones de España y Latinoamérica. Cada región dispone de una introducción y nueve sesiones.
        </p>

        <p className="admin-header__description">
          Las sesiones aparecen en la web desde que se configuran. En España el horario es fijo a las 19:00 h. El acceso a Zoom se habilita 15 minutos antes y permanece abierto hasta que cierres el directo desde este panel. Latinoamérica mantiene su calendario y horario propios.
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

              {item?.zoom_url && (
                <span className="admin-slot__live-badge">
                  ZOOM
                </span>
              )}

              <span className="admin-slot__status">
                {item
                  ? mode === "edit" ? "Editar" : "Ya configurada"
                  : mode === "create" ? "Disponible para crear" : "Sin configurar"}
              </span>

              {item && releaseDate && (
                <>
                  <span className={`admin-slot__session-state admin-slot__session-state--${getAdminLiveState(item)}`}>
                    {getAdminLiveState(item) === "ended" ? "Directo cerrado" : getAdminLiveState(item) === "live" ? "Directo abierto" : "Próxima"}
                  </span>
                  <span className="admin-slot__date">
                    {new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(releaseDate))}
                  </span>
                </>
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
            <label htmlFor="zoomUrl">
              Enlace de la reunión de Zoom
            </label>

            <input
              id="zoomUrl"
              type="url"
              required
              placeholder="https://zoom.us/j/..."
              value={form.zoomUrl}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  zoomUrl: event.target.value,
                }))
              }
            />

            <span className="admin-form__hint">
              Enlace que utilizarán los participantes para entrar a la sesión en directo.
            </span>
          </div>

          <div className="admin-form__row">
            <label htmlFor="zoomRecordingUrl">
              Enlace de la grabación de Zoom
            </label>

            <input
              id="zoomRecordingUrl"
              type="url"
              placeholder="https://zoom.us/rec/..."
              value={form.zoomRecordingUrl}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  zoomRecordingUrl: event.target.value,
                }))
              }
            />

            <span className="admin-form__hint">
              Opcional. Puedes añadirlo después de celebrar la sesión.
            </span>
          </div>

          <div className="admin-form__row">
            <label htmlFor="thumbnailUrl">
              Imagen de portada
            </label>

            <input
              id="thumbnailUrl"
              type="url"
              placeholder="https://..."
              value={form.thumbnailUrl}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  thumbnailUrl: event.target.value,
                }))
              }
            />

            <span className="admin-form__hint">
              Opcional. Si no se indica, la tarjeta mostrará su diseño de portada sin imagen.
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

          {existing && (
            <section className="admin-session-live-control" aria-label="Control del directo">
              <div>
                <p className="admin-session-live-control__eyebrow">Estado del directo</p>
                <h2>{existing.live_ended_at ? "Directo cerrado" : "Directo abierto hasta cierre manual"}</h2>
                <p>{existing.live_ended_at ? "La tarjeta pública ha pasado a diferido. Si todavía necesitas volver a abrir el directo, puedes hacerlo desde aquí." : "Cuando la reunión termine, pulsa el botón para cerrar el acceso en directo. La tarjeta pública pasará entonces a diferido."}</p>
              </div>
              <button
                type="button"
                className={existing.live_ended_at ? "btn-secondary" : "btn-primary"}
                onClick={() => void handleLiveStateChange()}
                disabled={saving || (!existing.live_ended_at && getAdminLiveState(existing) !== "live")}
              >
                {existing.live_ended_at ? "Reabrir directo" : "Cerrar directo"}
              </button>
            </section>
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