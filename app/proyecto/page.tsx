import type { Metadata } from "next";

import Footer from "@/components/public/landing/Footer";
import NavBar from "@/components/public/landing/NavBar";

import ProjectGuarantees from "@/components/public/project/ProjectGuarantees";
import ProjectHero from "@/components/public/project/ProjectHero";
import ProjectOrigin from "@/components/public/project/ProjectOrigin";
import ProjectOverview from "@/components/public/project/ProjectOverview";
import ProjectParticipation from "@/components/public/project/ProjectParticipation";
import ProjectTopics from "@/components/public/project/ProjectTopics";

import "@/components/styles/project.css";

export const metadata: Metadata = {
  title: "Proyecto",
  description:
    "Conoce Alpha-Help, un proyecto de investigación orientado a comprender y mejorar el bienestar emocional durante la adolescencia mediante herramientas basadas en evidencia científica.",
};

/**
 * Página institucional del proyecto Alpha-Help.
 */
export default function ProjectPage() {
  return (
    <>
      <NavBar />

      <main>
        <ProjectHero />

        <ProjectOrigin />

        <ProjectOverview />

        <ProjectTopics />

        <ProjectGuarantees />

        <ProjectParticipation />
      </main>

      <Footer />
    </>
  );
}
