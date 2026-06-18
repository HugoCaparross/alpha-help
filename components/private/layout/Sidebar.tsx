"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ClipboardList,
  FileText,
  Video,
  User,
  Book,
  Users,
} from "lucide-react";

const studyNavigation = [
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

const resourcesNavigation = [
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

const infoNavigation = [
  {
    href: "/quienes-somos",
    label: "¿Quiénes somos?",
    icon: Users,
  },
];

type NavigationItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
};

export default function Sidebar() {
  const pathname = usePathname();

  const renderNavigationItems = (items: NavigationItem[]) =>
    items.map((item) => {
      const Icon = item.icon;
      const active = pathname === item.href;

      return (
        <Link
          key={item.href}
          href={item.href}
          className={`sidebar-item ${active ? "sidebar-item--active" : ""}`}
        >
          <div className="sidebar-item-icon">
            <Icon size={20} />
          </div>

          <span className="sidebar-item-label">{item.label}</span>
        </Link>
      );
    });

  return (
    <aside className="sidebar">
      {/* HEADER */}
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

      {/* NAVIGATION */}
      <nav className="sidebar-nav">
        <section className="sidebar-section">
          <span className="sidebar-section-title">Área de estudio</span>

          <div className="sidebar-items">
            {renderNavigationItems(studyNavigation)}
          </div>
        </section>

        <section className="sidebar-section">
          <span className="sidebar-section-title">Recursos</span>

          <div className="sidebar-items">
            {renderNavigationItems(resourcesNavigation)}
          </div>
        </section>

        <section className="sidebar-section">
          <span className="sidebar-section-title">Información</span>

          <div className="sidebar-items">
            {renderNavigationItems(infoNavigation)}
          </div>
        </section>
      </nav>

      {/* FOOTER */}
      <footer className="sidebar-footer">
        <Link
          href="/perfil"
          className={`sidebar-profile ${
            pathname === "/perfil" ? "sidebar-profile--active" : ""
          }`}
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
