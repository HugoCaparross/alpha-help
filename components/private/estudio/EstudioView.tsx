import "@/components/styles/estudio.css";

import EstudioIntro from "./EstudioIntro";
import EstudioObjectives from "./EstudioObjectives";
import EstudioTopics from "./EstudioTopics";
import EstudioMethod from "./EstudioMethod";
import EstudioParticipation from "./EstudioParticipation";
import EstudioPrivacy from "./EstudioPrivacy";

export default function EstudioView() {
  return (
    <div className="estudio-page">
      <header className="estudio-header">
        <h1 className="estudio-title">El estudio</h1>

        <p className="estudio-description">
          Conoce en qué consiste el proyecto de investigación Alpha-Help y cómo
          contribuimos al bienestar emocional de adolescentes y familias.
        </p>
      </header>

      <EstudioIntro />
      <EstudioObjectives />

      <EstudioTopics />

      <EstudioMethod />

      <EstudioParticipation />

      <EstudioPrivacy />
    </div>
  );
}
