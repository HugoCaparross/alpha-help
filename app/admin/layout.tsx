import type { ReactNode } from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";

import "@/components/styles/admin.css";

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Layout del área de administración.
 *
 * La autenticación y la comprobación
 * del rol "admin" se gestionan en el
 * middleware (proxy.ts) y en cada
 * Route Handler mediante requireAdmin().
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-layout__main">{children}</main>
    </div>
  );
}
