import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">

      <div className="flex">

        <Sidebar />

        <div className="flex-1 min-h-screen flex flex-col">

          <Topbar />

          <main className="flex-1 p-8">
            {children}
          </main>

        </div>

      </div>

    </div>
  );
}