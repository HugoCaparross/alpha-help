interface QuestionnaireProgressProps {
  questionnaireTitle: string;
  currentStep: number;
  totalSteps: number;
}

export default function QuestionnaireProgress({
  questionnaireTitle,
  currentStep,
  totalSteps,
}: QuestionnaireProgressProps) {
  const progress = Math.min(
    100,
    totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0,
  );

  const progressDescriptionId = "questionnaire-progress-step";

  return (
    <section className="questionnaire-progress">
      <p className="questionnaire-progress__title">{questionnaireTitle}</p>

      <div className="questionnaire-progress__content">
        <p id={progressDescriptionId} className="questionnaire-progress__step">
          {currentStep} / {totalSteps}
        </p>

        <div
          className="questionnaire-progress__bar"
          role="progressbar"
          aria-label="Progreso del cuestionario"
          aria-describedby={progressDescriptionId}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-valuetext={`${progress}% completado`}
        >
          <div
            className="questionnaire-progress__fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <p className="questionnaire-progress__percentage">{progress}%</p>
      </div>
    </section>
  );
}
