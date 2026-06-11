import NavBar from "@/components/public/landing/NavBar";
import Hero from "@/components/public/landing/Hero";
import Concerns from "@/components/public/landing/Concerns";
import Benefits from "@/components/public/landing/Benefits";
import Features from "@/components/public/landing/Features";
import Research from "@/components/public/landing/Research";
import Participation from "@/components/public/landing/Participation";
import FinalCTA from "@/components/public/landing/FinalCTA";
import Footer from "@/components/public/landing/Footer";

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
