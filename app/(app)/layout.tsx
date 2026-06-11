import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Sidebar from "@/components/private/layout/Sidebar";
import RightPanel from "@/components/private/layout/RightPanel";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen">
          <Sidebar />

          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>

          <RightPanel />
        </div>
      </div>
    </ProtectedRoute>
  );
}