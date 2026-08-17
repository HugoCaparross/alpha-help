import { useMemo } from "react";

import type {
  ChildProfile,
  UserProfile,
} from "@/types/user";

import { getRegionLabel } from "@/lib/utils/regions";

import PerfilField from "./PerfilField";

interface PerfilViewProps {
  profile: UserProfile;
}

function formatDate(
  date: string,
): string {
  const parsedDate = new Date(date);

  if (
    Number.isNaN(parsedDate.getTime())
  ) {
    return "No disponible";
  }

  return new Intl.DateTimeFormat(
    "es-ES",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  ).format(parsedDate);
}

function getChildLabel(
  index: number,
): string {
  return `Hijo/a ${index + 1}`;
}

function formatChildSummary(
  child: ChildProfile,
): string {
  const age =
    `${child.age} años`;

  const gender =
    child.gender || "Sexo no indicado";

  const support =
    child.psychologicalSupport
      ? "Con atención psicológica"
      : "Sin atención psicológica";

  return `${age} · ${gender} · ${support}`;
}

/**
 * Vista principal del perfil
 * del participante.
 */
export default function PerfilView({
  profile,
}: PerfilViewProps) {
  const participantInitials =
    useMemo(() => {
      const code =
        profile.participantCode.trim();

      if (!code) {
        return "AH";
      }

      return code
        .split("-")
        .map((part) =>
          part.charAt(0),
        )
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }, [
      profile.participantCode,
    ]);

  const registrationDate =
    useMemo(
      () =>
        formatDate(
          profile.createdAt,
        ),
      [profile.createdAt],
    );

  const regionLabel =
    getRegionLabel(profile.region);

  const children = useMemo(
    () =>
      profile.children ?? [],
    [profile.children],
  );

  const sections = useMemo(
    () => [
      {
        title:
          "Información de acceso",
        fields: [
          {
            label:
              "Código de participante",
            value:
              profile.participantCode,
          },
          {
            label:
              "Correo electrónico",
            value: profile.email,
          },
          {
            label: "Región",
            value: regionLabel,
          },
          {
            label:
              "Fecha de inscripción",
            value:
              registrationDate,
          },
        ],
      },
      {
        title:
          "Información personal",
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
            label:
              "Estado civil",
            value:
              profile.maritalStatus,
          },
        ],
      },
      {
        title:
          "Información familiar",
        fields: [
          {
            label:
              "Número de hijos",
            value:
              profile.numberOfChildren,
          },
          {
            label:
              "Estructura familiar",
            value:
              profile.familyStructure,
          },
        ],
      },
      {
        title:
          "Información académica",
        fields: [
          {
            label:
              "Nivel educativo",
            value:
              profile.educationLevel,
          },
          {
            label:
              "Situación laboral",
            value:
              profile.employmentStatus,
          },
          {
            label:
              "Nivel socioeconómico",
            value:
              profile.socioeconomicLevel,
          },
          {
            label:
              "Tipo de centro educativo",
            value:
              profile.schoolType,
          },
          {
            label:
              "Centro educativo",
            value:
              profile.schoolCenter,
          },
        ],
      },
    ],
    [
      profile,
      regionLabel,
      registrationDate,
    ],
  );

  return (
    <main className="perfil-page">
      <header className="perfil-summary">
        <div
          className="perfil-summary-avatar"
          aria-hidden="true"
        >
          {participantInitials}
        </div>

        <div className="perfil-summary-content">
          <h1 className="perfil-summary-title">
            Mi perfil
          </h1>

          <p className="perfil-summary-role">
            Participante
          </p>

          <p className="perfil-summary-code">
            Código{" "}
            {profile.participantCode}
          </p>
        </div>
      </header>

      <section className="perfil-introduction">
        <p>
          Aquí puedes consultar la
          información registrada durante tu
          inscripción en el estudio. Estos
          datos forman parte del proyecto de
          investigación y no pueden
          modificarse desde la plataforma.
          Si detectas algún dato incorrecto,
          ponte en contacto con el equipo
          investigador.
        </p>
      </section>

      <div className="perfil-grid">
        {sections.map((section) => (
          <section
            key={section.title}
            className="perfil-card"
          >
            <h2 className="perfil-card-title">
              {section.title}
            </h2>

            {section.fields.map(
              (field) => (
                <PerfilField
                  key={field.label}
                  label={field.label}
                  value={field.value}
                />
              ),
            )}
          </section>
        ))}

        <section className="perfil-card perfil-card--children">
          <h2 className="perfil-card-title">
            Información de los hijos
          </h2>

          {children.length === 0 ? (
            <PerfilField
              label="Hijos registrados"
              value={null}
            />
          ) : (
            children.map(
              (child, index) => (
                <PerfilField
                  key={`profile-child-${index}`}
                  label={getChildLabel(
                    index,
                  )}
                  value={formatChildSummary(
                    child,
                  )}
                />
              ),
            )
          )}
        </section>
      </div>
    </main>
  );
}