import Navbar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";

export default function LegalNotice() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 py-16 md:py-24">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
            <div className="mb-10 text-center">
              <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mb-4">
                Última actualización: Mayo 2026
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Aviso Legal</h1>
              <p className="text-slate-600">
                Información general sobre la plataforma ALPHA-HELP y condiciones de uso.
              </p>
            </div>
            
            <div className="prose prose-slate max-w-none text-slate-600">
              <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Identificación del proyecto</h2>
              <p className="mb-4">
                ALPHA-HELP es un proyecto de investigación universitario orientado a analizar y mejorar el bienestar emocional en los adolescentes, contando con la participación activa de las familias.
              </p>
              <p className="mb-4">
                El contacto principal para cualquier cuestión técnica, de privacidad o del propio estudio es: alpha-help@unir.net.
              </p>

              <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Condiciones de uso</h2>
              <p className="mb-4">
                El acceso y registro en la plataforma ALPHA-HELP atribuye la condición de Usuario/Participante e implica la aceptación plena de las presentes condiciones, así como de la Política de Privacidad y Política de Cookies.
              </p>
              <p className="mb-4">
                El Usuario se compromete a utilizar la plataforma y sus cuestionarios de forma responsable y proporcionando información veraz a los fines de la investigación científica.
              </p>

              <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Propiedad Intelectual e Industrial</h2>
              <p className="mb-4">
                Todos los contenidos, textos, cuestionarios, logotipos, marcas y código fuente de esta plataforma son propiedad de sus respectivos autores o instituciones colaboradoras, y están protegidos por los derechos de propiedad intelectual e industrial.
              </p>

              <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Exclusión de garantías y responsabilidad</h2>
              <p className="mb-4">
                El proyecto ALPHA-HELP se enmarca en un contexto de investigación y no sustituye la atención, el consejo, o la intervención psicológica o médica profesional. Los responsables de la plataforma no se hacen responsables del uso indebido que el Usuario pueda realizar de la información obtenida en la misma.
              </p>

              <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Modificaciones</h2>
              <p className="mb-4">
                El equipo investigador se reserva el derecho de modificar el presente Aviso Legal para adaptarlo a novedades legislativas o requerimientos del proyecto.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
