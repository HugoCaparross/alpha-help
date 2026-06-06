import { Search, AlertCircle, HeartHandshake, ShieldCheck, ChevronDown } from 'lucide-react';
import '../styles/project.css';

const STEPS = [
  {
    icon: <Search size={24} />,
    label: 'Comprender',
    desc: 'Qué está pasando',
  },
  {
    icon: <AlertCircle size={24} />,
    label: 'Detectar',
    desc: 'Señales de alerta',
  },
  {
    icon: <HeartHandshake size={24} />,
    label: 'Actuar',
    desc: 'Cómo ayudar',
  },
  {
    icon: <ShieldCheck size={24} />,
    label: 'Prevenir',
    desc: 'Cuidar y fortalecer',
  },
] as const;

export default function ProjectToolkit() {
  return (
    <section className="section bg-surface">
      <div className="container-custom">
        <div className="proj-grid-2">

          {/* ── Left ── */}
          <div>
            <span className="proj-eyebrow">¿Qué es Alpha-Help?</span>
            <h2 className="proj-h2">
              Un botiquín de primeros auxilios{' '}
              <em>para familias</em>
            </h2>
            <p className="proj-body">
              Alpha-Help es un proyecto de investigación desarrollado por
              investigadores de la Universidad Internacional de La Rioja (UNIR).
            </p>
            <p className="proj-body">
              Hemos creado un "botiquín de primeros auxilios" para las familias:
              un programa temprano que ofrece información clara, recursos prácticos
              y estrategias basadas en la evidencia científica para comprender,
              detectar y actuar ante situaciones que pueden afectar el bienestar
              emocional y la salud mental de sus hijos e hijas.
            </p>
            <p className="proj-body">
              Nuestro objetivo es favorecer la detección temprana de dificultades
              y promover una intervención más rápida y eficaz.
            </p>
          </div>

          {/* ── Right: roadmap ── */}
          <div className="proj-toolkit__flow" role="list" aria-label="Pasos del programa">
            {STEPS.map((step, i) => (
              <div key={step.label} role="listitem">
                <div className="proj-toolkit__step">
                  <div className="proj-toolkit__step-icon" aria-hidden="true">
                    {step.icon}
                  </div>
                  <div className="proj-toolkit__step-body">
                    <p className="proj-toolkit__step-label">{step.label}</p>
                    <p className="proj-toolkit__step-desc">{step.desc}</p>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="proj-toolkit__connector" aria-hidden="true">
                    <ChevronDown size={18} />
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}