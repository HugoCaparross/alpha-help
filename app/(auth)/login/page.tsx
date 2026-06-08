import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="auth-layout">
      <section className="auth-hero">
        <div className="auth-hero-overlay" />

        <div className="auth-hero-content">
          <h1 className="auth-hero-title">Bienvenido de nuevo</h1>

          <p className="auth-hero-description">
            Continúa contribuyendo al bienestar emocional de adolescentes y
            familias mediante una investigación basada en evidencia científica.
          </p>
        </div>
      </section>

      <section className="auth-form-section">
        <div
          className="register-card"
          style={{
            maxWidth: "480px",
            padding: "40px",
          }}
        >
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
