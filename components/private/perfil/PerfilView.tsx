import type { UserProfile } from "@/types/user";

import PerfilField from "./PerfilField";

interface PerfilViewProps {
  profile: UserProfile;
}

export default function PerfilView({
  profile,
}: PerfilViewProps) {
  return (
    <div className="perfil-page">
      <section className="perfil-summary">
        <div className="perfil-summary-avatar">
          {profile.email?.charAt(0).toUpperCase()}
        </div>

        <div className="perfil-summary-content">
          <h2 className="perfil-summary-name">
            {profile.email}
          </h2>

          <p className="perfil-summary-region">
            {profile.region || "Región no disponible"}
          </p>
        </div>
      </section>

      <div className="perfil-grid">
        <section className="perfil-card">
          <h2 className="perfil-card-title">
            Personal
          </h2>

          <PerfilField
            label="Sexo"
            value={profile.gender}
          />

          <PerfilField
            label="Edad"
            value={profile.age}
          />

          <PerfilField
            label="Estado civil"
            value={profile.marital_status}
          />
        </section>

        <section className="perfil-card">
          <h2 className="perfil-card-title">
            Educación
          </h2>

          <PerfilField
            label="Nivel educativo"
            value={profile.education_level}
          />

          <PerfilField
            label="Situación laboral"
            value={profile.employment_status}
          />

          <PerfilField
            label="Nivel socioeconómico"
            value={profile.socioeconomic_level}
          />

          <PerfilField
            label="Tipo de centro"
            value={profile.school_type}
          />

          <PerfilField
            label="Centro educativo"
            value={profile.school_center}
          />
        </section>

        <section className="perfil-card">
          <h2 className="perfil-card-title">
            Familia
          </h2>

          <PerfilField
            label="Número de hijos"
            value={profile.number_of_children}
          />

          <PerfilField
            label="Estructura familiar"
            value={profile.family_structure}
          />
        </section>
      </div>
    </div>
  );
}