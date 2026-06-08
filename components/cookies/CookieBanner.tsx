"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Info, X } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show only if neither accepted nor rejected
    const cookieConsent = localStorage.getItem("alphaHelpCookies");
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("alphaHelpCookies", "accepted");
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("alphaHelpCookies", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
      <div className="container-custom mx-auto max-w-5xl pointer-events-auto">
        <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-5 md:p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Info size={20} className="text-accent" />
              <h3 className="font-bold text-slate-900 text-base">Uso de cookies</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
              Utilizamos cookies propias y de terceros para fines analíticos y para mostrarte contenido personalizado en base a un perfil elaborado a partir de tus hábitos de navegación. 
              Puedes aceptar todas las cookies, rechazarlas o ver más información.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-shrink-0">
            <Link 
              href="/politica-cookies" 
              className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors px-4 py-2 w-full sm:w-auto text-center"
              onClick={() => setIsVisible(false)} // Temporarily hide to let them read, but they should still accept/reject later or we just let it hide and not set storage
            >
              Más información
            </Link>
            
            <button 
              onClick={handleReject}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Rechazar
            </button>
            
            <button 
              onClick={handleAccept}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-accent text-white font-semibold text-sm hover:bg-sky-600 transition-colors"
            >
              Aceptar todas
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
