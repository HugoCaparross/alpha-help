import Link from "next/link";
import Navbar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function CompletedVerification() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-slate-50 py-16">
        <div className="container-custom max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-emerald-500" size={36} />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">¡Correo verificado!</h1>
            
            <p className="text-slate-600 mb-8 leading-relaxed">
              Tu dirección de correo electrónico ha sido verificada correctamente. 
              Ya puedes acceder a tu cuenta y continuar con el proceso de participación en Alpha-Help.
            </p>

            <Link href="/login" className="btn-primary w-full justify-center">
              Iniciar sesión <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
