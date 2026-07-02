"use client";

import { useEffect, useState } from "react";

import DashboardHeader from "./DashboardHeader";
import DashboardInfo from "./DashboardInfo";
import DashboardNextUnlocks from "./DashboardNextUnlocks";
import DashboardProgress from "./DashboardProgress";
import DashboardQuickActions from "./DashboardQuickActions";

import {
  getDashboardData,
  type DashboardData,
} from "@/services/dashboard/dashboard.service";

import "@/components/styles/dashboard.css";

/**
 * Página principal del área privada.
 */
export default function DashboardView() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setError("");

        const data = await getDashboardData();

        if (!isMounted) {
          return;
        }

        setDashboard(data);
      } catch (error) {
        console.error(error);

        if (!isMounted) {
          return;
        }

        setError("No se ha podido cargar el panel principal.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading" role="status" aria-live="polite">
        <p>Cargando panel...</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="dashboard-error" role="alert">
        <p>{error || "No se ha podido cargar el panel principal."}</p>
      </div>
    );
  }

  return (
    <section className="dashboard">
      <DashboardHeader participantName={dashboard.participantName} />

      <DashboardProgress
        questionnaireCompleted={dashboard.questionnaireCompleted}
        sessionsCompleted={dashboard.sessionsCompleted}
        materialsCompleted={dashboard.materialsCompleted}
        postCompleted={dashboard.postCompleted}
      />

      <DashboardQuickActions />

      <DashboardNextUnlocks
        nextSession={dashboard.nextSession}
        nextMaterial={dashboard.nextMaterial}
      />

      <DashboardInfo />
    </section>
  );
}
