import ContactForm from "@/components/contact/ContactForm";

import Navbar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";

import "@/components/styles/contact.css";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="contact-page">
        <section className="contact-hero">
          <h1 className="contact-title">Contacto</h1>

          <p className="contact-subtitle">
            ¿Tienes alguna duda sobre Alpha-Help? Nuestro equipo estará
            encantado de ayudarte.
          </p>
        </section>

        <section className="contact-content">
          <div className="contact-info">
            <div className="contact-info-card">
              <h3>Consultas generales</h3>

              <p>
                Resolvemos dudas relacionadas con el proyecto y su
                funcionamiento.
              </p>
            </div>

            <div className="contact-info-card">
              <h3>Privacidad y protección de datos</h3>

              <p>
                Información sobre confidencialidad, tratamiento de datos y
                derechos de los participantes.
              </p>
            </div>

            <div className="contact-info-card">
              <h3>Soporte técnico</h3>

              <p>
                Ayuda con incidencias de acceso, registro o funcionamiento de la
                plataforma.
              </p>
            </div>

            <div className="contact-info-card">
              <h3>Tiempo de respuesta</h3>

              <p>
                Intentamos responder todas las consultas en un plazo de 24 a 48
                horas laborables.
              </p>
            </div>
          </div>

          <ContactForm />
        </section>
      </main>

      <Footer />
    </>
  );
}