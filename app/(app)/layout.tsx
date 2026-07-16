import type { ReactNode } from "react";

import Sidebar from "@/components/layout/Sidebar";
import RightPanel from "@/components/layout/RightPanel";
import MobileNav from "@/components/layout/MobileNav";

import "@/components/layout/layout.css";
import "@/components/layout/sidebar.css";
import "@/components/layout/rightpanel.css";
import "@/components/layout/mobile-nav.css";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Layout principal del área privada.
 *
 * La autenticación y la protección
 * de rutas son gestionadas mediante
 * Middleware y Supabase SSR.
 *
 * SessionTimeout ya se monta una
 * única vez de forma global en
 * app/layout.tsx.
 */
export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="private-layout">
      <MobileNav />

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
