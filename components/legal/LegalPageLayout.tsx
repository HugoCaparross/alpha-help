import type { ReactNode } from "react";

import Navbar from "@/components/public/landing/NavBar";
import Footer from "@/components/public/landing/Footer";

interface Props {
  title: string;
  children: ReactNode;
}

export default function LegalPageLayout({
  title,
  children,
}: Props) {
  return (
    <>
      <Navbar />

      <main className="legal-page">
        <div className="legal-container">
          <div className="legal-card">
            <div className="legal-header">
              <h1 className="legal-title">{title}</h1>
            </div>

            <div className="legal-content">
              {children}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}