import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Accede rápidamente a los elementos pendientes.
        </p>

      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        <Link
          href="/cuestionarios/pre"
          className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition"
        >
          <h2 className="font-semibold text-lg">
            Cuestionario PRE
          </h2>

          <p className="text-slate-500 mt-2">
            Completar cuestionario inicial.
          </p>
        </Link>

        <Link
          href="/cuestionarios/post"
          className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition"
        >
          <h2 className="font-semibold text-lg">
            Cuestionario POST
          </h2>

          <p className="text-slate-500 mt-2">
            Disponible al finalizar la formación.
          </p>
        </Link>

        <Link
          href="/sesiones"
          className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition"
        >
          <h2 className="font-semibold text-lg">
            Sesiones
          </h2>

          <p className="text-slate-500 mt-2">
            Ver sesiones disponibles.
          </p>
        </Link>

      </div>

    </div>
  );
}