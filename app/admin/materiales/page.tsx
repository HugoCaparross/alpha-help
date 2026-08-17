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
  deleteAdminMaterial,
  listAdminMaterials,
  saveAdminMaterial,
  type AdminMaterialRow,
} from "@/services/admin/admin-material.service";

type MaterialType =
  | "support"
  | "extended";

type RegionValue =
  | "España"
  | "Latinoamérica";

const TYPE_TABS: {
  id: MaterialType;
  label: string;
}[] = [
    {
      id: "support",
      label: "Materiales cortos",
    },
    {
      id: "extended",
      label: "Materiales largos",
    },
  ];

const REGION_TABS: {
  id: RegionValue;
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

interface FormState {
  title: string;
  description: string;
  releaseDate: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  releaseDate: "",
};

function toDatetimeLocal(
  iso: string | undefined,
): string {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
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

export default function AdminMaterialsPage() {
  const [materials, setMaterials] =
    useState<AdminMaterialRow[]>([]);

  const [activeType, setActiveType] =
    useState<MaterialType>(
      "support",
    );

  const [activeRegion, setActiveRegion] =
    useState<RegionValue>(
      "España",
    );

  const [selectedOrder, setSelectedOrder] =
    useState<number>(0);

  const [form, setForm] =
    useState<FormState>(
      EMPTY_FORM,
    );

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const slots = useMemo(
    () =>
      Array.from(
        { length: 10 },
        (_, index) => index,
      ),
    [],
  );

  const loadMaterials =
    useCallback(async () => {
      setLoading(true);

      try {
        const data =
          await listAdminMaterials();

        setMaterials(data);
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
    void loadMaterials();
  }, [loadMaterials]);

  const materialByOrder =
    useMemo(() => {
      const map =
        new Map<
          number,
          AdminMaterialRow
        >();

      materials
        .filter(
          (material) =>
            material.material_type ===
            activeType &&
            material.region ===
            activeRegion,
        )
        .forEach(
          (material) =>
            map.set(
              material.material_order,
              material,
            ),
        );

      return map;
    }, [
      materials,
      activeType,
      activeRegion,
    ]);

  const selectSlot =
    useCallback(
      (order: number) => {
        setSelectedOrder(order);
        setError("");
        setSuccess("");
        setFile(null);

        const existing =
          materialByOrder.get(
            order,
          );

        if (existing) {
          setForm({
            title: existing.title,
            description:
              existing.description,
            releaseDate:
              toDatetimeLocal(
                activeRegion ===
                  "España"
                  ? existing.release_date_spain
                  : existing.release_date_latam,
              ),
          });
        } else {
          setForm(EMPTY_FORM);
        }
      },
      [
        materialByOrder,
        activeRegion,
      ],
    );

  function selectType(
    type: MaterialType,
  ) {
    setActiveType(type);
    setSelectedOrder(0);
    setForm(EMPTY_FORM);
    setFile(null);
    setError("");
    setSuccess("");
  }

  function selectRegion(
    region: RegionValue,
  ) {
    setActiveRegion(region);
    setSelectedOrder(0);
    setForm(EMPTY_FORM);
    setFile(null);
    setError("");
    setSuccess("");
  }

  const existing =
    materialByOrder.get(
      selectedOrder,
    );

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!existing && !file) {
      setError(
        "Debes adjuntar un archivo PDF para este material.",
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const releaseIso =
        form.releaseDate
          ? new Date(
            form.releaseDate,
          ).toISOString()
          : undefined;

      await saveAdminMaterial({
        title: form.title,
        description:
          form.description,
        materialType:
          activeType,
        materialOrder:
          selectedOrder,
        region:
          activeRegion,
        releaseDateSpain:
          activeRegion === "España"
            ? releaseIso
            : existing?.release_date_spain,
        releaseDateLatam:
          activeRegion ===
            "Latinoamérica"
            ? releaseIso
            : existing?.release_date_latam,
        pdfUrl:
          existing?.pdf_url,
        file,
      });

      setSuccess(
        "Material guardado. Ya está disponible para los participantes.",
      );

      setFile(null);

      await loadMaterials();
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
    if (!existing) {
      return;
    }

    if (
      !window.confirm(
        "¿Eliminar este material?",
      )
    ) {
      return;
    }

    setSaving(true);

    try {
      await deleteAdminMaterial(
        existing.id,
      );

      setForm(EMPTY_FORM);
      setSuccess(
        "Material eliminado.",
      );

      await loadMaterials();
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

  return (
    <section className="admin-page admin-page--materials">
      <header className="admin-header">
        <h1 className="admin-header__title">
          Materiales (PDF)
        </h1>

        <p className="admin-header__description">
          España y Latinoamérica son
          programas independientes.
          Tanto los materiales cortos
          como los materiales largos
          disponen de un recurso para
          la Introducción y de un
          recurso para cada una de
          las nueve sesiones del
          programa.
        </p>
      </header>

      <div className="admin-tabs">
        {REGION_TABS.map(
          (tab) => (
            <button
              key={tab.id}
              type="button"
              className={`admin-tab ${activeRegion ===
                tab.id
                ? "admin-tab--active"
                : ""
                }`}
              onClick={() =>
                selectRegion(
                  tab.id,
                )
              }
            >
              {tab.label}
            </button>
          ),
        )}
      </div>

      <div className="admin-tabs">
        {TYPE_TABS.map(
          (tab) => (
            <button
              key={tab.id}
              type="button"
              className={`admin-tab ${activeType ===
                tab.id
                ? "admin-tab--active"
                : ""
                }`}
              onClick={() =>
                selectType(
                  tab.id,
                )
              }
            >
              {tab.label}
            </button>
          ),
        )}
      </div>

      <div className="admin-slots-grid">
        {slots.map(
          (order) => {
            const item =
              materialByOrder.get(
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

                <span className="admin-slot__status">
                  {item
                    ? "Publicado"
                    : "Vacío"}
                </span>
              </button>
            );
          },
        )}
      </div>

      {loading ? (
        <p>
          Cargando materiales...
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
              Título (
              {
                REGION_TABS.find(
                  (t) =>
                    t.id ===
                    activeRegion,
                )?.label
              }{" "}
              ·{" "}
              {
                TYPE_TABS.find(
                  (t) =>
                    t.id ===
                    activeType,
                )?.label
              }
              {selectedOrder ===
                0
                ? " · Introducción"
                : ` · Sesión ${selectedOrder}`}
              )
            </label>

            <input
              id="title"
              type="text"
              required
              value={form.title}
              onChange={(
                event,
              ) =>
                setForm(
                  (prev) => ({
                    ...prev,
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
                  (prev) => ({
                    ...prev,
                    description:
                      event.target
                        .value,
                  }),
                )
              }
            />
          </div>

          <div className="admin-form__row">
            <label htmlFor="file">
              Archivo PDF
            </label>

            <input
              id="file"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(
                event,
              ) =>
                setFile(
                  event.target
                    .files?.[0] ??
                  null,
                )
              }
            />

            {existing && (
              <span className="admin-form__hint">
                Si no seleccionas
                otro archivo se
                conservará el PDF
                actual.
              </span>
            )}
          </div>

          <div className="admin-form__row">
            <label htmlFor="releaseDate">
              Fecha de publicación
            </label>

            <input
              id="releaseDate"
              type="datetime-local"
              value={
                form.releaseDate
              }
              onChange={(
                event,
              ) =>
                setForm(
                  (prev) => ({
                    ...prev,
                    releaseDate:
                      event.target
                        .value,
                  }),
                )
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
                "Guardar material"
              )}
            </button>

            {existing && (
              <button
                type="button"
                className="btn-danger"
                onClick={
                  handleDelete
                }
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