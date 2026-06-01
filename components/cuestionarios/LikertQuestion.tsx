interface Props {
  question: string;
  options: string[];
  value?: number;
  onChange: (value: number) => void;
}

export default function LikertQuestion({
  question,
  options,
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-medium text-slate-900">{question}</h3>

      <div className="space-y-3">
        {options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
              value === index + 1
                ? "border-sky-500 bg-sky-50"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <input
              type="radio"
              name={question}
              checked={value === index + 1}
              onChange={() => onChange(index + 1)}
              className="w-4 h-4"
            />

            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
