import { ShieldCheck } from "lucide-react";

/**
 * Información general para el participante.
 *
 * Recuerda el carácter confidencial de la
 * participación y el uso de los datos del estudio.
 */
export default function DashboardInfo() {
  return (
    <section
      className="dashboard-section"
      aria-labelledby="dashboard-info-title"
    >
      <div className="dashboard-info-card">
        <div className="dashboard-info-icon" aria-hidden="true">
          <ShieldCheck size={22} />
        </div>

        <div className="dashboard-info-content">
          <h2 id="dashboard-info-title" className="dashboard-info-title">
            Tu participación es confidencial
          </h2>

          <p className="dashboard-info-description">
            Toda la información que compartas durante el estudio será tratada de
            forma confidencial y utilizada exclusivamente con fines de
            investigación. Puedes completar las distintas fases del programa a
            tu ritmo conforme se vayan publicando.
          </p>
        </div>
      </div>
    </section>
  );
}
