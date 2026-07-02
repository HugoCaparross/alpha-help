import type { ReactNode } from "react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

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
 * Protege el acceso mediante autenticación y
 * muestra la estructura común de navegación.
 */
export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="private-layout">
        <div className="private-layout-shell">
          <Sidebar />

          <main id="main-content" className="private-layout-main">
            {children}
          </main>

          <RightPanel />
        </div>
      </div>
    </ProtectedRoute>
  );
}
