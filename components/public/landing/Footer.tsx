import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";

import LegalLinks from "@/components/legal/LegalLinks";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/logo_sin_letras.svg"
                alt="ALPHA-HELP"
                width={56}
                height={56}
                className="brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-sm text-slate-400 mb-6 max-w-xs">
              Proyecto de investigación enfocado en la prevención e intervención
              del bienestar emocional en adolescentes.
            </p>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Mail size={16} />
              <a
                href="mailto:alpha-help@unir.net"
                className="hover:text-white transition-colors"
              >
                alpha-help@unir.net
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">
              Navegación
            </h3>
            <ul className="flex flex-col gap-4 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="hover:text-white transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">
              Legal
            </h3>

            <div className="flex flex-col gap-4 text-sm items-start">
              <LegalLinks className="hover:text-white transition-colors text-slate-300 text-left" />
            </div>
          </div>

          {/* UNIR Logo */}
          <div className="col-span-1 flex flex-col md:items-end">
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm md:text-right">
              Respaldo
            </h3>
            <Image
              src="/images/unir.svg"
              alt="UNIR"
              width={140}
              height={40}
              className="brightness-0 invert opacity-60 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} ALPHA-HELP. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
