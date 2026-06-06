import { Building2, GraduationCap, Award, Handshake } from 'lucide-react';
import '../styles/project.css';

const PARTNERS = [
  {
    icon: <GraduationCap size={38} />,
    name: 'UNIR',
    sub: 'La Universidad en Internet',
  },
  {
    icon: <Building2 size={38} />,
    name: 'Centros educativos',
    sub: 'Colaboradores',
  },
  {
    icon: <Award size={38} />,
    name: 'Financiado por UNIR',
    sub: '',
  },
  {
    icon: <Handshake size={38} />,
    name: 'Profesionales y organizaciones',
    sub: 'Con su apoyo',
  },
] as const;

export default function ProjectPartners() {
  return (
    <section className="section proj-section--alt">
      <div className="container-custom">
        <div className="section-header">
          <span className="section-badge">Colaboradores</span>
          <h2 className="section-title">Entidades colaboradoras</h2>
          <p className="section-description">
            Trabajamos junto a instituciones de referencia.
          </p>
        </div>

        <div className="proj-partners__row" role="list" aria-label="Entidades colaboradoras">
          {PARTNERS.map((p) => (
            <div key={p.name} className="proj-partners__logo" role="listitem">
              <div className="proj-partners__logo-mark" aria-hidden="true">
                {p.icon}
              </div>
              <span className="proj-partners__logo-name">
                {p.name}
                {p.sub ? ` · ${p.sub}` : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}