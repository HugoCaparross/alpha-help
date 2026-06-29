import type { UserProfile } from "@/types/user";

import PerfilField from "./PerfilField";

interface PerfilViewProps {
  profile: UserProfile;
}

export default function PerfilView({ profile }: PerfilViewProps) {
  const {
    email,
    region,
    gender,
    age,
    marital_status,
    education_level,
    employment_status,
    socioeconomic_level,
    school_type,
    school_center,
    number_of_children,
    family_structure,
  } = profile;

  return (
    <div className="perfil-page">
      <header className="perfil-summary">
        <div className="perfil-summary-avatar" aria-hidden="true">
          {(email?.charAt(0) ?? "U").toUpperCase()}
        </div>

        <div className="perfil-summary-content">
          <h2 className="perfil-summary-name">{email}</h2>

          <p className="perfil-summary-region">
            {region || "Región no disponible"}
          </p>
        </div>
      </header>

      <div className="perfil-grid">
        <section className="perfil-card">
          <h2 className="perfil-card-title">Personal</h2>

          <PerfilField label="Sexo" value={gender} />

          <PerfilField label="Edad" value={age} />

          <PerfilField label="Estado civil" value={marital_status} />
        </section>

        <section className="perfil-card">
          <h2 className="perfil-card-title">Educación</h2>

          <PerfilField label="Nivel educativo" value={education_level} />

          <PerfilField label="Situación laboral" value={employment_status} />

          <PerfilField
            label="Nivel socioeconómico"
            value={socioeconomic_level}
          />

          <PerfilField label="Tipo de centro" value={school_type} />

          <PerfilField label="Centro educativo" value={school_center} />
        </section>

        <section className="perfil-card">
          <h2 className="perfil-card-title">Familia</h2>

          <PerfilField label="Número de hijos" value={number_of_children} />

          <PerfilField label="Estructura familiar" value={family_structure} />
        </section>
      </div>
    </div>
  );
}
