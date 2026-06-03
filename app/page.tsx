import NavBar from "@/components/landing/NavBar";
import Hero from "@/components/landing/Hero";
import Concerns from "@/components/landing/Concerns";
import Benefits from "@/components/landing/Benefits";
import Features from "@/components/landing/Features";
import Research from "@/components/landing/Research";
import Participation from "@/components/landing/Participation";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

import "@/components/styles/landing.css";

export default function Landing() {
  return (
    <>
      <NavBar />
      <Hero />
      <Features />
      <Concerns />
      <Benefits />
      <Research />
      <Participation />
      <FinalCTA />
      <Footer />
    </>
  );
}
