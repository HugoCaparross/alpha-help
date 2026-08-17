import PageHeader from "@/components/ui/PageHeader";

import "@/components/styles/estudio.css";

import EstudioIntro from "./EstudioIntro";
import EstudioMethod from "./EstudioMethod";
import EstudioObjectives from "./EstudioObjectives";
import EstudioParticipation from "./EstudioParticipation";
import EstudioPrivacy from "./EstudioPrivacy";
import EstudioTopics from "./EstudioTopics";

export default function EstudioView() {
  return (
    <section className="estudio-page">
      <PageHeader
        title="El estudio"
        description="Conoce en qué consiste el proyecto de investigación Alpha-Help y cómo contribuimos al bienestar emocional de adolescentes y sus familias."
      />

      <div className="estudio-content">
        <EstudioIntro />
        <EstudioObjectives />
        <EstudioTopics />
        <EstudioMethod />
        <EstudioParticipation />
        <EstudioPrivacy />
      </div>
    </section>
  );
}