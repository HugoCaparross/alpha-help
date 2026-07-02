import MaterialCard from "./MaterialCard";

import type { StudyMaterialWithStatus } from "@/types/study-material";

interface MaterialsGridProps {
  materials: StudyMaterialWithStatus[];
}

export default function MaterialsGrid({ materials }: MaterialsGridProps) {
  return (
    <section className="materials-grid" aria-label="Listado de materiales">
      {materials.map((material) => (
        <MaterialCard key={material.id} material={material} />
      ))}
    </section>
  );
}
