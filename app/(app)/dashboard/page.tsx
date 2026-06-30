import Link from "next/link";

type QuickAccess = {
  href: string;
  title: string;
  description: string;
};

const quickAccess: QuickAccess[] = [
  {
    href: "/cuestionarios",
    title: "Cuestionarios",
    description:
      "Completa las evaluaciones disponibles del estudio.",
  },
  {
    href: "/sesiones",
    title: "Sesiones",
    description:
      "Accede a las sesiones disponibles según tu progreso.",
  },
  {
    href: "/recursos",
    title: "Materiales",
    description:
      "Consulta los recursos y materiales complementarios.",
  },
  {
    href: "/perfil",
    title: "Mi perfil",
    description:
      "Consulta y actualiza tu información personal.",
  },
];

export default function DashboardPage() {
  return (
    <section className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">
          Bienvenido a Alpha-Help
        </h1>

        <p className="dashboard-description">
          Desde esta página podrás realizar el seguimiento de tu
          participación en el estudio, acceder a las sesiones,
          completar los cuestionarios y consultar los materiales
          disponibles.
        </p>
      </header>

      <section className="dashboard-section">
        <div className="dashboard-highlight">
          <h2 className="dashboard-highlight-title">
            Continúa con tu participación
          </h2>

          <p className="dashboard-highlight-description">
            Sigue los pasos indicados para completar correctamente
            todas las fases del estudio.
          </p>
        </div>
      </section>

      <section className="dashboard-section">
        <h2 className="dashboard-section-title">
          Accesos rápidos
        </h2>

        <div className="dashboard-grid">
          {quickAccess.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="dashboard-card"
              aria-label={item.title}
            >
              <h3 className="dashboard-card-title">
                {item.title}
              </h3>

              <p className="dashboard-card-description">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}