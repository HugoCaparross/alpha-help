import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Sidebar from "@/components/layout/Sidebar";
import RightPanel from "@/components/layout/RightPanel";
import "@/components/layout/sidebar.css";
import "@/components/layout/rightpanel.css";
import "@/components/layout/usermenu.css";
import "@/components/layout/layout.css";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="private-layout">
        <div className="private-layout-shell">
          <Sidebar />

          <main className="private-layout-main">
            {children}
          </main>

          <RightPanel />
        </div>
      </div>
    </ProtectedRoute>
  );
}
