import MaterialCard from "./MaterialCard";
import MaterialEmptyState from "./MaterialEmptyState";

import type { StudyMaterialWithStatus } from "@/types/study-material";

import "@/components/styles/materiales.css";

interface MaterialsGridProps {
  materials: StudyMaterialWithStatus[];
}

export default function MaterialsGrid({ materials }: MaterialsGridProps) {
  if (materials.length === 0) {
    return <MaterialEmptyState />;
  }

  return (
    <div className="materials-grid">
      {materials.map((material) => (
        <MaterialCard key={material.id} material={material} />
      ))}
    </div>
  );
}
