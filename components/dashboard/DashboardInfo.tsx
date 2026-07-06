import { ShieldCheck } from "lucide-react";

const INFO_TITLE = "Tu participación es confidencial";

const INFO_DESCRIPTION =
  "Toda la información que compartas durante el estudio será tratada de forma confidencial y utilizada exclusivamente con fines de investigación. Podrás acceder progresivamente a las distintas fases del estudio conforme se habiliten para tu participación.";

/**
 * Información general sobre
 * la participación en el estudio.
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
            {INFO_TITLE}
          </h2>

          <p className="dashboard-info-description">{INFO_DESCRIPTION}</p>
        </div>
      </div>
    </section>
  );
}
