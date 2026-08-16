"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Book,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  Users,
  Video,
  X,
} from "lucide-react";

import { authService } from "@/services/auth/auth.service";

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

function isNavigationItemActive(
  pathname: string,
  href: string,
): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function renderItems(
  pathname: string,
  items: readonly NavigationItem[],
) {
  return items.map((item) => {
    const Icon = item.icon;

    const active = isNavigationItemActive(
      pathname,
      item.href,
    );

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`sidebar-item ${active ? "sidebar-item--active" : ""
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

/**
 * Barra superior y menú desplegable
 * para el área privada en pantallas
 * más estrechas que 1024px.
 *
 * Reúne en un único lugar la navegación
 * y el cierre de sesión.
 */
export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);

      await authService.logout();

      router.replace("/");
      router.refresh();
    } catch (error) {
      if (
        process.env.NODE_ENV ===
        "development"
      ) {
        console.error(error);
      }
    } finally {
      setIsLoggingOut(false);
    }
  }

  const dashboardActive =
    pathname === "/dashboard";

  const profileActive =
    pathname === "/perfil" ||
    pathname.startsWith("/perfil/");

  return (
    <>
      <header className="mobile-nav-bar">
        <Link
          href="/dashboard"
          className="mobile-nav-brand"
          aria-label="Ir al Dashboard"
        >
          <span
            className="mobile-nav-brand-mark"
            aria-hidden="true"
          />

          ALPHA-HELP
        </Link>

        <button
          type="button"
          className="mobile-nav-toggle"
          aria-label={
            open
              ? "Cerrar menú"
              : "Abrir menú"
          }
          aria-expanded={open}
          onClick={() =>
            setOpen((prev) => !prev)
          }
        >
          {open ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </header>

      {open && (
        <div
          className="mobile-nav-overlay"
          role="presentation"
        >
          <div
            className="mobile-nav-backdrop"
            onClick={() =>
              setOpen(false)
            }
          />

          <nav
            className="mobile-nav-drawer"
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
                {renderItems(
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
                {renderItems(
                  pathname,
                  RESOURCES_NAVIGATION,
                )}
              </div>
            </section>

            <section className="sidebar-section">
              <h2 className="sidebar-section-title">
                Información
              </h2>

              <div className="sidebar-items">
                {renderItems(
                  pathname,
                  INFO_NAVIGATION,
                )}
              </div>
            </section>

            <section className="sidebar-section">
              <h2 className="sidebar-section-title">
                Cuenta
              </h2>

              <div className="sidebar-items">
                <Link
                  href="/perfil"
                  className={`sidebar-item ${profileActive
                      ? "sidebar-item--active"
                      : ""
                    }`}
                  aria-current={
                    profileActive
                      ? "page"
                      : undefined
                  }
                >
                  <div className="sidebar-item-icon">
                    <User size={20} />
                  </div>

                  <span className="sidebar-item-label">
                    Mi perfil
                  </span>
                </Link>

                <button
                  type="button"
                  className="mobile-nav-logout"
                  onClick={
                    handleLogout
                  }
                  disabled={
                    isLoggingOut
                  }
                >
                  <div className="sidebar-item-icon">
                    <LogOut size={20} />
                  </div>

                  <span className="sidebar-item-label">
                    {isLoggingOut
                      ? "Cerrando sesión..."
                      : "Cerrar sesión"}
                  </span>
                </button>
              </div>
            </section>
          </nav>
        </div>
      )}
    </>
  );
}