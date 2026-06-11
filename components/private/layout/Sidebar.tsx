"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Video,
  User,
  Book,
  Users,
  FileWarning,
  Mail,
} from "lucide-react";

const navigation = [
  {
    href: "/estudio",
    label: "El estudio",
    description: "Información detallada sobre el estudio",
    icon: FileText,
  },
  {
    href: "/quienes-somos",
    label: "¿Quiénes somos?",
    description: "Conoce al equipo del proyecto",
    icon: Users,
  },
  {
    href: "/cuestionarios",
    label: "Formularios",
    description: "Accede a los cuestionarios del estudio",
    icon: ClipboardList,
  },
  {
    href: "/recursos",
    label: "Manuales",
    description: "Descarga materiales y guías prácticas",
    icon: Book,
  },
  {
    href: "/sesiones",
    label: "Sesiones",
    description: "Sesiones formativas del programa",
    icon: Video,
  },
  
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">
          ALPHA-HELP
        </h1>

        <p className="sidebar-subtitle">
          Bienestar emocional y acompañamiento familiar
        </p>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-items">
          {navigation.map((item) => {
            const Icon = item.icon as React.ComponentType<{ size?: number }>;

            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item ${active ? "sidebar-item--active" : ""}`}
              >
                <div className="sidebar-item-icon">
                  <Icon size={18} />
                </div>

                <div className="sidebar-item-content">
                  <span className="sidebar-item-label">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="sidebar-footer">
        <Link
          href="/perfil"
          className={`sidebar-item ${pathname === "/perfil" ? "sidebar-item--active" : ""}`}
        >
          <div className="sidebar-item-icon">
            <User size={18} />
          </div>

          <div className="sidebar-item-content">
            <span className="sidebar-item-label">Perfil</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}