import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";

import LegalLinks from "@/components/legal/LegalLinks";

const NAVIGATION = [
  {
    href: "/",
    label: "Inicio",
  },
  {
    href: "/faq",
    label: "FAQ",
  },
  {
    href: "/contacto",
    label: "Contacto",
  },
] as const;

const CONTACT_EMAIL = "alpha-help@unir.net";
const INSTAGRAM_URL = "https://www.instagram.com/proyecto.alphahelp/";

/**
 * Pie de página de la Landing.
 */
export default function Footer() {
  return (
    <footer className="landing-footer" aria-labelledby="footer-title">
      <div className="container-custom">
        <div className="landing-footer-grid">
          <section className="landing-footer-brand">
            <Link href="/" aria-label="Ir al inicio">
              <Image
                src="/images/logo_sin_letras.svg"
                alt="Logotipo de Alpha-Help"
                width={56}
                height={56}
                className="landing-footer-logo"
              />
            </Link>

            <p className="landing-footer-description">
              Proyecto de investigación orientado a la prevención y al bienestar
              emocional durante la adolescencia.
            </p>

            <a href={`mailto:${CONTACT_EMAIL}`} className="landing-footer-mail">
              <Mail size={16} />

              {CONTACT_EMAIL}
            </a>

            <a
              href={INSTAGRAM_URL}
              className="landing-footer-social"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram de Alpha-Help"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
              </svg>

              <span>@proyecto.alphahelp</span>
            </a>
          </section>

          <nav aria-label="Navegación del sitio" className="landing-footer-nav">
            <h2 id="footer-title" className="landing-footer-title">
              Navegación
            </h2>

            <ul>
              {NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <section className="landing-footer-legal">
            <h2 className="landing-footer-title">Legal</h2>

            <LegalLinks />
          </section>

          <section className="landing-footer-unir">
            <h2 className="landing-footer-title">Respaldo</h2>

            <Image
              src="/images/unir.svg"
              alt="Universidad Internacional de La Rioja"
              width={140}
              height={40}
            />
          </section>
        </div>

        <div className="landing-footer-bottom">
          © {new Date().getFullYear()} Alpha-Help. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
}
