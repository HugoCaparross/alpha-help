import Image from "next/image";

/**
 * Sección que explica el origen y la motivación
 * del proyecto Alpha-Help.
 */
export default function ProjectOrigin() {
  return (
    <section className="project-section" aria-labelledby="project-origin-title">
      <div className="container-custom">
        <div className="project-split">
          <div className="project-content">
            <div className="project-section-heading">
              <span className="project-section-number" aria-hidden="true">
                1
              </span>

              <h2 id="project-origin-title" className="section-title">
                ¿Por qué nace Alpha-Help?
              </h2>
            </div>

            <p className="section-description">
              El proyecto Alpha-Help nace de la experiencia y el trabajo conjunto
              de profesionales procedentes de la psicología, la terapia familiar,
              la educación y el ámbito académico.
            </p>

            <p className="section-description">
              En los últimos años hemos observado que muchas familias encuentran
              dificultades para comprender determinados comportamientos de sus
              hijos, identificar señales de alarma o saber cómo actuar ante
              situaciones relacionadas con su salud emocional.
            </p>

            <p className="section-description">
              Al mismo tiempo, desde el ámbito de la investigación se ha
              constatado un incremento de los problemas de bienestar emocional
              entre niños, niñas y adolescentes, lo que pone de manifiesto la
              necesidad de ofrecer recursos de orientación y apoyo accesibles
              para las familias.
            </p>
          </div>

          <div className="project-image-wrapper">
            <Image
              src="/images/familia_v2.png"
              alt="Familia participante en el proyecto Alpha-Help"
              width={900}
              height={650}
              className="project-image-card"
            />
          </div>
        </div>
      </div>
    </section>
  );
}