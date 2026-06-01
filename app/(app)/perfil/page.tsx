"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/lib/supabase/getProfile";

export default function PerfilPage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      const data = await getProfile();

      setProfile(data);
    }

    loadProfile();
  }, []);

  if (!profile) {
    return (
      <div>
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="max-w-3xl">

      <h1 className="text-3xl font-bold mb-8">
        Perfil
      </h1>

      <div className="bg-white rounded-3xl border border-slate-200 p-8">

        <div className="space-y-6">

          <div>
            <p className="text-sm text-slate-500">
              Correo electrónico
            </p>

            <p className="font-medium">
              {profile.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Región
            </p>

            <p className="font-medium">
              {profile.region}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Rol
            </p>

            <p className="font-medium">
              {profile.role}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Política aceptada
            </p>

            <p className="font-medium">
              {profile.accepted_policy
                ? "Sí"
                : "No"}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}