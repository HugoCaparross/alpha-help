import {
  Building2,
  User,
  Clock,
  Gift,
  Microscope,
  Heart,
  Sparkles,
} from 'lucide-react';
import '../styles/project.css';

const META = [
  {
    icon: <Building2 size={18} />,
    label: 'Promotor',
    value: 'Universidad Internacional de La Rioja (UNIR)',
  },
  {
    icon: <User size={18} />,
    label: 'Investigador principal',
    value: 'Eduardo González-Fraile',
  },
  {
    icon: <Clock size={18} />,
    label: 'Duración de la intervención',
    value: '8 meses',
  },
  {
    icon: <Gift size={18} />,
    label: 'Participación',
    value: 'Gratuita',
  },
] as const;

const PILLARS = [
  {
    icon: <Microscope size={20} />,
    title: 'Ciencia rigurosa',
    desc: 'Metodología avalada por expertos y universidades.',
  },
  {
    icon: <Heart size={20} />,
    title: 'Impacto social',
    desc: 'Resultados que se traducen en intervenciones reales.',
  },
  {
    icon: <Sparkles size={20} />,
    title: 'Futuro mejor',
    desc: 'Trabajamos hoy por el bienestar de mañana.',
  },
] as const;

export default function ProjectResearch() {
  return (
    <section className="section proj-section--alt">
      <div className="container-custom">
        <div className="section-header">
          <span className="section-badge">El estudio</span>
          <h2 className="section-title">
            Sobre el estudio de investigación
          </h2>
        </div>

        <div className="proj-grid-2 proj-grid-2--top">

          {/* ── Left: meta table ── */}
          <dl className="proj-research__meta" aria-label="Datos del estudio">
            {META.map((row) => (
              <div key={row.label} className="proj-research__meta-row">
                <div className="proj-research__meta-icon" aria-hidden="true">
                  {row.icon}
                </div>
                <div>
                  <dt className="proj-research__meta-label">{row.label}</dt>
                  <dd className="proj-research__meta-value">{row.value}</dd>
                </div>
              </div>
            ))}
          </dl>

          {/* ── Right ── */}
          <div>
            <span className="proj-eyebrow">Investigación con propósito</span>
            <h3 className="proj-h2" style={{ fontSize: '1.5rem' }}>
              Este proyecto generará conocimiento científico riguroso para
              desarrollar herramientas y programas que mejoren la salud mental
              adolescente en el futuro.
            </h3>

            <div className="proj-research__pillars">
              {PILLARS.map((p) => (
                <div key={p.title} className="card proj-research__pillar">
                  <div className="proj-why-card__icon" style={{ flexShrink: 0 }} aria-hidden="true">
                    {p.icon}
                  </div>
                  <div>
                    <p className="proj-research__pillar-title">{p.title}</p>
                    <p className="proj-research__pillar-desc">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}