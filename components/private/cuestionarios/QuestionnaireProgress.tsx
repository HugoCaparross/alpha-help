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
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <section className="questionnaire-progress">
      <p className="questionnaire-progress__title">{questionnaireTitle}</p>

      <div className="questionnaire-progress__content">
        <p className="questionnaire-progress__step">
          {currentStep} / {totalSteps}
        </p>

        <div
          className="questionnaire-progress__bar"
          role="progressbar"
          aria-label="Progreso del cuestionario"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
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
