interface DashboardHeaderProps {
  participantName: string;
}

/**
 * Cabecera del Dashboard.
 *
 * Presenta un saludo personalizado
 * e introduce al participante en
 * el programa Alpha-Help.
 */
export default function DashboardHeader({
  participantName,
}: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div>
        <span className="dashboard-header__eyebrow">
          Área privada
        </span>

        <h1 className="dashboard-header__title">
          Bienvenido, {participantName}
        </h1>

        <p className="dashboard-header__description">
          Desde aquí podrás seguir tu participación en el estudio,
          completar los cuestionarios, acceder a las sesiones
          formativas y consultar los materiales disponibles.
        </p>
      </div>
    </header>
  );
}