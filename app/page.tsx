import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">
          ALPHA-HELP
        </h1>

        <p>
          Formación para la intervención eficaz
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 rounded bg-blue-600 text-white"
          >
            Iniciar sesión
          </Link>

          <Link
            href="/register"
            className="px-6 py-3 rounded border"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </main>
  );
}