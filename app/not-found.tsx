import Link from "next/link";
import Navbar from "@/components/public/landing/NavBar";
import Footer from "@/components/public/landing/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-slate-50 py-16">
        <div className="container-custom text-center px-4">
          <h1 className="text-9xl font-black text-slate-200 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Página no encontrada</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
            Lo sentimos, la página que estás buscando no existe o ha sido movida a otra dirección.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="btn-primary w-full sm:w-auto">
              Volver al inicio
            </Link>
            <Link href="/contacto" className="btn-secondary w-full sm:w-auto">
              Contactar soporte
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
