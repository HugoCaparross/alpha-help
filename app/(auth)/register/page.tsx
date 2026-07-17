import RegisterWizard from "@/components/auth/RegisterWizard";

export default function RegisterPage() {
  return (
    <main className="auth-layout">
      <section className="auth-hero">
        <div className="auth-hero-overlay" />

        <div className="auth-hero-content">
          <h1 className="auth-hero-title">
            Acompañar a tu familia
            <br />
            es la mejor prevención
          </h1>

          <p className="hero__description">
            Programa desarrollado por investigadores de la Universidad
            Internacional de La Rioja y profesionales de la salud mental
            infanto-juvenil para mejorar el bienestar emocional de adolescentes
            y familias.
          </p>
        </div>
      </section>

      <section className="auth-form-section">
        <RegisterWizard />
      </section>
    </main>
  );
}
