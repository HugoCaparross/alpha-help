import { ShieldCheck } from "lucide-react";

export default function EstudioPrivacy() {
  return (
    <section className="estudio-privacy">
      <div className="estudio-privacy-icon">
        <ShieldCheck size={22} />
      </div>

      <div className="estudio-privacy-content">
        <h2 className="estudio-privacy-title">
          Confidencialidad y protección de datos
        </h2>

        <p className="estudio-privacy-description">
          Toda la información recogida durante el estudio será tratada de forma
          confidencial y utilizada exclusivamente con fines de investigación,
          siguiendo la normativa vigente de protección de datos y los principios
          éticos de la investigación científica.
        </p>
      </div>
    </section>
  );
}