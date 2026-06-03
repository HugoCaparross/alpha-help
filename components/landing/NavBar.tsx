import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container-custom">
        <div className="navbar-inner">
          {/* Logo */}

          <Link href="/" className="navbar-brand">
            <Image
              src="/images/logo_sin_letras.png"
              alt="ALPHA-HELP"
              width={68}
              height={68}
              priority
              className="navbar-logo"
            />

            <div className="navbar-brand-content">
              <span className="navbar-title">ALPHA-HELP</span>

              <span className="navbar-subtitle">Ayudando a las familias en la adolescencia</span>
            </div>
          </Link>

          {/* Navegación */}

          <nav className="navbar-nav">
            <Link href="#proyecto" className="navbar-link">
              Proyecto
            </Link>

            <Link href="/faq" className="navbar-link">
              FAQ
            </Link>

            <Link href="/contacto" className="navbar-link">
              Contacto
            </Link>
          </nav>

          {/* Acciones */}

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
    </header>
  );
}
