interface QuestionnaireProgressProps {
  questionnaireTitle: string;

  currentStep: number;

  totalSteps: number;
}

/**
 * Calcula el porcentaje de progreso
 * del cuestionario.
 */
function calculateProgress(currentStep: number, totalSteps: number): number {
  if (totalSteps <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((currentStep / totalSteps) * 100));
}

/**
 * Barra de progreso del cuestionario.
 */
export default function QuestionnaireProgress({
  questionnaireTitle,
  currentStep,
  totalSteps,
}: QuestionnaireProgressProps) {
  const progress = calculateProgress(currentStep, totalSteps);

  const progressDescriptionId = "questionnaire-progress-description";

  const progressLabel = `Pregunta ${currentStep} de ${totalSteps}`;

  const progressText = `Ya has completado el ${progress}% del cuestionario.`;

  return (
    <section
      className="questionnaire-progress"
      aria-labelledby="questionnaire-progress-title"
    >
      <header className="questionnaire-progress__header">
        <p
          id="questionnaire-progress-title"
          className="questionnaire-progress__title"
        >
          {questionnaireTitle}
        </p>

        <p id={progressDescriptionId} className="questionnaire-progress__step">
          {progressLabel}
        </p>
      </header>

      <div
        className="questionnaire-progress__bar"
        role="progressbar"
        aria-labelledby="questionnaire-progress-title"
        aria-describedby={progressDescriptionId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-valuetext={`${progress}% completado. ${progressLabel}.`}
      >
        <div
          className="questionnaire-progress__fill"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <footer className="questionnaire-progress__footer">
        <p className="questionnaire-progress__percentage">{progress}%</p>

        <p className="questionnaire-progress__text">{progressText}</p>
      </footer>
    </section>
  );
}
