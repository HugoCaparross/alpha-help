"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getUser } from "@/lib/supabase/getUser";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protege las rutas privadas de la aplicación.
 *
 * Si el usuario no tiene una sesión activa,
 * será redirigido automáticamente al inicio
 * de sesión.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function validateSession() {
      try {
        const user = await getUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        if (isMounted) {
          setIsLoading(false);
        }
      } catch {
        router.replace("/login");
      }
    }

    void validateSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="protected-route-loading" role="status" aria-live="polite">
        Cargando...
      </div>
    );
  }

  return children;
}
