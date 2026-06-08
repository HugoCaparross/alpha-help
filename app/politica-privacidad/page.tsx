import Navbar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";

export default function PrivacyPolicy() {
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
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Política de Privacidad</h1>
              <p className="text-slate-600">
                En ALPHA-HELP nos tomamos muy en serio la protección de sus datos personales.
              </p>
            </div>
            
            <div className="prose prose-slate max-w-none text-slate-600">
              <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Responsable del tratamiento</h2>
              <p className="mb-4">
                De conformidad con la normativa vigente en protección de datos, le informamos que sus datos personales serán tratados por la entidad investigadora responsable del proyecto ALPHA-HELP, con el correo electrónico de contacto: alpha-help@unir.net.
              </p>

              <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Finalidad del tratamiento</h2>
              <p className="mb-4">
                La finalidad principal de la recogida y tratamiento de sus datos es la gestión de su participación en el proyecto de investigación ALPHA-HELP, que incluye:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Gestión de la cuenta de usuario.</li>
                <li>Recopilación de información a través de cuestionarios relacionados con el bienestar emocional.</li>
                <li>Comunicaciones estrictamente necesarias para el correcto desarrollo del proyecto.</li>
              </ul>

              <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Base legitimadora</h2>
              <p className="mb-4">
                La base legal para el tratamiento de sus datos es su consentimiento explícito, prestado en el momento del registro en la plataforma.
              </p>

              <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Conservación de los datos</h2>
              <p className="mb-4">
                Los datos proporcionados se conservarán mientras se mantenga la relación como participante en el estudio y durante el tiempo necesario para cumplir con las obligaciones legales derivadas de proyectos científicos e investigaciones.
              </p>

              <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Derechos del usuario</h2>
              <p className="mb-4">
                Usted puede ejercer los derechos de acceso, rectificación, supresión y oposición, limitar el tratamiento de sus datos, o oponerse al mismo, dirigiéndose por escrito al correo electrónico alpha-help@unir.net.
              </p>

              <p className="mt-12 text-sm text-slate-500 italic">
                Nota: Esta política es un documento en construcción para el prototipo.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
