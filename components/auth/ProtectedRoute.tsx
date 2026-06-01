"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getUser } from "@/lib/supabase/getUser";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function checkAuth() {
      const user = await getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setLoading(false);
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        Cargando...
      </div>
    );
  }

  return <>{children}</>;
}