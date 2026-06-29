import { BookOpen, Laptop, ClipboardCheck } from "lucide-react";

export default function EstudioMethod() {
  return (
    <section className="estudio-card">
      <div className="estudio-card-header">

        <div>
          <h2 className="estudio-card-title">¿Cómo lo hacemos?</h2>

          <p className="estudio-card-description">
            El estudio combina formación, recursos y seguimiento científico para
            comprender mejor el bienestar emocional durante la adolescencia.
          </p>
        </div>
      </div>

      <div className="estudio-method-grid">
        <article className="estudio-method-card">
          <div className="estudio-method-icon">
            <Laptop size={24} />
          </div>

          <h3 className="estudio-method-title">Sesiones formativas</h3>

          <p className="estudio-method-description">
            Acceso a sesiones y actividades orientadas al bienestar emocional.
          </p>
        </article>

        <article className="estudio-method-card">
          <div className="estudio-method-icon">
            <BookOpen size={24} />
          </div>

          <h3 className="estudio-method-title">Materiales de apoyo</h3>

          <p className="estudio-method-description">
            Recursos prácticos elaborados por profesionales especializados.
          </p>
        </article>

        <article className="estudio-method-card">
          <div className="estudio-method-icon">
            <ClipboardCheck size={24} />
          </div>

          <h3 className="estudio-method-title">Seguimiento científico</h3>

          <p className="estudio-method-description">
            Evaluaciones periódicas mediante metodologías validadas.
          </p>
        </article>
      </div>
    </section>
  );
}
