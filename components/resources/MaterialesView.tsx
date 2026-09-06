"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";
import MaterialEmptyState from "./MaterialEmptyState";
import MaterialsGrid from "./MaterialsGrid";
import MaterialCategoryCard from "./MaterialCategoryCard";
import { getGroupedStudyMaterials, type GroupedStudyMaterials } from "@/services/resources/study-material.service";
import type { MaterialType, StudyMaterialWithStatus } from "@/types/study-material";
import "@/components/styles/materiales.css";

const PAGE_TITLE = "Recursos";
const PAGE_DESCRIPTION = "Aquí encontrarás los documentos que complementan la introducción y las nueve sesiones del programa. Cada recurso se abre automáticamente el día siguiente a la sesión correspondiente y solo podrás acceder a él después de completar la evaluación inicial.";
const LOADING_MESSAGE = "Preparando los recursos...";
const LOAD_ERROR = "No se han podido cargar los recursos. Inténtalo de nuevo.";
const EMPTY_MATERIALS: GroupedStudyMaterials = { support: [], extended: [] };

interface CategoryCopy { title: string; description: string; sectionDescription: string; }
const CATEGORY_COPY: Record<MaterialType, CategoryCopy> = {
  support: {
    title: "Versiones reducidas",
    description: "Guías prácticas para repasar rápidamente las ideas de cada sesión.",
    sectionDescription: "Guías prácticas para repasar rápidamente las ideas de cada sesión.",
  },
  extended: {
    title: "Versiones extendidas",
    description: "Manuales ampliados con contenidos adicionales, ejercicios, enlaces y tests de autoevaluación.",
    sectionDescription: "Manuales ampliados para profundizar en los contenidos de cada sesión.",
  },
};

const dateFormatter = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
function formatCalendarDate(value: string | null): string {
  if (!value) return "Pendiente";
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? "Pendiente" : dateFormatter.format(timestamp);
}

function getCalendarItems(materials: GroupedStudyMaterials): StudyMaterialWithStatus[] {
  return [...materials.support, ...materials.extended].sort((a, b) => {
    if (a.materialOrder !== b.materialOrder) return a.materialOrder - b.materialOrder;
    return a.materialType.localeCompare(b.materialType);
  });
}

export default function MaterialesView() {
  const [materials, setMaterials] = useState<GroupedStudyMaterials>(EMPTY_MATERIALS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState<MaterialType | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const loadMaterials = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setMaterials(await getGroupedStudyMaterials());
    } catch (loadError) {
      if (process.env.NODE_ENV === "development") console.error(loadError);
      setMaterials(EMPTY_MATERIALS);
      setError(LOAD_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadMaterials(); }, [loadMaterials]);

  const calendarItems = useMemo(() => getCalendarItems(materials), [materials]);

  if (loading) return <section className="materiales-page" aria-busy="true"><PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} /><div className="materiales-loading"><p>{LOADING_MESSAGE}</p></div></section>;

  if (error) return <section className="materiales-page"><PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} /><div className="materiales-error" role="alert"><p>{error}</p><button type="button" className="btn-primary" onClick={() => void loadMaterials()}>Reintentar</button></div></section>;

  if (materials.support.length === 0 && materials.extended.length === 0) return <section className="materiales-page"><PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} /><MaterialEmptyState /></section>;

  if (!activeCategory) {
    const availableSupport = materials.support.filter((m) => m.status === "available").length;
    const availableExtended = materials.extended.filter((m) => m.status === "available").length;
    return (
      <section className="materiales-page">
        <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />

        <section className="materiales-calendar-trigger" aria-labelledby="materiales-calendar-trigger-title">
          <div className="materiales-calendar-trigger__icon" aria-hidden="true">
            <CalendarDays size={22} />
          </div>
          <div className="materiales-calendar-trigger__content">
            <p className="materiales-calendar-trigger__eyebrow">Calendario de apertura</p>
            <h2 id="materiales-calendar-trigger-title" className="materiales-calendar-trigger__title">Consulta cuándo se abre cada material</h2>
            <p className="materiales-calendar-trigger__description">Los materiales se liberan automáticamente el día siguiente a la sesión correspondiente.</p>
          </div>
          <button
            type="button"
            className="materiales-calendar-trigger__button"
            onClick={() => setCalendarOpen(true)}
            aria-haspopup="dialog"
          >
            <CalendarDays size={17} aria-hidden="true" />
            <span>Ver calendario</span>
          </button>
        </section>

        <Modal
          open={calendarOpen}
          title="Calendario de apertura"
          onClose={() => setCalendarOpen(false)}
          maxWidth={1050}
        >
          <div className="materiales-calendar-modal">
            <div className="materiales-calendar-modal__intro">
              <div className="materiales-calendar-modal__intro-icon" aria-hidden="true">
                <CalendarDays size={20} />
              </div>
              <div>
                <h3>Cuándo se abre cada material</h3>
                <p>La fecha se calcula automáticamente como el día siguiente a la sesión correspondiente. La fecha mostrada es la que determina el acceso en tu programa.</p>
              </div>
            </div>

            <div className="materiales-calendar__table-wrap">
              <table className="materiales-calendar__table">
                <thead>
                  <tr>
                    <th>Sesión</th>
                    <th>Recurso</th>
                    <th>Tipo</th>
                    <th>Se abre</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {calendarItems.map((material) => {
                    const available = material.status === "available";
                    return (
                      <tr key={material.id}>
                        <td className="materiales-calendar__session">
                          {material.materialOrder === 0 ? "Introducción" : `Sesión ${material.materialOrder}`}
                        </td>
                        <td>{material.title}</td>
                        <td>{material.materialType === "support" ? "Versión reducida" : "Versión extendida"}</td>
                        <td className="materiales-calendar__release">{formatCalendarDate(material.releaseDate)}</td>
                        <td>
                          <span className={`materiales-calendar__status materiales-calendar__status--${available ? "available" : "locked"}`}>
                            {available ? "Disponible" : "Bloqueado"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="materiales-access-notice">
              <div className="materiales-access-notice__icon" aria-hidden="true"><CalendarDays size={20} /></div>
              <div className="materiales-access-notice__content">
                <p className="materiales-access-notice__title">Acceso condicionado</p>
                <p className="materiales-access-notice__text">Para consultar cualquier material debes haber completado la evaluación inicial y haber alcanzado la fecha de apertura indicada en el calendario. La misma regla se aplica a las versiones extendidas.</p>
              </div>
            </div>
          </div>
        </Modal>

        <div className="material-categories-grid">
          <MaterialCategoryCard type="support" title={CATEGORY_COPY.support.title} description={CATEGORY_COPY.support.description} total={materials.support.length} available={availableSupport} onOpen={setActiveCategory} />
          <MaterialCategoryCard type="extended" title={CATEGORY_COPY.extended.title} description={CATEGORY_COPY.extended.description} total={materials.extended.length} available={availableExtended} onOpen={setActiveCategory} />
        </div>
      </section>
    );
  }

  const activeMaterials = materials[activeCategory];
  const copy = CATEGORY_COPY[activeCategory];
  return <section className="materiales-page">
    <button type="button" className="materiales-back" onClick={() => setActiveCategory(null)}><ArrowLeft size={16} /><span>Volver a recursos</span></button>
    <PageHeader title={copy.title} description={copy.sectionDescription} />
    {activeMaterials.length > 0 ? <MaterialsGrid materials={activeMaterials} /> : <MaterialEmptyState />}
  </section>;
}
