"use client";

import { useState } from "react";
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
 * Tarjeta informativa de un miembro del equipo investigador.
 *
 * Si existe una fotografía y puede cargarse correctamente,
 * se muestra la imagen.
 *
 * Si no existe fotografía o la imagen falla al cargar,
 * se muestran las iniciales del nombre y primer apellido.
 */
export default function TeamMemberCard({
  name,
  studies,
  role,
  description,
  initials,
  photoUrl,
}: TeamMemberCardProps) {
  const [imageError, setImageError] = useState(false);

  const showPhoto = Boolean(photoUrl) && !imageError;

  return (
    <article className="about-member" aria-labelledby={`member-${initials}`}>
      <div className="about-member-avatar">
        {showPhoto ? (
          <Image
            src={photoUrl!}
            alt=""
            fill
            sizes="72px"
            className="about-member-avatar-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <span aria-hidden="true">{initials}</span>
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