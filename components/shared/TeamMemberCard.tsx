import Image from "next/image";

interface TeamMemberCardProps {
  name: string;
  studies: string;
  role: string;
  description: string;
  initials: string;
  photoUrl?: string;
}

/**
 * Tarjeta informativa de un miembro
 * del equipo investigador.
 *
 * Muestra una fotografía si se indica
 * `photoUrl`; en caso contrario muestra
 * las iniciales sobre un fondo de color.
 */
export default function TeamMemberCard({
  name,
  studies,
  role,
  description,
  initials,
  photoUrl,
}: TeamMemberCardProps) {
  return (
    <article className="about-member" aria-labelledby={`member-${initials}`}>
      <div className="about-member-avatar" aria-hidden="true">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            fill
            sizes="72px"
            className="about-member-avatar-image"
          />
        ) : (
          initials
        )}
      </div>

      <div className="about-member-content">
        <h3 id={`member-${initials}`} className="about-member-name">
          {name}
        </h3>

        <p className="about-member-role">
          {studies} · {role}
        </p>

        {description && (
          <p className="about-member-description">{description}</p>
        )}
      </div>
    </article>
  );
}