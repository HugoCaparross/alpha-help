import Navbar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";

export default function CookiesPolicy() {
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
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Política de Cookies</h1>
              <p className="text-slate-600">
                Información transparente sobre el uso de cookies en ALPHA-HELP.
              </p>
            </div>
            
            <div className="prose prose-slate max-w-none text-slate-600">
              <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. ¿Qué son las cookies?</h2>
              <p className="mb-4">
                Una cookie es un fichero que se descarga en su ordenador o dispositivo móvil al acceder a determinadas páginas web. Las cookies permiten a una página web, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo y, dependiendo de la información que contengan y de la forma en que utilice su equipo, pueden utilizarse para reconocer al usuario.
              </p>

              <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. ¿Qué tipos de cookies utilizamos?</h2>
              <ul className="list-disc pl-6 mb-4 space-y-4">
                <li>
                  <strong>Cookies técnicas y de funcionamiento (Necesarias):</strong> 
                  <br />Son esenciales para el funcionamiento de la plataforma. Permiten la navegación a través del sitio web y la utilización de las diferentes opciones y servicios que en ella existen, como mantener la sesión de usuario iniciada, utilizar elementos de seguridad durante la navegación, etc. 
                </li>
                <li>
                  <strong>Cookies de análisis:</strong> 
                  <br />Son aquellas que, tratadas por nosotros o por terceros, nos permiten cuantificar el número de usuarios y así realizar la medición y análisis estadístico de la utilización que hacen los usuarios del servicio ofertado. Para ello se analiza su navegación en nuestra página web con el fin de mejorar la oferta de productos o servicios que le ofrecemos.
                </li>
              </ul>

              <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Gestión de las cookies</h2>
              <p className="mb-4">
                Usted puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su ordenador. Consulte las instrucciones y manuales de su navegador para ampliar esta información.
              </p>
              
              <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Más información</h2>
              <p className="mb-4">
                Si tiene alguna duda sobre nuestra política de cookies, puede contactar con nosotros en: alpha-help@unir.net.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
