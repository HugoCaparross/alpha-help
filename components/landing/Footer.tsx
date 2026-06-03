import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container-custom">
        {/* Parte superior */}

        <div className="footer-top">
          <div className="footer-brand">
            <Image
              src="/images/logo.png"
              alt="ALPHA-HELP"
              width={56}
              height={56}
              className="footer-logo"
            />

            <div>
              <h3 className="footer-title">ALPHA-HELP</h3>

              <p className="footer-description">
                Proyecto universitario orientado al estudio y la prevención de
                los desafíos emocionales durante la adolescencia.
              </p>
            </div>
          </div>

          <div className="footer-navigation">
            <div className="footer-column">
              <h4 className="footer-column-title">Proyecto</h4>

              <Link href="#proyecto">Conocer el proyecto</Link>

              <Link href="/register">Participar</Link>

              <Link href="/login">Iniciar sesión</Link>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Información</h4>

              <Link href="/faq">FAQ</Link>

              <Link href="/contacto">Contacto</Link>
            </div>

            <div className="footer-column">
              <h4 className="footer-column-title">Legal</h4>

              <Link href="/privacidad">Política de privacidad</Link>

              <Link href="/cookies">Política de cookies</Link>

              <Link href="/terminos">Términos y condiciones</Link>
            </div>
          </div>
        </div>

        {/* División */}

        <div className="footer-divider" />

        {/* Parte inferior */}

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} ALPHA-HELP. Todos los derechos
            reservados.
          </p>

          <p>
            Proyecto desarrollado en colaboración con instituciones académicas y
            profesionales.
          </p>
        </div>
      </div>
    </footer>
  );
}
