import type { Metadata } from "next";

import Footer from "@/components/public/landing/Footer";
import NavBar from "@/components/public/landing/NavBar";

import FaqAccordion from "@/components/public/faq/FaqAccordion";

import "@/components/styles/faq.css";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
};

/**
 * Página de preguntas frecuentes.
 */
export default function FAQPage() {
  return (
    <>
      <NavBar />

      <main className="faq-page">
        <FaqAccordion />
      </main>

      <Footer />
    </>
  );
}
