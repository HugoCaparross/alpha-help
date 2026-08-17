"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Book,
  ClipboardList,
  FileText,
  LayoutDashboard,
  User,
  Video,
} from "lucide-react";

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{
    size?: number;
  }>;
}

const STUDY_NAVIGATION = [
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
] as const satisfies readonly NavigationItem[];

const RESOURCES_NAVIGATION = [
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
] as const satisfies readonly NavigationItem[];

function isNavigationItemActive(
  pathname: string,
  href: string,
): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

function renderNavigationItems(
  pathname: string,
  items: readonly NavigationItem[],
) {
  return items.map((item) => {
    const Icon = item.icon;

    const active =
      isNavigationItemActive(
        pathname,
        item.href,
      );

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`sidebar-item ${active
            ? "sidebar-item--active"
            : ""
          }`}
        aria-current={
          active ? "page" : undefined
        }
      >
        <div className="sidebar-item-icon">
          <Icon size={20} />
        </div>

        <span className="sidebar-item-label">
          {item.label}
        </span>
      </Link>
    );
  });
}

export default function Sidebar() {
  const pathname = usePathname();

  const dashboardActive =
    pathname === "/dashboard";

  const profileActive =
    pathname === "/perfil" ||
    pathname.startsWith("/perfil/");

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <Link
          href="/dashboard"
          className="sidebar-brand"
          aria-label="Ir al Dashboard"
        >
          <div
            className="sidebar-brand-mark"
            aria-hidden="true"
          />

          <div className="sidebar-brand-content">
            <h1 className="sidebar-title">
              ALPHA-HELP
            </h1>

            <p className="sidebar-subtitle">
              Investigación y bienestar
              adolescente
            </p>
          </div>
        </Link>
      </header>

      <nav
        className="sidebar-nav"
        aria-label="Navegación principal"
      >
        <section className="sidebar-section">
          <h2 className="sidebar-section-title">
            Principal
          </h2>

          <div className="sidebar-items">
            <Link
              href="/dashboard"
              className={`sidebar-item ${dashboardActive
                  ? "sidebar-item--active"
                  : ""
                }`}
              aria-current={
                dashboardActive
                  ? "page"
                  : undefined
              }
            >
              <div className="sidebar-item-icon">
                <LayoutDashboard size={20} />
              </div>

              <span className="sidebar-item-label">
                Dashboard
              </span>
            </Link>
          </div>
        </section>

        <section className="sidebar-section">
          <h2 className="sidebar-section-title">
            Área de estudio
          </h2>

          <div className="sidebar-items">
            {renderNavigationItems(
              pathname,
              STUDY_NAVIGATION,
            )}
          </div>
        </section>

        <section className="sidebar-section">
          <h2 className="sidebar-section-title">
            Recursos
          </h2>

          <div className="sidebar-items">
            {renderNavigationItems(
              pathname,
              RESOURCES_NAVIGATION,
            )}
          </div>
        </section>
      </nav>

      <footer className="sidebar-footer">
        <Link
          href="/perfil"
          className={`sidebar-profile ${profileActive
              ? "sidebar-profile--active"
              : ""
            }`}
          aria-current={
            profileActive
              ? "page"
              : undefined
          }
        >
          <div className="sidebar-profile-avatar">
            <User size={20} />
          </div>

          <div className="sidebar-profile-content">
            <span className="sidebar-profile-title">
              Mi perfil
            </span>

            <span className="sidebar-profile-subtitle">
              Área personal
            </span>
          </div>
        </Link>
      </footer>
    </aside>
  );
}