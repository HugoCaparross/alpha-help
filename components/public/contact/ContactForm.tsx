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
  AlertCircle,
} from "lucide-react";

const categories = [
  {
    id: "Consulta general",
    icon: HelpCircle,
  },
  {
    id: "Participación",
    icon: Handshake,
  },
  {
    id: "Privacidad",
    icon: ShieldCheck,
  },
  {
    id: "Soporte",
    icon: Wrench,
  },
] as const;

const GENERIC_ERROR =
  "No hemos podido procesar tu solicitud en este momento. Por favor, inténtalo de nuevo o escribe directamente a alpha-help@unir.net.";

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

  function updateField(field: keyof typeof formData, value: string) {
    if (error) {
      setError("");
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function validateForm() {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!name || name.length < 2) {
      return "Introduce un nombre válido.";
    }

    if (!email) {
      return "Introduce un correo electrónico válido.";
    }

    if (!formData.category) {
      return "Selecciona el tipo de consulta.";
    }

    if (subject.length < 5) {
      return "El asunto debe tener al menos 5 caracteres.";
    }

    if (message.length < 20) {
      return "Describe tu consulta con un poco más de detalle.";
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) {
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    setError("");

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      category: formData.category,
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? GENERIC_ERROR);
      }

      setSuccess(true);

      setFormData({
        name: "",
        email: "",
        category: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(GENERIC_ERROR);
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <section className="contact-success-card">
        <div className="contact-success-icon-wrapper">
          <CheckCircle size={36} />
        </div>

        <h2 className="contact-success-title">Mensaje enviado correctamente</h2>

        <p className="contact-success-description">
          Hemos recibido tu consulta con éxito. Nuestro equipo revisará la
          información y te responderemos al correo proporcionado en un plazo de
          24 a 48 horas laborables.
        </p>

        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="btn-outline contact-success-button"
        >
          Enviar otro mensaje
        </button>
      </section>
    );
  }

  return (
    <div className="contact-form-card" aria-busy={loading}>
      <h2 className="contact-form-title">Formulario de contacto</h2>

      <p className="contact-form-description">
        Completa los campos a continuación para ayudarnos a clasificar tu duda.
      </p>

      {error && (
        <div className="contact-error" role="alert" aria-live="polite">
          <AlertCircle size={20} />

          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="contact-field">
          <div className="contact-input-wrapper">
            <User size={18} className="contact-input-icon" />

            <input
              type="text"
              required
              placeholder="Nombre completo"
              className="contact-input"
              value={formData.name}
              aria-invalid={!!error}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>
        </div>

        <div className="contact-field">
          <div className="contact-input-wrapper">
            <Mail size={18} className="contact-input-icon" />

            <input
              type="email"
              required
              placeholder="Correo electrónico"
              className="contact-input"
              value={formData.email}
              aria-invalid={!!error}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>
        </div>

        <div className="contact-field">
          <label className="contact-label">Tipo de consulta</label>

          <div className="contact-category-selector">
            {categories.map((cat) => {
              const Icon = cat.icon;

              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`contact-category-card ${
                    formData.category === cat.id ? "active" : ""
                  }`}
                  onClick={() => updateField("category", cat.id)}
                >
                  <Icon size={16} />

                  <span>{cat.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="contact-field">
          <div className="contact-input-wrapper">
            <MessageSquare size={18} className="contact-input-icon" />

            <input
              type="text"
              required
              placeholder="Asunto"
              className="contact-input"
              value={formData.subject}
              aria-invalid={!!error}
              onChange={(e) => updateField("subject", e.target.value)}
            />
          </div>
        </div>

        <div className="contact-field">
          <textarea
            required
            rows={5}
            maxLength={1000}
            className="contact-textarea"
            placeholder="Escribe tu mensaje con el máximo detalle posible..."
            value={formData.message}
            aria-invalid={!!error}
            onChange={(e) => updateField("message", e.target.value)}
          />

          <div className="contact-counter">
            {formData.message.length} / 1000
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary contact-submit-button"
        >
          {loading ? (
            "Enviando..."
          ) : (
            <>
              Enviar mensaje
              <Send size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
