import { BookOpen, ClipboardCheck, Laptop } from "lucide-react";

/**
 * Metodología del proyecto Alpha-Help.
 */
export default function EstudioMethod() {
  return (
    <section className="estudio-card" aria-labelledby="estudio-method-title">
      <div className="estudio-card-header">
        <div>
          <h2 id="estudio-method-title" className="estudio-card-title">
            ¿Cómo desarrollamos el estudio?
          </h2>

          <p className="estudio-card-description">
            Alpha-Help combina formación, materiales de apoyo y un seguimiento
            científico estructurado para estudiar el bienestar emocional durante
            la adolescencia y favorecer el acompañamiento familiar.
          </p>
        </div>
      </div>

      <div className="estudio-method-grid">
        <article className="estudio-method-card">
          <div className="estudio-method-icon" aria-hidden="true">
            <Laptop size={24} />
          </div>

          <h3 className="estudio-method-title">Sesiones formativas</h3>

          <p className="estudio-method-description">
            Contenido audiovisual diseñado por profesionales para trabajar
            estrategias y herramientas relacionadas con el bienestar emocional.
          </p>
        </article>

        <article className="estudio-method-card">
          <div className="estudio-method-icon" aria-hidden="true">
            <BookOpen size={24} />
          </div>

          <h3 className="estudio-method-title">Materiales de apoyo</h3>

          <p className="estudio-method-description">
            Documentos y recursos complementarios que ayudan a trasladar los
            contenidos a la vida cotidiana de las familias.
          </p>
        </article>

        <article className="estudio-method-card">
          <div className="estudio-method-icon" aria-hidden="true">
            <ClipboardCheck size={24} />
          </div>

          <h3 className="estudio-method-title">Seguimiento científico</h3>

          <p className="estudio-method-description">
            Evaluaciones realizadas mediante cuestionarios validados
            científicamente para analizar la evolución de los participantes a lo
            largo del estudio.
          </p>
        </article>
      </div>
    </section>
  );
}
