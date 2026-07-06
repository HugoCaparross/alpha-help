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

const DASHBOARD_LOAD_ERROR =
  "No se ha podido cargar el panel principal.";

const DASHBOARD_LOADING =
  "Cargando panel...";

export default function DashboardView() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const data =
          await getDashboardData();

        if (cancelled) {
          return;
        }

        setDashboard(data);
      } catch (error) {
        if (
          process.env.NODE_ENV ===
          "development"
        ) {
          console.error(error);
        }

        if (!cancelled) {
          setError(
            DASHBOARD_LOAD_ERROR,
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section
        className="dashboard-loading"
        role="status"
        aria-live="polite"
      >
        <p>{DASHBOARD_LOADING}</p>
      </section>
    );
  }

  if (error || !dashboard) {
    return (
      <section
        className="dashboard-error"
        role="alert"
      >
        <p>
          {error ||
            DASHBOARD_LOAD_ERROR}
        </p>
      </section>
    );
  }

  return (
    <section className="dashboard">
      <DashboardHeader
        participantCode={
          dashboard.participantCode
        }
      />

      <DashboardProgress
        preCompleted={
          dashboard.preCompleted
        }
        postCompleted={
          dashboard.postCompleted
        }
        completedSessions={
          dashboard.completedSessions
        }
        totalSessions={
          dashboard.totalSessions
        }
        completedMaterials={
          dashboard.completedMaterials
        }
        totalMaterials={
          dashboard.totalMaterials
        }
      />

      <DashboardQuickActions />

      <DashboardNextUnlocks
        nextSession={
          dashboard.nextSession
        }
        nextMaterial={
          dashboard.nextMaterial
        }
      />

      <DashboardInfo />
    </section>
  );
}