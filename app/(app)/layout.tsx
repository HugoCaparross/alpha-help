import type { ReactNode } from "react";

import RightPanel from "@/components/layout/RightPanel";
import Sidebar from "@/components/layout/Sidebar";

import "@/components/layout/layout.css";
import "@/components/layout/rightpanel.css";
import "@/components/layout/sidebar.css";
import "@/components/layout/usermenu.css";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Layout principal del área privada.
 *
 * La autenticación y protección de rutas
 * se realiza mediante Middleware + Supabase SSR.
 */
export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="private-layout">
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
