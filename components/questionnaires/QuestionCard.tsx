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

  return (
    <Card
      className={`question-card ${showError ? "question-card--error" : ""}`}
    >
      <p className="question-card__number">Pregunta {questionNumber}</p>

      <h2 id={titleId} className="question-card__title">
        {question.question}
      </h2>

      {showError && (
        <p
          id={errorId}
          className="question-card__error"
          role="alert"
          aria-live="polite"
        >
          Selecciona una respuesta para continuar.
        </p>
      )}

      <div
        className="question-card__options"
        role="radiogroup"
        aria-labelledby={titleId}
        aria-describedby={showError ? errorId : undefined}
        aria-invalid={showError}
      >
        {options.map((option, index) => {
          const optionValue = index + 1;

          const isSelected = selectedValue === optionValue;

          const optionClass = `question-card__option ${
            isSelected ? "question-card__option--selected" : ""
          }`;

          return (
            <label
              key={`${question.id}-${optionValue}`}
              className={optionClass}
            >
              <input
                type="radio"
                name={question.id}
                value={optionValue}
                checked={isSelected}
                disabled={disabled}
                onChange={() => onChange(question.id, optionValue)}
                className="question-card__input"
              />

              <span className="question-card__label">{option}</span>
            </label>
          );
        })}
      </div>

      {showPrevious && (
        <button
          type="button"
          className="question-card__previous"
          onClick={onPrevious}
          disabled={disabled}
        >
          ← Anterior
        </button>
      )}
    </Card>
  );
}
