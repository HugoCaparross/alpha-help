import Link from "next/link";
import Navbar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";
import { Mail, ArrowRight } from "lucide-react";

export default function PendingVerification() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-slate-50 py-16">
        <div className="container-custom max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="text-accent" size={32} />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Verifica tu correo</h1>
            
            <p className="text-slate-600 mb-8 leading-relaxed">
              Te hemos enviado un correo electrónico con un enlace de verificación. 
              Por favor, revisa tu bandeja de entrada y la carpeta de spam o correo no deseado.
            </p>

            <div className="flex flex-col gap-4">
              <Link href="/login" className="btn-primary w-full justify-center">
                Ir al inicio de sesión <ArrowRight size={18} />
              </Link>
              
              <div className="mt-6 text-sm text-slate-500">
                <p>¿No has recibido el correo?</p>
                <Link href="/contacto" className="text-accent hover:underline font-medium mt-1 inline-block">
                  Contacta con soporte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
