import "@/components/styles/estudio.css";

import EstudioIntro from "./EstudioIntro";
import EstudioMethod from "./EstudioMethod";
import EstudioObjectives from "./EstudioObjectives";
import EstudioParticipation from "./EstudioParticipation";
import EstudioPrivacy from "./EstudioPrivacy";
import EstudioTopics from "./EstudioTopics";

/**
 * Página informativa del estudio Alpha-Help.
 *
 * Presenta los objetivos, metodología,
 * áreas de investigación, participación
 * y tratamiento de la información.
 */
export default function EstudioView() {
  return (
    <div className="estudio-page">
      <header className="estudio-header">
        <h1 className="estudio-title">El estudio</h1>

        <p className="estudio-description">
          Conoce en qué consiste el proyecto de investigación Alpha-Help y cómo
          contribuimos al bienestar emocional de adolescentes y sus familias.
        </p>
      </header>

      <main className="estudio-content">
        <EstudioIntro />

        <EstudioObjectives />

        <EstudioTopics />

        <EstudioMethod />

        <EstudioParticipation />

        <EstudioPrivacy />
      </main>
    </div>
  );
}
