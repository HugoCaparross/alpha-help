import type { Metadata } from "next";

import Benefits from "@/components/public/landing/Benefits";
import Concerns from "@/components/public/landing/Concerns";
import Features from "@/components/public/landing/Features";
import FinalCTA from "@/components/public/landing/FinalCTA";
import Footer from "@/components/public/landing/Footer";
import Hero from "@/components/public/landing/Hero";
import NavBar from "@/components/public/landing/NavBar";
import Participation from "@/components/public/landing/Participation";

import "@/components/styles/landing.css";

export const metadata: Metadata = {
  title: "Inicio",
};

/**
 * Landing pública de Alpha-Help.
 */
export default function HomePage() {
  return (
    <>
      <NavBar />

      <main>
        <Hero />

        <Features />

        <Concerns />

        <Benefits />

        <Participation />

        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}
