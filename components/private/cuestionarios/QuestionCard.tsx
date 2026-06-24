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

  return (
    <Card
      className={`question-card ${showError ? "question-card--error" : ""}`}
    >
      <h2 className="question-card__title">{question.question}</h2>

      {showError && (
        <p className="question-card__error" role="alert" aria-live="polite">
          Selecciona una respuesta para continuar.
        </p>
      )}

      <div
        className="question-card__options"
        role="radiogroup"
        aria-labelledby={`question-${question.id}`}
      >
        {options.map((option, index) => {
          const value = index + 1;

          const isSelected = selectedValue === value;

          return (
            <label
              key={`${question.id}-${value}`}
              className={`question-card__option ${
                isSelected ? "question-card__option--selected" : ""
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={value}
                checked={isSelected}
                disabled={disabled}
                onChange={() => onChange(question.id, value)}
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
