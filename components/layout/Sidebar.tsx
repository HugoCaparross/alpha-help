"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Book,
  ClipboardList,
  FileText,
  User,
  Users,
  Video,
} from "lucide-react";

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{
    size?: number;
  }>;
}

const STUDY_NAVIGATION: readonly NavigationItem[] = [
  {
    href: "/estudio",
    label: "El estudio",
    icon: FileText,
  },
  {
    href: "/cuestionarios",
    label: "Formularios",
    icon: ClipboardList,
  },
];

const RESOURCES_NAVIGATION: readonly NavigationItem[] = [
  {
    href: "/sesiones",
    label: "Sesiones",
    icon: Video,
  },
  {
    href: "/recursos",
    label: "Manuales",
    icon: Book,
  },
];

const INFO_NAVIGATION: readonly NavigationItem[] = [
  {
    href: "/quienes-somos",
    label: "¿Quiénes somos?",
    icon: Users,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  function renderNavigationItems(items: readonly NavigationItem[]) {
    return items.map((item) => {
      const Icon = item.icon;

      const active = pathname === item.href;

      return (
        <Link
          key={item.href}
          href={item.href}
          className={`sidebar-item ${active ? "sidebar-item--active" : ""}`}
          aria-current={active ? "page" : undefined}
        >
          <div className="sidebar-item-icon">
            <Icon size={20} />
          </div>

          <span className="sidebar-item-label">{item.label}</span>
        </Link>
      );
    });
  }

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark" aria-hidden="true" />

          <div className="sidebar-brand-content">
            <h1 className="sidebar-title">ALPHA-HELP</h1>

            <p className="sidebar-subtitle">
              Investigación y bienestar adolescente
            </p>
          </div>
        </div>
      </header>

      <nav className="sidebar-nav" aria-label="Navegación principal">
        <section className="sidebar-section">
          <h2 className="sidebar-section-title">Área de estudio</h2>

          <div className="sidebar-items">
            {renderNavigationItems(STUDY_NAVIGATION)}
          </div>
        </section>

        <section className="sidebar-section">
          <h2 className="sidebar-section-title">Recursos</h2>

          <div className="sidebar-items">
            {renderNavigationItems(RESOURCES_NAVIGATION)}
          </div>
        </section>

        <section className="sidebar-section">
          <h2 className="sidebar-section-title">Información</h2>

          <div className="sidebar-items">
            {renderNavigationItems(INFO_NAVIGATION)}
          </div>
        </section>
      </nav>

      <footer className="sidebar-footer">
        <Link
          href="/perfil"
          className={`sidebar-profile ${
            pathname === "/perfil" ? "sidebar-profile--active" : ""
          }`}
          aria-current={pathname === "/perfil" ? "page" : undefined}
        >
          <div className="sidebar-profile-avatar">
            <User size={20} />
          </div>

          <div className="sidebar-profile-content">
            <span className="sidebar-profile-title">Mi perfil</span>

            <span className="sidebar-profile-subtitle">Área personal</span>
          </div>
        </Link>
      </footer>
    </aside>
  );
}
