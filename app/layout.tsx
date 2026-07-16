import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import "@/components/styles/auth.css";
import "@/components/styles/landing.css";

import SessionTimeout from "@/components/auth/SessionTimeout";
import CookieBanner from "@/components/cookies/CookieBanner";
import SupabaseProvider from "@/components/providers/SupabaseProvider";

/**
 * Configuración global del viewport.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1E3A8A",
};

/**
 * Metadatos globales de la aplicación.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://alpha-help.org"),

  title: {
    default: "ALPHA-HELP | Ayudando a las familias en la adolescencia",
    template: "%s | ALPHA-HELP",
  },

  description:
    "Proyecto de investigación orientado a comprender los factores que influyen en el bienestar emocional de adolescentes y sus familias.",

  applicationName: "ALPHA-HELP",

  authors: [
    {
      name: "ALPHA-HELP",
    },
  ],

  openGraph: {
    title: "ALPHA-HELP | Bienestar emocional en adolescentes",

    description:
      "Proyecto de investigación orientado a comprender los factores que influyen en el bienestar emocional de adolescentes y sus familias.",

    url: "https://alpha-help.org",

    siteName: "ALPHA-HELP",

    locale: "es_ES",

    type: "website",

    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "ALPHA-HELP",
      },
    ],
  },

  robots: {
    index: true,

    follow: true,

    googleBot: {
      index: true,

      follow: true,

      "max-image-preview": "large",

      "max-video-preview": -1,

      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo_sin_letras.svg", type: "image/svg+xml" },
    ],

    apple: "/apple-touch-icon.png",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

/**
 * Layout raíz de la aplicación.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body className="antialiased">
        <SupabaseProvider>
          <SessionTimeout />

          {children}

          <CookieBanner />
        </SupabaseProvider>
      </body>
    </html>
  );
}
