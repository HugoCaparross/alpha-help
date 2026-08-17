interface QuestionnaireProgressProps {
  questionnaireTitle: string;

  currentStep: number;

  totalSteps: number;

  segments: readonly number[];
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
  segments,
}: QuestionnaireProgressProps) {
  const progress = calculateProgress(currentStep, totalSteps);

  const progressLevel =
    progress >= 100
      ? "complete"
      : progress >= 75
        ? "high"
        : progress >= 40
          ? "medium"
          : "low";

  const progressDescriptionId = "questionnaire-progress-description";

  const progressLabel = `Pregunta ${currentStep} de ${totalSteps}`;

  /**
   * Calcula la posición acumulada
   * de cada separador.
   */
  const dividerPositions: number[] = [];

  let accumulated = 0;

  for (let index = 0; index < segments.length - 1; index++) {
    accumulated += segments[index];

    dividerPositions.push((accumulated / totalSteps) * 100);
  }

  return (
    <section
      className="questionnaire-progress"
      data-progress-level={progressLevel}
      aria-labelledby="questionnaire-progress-title"
    >
      <header className="questionnaire-progress__header">
        <div className="questionnaire-progress__heading">
          <p
            id="questionnaire-progress-title"
            className="questionnaire-progress__title"
          >
            {questionnaireTitle}
          </p>

          <p
            id={progressDescriptionId}
            className="questionnaire-progress__step"
          >
            {progressLabel}
          </p>
        </div>

        <p className="questionnaire-progress__percentage">{progress}%</p>
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

        {dividerPositions.map((position, index) => (
          <span
            key={index}
            className="questionnaire-progress__divider"
            style={{
              left: `${position}%`,
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  );
}