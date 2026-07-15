"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Límite de error global de la aplicación.
 *
 * Next.js muestra este componente cuando
 * un error no controlado se produce en
 * cualquier página o layout anidado.
 */
export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        Algo ha salido mal
      </h1>

      <p className="text-lg text-slate-600 mb-8 max-w-md">
        Se ha producido un error inesperado. Puedes intentarlo de nuevo o volver
        al inicio.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button type="button" className="btn-primary" onClick={reset}>
          Reintentar
        </button>

        <Link href="/" className="btn-secondary">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
