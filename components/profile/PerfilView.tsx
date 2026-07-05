import { useMemo } from "react";

import type { UserProfile } from "@/types/user";

import PerfilField from "./PerfilField";

interface PerfilViewProps {
  profile: UserProfile;
}

/**
 * Vista principal del perfil del participante.
 */
export default function PerfilView({ profile }: PerfilViewProps) {
  const userInitial = profile.email?.trim().charAt(0).toUpperCase() || "U";

  const sections = useMemo(
    () => [
      {
        title: "Información de acceso",
        fields: [
          {
            label: "Correo electrónico",
            value: profile.email,
          },
          {
            label: "Región",
            value: profile.region,
          },
        ],
      },
      {
        title: "Información personal",
        fields: [
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
            value: profile.maritalStatus,
          },
        ],
      },
      {
        title: "Información familiar",
        fields: [
          {
            label: "Número de hijos",
            value: profile.numberOfChildren,
          },
          {
            label: "Estructura familiar",
            value: profile.familyStructure,
          },
        ],
      },
      {
        title: "Información académica",
        fields: [
          {
            label: "Nivel educativo",
            value: profile.educationLevel,
          },
          {
            label: "Situación laboral",
            value: profile.employmentStatus,
          },
          {
            label: "Nivel socioeconómico",
            value: profile.socioeconomicLevel,
          },
          {
            label: "Tipo de centro educativo",
            value: profile.schoolType,
          },
          {
            label: "Centro educativo",
            value: profile.schoolCenter,
          },
        ],
      },
    ],
    [profile],
  );

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
        {sections.map((section) => (
          <section key={section.title} className="perfil-card">
            <h2 className="perfil-card-title">{section.title}</h2>

            {section.fields.map((field) => (
              <PerfilField
                key={field.label}
                label={field.label}
                value={field.value}
              />
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
