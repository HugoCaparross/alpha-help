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

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    if (!formData.category) {
      setError("Selecciona el tipo de consulta.");
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
      setError(
        "Ha ocurrido un error al enviar tu mensaje.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="contact-form-card">
        <div className="contact-success-screen">
          <div className="contact-success-icon">
            ✓
          </div>

          <h2>Mensaje enviado</h2>

          <p>
            Hemos recibido tu consulta correctamente.
            Intentaremos responder en un plazo de
            24-48 horas laborables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-form-card">
      <h2 className="contact-form-title">
        Envíanos un mensaje
      </h2>

      <p className="contact-form-description">
        Completa el formulario y nos pondremos en
        contacto contigo lo antes posible.
      </p>

      {error && (
        <div className="contact-error">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        {/* NOMBRE */}

        <div className="auth-field">
          <div className="auth-input-wrapper">
            <User
              size={18}
              className="auth-input-icon"
            />

            <input
              type="text"
              required
              placeholder="Nombre completo"
              className="auth-input auth-input-with-icon"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>
        </div>

        {/* EMAIL */}

        <div className="auth-field">
          <div className="auth-input-wrapper">
            <Mail
              size={18}
              className="auth-input-icon"
            />

            <input
              type="email"
              required
              placeholder="Correo electrónico"
              className="auth-input auth-input-with-icon"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </div>
        </div>

        {/* CATEGORÍA */}

        <div className="auth-field">
          <label className="auth-label">
            Tipo de consulta
          </label>

          <div className="contact-category-selector">
            <button
              type="button"
              className={`contact-category-card ${
                formData.category ===
                "Consulta general"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  category: "Consulta general",
                }))
              }
            >
              <HelpCircle size={18} />

              <span>Consulta general</span>
            </button>

            <button
              type="button"
              className={`contact-category-card ${
                formData.category ===
                "Participación"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  category: "Participación",
                }))
              }
            >
              <Handshake size={18} />

              <span>Participación</span>
            </button>

            <button
              type="button"
              className={`contact-category-card ${
                formData.category ===
                "Privacidad"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  category: "Privacidad",
                }))
              }
            >
              <ShieldCheck size={18} />

              <span>Privacidad</span>
            </button>

            <button
              type="button"
              className={`contact-category-card ${
                formData.category ===
                "Soporte"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  category: "Soporte",
                }))
              }
            >
              <Wrench size={18} />

              <span>Soporte técnico</span>
            </button>
          </div>
        </div>

        {/* ASUNTO */}

        <div className="auth-field">
          <div className="auth-input-wrapper">
            <MessageSquare
              size={18}
              className="auth-input-icon"
            />

            <input
              type="text"
              required
              placeholder="Asunto"
              className="auth-input auth-input-with-icon"
              value={formData.subject}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  subject: e.target.value,
                }))
              }
            />
          </div>
        </div>

        {/* MENSAJE */}

        <div className="auth-field">
          <textarea
            required
            rows={6}
            maxLength={1000}
            className="contact-textarea"
            placeholder="Escribe tu mensaje..."
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                message: e.target.value,
              }))
            }
          />

          <div className="contact-counter">
            {formData.message.length} / 1000
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary btn-full"
        >
          <Send size={18} />

          {loading
            ? "Enviando..."
            : "Enviar mensaje"}
        </button>
      </form>
    </div>
  );
}