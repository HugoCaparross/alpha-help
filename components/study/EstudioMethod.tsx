import { BookOpen, ClipboardCheck, Laptop } from "lucide-react";

/**
 * Metodología del estudio Alpha-Help.
 */
export default function EstudioMethod() {
  return (
    <section className="estudio-card" aria-labelledby="estudio-method-title">
      <div className="estudio-card-header">
        <div>
          <h2 id="estudio-method-title" className="estudio-card-title">
            ¿Cómo se desarrolla el estudio?
          </h2>

          <p className="estudio-card-description">
            El estudio se desarrolla en tres fases: una evaluación inicial, un
            programa de intervención online y una evaluación final para analizar
            los posibles efectos de la intervención sobre las competencias
            parentales y el bienestar familiar.
          </p>
        </div>
      </div>

      <div className="estudio-method-grid">
        <article className="estudio-method-card">
          <div className="estudio-method-icon" aria-hidden="true">
            <ClipboardCheck size={24} />
          </div>

          <h3 className="estudio-method-title">Evaluación inicial</h3>

          <p className="estudio-method-description">
            Los participantes completan una evaluación online antes de acceder
            al programa de intervención.
          </p>
        </article>

        <article className="estudio-method-card">
          <div className="estudio-method-icon" aria-hidden="true">
            <Laptop size={24} />
          </div>

          <h3 className="estudio-method-title">Programa de intervención</h3>

          <p className="estudio-method-description">
            Acceso a 9 sesiones online y a materiales elaborados por expertos en
            salud mental infanto-juvenil, publicados mensualmente durante el
            desarrollo del estudio.
          </p>
        </article>

        <article className="estudio-method-card">
          <div className="estudio-method-icon" aria-hidden="true">
            <BookOpen size={24} />
          </div>

          <h3 className="estudio-method-title">Evaluación final</h3>

          <p className="estudio-method-description">
            Al finalizar el programa, los participantes realizan una nueva
            evaluación que permitirá analizar los efectos de la intervención.
          </p>
        </article>
      </div>
    </section>
  );
}
