import { ArrowRight, BookOpen, FileText } from "lucide-react";

import type { MaterialType } from "@/types/study-material";

interface MaterialCategoryCardProps {
  readonly type: MaterialType;

  readonly title: string;

  readonly description: string;

  readonly total: number;

  readonly available: number;

  readonly onOpen: (type: MaterialType) => void;
}

/**
 * Tarjeta de categoría mostrada
 * en la vista principal de materiales.
 *
 * Al seleccionarla, se muestran
 * las 9 sesiones correspondientes
 * a esa categoría.
 */
export default function MaterialCategoryCard({
  type,
  title,
  description,
  total,
  available,
  onOpen,
}: MaterialCategoryCardProps) {
  const Icon = type === "support" ? FileText : BookOpen;

  return (
    <button
      type="button"
      className="material-category-card"
      onClick={() => onOpen(type)}
      aria-label={`Ver ${title}`}
    >
      <div className="material-category-card__icon" aria-hidden="true">
        <Icon size={26} />
      </div>

      <div className="material-category-card__body">
        <h2 className="material-category-card__title">{title}</h2>

        <p className="material-category-card__desc">{description}</p>

        <span className="material-category-card__count">
          {available} de {total} sesiones disponibles
        </span>
      </div>

      <ArrowRight size={20} className="material-category-card__arrow" />
    </button>
  );
}
