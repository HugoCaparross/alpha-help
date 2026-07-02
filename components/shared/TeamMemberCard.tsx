interface TeamMemberCardProps {
  name: string;
  role: string;
  description: string;
  initials: string;
}

/**
 * Tarjeta informativa de un miembro
 * del equipo investigador.
 */
export default function TeamMemberCard({
  name,
  role,
  description,
  initials,
}: TeamMemberCardProps) {
  return (
    <article className="about-member" aria-labelledby={`member-${initials}`}>
      <div className="about-member-avatar" aria-hidden="true">
        {initials}
      </div>

      <div className="about-member-content">
        <h3 id={`member-${initials}`} className="about-member-name">
          {name}
        </h3>

        <p className="about-member-role">{role}</p>

        <p className="about-member-description">{description}</p>
      </div>
    </article>
  );
}
