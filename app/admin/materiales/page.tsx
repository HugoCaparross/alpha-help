"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { LoaderCircle, Trash2 } from "lucide-react";

import {
  deleteAdminMaterial,
  listAdminMaterials,
  saveAdminMaterial,
  type AdminMaterialRow,
} from "@/services/admin/admin-material.service";

const TOTAL_SLOTS = 9;

const SLOTS = Array.from({ length: TOTAL_SLOTS }, (_, index) => index + 1);

type MaterialType = "support" | "extended";

const TABS: { id: MaterialType; label: string }[] = [
  { id: "support", label: "Materiales de apoyo" },
  { id: "extended", label: "Guías completas" },
];

interface FormState {
  title: string;
  description: string;
  releaseDateSpain: string;
  releaseDateLatam: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  releaseDateSpain: "",
  releaseDateLatam: "",
};

function toDatetimeLocal(iso: string | undefined): string {
  if (!iso) return "";

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return "";

  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<AdminMaterialRow[]>([]);
  const [activeTab, setActiveTab] = useState<MaterialType>("support");
  const [selectedOrder, setSelectedOrder] = useState<number>(1);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadMaterials = useCallback(async () => {
    setLoading(true);

    try {
      const data = await listAdminMaterials();

      setMaterials(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMaterials();
  }, [loadMaterials]);

  const materialByOrder = useMemo(() => {
    const map = new Map<number, AdminMaterialRow>();

    materials
      .filter((material) => material.material_type === activeTab)
      .forEach((material) => map.set(material.material_order, material));

    return map;
  }, [materials, activeTab]);

  const selectSlot = useCallback(
    (order: number) => {
      setSelectedOrder(order);
      setError("");
      setSuccess("");
      setFile(null);

      const existing = materialByOrder.get(order);

      if (existing) {
        setForm({
          title: existing.title,
          description: existing.description,
          releaseDateSpain: toDatetimeLocal(existing.release_date_spain),
          releaseDateLatam: toDatetimeLocal(existing.release_date_latam),
        });
      } else {
        setForm(EMPTY_FORM);
      }
    },
    [materialByOrder],
  );

  function selectTab(tab: MaterialType) {
    setActiveTab(tab);
    setSelectedOrder(1);
    setForm(EMPTY_FORM);
    setFile(null);
    setError("");
    setSuccess("");
  }

  const existing = materialByOrder.get(selectedOrder);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!existing && !file) {
      setError("Debes adjuntar un archivo PDF para este material.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await saveAdminMaterial({
        title: form.title,
        description: form.description,
        materialType: activeTab,
        materialOrder: selectedOrder,
        releaseDateSpain: form.releaseDateSpain
          ? new Date(form.releaseDateSpain).toISOString()
          : undefined,
        releaseDateLatam: form.releaseDateLatam
          ? new Date(form.releaseDateLatam).toISOString()
          : undefined,
        pdfUrl: existing?.pdf_url,
        file,
      });

      setSuccess(
        "Material guardado. Ya está disponible para los participantes.",
      );

      setFile(null);

      await loadMaterials();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existing) return;

    if (!window.confirm("¿Eliminar este material?")) return;

    setSaving(true);

    try {
      await deleteAdminMaterial(existing.id);

      setForm(EMPTY_FORM);
      setSuccess("Material eliminado.");

      await loadMaterials();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <header className="admin-header">
        <h1 className="admin-header__title">Materiales (PDF)</h1>

        <p className="admin-header__description">
          Sube los materiales de apoyo (resúmenes cortos) y las guías completas
          (documentos ampliados) de cada una de las 9 sesiones.
        </p>
      </header>

      <div className="admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`admin-tab ${
              activeTab === tab.id ? "admin-tab--active" : ""
            }`}
            onClick={() => selectTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-slots-grid">
        {SLOTS.map((order) => {
          const item = materialByOrder.get(order);

          return (
            <button
              key={order}
              type="button"
              onClick={() => selectSlot(order)}
              className={`admin-slot ${item ? "admin-slot--filled" : ""} ${
                selectedOrder === order ? "admin-slot--active" : ""
              }`}
            >
              <span className="admin-slot__number">Sesión {order}</span>
              <span className="admin-slot__title">
                {item ? item.title : "Sin configurar"}
              </span>
              <span className="admin-slot__status">
                {item ? "Publicado" : "Vacío"}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <p>Cargando materiales...</p>
      ) : (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__row">
            <label htmlFor="title">
              Título ({TABS.find((t) => t.id === activeTab)?.label} · Sesión{" "}
              {selectedOrder})
            </label>
            <input
              id="title"
              type="text"
              required
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
            />
          </div>

          <div className="admin-form__row">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              required
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
            />
          </div>

          <div className="admin-form__row">
            <label htmlFor="file">Archivo PDF</label>
            <input
              id="file"
              type="file"
              accept="application/pdf"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            {existing && !file && (
              <span className="admin-form__hint">
                Ya existe un PDF subido. Selecciona un archivo solo si quieres
                sustituirlo.
              </span>
            )}
          </div>

          <div className="admin-form__row admin-form__row--split">
            <div>
              <label htmlFor="releaseDateSpain">
                Publicación España (opcional)
              </label>
              <input
                id="releaseDateSpain"
                type="datetime-local"
                value={form.releaseDateSpain}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    releaseDateSpain: event.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label htmlFor="releaseDateLatam">
                Publicación Latinoamérica (opcional)
              </label>
              <input
                id="releaseDateLatam"
                type="datetime-local"
                value={form.releaseDateLatam}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    releaseDateLatam: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <span className="admin-form__hint">
            Si dejas las fechas vacías, el material se publica inmediatamente.
          </span>

          {error && <p className="admin-form__error">{error}</p>}
          {success && <p className="admin-form__success">{success}</p>}

          <div className="admin-form__actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />{" "}
                  Guardando...
                </>
              ) : (
                "Guardar material"
              )}
            </button>

            {existing && (
              <button
                type="button"
                className="admin-delete-button"
                onClick={handleDelete}
                disabled={saving}
              >
                <Trash2 size={15} /> Eliminar
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
