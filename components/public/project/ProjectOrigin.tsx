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
              La adolescencia constituye una etapa de profundos cambios físicos,
              emocionales y sociales. Durante este periodo pueden aparecer
              situaciones que afectan tanto al bienestar de los adolescentes
              como al equilibrio familiar.
            </p>

            <p className="section-description">
              Muchas familias manifiestan dificultades para identificar señales
              de alerta, comprender determinados comportamientos o saber cómo
              actuar ante problemas relacionados con la salud emocional.
            </p>

            <p className="section-description">
              Alpha-Help nace con el objetivo de acercar la investigación
              científica a las familias, proporcionando conocimiento, recursos y
              herramientas que favorezcan una mejor comprensión de esta etapa y
              contribuyan a la prevención de dificultades emocionales.
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
