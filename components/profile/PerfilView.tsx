import type { UserProfile } from "@/types/user";

import PerfilField from "./PerfilField";

interface PerfilViewProps {
  profile: UserProfile;
}

const ACCESS_FIELDS = (profile: UserProfile) => [
  {
    label: "Correo electrónico",
    value: profile.email,
  },
  {
    label: "Región",
    value: profile.region,
  },
];

const PERSONAL_FIELDS = (profile: UserProfile) => [
  {
    label: "Sexo",
    value: profile.gender,
  },
  {
    label: "Edad",
    value: profile.age,
  },
  {
    label: "Estado civil",
    value: profile.marital_status,
  },
];

const FAMILY_FIELDS = (profile: UserProfile) => [
  {
    label: "Número de hijos",
    value: profile.number_of_children,
  },
  {
    label: "Estructura familiar",
    value: profile.family_structure,
  },
];

const ACADEMIC_FIELDS = (profile: UserProfile) => [
  {
    label: "Nivel educativo",
    value: profile.education_level,
  },
  {
    label: "Situación laboral",
    value: profile.employment_status,
  },
  {
    label: "Nivel socioeconómico",
    value: profile.socioeconomic_level,
  },
  {
    label: "Tipo de centro educativo",
    value: profile.school_type,
  },
  {
    label: "Centro educativo",
    value: profile.school_center,
  },
];

export default function PerfilView({ profile }: PerfilViewProps) {
  const userInitial = profile.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <main className="perfil-page">
      <header className="perfil-summary">
        <div className="perfil-summary-avatar" aria-hidden="true">
          {userInitial}
        </div>

        <div className="perfil-summary-content">
          <h1 className="perfil-summary-title">Mi perfil</h1>

          <p className="perfil-summary-role">Participante</p>
        </div>
      </header>

      <section className="perfil-introduction">
        <p>
          En esta sección puedes consultar la información registrada durante tu
          inscripción en el estudio. Si detectas algún dato incorrecto, ponte en
          contacto con el equipo investigador.
        </p>
      </section>

      <div className="perfil-grid">
        <section className="perfil-card">
          <h2 className="perfil-card-title">Información de acceso</h2>

          {ACCESS_FIELDS(profile).map((field) => (
            <PerfilField
              key={field.label}
              label={field.label}
              value={field.value}
            />
          ))}
        </section>

        <section className="perfil-card">
          <h2 className="perfil-card-title">Información personal</h2>

          {PERSONAL_FIELDS(profile).map((field) => (
            <PerfilField
              key={field.label}
              label={field.label}
              value={field.value}
            />
          ))}
        </section>

        <section className="perfil-card">
          <h2 className="perfil-card-title">Información familiar</h2>

          {FAMILY_FIELDS(profile).map((field) => (
            <PerfilField
              key={field.label}
              label={field.label}
              value={field.value}
            />
          ))}
        </section>

        <section className="perfil-card">
          <h2 className="perfil-card-title">Información académica</h2>

          {ACADEMIC_FIELDS(profile).map((field) => (
            <PerfilField
              key={field.label}
              label={field.label}
              value={field.value}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
