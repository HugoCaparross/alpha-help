interface DashboardHeaderProps {
  participantCode: string;
}

/**
 * Cabecera del Dashboard.
 *
 * Presenta la información principal
 * del participante dentro del estudio.
 */
export default function DashboardHeader({
  participantCode,
}: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div>
        <span className="dashboard-header__eyebrow">Área privada</span>

        <h1 className="dashboard-header__title">Panel del participante</h1>

        <p className="dashboard-header__participant-code">
          Código del participante: <strong>{participantCode}</strong>
        </p>

        <p className="dashboard-header__description">
          Desde aquí podrás realizar el seguimiento de tu participación en el
          estudio, completar los cuestionarios, acceder a las sesiones
          formativas y consultar los materiales disponibles.
        </p>
      </div>
    </header>
  );
}
