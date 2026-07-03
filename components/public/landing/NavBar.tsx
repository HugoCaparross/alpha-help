"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="navbar">
      <div className="container-custom">
        <div className="navbar-inner">
          <Link
            href="/"
            className="navbar-brand"
            aria-label="Ir a la página de inicio"
          >
            <Image
              src="/images/logo_sin_letras.svg"
              alt="Logotipo de Alpha-Help"
              width={68}
              height={68}
              priority
              className="navbar-logo"
            />

            <div className="navbar-brand-content">
              <span className="navbar-title">ALPHA-HELP</span>

              <span className="navbar-subtitle">
                Ayudando a las familias en la adolescencia
              </span>
            </div>
          </Link>

          <div className="navbar-right">
            <nav className="navbar-nav" aria-label="Navegación principal">
              <Link
                href="/"
                className={`navbar-link ${pathname === "/" ? "active" : ""}`}
                aria-current={pathname === "/" ? "page" : undefined}
              >
                Inicio
              </Link>

              <Link
                href="/faq"
                className={`navbar-link ${pathname === "/faq" ? "active" : ""}`}
                aria-current={pathname === "/faq" ? "page" : undefined}
              >
                FAQ
              </Link>

              <Link
                href="/contacto"
                className={`navbar-link ${
                  pathname === "/contacto" ? "active" : ""
                }`}
                aria-current={pathname === "/contacto" ? "page" : undefined}
              >
                Contacto
              </Link>
            </nav>

            <div className="navbar-divider" aria-hidden="true" />

            <div className="navbar-actions">
              <Link href="/login" className="btn-outline">
                Iniciar sesión
              </Link>

              <Link href="/register" className="btn-primary">
                Crear cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
