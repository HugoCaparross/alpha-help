import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

        <div className="grid lg:grid-cols-2">

          <div className="p-10 flex flex-col justify-center">

            <div className="mb-8">
              <Image
                src="/logo.png"
                alt="ALPHA-HELP"
                width={140}
                height={140}
                className="mb-6"
              />

              <h1 className="text-5xl font-bold text-slate-900">
                ALPHA-HELP
              </h1>

              <p className="mt-3 text-slate-600">
                Formación para la intervención eficaz con familias,
                adolescentes y menores.
              </p>
            </div>

            <p className="text-slate-600 mb-8">
              Plataforma de formación especializada basada en evidencia,
              práctica profesional y acompañamiento.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">

              <Link
                href="/login"
                className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl text-center transition"
              >
                Iniciar sesión
              </Link>

              <Link
                href="/register"
                className="border border-slate-300 px-6 py-3 rounded-xl text-center hover:bg-slate-50 transition"
              >
                Crear cuenta
              </Link>

            </div>

          </div>

          <div className="bg-slate-50 p-10 flex flex-col justify-center">

            <h2 className="text-2xl font-semibold mb-6">
              Información importante
            </h2>

            <div className="space-y-4 text-slate-600">

              <p>
                Esta formación forma parte de un estudio de investigación.
              </p>

              <p>
                Los cuestionarios PRE y POST permitirán evaluar el impacto de la formación.
              </p>

              <p>
                Los datos serán utilizados exclusivamente para fines de investigación.
              </p>

              <p>
                No se cederán datos personales a terceros.
              </p>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}