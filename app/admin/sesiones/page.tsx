"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  LoaderCircle,
  Trash2,
} from "lucide-react";

import {
  deleteAdminSession,
  listAdminSessions,
  saveAdminSession,
  type AdminRegion,
  type AdminSessionRow,
} from "@/services/admin/admin-session.service";

const REGIONS: {
  id: AdminRegion;
  label: string;
}[] = [
    {
      id: "España",
      label: "España",
    },
    {
      id: "Latinoamérica",
      label: "Latinoamérica",
    },
  ];

const TOTAL_SLOTS = 10;

const SLOTS =
  Array.from(
    {
      length:
        TOTAL_SLOTS,
    },
    (_, index) =>
      index,
  );

interface FormState {
  title: string;
  description: string;
  youtubeUrl: string;
  releaseDateSpain: string;
  releaseDateLatam: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  youtubeUrl: "",
  releaseDateSpain: "",
  releaseDateLatam: "",
};

function toDatetimeLocal(
  iso: string | undefined,
): string {
  if (!iso) {
    return "";
  }

  const date =
    new Date(iso);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  const pad = (
    value: number,
  ) =>
    String(value).padStart(
      2,
      "0",
    );

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
  const [
    sessions,
    setSessions,
  ] =
    useState<
      AdminSessionRow[]
    >([]);

  const [
    activeRegion,
    setActiveRegion,
  ] =
    useState<AdminRegion>(
      "España",
    );

  const [
    selectedOrder,
    setSelectedOrder,
  ] =
    useState(0);

  const [
    form,
    setForm,
  ] =
    useState<FormState>(
      EMPTY_FORM,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const loadSessions =
    useCallback(
      async () => {
        setLoading(
          true,
        );

        setError("");

        try {
          const data =
            await listAdminSessions();

          setSessions(
            data,
          );
        } catch (
        err
        ) {
          setError(
            err instanceof Error
              ? err.message
              : "Error inesperado.",
          );
        } finally {
          setLoading(
            false,
          );
        }
      },
      [],
    );

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
      [
        sessions,
        activeRegion,
      ],
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
    }, [
      visibleSessions,
    ]);

  const selectSlot =
    useCallback(
      (
        order: number,
      ) => {
        setSelectedOrder(
          order,
        );

        setError("");
        setSuccess("");

        const existing =
          sessionByOrder.get(
            order,
          );

        if (existing) {
          setForm({
            title:
              existing.title,
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
          });
        } else {
          setForm(
            EMPTY_FORM,
          );
        }
      },
      [
        sessionByOrder,
      ],
    );

  function selectRegion(
    region: AdminRegion,
  ) {
    setActiveRegion(
      region,
    );

    setSelectedOrder(
      0,
    );

    setForm(
      EMPTY_FORM,
    );

    setError("");
    setSuccess("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(
      true,
    );

    setError("");
    setSuccess("");

    try {
      await saveAdminSession({
        title:
          form.title,
        description:
          form.description,
        youtubeUrl:
          form.youtubeUrl,
        sessionOrder:
          selectedOrder,
        region:
          activeRegion,
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
        "Sesión guardada correctamente.",
      );

      await loadSessions();
    } catch (
    err
    ) {
      setError(
        err instanceof Error
          ? err.message
          : "Error inesperado.",
      );
    } finally {
      setSaving(
        false,
      );
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

    setSaving(
      true,
    );

    setError("");
    setSuccess("");

    try {
      await deleteAdminSession(
        existing.id,
      );

      setForm(
        EMPTY_FORM,
      );

      setSuccess(
        "Sesión eliminada.",
      );

      await loadSessions();
    } catch (
    err
    ) {
      setError(
        err instanceof Error
          ? err.message
          : "Error inesperado.",
      );
    } finally {
      setSaving(
        false,
      );
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
          Configura de forma independiente
          las sesiones de España y
          Latinoamérica. El estado del vídeo
          se determina automáticamente a partir
          de YouTube.
        </p>
      </header>

      <div className="admin-tabs">
        {REGIONS.map(
          (region) => (
            <button
              key={region.id}
              type="button"
              className={`admin-tab ${activeRegion ===
                  region.id
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
          ),
        )}
      </div>

      <div className="admin-slots-grid">
        {SLOTS.map(
          (order) => {
            const item =
              sessionByOrder.get(
                order,
              );

            return (
              <button
                key={order}
                type="button"
                onClick={() =>
                  selectSlot(
                    order,
                  )
                }
                className={`admin-slot ${item
                    ? "admin-slot--filled"
                    : ""
                  } ${selectedOrder ===
                    order
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
                    ? item.is_live
                      ? "En directo"
                      : "En diferido"
                    : "Vacía"}
                </span>
              </button>
            );
          },
        )}
      </div>

      {loading ? (
        <p>
          Cargando sesiones...
        </p>
      ) : (
        <form
          className="admin-form"
          onSubmit={
            handleSubmit
          }
        >
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
              value={
                form.title
              }
              onChange={(
                event,
              ) =>
                setForm(
                  (
                    previous,
                  ) => ({
                    ...previous,
                    title:
                      event.target
                        .value,
                  }),
                )
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
              onChange={(
                event,
              ) =>
                setForm(
                  (
                    previous,
                  ) => ({
                    ...previous,
                    description:
                      event.target
                        .value,
                  }),
                )
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
              onChange={(
                event,
              ) =>
                setForm(
                  (
                    previous,
                  ) => ({
                    ...previous,
                    youtubeUrl:
                      event.target
                        .value,
                  }),
                )
              }
            />

            <span className="admin-form__hint">
              Puedes utilizar una URL normal,
              un enlace /live/, /embed/, /shorts/
              o un enlace youtu.be.
            </span>
          </div>

          <div className="admin-form__row admin-form__row--split">
            <div>
              <label htmlFor="releaseDateSpain">
                Publicación España
              </label>

              <input
                id="releaseDateSpain"
                type="datetime-local"
                value={
                  form.releaseDateSpain
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      previous,
                    ) => ({
                      ...previous,
                      releaseDateSpain:
                        event.target
                          .value,
                    }),
                  )
                }
              />
            </div>

            <div>
              <label htmlFor="releaseDateLatam">
                Publicación Latinoamérica
              </label>

              <input
                id="releaseDateLatam"
                type="datetime-local"
                value={
                  form.releaseDateLatam
                }
                onChange={(
                  event,
                ) =>
                  setForm(
                    (
                      previous,
                    ) => ({
                      ...previous,
                      releaseDateLatam:
                        event.target
                          .value,
                    }),
                  )
                }
              />
            </div>
          </div>

          <span className="admin-form__hint">
            El estado del vídeo se determina
            automáticamente consultando YouTube.
            No tienes que cambiarlo manualmente.
          </span>

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
                "Guardar sesión"
              )}
            </button>

            {existing && (
              <button
                type="button"
                className="btn-secondary"
                onClick={
                  handleDelete
                }
                disabled={saving}
              >
                <Trash2
                  size={16}
                />
                Eliminar
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}