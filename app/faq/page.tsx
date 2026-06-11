import Navbar from "@/components/public/landing/NavBar";
import Footer from "@/components/public/landing/Footer";

import FaqAccordion from "@/components/public/faq/FaqAccordion";

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