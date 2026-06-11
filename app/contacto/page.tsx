import ContactForm from "@/components/public/contact/ContactForm";
import Navbar from "@/components/public/landing/NavBar";
import Footer from "@/components/public/landing/Footer";

import {
  Mail,
  ShieldCheck,
  HelpCircle,
  Clock,
  Wrench,
} from "lucide-react";

import "@/components/styles/contact.css";

const contactCards = [
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
      "Intentamos responder todas las consultas en un plazo de 24 a 48 horas laborables a través del correo.",
    icon: Clock,
    iconClass: "contact-info-icon-neutral",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="contact-page">
        <section className="contact-hero">
          <div className="contact-hero-container">
            <h1 className="contact-title">
              Contacto
            </h1>

            <p className="contact-subtitle">
              ¿Tienes alguna duda sobre Alpha-Help? Nuestro equipo estará
              encantado de ayudarte.
            </p>

            <div className="contact-email">
              <Mail size={20} />

              <a href="mailto:alpha-help@unir.net">
                alpha-help@unir.net
              </a>
            </div>
          </div>
        </section>

        <section className="contact-content">
          <div className="contact-layout">
            <aside className="contact-info">
              {contactCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className="contact-info-card"
                  >
                    <div
                      className={`contact-info-icon ${card.iconClass}`}
                    >
                      <Icon size={24} />
                    </div>

                    <h3>{card.title}</h3>

                    <p>{card.description}</p>
                  </article>
                );
              })}
            </aside>

            <section className="contact-form-wrapper">
              <ContactForm />
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}