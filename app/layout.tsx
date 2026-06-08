import type { Metadata } from "next";
import "./globals.css";
import "@/components/styles/landing.css";
import "@/components/styles/auth.css"

import SupabaseProvider from "@/components/providers/SupabaseProvider";
import CookieBanner from "@/components/cookies/CookieBanner";

export const metadata: Metadata = {
  title: {
    template: "%s | ALPHA-HELP",
    default: "ALPHA-HELP | Ayudando a las familias en la adolescencia",
  },
  description: "Proyecto de investigación orientado a comprender los factores que influyen en el bienestar emocional de adolescentes y sus familias.",
  openGraph: {
    title: "ALPHA-HELP | Bienestar emocional en adolescentes",
    description: "Proyecto de investigación orientado a comprender los factores que influyen en el bienestar emocional de adolescentes y sus familias.",
    url: "https://alpha-help.org",
    siteName: "ALPHA-HELP",
    locale: "es_ES",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <SupabaseProvider>
          {children}
          <CookieBanner />
        </SupabaseProvider>
      </body>
    </html>
  );
}
