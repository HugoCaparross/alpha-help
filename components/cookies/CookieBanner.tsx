"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Info } from "lucide-react";

import "@/components/styles/cookies.css";

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
    <div className="cookie-banner">
      <div className="cookie-banner-container">
        <div className="cookie-banner-card">
          <div className="cookie-banner-content">
            <div className="cookie-banner-header">
              <Info size={20} className="text-accent" />

              <h3 className="cookie-banner-title">Uso de cookies</h3>
            </div>

            <p className="cookie-banner-text">
              Utilizamos cookies propias y de terceros para fines analíticos y
              para mostrarte contenido personalizado en base a un perfil
              elaborado a partir de tus hábitos de navegación. Puedes aceptar
              todas las cookies, rechazarlas o consultar más información.
            </p>
          </div>

          <div className="cookie-banner-actions">
            <Link
              href="/politica-cookies"
              className="cookie-banner-link"
              onClick={() => setIsVisible(false)}
            >
              Más información
            </Link>

            <button onClick={handleReject} className="btn-secondary">
              Rechazar
            </button>

            <button onClick={handleAccept} className="btn-primary">
              Aceptar todas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
