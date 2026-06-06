import { User } from 'lucide-react';
import '../styles/project.css';

interface TeamMember {
  name: string;
  role: string;
  photo?: string;
}

const TEAM: TeamMember[] = [
  { name: 'Eduardo González-Fraile', role: 'Psicólogo' },
  { name: 'María Pilar Berzosa Grande', role: 'Psicóloga' },
  { name: 'Ana Ordóñez López', role: 'Psicóloga' },
  { name: 'María Arantzazu Basterra González', role: 'Psicopedagoga' },
  { name: 'Daniels Baridón Chauvé', role: 'Psicopedagoga' },
];

export default function ProjectTeam() {
  return (
    <section className="section bg-surface">
      <div className="container-custom">
        <div className="section-header">
          <span className="section-badge">Las personas</span>
          <h2 className="section-title">Equipo investigador</h2>
        </div>

        <div className="proj-team__grid">
          {TEAM.map((member) => (
            <article key={member.name} className="card proj-team-card">
              <div className="proj-team-card__avatar">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.photo} alt={`Foto de ${member.name}`} />
                ) : (
                  <div className="proj-team-card__avatar-placeholder" aria-hidden="true">
                    <User size={32} />
                  </div>
                )}
              </div>
              <p className="proj-team-card__name">{member.name}</p>
              <p className="proj-team-card__role">{member.role}</p>
            </article>
          ))}
        </div>

        <p className="proj-team__note">
          El programa Alpha-Help ha sido desarrollado por un equipo multidisciplinar
          formado por profesionales de la psicología, la psicopedagogía y la
          investigación en salud mental infanto-juvenil.
        </p>
      </div>
    </section>
  );
}