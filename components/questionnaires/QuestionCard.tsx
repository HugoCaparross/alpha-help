import Card from "@/components/ui/Card";

import { SCALES, type Question } from "@/lib/constants/questionnaires";

interface QuestionCardProps {
  question: Question;

  questionNumber: number;

  selectedValue?: number;

  showError?: boolean;

  disabled?: boolean;

  showPrevious?: boolean;

  onPrevious?: () => void;

  onChange: (questionId: string, value: number) => void;
}

const REQUIRED_MESSAGE = "Selecciona una respuesta para continuar.";

/**
 * Tarjeta que representa
 * una única pregunta del cuestionario.
 */
export default function QuestionCard({
  question,
  questionNumber,
  selectedValue,
  showError = false,
  disabled = false,
  showPrevious = false,
  onPrevious,
  onChange,
}: QuestionCardProps) {
  const options = SCALES[question.scaleType];

  const titleId = `question-${question.id}`;

  const errorId = `question-error-${question.id}`;

  const hasSelection = selectedValue !== undefined;

  return (
    <Card
      className={`question-card card-padding ${
        showError ? "question-card--error" : ""
      }`}
    >
      <header className="question-card__header">
        <p className="question-card__number">Pregunta {questionNumber}</p>

        <h2 id={titleId} className="question-card__title">
          {question.question}
        </h2>
      </header>

      {showError && (
        <p id={errorId} className="question-card__error" role="alert">
          {REQUIRED_MESSAGE}
        </p>
      )}

      <fieldset
        className="question-card__options"
        aria-labelledby={titleId}
        aria-describedby={showError ? errorId : undefined}
        aria-invalid={showError}
        aria-required="true"
        disabled={disabled}
      >
        <legend className="sr-only">{question.question}</legend>

        {options.map((option, index) => {
          const optionValue = index + 1;

          const isSelected = selectedValue === optionValue;

          return (
            <label
              key={`${question.id}-${optionValue}`}
              className={`question-card__option ${
                isSelected ? "question-card__option--selected" : ""
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={optionValue}
                checked={isSelected}
                onChange={() => onChange(question.id, optionValue)}
                className="question-card__input"
              />

              <span className="question-card__label">{option}</span>
            </label>
          );
        })}
      </fieldset>

      <footer className="question-card__footer">
        {showPrevious && (
          <button
            type="button"
            className="question-card__previous"
            onClick={onPrevious}
            disabled={disabled}
            aria-label="Volver a la pregunta anterior"
          >
            ← Anterior
          </button>
        )}

        {hasSelection && (
          <span className="question-card__answered">
            Respuesta seleccionada
          </span>
        )}
      </footer>
    </Card>
  );
}
