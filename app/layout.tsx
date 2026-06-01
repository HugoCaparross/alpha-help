import type { Metadata } from "next";
import "./globals.css";

import SupabaseProvider from "@/components/providers/SupabaseProvider";

export const metadata: Metadata = {
  title: "ALPHA-HELP",
  description: "Formación para la intervención eficaz",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}