interface DashboardHeaderProps {
  participantCode: string;
}

const DASHBOARD_TITLE =
  "Panel del participante";

const DASHBOARD_DESCRIPTION =
  "Desde aquí podrás realizar el seguimiento de tu participación en el estudio, completar los cuestionarios, acceder a las sesiones formativas y consultar los materiales disponibles.";

/**
 * Cabecera principal del Dashboard.
 *
 * Muestra la información general
 * del participante dentro del estudio.
 */
export default function DashboardHeader({
  participantCode,
}: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header__content">
        <span className="dashboard-header__eyebrow">
          Área privada
        </span>

        <h1 className="dashboard-header__title">
          {DASHBOARD_TITLE}
        </h1>

        <p className="dashboard-header__participant-code">
          Código del participante:{" "}
          <strong>{participantCode}</strong>
        </p>

        <p className="dashboard-header__description">
          {DASHBOARD_DESCRIPTION}
        </p>
      </div>
    </header>
  );
}