"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setError(error.message || "Error al restablecer la contraseña.");
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
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
                <h1 className="text-2xl font-bold text-slate-900 mb-4">¡Contraseña actualizada!</h1>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Tu contraseña se ha restablecido correctamente. Te estamos redirigiendo al panel...
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">Nueva contraseña</h1>
                  <p className="text-slate-600 text-sm">
                    Introduce tu nueva contraseña para tu cuenta de Alpha-Help.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Nueva contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 pl-12 pr-12 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm transition-colors focus:outline-none focus:border-accent focus:ring-4 focus:ring-sky-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {error && <p className="text-danger text-sm font-medium">{error}</p>}

                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                    {loading ? "Guardando..." : "Guardar contraseña"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
