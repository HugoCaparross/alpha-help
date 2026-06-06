import Navbar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";

import ProjectHero from "@/components/project/ProjectHero";
import ProjectWhy from "@/components/project/ProjectWhy";
import ProjectToolkit from "@/components/project/ProjectToolkit";
import ProjectTopics from "@/components/project/ProjectTopics";
import ProjectTrust from "@/components/project/ProjectTrust";
import ProjectResearch from "@/components/project/ProjectResearch";
import ProjectTeam from "@/components/project/ProjectTeam";
import ProjectPartners from "@/components/project/ProjectPartners";
import ProjectCTA from "@/components/project/ProjectCTA";

export default function ProyectoPage() {
  return (
    <>
      <Navbar />

      <ProjectHero />
      <ProjectWhy />
      <ProjectToolkit />
      <ProjectTopics />
      <ProjectTrust />
      <ProjectResearch />
      <ProjectTeam />
      <ProjectPartners />
      <ProjectCTA />

      <Footer />
    </>
  );
}