import PageHeader from "@/components/ui/PageHeader";
import EvaluationCard from "./EvaluationCard";

import { EVALUATIONS } from "@/lib/constants/questionnaires";

export default function CuestionariosView() {
  return (
    <section className="questionnaires-page">
      <PageHeader
        title="Formularios"
        description="Completa las evaluaciones del estudio cuando estén disponibles. Tus respuestas son confidenciales y se utilizan exclusivamente con fines de investigación."
      />

      <div className="questionnaires-list">
        {EVALUATIONS.map((evaluation) => (
          <EvaluationCard key={evaluation.id} evaluation={evaluation} />
        ))}
      </div>
    </section>
  );
}
