export default function EstudioPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">El estudio</h1>
        <p className="text-slate-600">Conoce en qué consiste el estudio Alpha-Help.</p>
      </header>

      {/* Block 1 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-50 rounded-lg">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 2v20" stroke="#0ea5a4" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-500">1. ¿Cuál es la idea del estudio?</div>
            <p className="mt-2 text-slate-700">El estudio busca evaluar el impacto de intervenciones de apoyo familiar y formación en bienestar emocional durante la adolescencia.</p>
          </div>
        </div>
      </section>

      {/* Block 2 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900">2. ¿Qué queremos conseguir?</h3>
        <ul className="mt-3 list-disc list-inside text-slate-700 space-y-2">
          <li>Mejorar el bienestar emocional de adolescentes y familias.</li>
          <li>Validar herramientas de intervención en un entorno real.</li>
          <li>Generar evidencia científica replicable.</li>
        </ul>
      </section>

      {/* Block 3 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900">3. ¿Qué temas abordamos?</h3>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            "Salud mental",
            "Relaciones familiares",
            "Uso de tecnología",
            "Educación digital",
            "Gestión emocional",
            "Conductas de riesgo",
          ].map((t) => (
            <div key={t} className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
              <div className="w-9 h-9 rounded-md bg-white border border-slate-200 flex items-center justify-center">📘</div>
              <div className="text-sm font-medium">{t}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Block 4 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900">4. ¿Cómo lo hacemos?</h3>
        <p className="mt-2 text-slate-700">A través de registros estandarizados, sesiones formativas y seguimiento longitudinal de los participantes.</p>
      </section>

      {/* Block 5 */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900">5. ¿Cómo será tu participación?</h3>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">1</div>
            <div>
              <div className="font-medium">Inscripción</div>
              <div className="text-xs text-slate-500">Registro y aceptación de consentimiento.</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">2</div>
            <div>
              <div className="font-medium">Evaluación inicial</div>
              <div className="text-xs text-slate-500">Cuestionarios iniciales para establecer línea base.</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">3</div>
            <div>
              <div className="font-medium">Sesiones</div>
              <div className="text-xs text-slate-500">Sesiones formativas y actividades mensuales.</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">4</div>
            <div>
              <div className="font-medium">Evaluación final</div>
              <div className="text-xs text-slate-500">Evaluación de resultados y cierre del estudio.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
