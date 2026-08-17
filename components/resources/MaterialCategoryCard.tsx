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
      className={`material-category-card material-category-card--${type}`}
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
          {type === "support"
            ? `${available} de ${total} recursos disponibles`
            : available > 0
              ? "Disponible"
              : "Aún no disponible"}
        </span>
      </div>

      <ArrowRight size={20} className="material-category-card__arrow" />
    </button>
  );
}