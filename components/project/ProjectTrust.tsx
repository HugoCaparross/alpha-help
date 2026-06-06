import { ShieldCheck, Check, Lock } from 'lucide-react';
import '../styles/project.css';

const LIST_ITEMS = [
  'Consentimiento informado',
  'Datos confidenciales y anónimos',
  'Cumplimiento del RGPD',
  'Supervisión ética y científica',
] as const;

export default function ProjectTrust() {
  return (
    <section className="section bg-surface">
      <div className="container-custom">
        <div className="proj-grid-2">

          {/* ── Left ── */}
          <div>
            <span className="proj-eyebrow">Confianza y ética</span>
            <h2 className="proj-h2">
              La seguridad y el bienestar de los{' '}
              <em>participantes son nuestra prioridad</em>
            </h2>
            <p className="proj-body">
              Todo el programa se desarrolla bajo los más estrictos criterios
              éticos y de privacidad. Tu participación es completamente
              confidencial y tus datos nunca serán cedidos a terceros.
            </p>

            <ul className="proj-trust__list" aria-label="Compromisos éticos">
              {LIST_ITEMS.map((item) => (
                <li key={item}>
                  <Check size={17} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right: featured card ── */}
          <div className="proj-trust__card" role="complementary" aria-label="Garantía de privacidad">
            <div className="proj-trust__card-bg" aria-hidden="true" />

            <div className="proj-trust__card-photo-placeholder" aria-hidden="true">
              <Lock size={160} />
            </div>

            <div className="proj-trust__card-content">
              <div className="proj-trust__card-shield" aria-hidden="true">
                <ShieldCheck size={24} />
              </div>
              <p className="proj-trust__card-title">
                Tu información está<br />100% protegida
              </p>
              <p className="proj-trust__card-desc">
                No compartimos tus datos personales con terceros bajo ninguna circunstancia.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}