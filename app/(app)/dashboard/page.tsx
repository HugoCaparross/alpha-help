import Link from "next/link";

type DashboardCard = {
  href: string;
  title: string;
  description: string;
};

const dashboardCards: DashboardCard[] = [
  {
    href: "/cuestionarios/pre",
    title: "Cuestionario PRE",
    description: "Completar cuestionario inicial.",
  },
  {
    href: "/cuestionarios/post",
    title: "Cuestionario POST",
    description: "Disponible al finalizar la formación.",
  },
  {
    href: "/sesiones",
    title: "Sesiones",
    description: "Ver sesiones disponibles.",
  },
];

const cardClass =
  "bg-white rounded-2xl border border-slate-200 p-6 transition hover:shadow-md";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="mt-2 text-slate-500">
          Accede rápidamente a los elementos pendientes.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {dashboardCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            aria-label={card.title}
            className={cardClass}
          >
            <h2 className="text-lg font-semibold">{card.title}</h2>

            <p className="mt-2 text-slate-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
