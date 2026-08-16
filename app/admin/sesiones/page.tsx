"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { FormEvent } from "react";

import {
  LoaderCircle,
  Trash2,
} from "lucide-react";

import {
  deleteAdminSession,
  listAdminSessions,
  saveAdminSession,
  type AdminSessionRow,
} from "@/services/admin/admin-session.service";

const TOTAL_SLOTS = 10;

const SLOTS = Array.from(
  { length: TOTAL_SLOTS },
  (_, index) => index,
);

interface FormState {
  title: string;
  description: string;
  youtubeUrl: string;
  releaseDateSpain: string;
  releaseDateLatam: string;
  isLive: boolean;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  youtubeUrl: "",
  releaseDateSpain: "",
  releaseDateLatam: "",
  isLive: false,
};

function toDatetimeLocal(
  iso: string | undefined,
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

  const [selectedOrder, setSelectedOrder] =
    useState<number>(0);

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

  const sessionByOrder =
    useMemo(() => {
      const map =
        new Map<
          number,
          AdminSessionRow
        >();

      sessions.forEach(
        (session) =>
          map.set(
            session.session_order,
            session,
          ),
      );

      return map;
    }, [sessions]);

  const selectSlot =
    useCallback(
      (order: number) => {
        setSelectedOrder(order);
        setError("");
        setSuccess("");

        const existing =
          sessionByOrder.get(order);

        if (existing) {
          setForm({
            title: existing.title,
            description:
              existing.description,
            youtubeUrl:
              existing.youtube_url,
            releaseDateSpain:
              toDatetimeLocal(
                existing.release_date_spain,
              ),
            releaseDateLatam:
              toDatetimeLocal(
                existing.release_date_latam,
              ),
            isLive:
              existing.is_live,
          });
        } else {
          setForm(EMPTY_FORM);
        }
      },
      [sessionByOrder],
    );

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await saveAdminSession({
        title: form.title,
        description: form.description,
        youtubeUrl: form.youtubeUrl,
        sessionOrder: selectedOrder,
        isLive: form.isLive,
        releaseDateSpain:
          form.releaseDateSpain
            ? new Date(
              form.releaseDateSpain,
            ).toISOString()
            : undefined,
        releaseDateLatam:
          form.releaseDateLatam
            ? new Date(
              form.releaseDateLatam,
            ).toISOString()
            : undefined,
      });

      setSuccess(
        "Contenido guardado. Ya está disponible para los participantes.",
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
        "¿Eliminar este contenido?",
      )
    ) {
      return;
    }

    setSaving(true);

    try {
      await deleteAdminSession(
        existing.id,
      );

      setForm(EMPTY_FORM);
      setSuccess(
        "Contenido eliminado.",
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
          Configura la introducción y las
          nueve sesiones del programa. Cada
          contenido puede publicarse de
          inmediato o programarse mediante
          una fecha de publicación.
        </p>
      </header>

      <div className="admin-slots-grid">
        {SLOTS.map((order) => {
          const item =
            sessionByOrder.get(order);

          return (
            <button
              key={order}
              type="button"
              onClick={() =>
                selectSlot(order)
              }
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

              <span className="admin-slot__status">
                {item
                  ? "Publicado"
                  : "Vacío"}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <p>Cargando sesiones...</p>
      ) : (
        <form
          className="admin-form"
          onSubmit={handleSubmit}
        >
          <div className="admin-form__row">
            <label htmlFor="title">
              Título (
              {selectedOrder === 0
                ? "Introducción"
                : `Sesión ${selectedOrder}`}
              )
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
              value={form.description}
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
              value={form.youtubeUrl}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  youtubeUrl:
                    event.target.value,
                }))
              }
            />

            <span className="admin-form__hint">
              Admite enlaces normales,
              retransmisiones en directo,
              youtu.be y shorts.
            </span>
          </div>

          <div className="admin-form__row">
            <label>
              Estado de la sesión
            </label>

            <div className="admin-live-toggle">
              <button
                type="button"
                className={`admin-live-toggle__option ${!form.isLive
                    ? "admin-live-toggle__option--active"
                    : ""
                  }`}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    isLive: false,
                  }))
                }
              >
                Grabada / en diferido
              </button>

              <button
                type="button"
                className={`admin-live-toggle__option admin-live-toggle__option--live ${form.isLive
                    ? "admin-live-toggle__option--active"
                    : ""
                  }`}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    isLive: true,
                  }))
                }
              >
                En directo
              </button>
            </div>
          </div>

          <div className="admin-form__row">
            <label htmlFor="releaseDateSpain">
              Publicación España
            </label>

            <input
              id="releaseDateSpain"
              type="datetime-local"
              value={
                form.releaseDateSpain
              }
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  releaseDateSpain:
                    event.target.value,
                }))
              }
            />
          </div>

          <div className="admin-form__row">
            <label htmlFor="releaseDateLatam">
              Publicación Latinoamérica
            </label>

            <input
              id="releaseDateLatam"
              type="datetime-local"
              value={
                form.releaseDateLatam
              }
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  releaseDateLatam:
                    event.target.value,
                }))
              }
            />
          </div>

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
                    className="spin"
                  />
                  Guardando...
                </>
              ) : (
                "Guardar contenido"
              )}
            </button>

            {existing && (
              <button
                type="button"
                className="btn-danger"
                onClick={handleDelete}
                disabled={saving}
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            )}
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
        </form>
      )}
    </section>
  );
}