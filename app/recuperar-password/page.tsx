"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/restablecer-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Error al solicitar la recuperación.");
    } else {
      setSuccess(true);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-slate-50 py-16">
        <div className="container-custom max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
            {success ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-emerald-500" size={28} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Revisa tu correo</h1>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Si tu correo electrónico coincide con una cuenta registrada, te hemos enviado instrucciones para restablecer tu contraseña.
                </p>
                <Link href="/login" className="btn-primary w-full justify-center">
                  Volver al inicio de sesión <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">Recuperar contraseña</h1>
                  <p className="text-slate-600 text-sm">
                    Introduce tu correo y te enviaremos un enlace para crear una nueva contraseña.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="Correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm transition-colors focus:outline-none focus:border-accent focus:ring-4 focus:ring-sky-100"
                    />
                  </div>

                  {error && <p className="text-danger text-sm font-medium">{error}</p>}

                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                    {loading ? "Enviando..." : "Enviar enlace"}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
                    <ArrowLeft size={16} /> Volver a iniciar sesión
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
