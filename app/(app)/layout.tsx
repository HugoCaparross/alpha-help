import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Sidebar from "@/components/private/layout/Sidebar";
import RightPanel from "@/components/private/layout/RightPanel";
import "@/components/private/layout/sidebar.css";
import "@/components/private/layout/rightpanel.css";
import "@/components/private/layout/usermenu.css";
import "@/components/private/layout/layout.css";

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
