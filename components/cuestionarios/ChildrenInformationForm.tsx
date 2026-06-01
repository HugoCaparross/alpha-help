interface Props {
  childrenCount: number;
  answers: Record<string, any>;
  updateAnswer: (
    key: string,
    value: any
  ) => void;
}

export default function ChildrenInformationForm({
  childrenCount,
  answers,
  updateAnswer,
}: Props) {
  const labels = [
    "Primero/a",
    "Segundo/a",
    "Tercero/a",
    "Cuarto/a",
    "Quinto/a",
  ];

  return (
    <div className="space-y-8 mt-8">

      <h3 className="text-xl font-semibold">
        10. Información de los hijos/as
      </h3>

      {Array.from({
        length: childrenCount,
      }).map((_, index) => {

        const prefix =
          `child_${index + 1}`;

        return (
          <div
            key={prefix}
            className="border rounded-2xl p-6 space-y-4"
          >

            <h4 className="font-medium">
              {labels[index]}
            </h4>

            <div>

              <label className="block mb-2">
                Edad
              </label>

              <select
                value={
                  answers[
                    `${prefix}_age`
                  ] || ""
                }
                onChange={(e) =>
                  updateAnswer(
                    `${prefix}_age`,
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full border rounded-xl p-3"
              >
                <option value="">
                  Seleccione edad
                </option>

                {Array.from(
                  { length: 18 },
                  (_, i) => i
                ).map((age) => (
                  <option
                    key={age}
                    value={age}
                  >
                    {age}
                  </option>
                ))}
              </select>

            </div>

            <div>

              <label className="block mb-2">
                Sexo
              </label>

              <select
                value={
                  answers[
                    `${prefix}_gender`
                  ] || ""
                }
                onChange={(e) =>
                  updateAnswer(
                    `${prefix}_gender`,
                    e.target.value
                  )
                }
                className="w-full border rounded-xl p-3"
              >
                <option value="">
                  Seleccione sexo
                </option>

                <option value="Hombre">
                  Hombre
                </option>

                <option value="Mujer">
                  Mujer
                </option>

              </select>

            </div>

            <div>

              <label className="block mb-2">
                ¿Ha recibido atención psicológica?
              </label>

              <select
                value={
                  answers[
                    `${prefix}_psychological_help`
                  ] || ""
                }
                onChange={(e) =>
                  updateAnswer(
                    `${prefix}_psychological_help`,
                    e.target.value
                  )
                }
                className="w-full border rounded-xl p-3"
              >
                <option value="">
                  Seleccione
                </option>

                <option value="Sí">
                  Sí
                </option>

                <option value="No">
                  No
                </option>

              </select>

            </div>

          </div>
        );
      })}

    </div>
  );
}