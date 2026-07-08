import type { ReactNode } from "react";

import Sidebar from "@/components/layout/Sidebar";
import RightPanel from "@/components/layout/RightPanel";

import SessionTimeout from "@/components/auth/SessionTimeout";

import "@/components/layout/layout.css";
import "@/components/layout/sidebar.css";
import "@/components/layout/rightpanel.css";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Layout principal del área privada.
 *
 * La autenticación y la protección
 * de rutas son gestionadas mediante
 * Middleware y Supabase SSR.
 */
export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="private-layout">
      <SessionTimeout />

      <div className="private-layout-shell">
        <Sidebar />

        <main id="main-content" className="private-layout-main">
          {children}
        </main>

        <RightPanel />
      </div>
    </div>
  );
}
