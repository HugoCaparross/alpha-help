"use client";

import { ChevronRight } from "lucide-react";

interface TeamMemberCardProps {
  name: string;
  role: string;
  description: string;
  initials: string;
}

export default function TeamMemberCard({
  name,
  role,
  description,
  initials,
}: TeamMemberCardProps) {
  return (
    <article className="about-member">
      <div className="about-member-avatar">{initials}</div>

      <div className="about-member-content">
        <h3 className="about-member-name">{name}</h3>
        <p className="about-member-role">{role}</p>
        <p className="about-member-description">{description}</p>
      </div>

      <button className="about-member-action" aria-label={`Ver perfil de ${name}`}>
        Ver más
        <ChevronRight size={14} />
      </button>
    </article>
  );
}
