import Image from "next/image";
import Link from "next/link";

import {
  ShieldCheck,
  Users,
  FlaskConical,
  HeartHandshake,
  Search,
  Shield,
  Brain,
  MessageCircle,
  Smartphone,
  Heart,
  GraduationCap,
  Building2,
} from "lucide-react";

import Navbar from "@/components/public/landing/NavBar";
import Footer from "@/components/public/landing/Footer";
import FinalCTA from "@/components/public/landing/FinalCTA";

import "@/components/styles/project.css";

export default function ProjectPage() {
  return (
    <>
      <Navbar />

      <main className="project-page">
        {/* HERO */}

        <section className="project-hero">
          <div className="container-custom">
            <div className="project-hero-grid">
              <div className="project-hero-content">

                <h1 className="project-title">Conoce ALPHA-HELP</h1>

                <p className="project-description">
                  Un proyecto orientado a ayudar a las familias a comprender,
                  detectar y afrontar los desafíos emocionales que pueden surgir
                  durante la adolescencia.
                </p>

                <div className="project-actions">
                  <Link href="/register" className="btn-primary">
                    Participar gratuitamente
                  </Link>

                  <Link href="/contacto" className="btn-secondary">
                    Contactar
                  </Link>
                </div>

                <div className="project-benefits">
                  <div className="project-benefit">
                    <ShieldCheck className="project-benefit-icon" />

                    <h3>Seguro y confidencial</h3>

                    <p>Protección de datos y privacidad garantizada.</p>
                  </div>

                  <div className="project-benefit">
                    <Users className="project-benefit-icon" />

                    <h3>Participación gratuita</h3>

                    <p>Sin coste para las familias participantes.</p>
                  </div>

                  <div className="project-benefit">
                    <FlaskConical className="project-benefit-icon" />

                    <h3>Basado en evidencia científica</h3>

                    <p>Investigación desarrollada por especialistas.</p>
                  </div>
                </div>
              </div>

              <div className="project-hero-image">
                <Image
                  src="/images/familia_v2.png"
                  alt="Familia participando en Alpha-Help"
                  width={900}
                  height={650}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* 1 */}

        <section className="project-section">
          <div className="container-custom">
            <div className="project-split">
              <div>
                <div className="project-section-heading">
                  <span className="project-section-number">1</span>

                  <h2 className="section-title">¿Por qué nace Alpha-Help?</h2>
                </div>

                <p className="section-description">
                  La adolescencia es una etapa de cambios intensos en la que
                  muchas familias se enfrentan a dudas, incertidumbre y nuevos
                  retos relacionados con el bienestar emocional.
                </p>

                <p className="section-description">
                  Los cambios emocionales, la autoestima, las relaciones
                  sociales, los conflictos familiares o el entorno digital son
                  algunos de los factores que pueden influir en esta etapa.
                </p>

                <p className="section-description">
                  Alpha-Help nace para proporcionar herramientas y conocimiento
                  científico que ayuden a comprender mejor estas situaciones y
                  ofrecer apoyo a las familias.
                </p>
              </div>

              <div>
                <Image
                  src="/images/familia_v2.png"
                  alt="Familia"
                  width={800}
                  height={600}
                  className="project-image-card"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2 */}

        <section className="project-section project-section-alt">
          <div className="container-custom">
            <div className="project-split">
              <div>
                <div className="project-section-heading">
                  <span className="project-section-number">2</span>

                  <h2 className="section-title">¿Qué es Alpha-Help?</h2>
                </div>

                <p className="section-description">
                  Alpha-Help es un proyecto de investigación orientado a mejorar
                  la comprensión del bienestar emocional adolescente y el papel
                  de las familias en la detección temprana de dificultades.
                </p>

                <p className="section-description">
                  La participación de madres, padres y tutores permite generar
                  evidencia científica que contribuirá al desarrollo de futuras
                  estrategias de apoyo e intervención.
                </p>
              </div>

              <div className="project-process">
                <div className="project-process-item">
                  <HeartHandshake size={32} />

                  <h3>Comprender</h3>

                  <p>Entender qué está ocurriendo.</p>
                </div>

                <div className="project-process-item">
                  <Search size={32} />

                  <h3>Detectar</h3>

                  <p>Identificar señales de alerta.</p>
                </div>

                <div className="project-process-item">
                  <Users size={32} />

                  <h3>Actuar</h3>

                  <p>Aprender cómo ayudar.</p>
                </div>

                <div className="project-process-item">
                  <Shield size={32} />

                  <h3>Prevenir</h3>

                  <p>Fortalecer factores protectores.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 */}

        <section className="project-section">
          <div className="container-custom">
            <div className="project-section-heading">
              <span className="project-section-number">3</span>

              <h2 className="section-title">Temas que abordaremos</h2>
            </div>

            <div className="project-topics">
              <div className="project-topic-card">
                <Brain />
                <span>Bienestar emocional</span>
              </div>

              <div className="project-topic-card">
                <MessageCircle />
                <span>Comunicación familiar</span>
              </div>

              <div className="project-topic-card">
                <Heart />
                <span>Autoestima</span>
              </div>

              <div className="project-topic-card">
                <Brain />
                <span>Ansiedad y estrés</span>
              </div>

              <div className="project-topic-card">
                <Smartphone />
                <span>Uso saludable de tecnología</span>
              </div>

              <div className="project-topic-card">
                <Users />
                <span>Relaciones sociales</span>
              </div>

              <div className="project-topic-card">
                <Shield />
                <span>Prevención de riesgos</span>
              </div>

              <div className="project-topic-card">
                <GraduationCap />
                <span>Entorno educativo</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4 */}

        <section className="project-section project-section-alt">
          <div className="container-custom">
            <div className="project-section-heading">
              <span className="project-section-number">4</span>

              <h2 className="section-title">¿Por qué confiar en Alpha-Help?</h2>
            </div>

            <div className="project-trust-grid">
              <div className="project-trust-card">
                Proyecto universitario respaldado por investigación.
              </div>

              <div className="project-trust-card">
                Basado en evidencia científica actual.
              </div>

              <div className="project-trust-card">
                Participación completamente gratuita.
              </div>

              <div className="project-trust-card">
                Equipo especializado en adolescencia y familia.
              </div>

              <div className="project-trust-card">
                Protección de datos y confidencialidad.
              </div>

              <div className="project-trust-card">
                Investigación rigurosa y supervisada.
              </div>
            </div>
          </div>
        </section>

        {/* 5 */}

        <section className="project-section">
          <div className="container-custom">
            <div className="project-section-heading">
              <span className="project-section-number">5</span>

              <h2 className="section-title">
                Sobre el estudio de investigación
              </h2>
            </div>

            <div className="project-study-card">
              <div>
                <strong>Promotor</strong>
                <p>Universidad Internacional de La Rioja (UNIR)</p>
              </div>

              <div>
                <strong>Modalidad</strong>
                <p>Online</p>
              </div>

              <div>
                <strong>Participación</strong>
                <p>Gratuita</p>
              </div>

              <div>
                <strong>Finalidad</strong>
                <p>Investigación científica</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6 */}

        <section className="project-section project-section-alt">
          <div className="container-custom">
            <div className="project-section-heading">
              <span className="project-section-number">6</span>

              <h2 className="section-title">Equipo investigador</h2>
            </div>

            <div className="project-team-grid">
              <div className="project-team-card">
                <div className="project-team-avatar" />

                <h3>Investigador principal</h3>

                <p>Universidad Internacional de La Rioja</p>
              </div>

              <div className="project-team-card">
                <div className="project-team-avatar" />

                <h3>Equipo colaborador</h3>

                <p>Psicología, educación e investigación</p>
              </div>

              <div className="project-team-card">
                <div className="project-team-avatar" />

                <h3>Profesionales participantes</h3>

                <p>Especialistas en adolescencia y familia</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7 */}

        <section className="project-section">
          <div className="container-custom">
            <div className="project-section-heading">
              <span className="project-section-number">7</span>

              <h2 className="section-title">Entidades colaboradoras</h2>
            </div>

            <div className="project-partners">
              <div className="project-partner-card">
                <Building2 size={32} />

                <h3>UNIR</h3>

                <p>Universidad Internacional de La Rioja</p>
              </div>
            </div>
          </div>
        </section>

        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}
