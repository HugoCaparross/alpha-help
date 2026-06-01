import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/cuestionarios/pre"
          className="border rounded-xl p-4 hover:shadow"
        >
          <h2 className="font-semibold">
            Cuestionario PRE
          </h2>

          <p className="text-sm text-gray-500">
            Completar cuestionario inicial.
          </p>
        </Link>

        <Link
          href="/cuestionarios/post"
          className="border rounded-xl p-4 hover:shadow"
        >
          <h2 className="font-semibold">
            Cuestionario POST
          </h2>

          <p className="text-sm text-gray-500">
            Disponible tras la formación.
          </p>
        </Link>

        <Link
          href="/sesiones"
          className="border rounded-xl p-4 hover:shadow"
        >
          <h2 className="font-semibold">
            Sesiones
          </h2>

          <p className="text-sm text-gray-500">
            Ver sesiones disponibles.
          </p>
        </Link>
      </div>
    </div>
  );
}