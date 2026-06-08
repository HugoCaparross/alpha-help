import ContactForm from "@/components/contact/ContactForm";
import Navbar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";
import { Mail, ShieldCheck, HelpCircle, Clock, Wrench } from "lucide-react";
import "@/components/styles/contact.css";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="contact-page bg-slate-50 min-h-screen">
        <section className="contact-hero py-16 text-center">
          <div className="container-custom max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Contacto</h1>
            <p className="text-lg text-slate-600 mb-6">
              ¿Tienes alguna duda sobre Alpha-Help? Nuestro equipo estará
              encantado de ayudarte.
            </p>
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-200">
              <Mail className="text-accent" size={20} />
              <a href="mailto:alpha-help@unir.net" className="text-slate-700 font-medium hover:text-accent transition-colors">
                alpha-help@unir.net
              </a>
            </div>
          </div>
        </section>

        <section className="contact-content pb-24">
          <div className="container-custom max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="contact-info flex flex-col gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-4 items-start">
                <div className="p-3 bg-sky-50 rounded-xl text-accent shrink-0">
                  <HelpCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Consultas generales</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Resolvemos dudas relacionadas con el proyecto de investigación y su
                    funcionamiento.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-4 items-start">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Privacidad y protección de datos</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Información sobre confidencialidad, tratamiento de datos y
                    derechos de los participantes.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-4 items-start">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600 shrink-0">
                  <Wrench size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Soporte técnico</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Ayuda con incidencias de acceso, registro o funcionamiento de la
                    plataforma.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-4 items-start">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-600 shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Tiempo de respuesta</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Intentamos responder todas las consultas en un plazo de 24 a 48
                    horas laborables a través del correo.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}