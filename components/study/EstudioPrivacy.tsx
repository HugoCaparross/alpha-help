import { ShieldCheck } from "lucide-react";

/**
 * Información sobre confidencialidad
 * y protección de datos del estudio.
 */
export default function EstudioPrivacy() {
  return (
    <section
      className="estudio-privacy"
      aria-labelledby="estudio-privacy-title"
    >
      <div className="estudio-privacy-icon" aria-hidden="true">
        <ShieldCheck size={22} />
      </div>

      <div className="estudio-privacy-content">
        <h2 id="estudio-privacy-title" className="estudio-privacy-title">
          Confidencialidad y protección de datos
        </h2>

        <p className="estudio-privacy-description">
          Toda la información recopilada durante el estudio será tratada de
          forma confidencial y utilizada exclusivamente con fines de
          investigación científica. El tratamiento de los datos se realizará de
          acuerdo con la normativa vigente en materia de protección de datos y
          con los principios éticos aplicables a la investigación.
        </p>
      </div>
    </section>
  );
}
