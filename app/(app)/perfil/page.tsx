import { supabase } from "@/lib/supabase/client";

export default async function PerfilPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Perfil
      </h1>

      <p>
        Perfil conectado próximamente.
      </p>
    </div>
  );
}