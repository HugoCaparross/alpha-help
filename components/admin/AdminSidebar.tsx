"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import {
  Download,
  FileText,
  LayoutDashboard,
  LogOut,
  Video,
} from "lucide-react";

import { authService } from "@/services/auth/auth.service";

const NAV_ITEMS = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/sesiones", label: "Sesiones (vídeos)", icon: Video },
  { href: "/admin/materiales", label: "Materiales (PDF)", icon: FileText },
  { href: "/admin/exportar", label: "Exportar datos", icon: Download },
] as const;

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await authService.logout();
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__header">
        <div className="admin-sidebar__mark" aria-hidden="true" />

        <div>
          <h1 className="admin-sidebar__title">ALPHA-HELP</h1>
          <p className="admin-sidebar__subtitle">Panel de administración</p>
        </div>
      </div>

      <nav className="admin-sidebar__nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar__item ${active ? "admin-sidebar__item--active" : ""
                }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className="admin-sidebar__logout"
        onClick={handleLogout}
      >
        <LogOut size={18} />
        <span>Cerrar sesión</span>
      </button>
    </aside>
  );
}