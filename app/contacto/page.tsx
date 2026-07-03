import type { Metadata } from "next";

import { Clock, HelpCircle, Mail, ShieldCheck, Wrench } from "lucide-react";

import ContactForm from "@/components/public/contact/ContactForm";
import Footer from "@/components/public/landing/Footer";
import NavBar from "@/components/public/landing/NavBar";

import "@/components/styles/contact.css";

export const metadata: Metadata = {
  title: "Contacto",
};

const CONTACT_CARDS = [
  {
    title: "Consultas generales",
    description:
      "Resolvemos dudas relacionadas con el proyecto de investigación y su funcionamiento.",
    icon: HelpCircle,
    iconClass: "",
  },
  {
    title: "Privacidad y protección de datos",
    description:
      "Información sobre confidencialidad, tratamiento de datos y derechos de los participantes.",
    icon: ShieldCheck,
    iconClass: "contact-info-icon-success",
  },
  {
    title: "Soporte técnico",
    description:
      "Ayuda con incidencias de acceso, registro o funcionamiento de la plataforma.",
    icon: Wrench,
    iconClass: "contact-info-icon-warning",
  },
  {
    title: "Tiempo de respuesta",
    description:
      "Intentamos responder todas las consultas en un plazo de 24 a 48 horas laborables.",
    icon: Clock,
    iconClass: "contact-info-icon-neutral",
  },
] as const;

/**
 * Página pública de contacto.
 */
export default function ContactPage() {
  return (
    <>
      <NavBar />

      <main className="contact-page">
        <section className="contact-hero" aria-labelledby="contact-title">
          <div className="contact-hero-container">
            <h1 id="contact-title" className="contact-title">
              Contacto
            </h1>

            <p className="contact-subtitle">
              ¿Tienes alguna duda sobre Alpha-Help? Nuestro equipo estará
              encantado de ayudarte.
            </p>

            <div className="contact-email">
              <Mail size={20} aria-hidden="true" />

              <a href="mailto:alpha-help@unir.net">alpha-help@unir.net</a>
            </div>
          </div>
        </section>

        <section className="contact-content">
          <div className="contact-layout">
            <aside
              className="contact-info"
              aria-label="Información de contacto"
            >
              {CONTACT_CARDS.map((card) => {
                const Icon = card.icon;

                return (
                  <article key={card.title} className="contact-info-card">
                    <div
                      className={`contact-info-icon ${card.iconClass}`}
                      aria-hidden="true"
                    >
                      <Icon size={24} />
                    </div>

                    <h2>{card.title}</h2>

                    <p>{card.description}</p>
                  </article>
                );
              })}
            </aside>

            <section
              className="contact-form-wrapper"
              aria-labelledby="contact-form-title"
            >
              <h2 id="contact-form-title" className="sr-only">
                Formulario de contacto
              </h2>

              <ContactForm />
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
