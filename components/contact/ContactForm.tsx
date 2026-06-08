"use client";

import { useState } from "react";
import {
  Mail,
  User,
  MessageSquare,
  Send,
  HelpCircle,
  ShieldCheck,
  Wrench,
  Handshake,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData.category) {
      setError("Por favor, selecciona un tipo de consulta para poder derivarlo al departamento adecuado.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        category: "",
        subject: "",
        message: "",
      });
    } catch {
      setError("No hemos podido procesar tu solicitud en este momento. Por favor, inténtalo de nuevo o escribe directamente a alpha-help@unir.net.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 text-center h-full flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-emerald-500" size={36} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Mensaje enviado correctamente</h2>
        <p className="text-slate-600 mb-8 leading-relaxed max-w-sm mx-auto">
          Hemos recibido tu consulta con éxito. Nuestro equipo revisará la información y te responderemos al correo proporcionado en un plazo de 24 a 48 horas laborables.
        </p>
        <button onClick={() => setSuccess(false)} className="btn-outline">
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Formulario de contacto
      </h2>
      <p className="text-slate-600 mb-6 text-sm">
        Completa los campos a continuación para ayudarnos a clasificar tu duda.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex gap-3 items-start text-sm">
          <AlertCircle size={20} className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="auth-field">
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              placeholder="Nombre completo"
              className="w-full h-12 pl-11 pr-4 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-4 focus:ring-sky-100 transition-all"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
        </div>

        <div className="auth-field">
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              required
              placeholder="Correo electrónico"
              className="w-full h-12 pl-11 pr-4 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-4 focus:ring-sky-100 transition-all"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
        </div>

        <div className="auth-field">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Tipo de consulta
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "Consulta general", icon: HelpCircle },
              { id: "Participación", icon: Handshake },
              { id: "Privacidad", icon: ShieldCheck },
              { id: "Soporte", icon: Wrench },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                  formData.category === cat.id
                    ? "border-accent bg-sky-50 text-accent"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
                onClick={() => setFormData((prev) => ({ ...prev, category: cat.id }))}
              >
                <cat.icon size={16} />
                <span>{cat.id}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="auth-field">
          <div className="relative">
            <MessageSquare size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              placeholder="Asunto"
              className="w-full h-12 pl-11 pr-4 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-4 focus:ring-sky-100 transition-all"
              value={formData.subject}
              onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
            />
          </div>
        </div>

        <div className="auth-field">
          <textarea
            required
            rows={5}
            maxLength={1000}
            className="w-full p-4 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-accent focus:ring-4 focus:ring-sky-100 transition-all resize-none"
            placeholder="Escribe tu mensaje con el máximo detalle posible..."
            value={formData.message}
            onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          />
          <div className="text-right text-xs text-slate-400 mt-1">
            {formData.message.length} / 1000
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center mt-2"
        >
          {loading ? "Enviando..." : (
            <>
              Enviar mensaje <Send size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}