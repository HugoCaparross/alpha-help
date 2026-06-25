"use client";

import { useEffect, useState } from "react";

import MaterialsGrid from "./MaterialsGrid";

import { supabase } from "@/lib/supabase/client";
import { getUser } from "@/lib/supabase/getUser";

import { getStudyMaterialsWithStatus } from "@/services/supabase/study-material.service";

import type { Region } from "@/lib/utils/regions";
import type { StudyMaterialWithStatus } from "@/types/study-material";

import "@/components/styles/materiales.css";

export default function MaterialesView() {
  const [materials, setMaterials] = useState<StudyMaterialWithStatus[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadMaterials() {
      try {
        setLoading(true);

        setError("");

        const user = await getUser();

        if (!user) {
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("region")
          .eq("id", user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        const region = (profile?.region ?? "España") as Region;

        const materials = await getStudyMaterialsWithStatus(region);

        if (!isMounted) {
          return;
        }

        setMaterials(materials);
      } catch (error) {
        console.error(error);

        if (!isMounted) {
          return;
        }

        setError("No se han podido cargar los materiales. Inténtalo de nuevo.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadMaterials();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="materiales-page">
      <div className="materiales-page__header">
        <span className="materiales-page__eyebrow">Recursos del programa</span>

        <h1 className="materiales-page__title">Materiales</h1>

        <p className="materiales-page__description">
          Documentos de apoyo para acompañar cada sesión del programa. Cada
          material se publica en su fecha correspondiente y queda disponible
          para consultarlo cuando quieras.
        </p>
      </div>

      {loading && (
        <div
          className="materiales-page__state"
          role="status"
          aria-live="polite"
        >
          <span className="materiales-page__spinner" aria-hidden="true" />

          <p className="materiales-page__state-text">Cargando materiales...</p>
        </div>
      )}

      {!loading && error && (
        <div
          className="materiales-page__state materiales-page__state--error"
          role="alert"
        >
          <p className="materiales-page__state-text">{error}</p>
        </div>
      )}

      {!loading && !error && <MaterialsGrid materials={materials} />}
    </div>
  );
}
