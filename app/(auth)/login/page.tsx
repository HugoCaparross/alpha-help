import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="auth-layout">

      <div className="auth-panel">
        <LoginForm />
      </div>
    </main>
  );
}