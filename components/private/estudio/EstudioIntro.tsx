import { Brain, BookOpen, Users } from "lucide-react";

export default function EstudioIntro() {
  return (
    <section className="estudio-card">
      <div className="estudio-card-header">

        <div>
          <h2 className="estudio-card-title">
            ¿Cuál es la idea del estudio?
          </h2>

          <p className="estudio-card-description">
            Alpha-Help es un proyecto de investigación que estudia el bienestar
            emocional durante la adolescencia y el papel de las familias en la
            prevención, el acompañamiento y el apoyo a los jóvenes.
          </p>
        </div>
      </div>

      <div className="estudio-highlights">
        <div className="estudio-highlight">
          <Brain size={20} />
          <span>Bienestar emocional</span>
        </div>

        <div className="estudio-highlight">
          <Users size={20} />
          <span>Entorno familiar</span>
        </div>

        <div className="estudio-highlight">
          <BookOpen size={20} />
          <span>Investigación científica</span>
        </div>
      </div>
    </section>
  );
}