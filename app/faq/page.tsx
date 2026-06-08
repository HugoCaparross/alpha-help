import Navbar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";

import FaqAccordion from "@/components/faq/FaqAccordion";

import "@/components/styles/faq.css";

export default function FAQPage() {
  return (
    <>
      <Navbar />

      <main className="faq-page">
        <FaqAccordion />
      </main>

      <Footer />
    </>
  );
}