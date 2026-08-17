"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { childSchema } from "@/validators";
import { GENDERS } from "@/lib/constants";

import type {
  ChildData,
  RegisterData,
} from "./register.types";

interface Props {
  formData: RegisterData;

  setFormData: React.Dispatch<
    React.SetStateAction<RegisterData>
  >;

  nextStep: () => void;

  previousStep: () => void;
}

const CHILD_ORDINALS = [
  "Primer",
  "Segundo",
  "Tercer",
  "Cuarto",
  "Quinto",
] as const;

const EMPTY_CHILD: ChildData = {
  age: "",
  gender: "",
  psychologicalSupport: false,
};

export default function RegisterStepChild({
  formData,
  setFormData,
  nextStep,
  previousStep,
}: Props) {
  const [error, setError] =
    useState("");

  const numberOfChildren =
    Number(formData.numberOfChildren) || 0;

  useEffect(() => {
    setFormData((previous) => {
      const children = [
        ...previous.children,
      ];

      if (numberOfChildren < 1) {
        return {
          ...previous,
          children: [],
        };
      }

      while (
        children.length <
        numberOfChildren
      ) {
        children.push({
          ...EMPTY_CHILD,
        });
      }

      if (
        children.length >
        numberOfChildren
      ) {
        children.length =
          numberOfChildren;
      }

      return {
        ...previous,
        children,
      };
    });
  }, [
    numberOfChildren,
    setFormData,
  ]);

  function updateChild(
    index: number,
    field: keyof ChildData,
    value: ChildData[keyof ChildData],
  ) {
    setError("");

    setFormData((previous) => {
      const children = [
        ...previous.children,
      ];

      const currentChild =
        children[index];

      if (!currentChild) {
        return previous;
      }

      children[index] = {
        ...currentChild,
        [field]: value,
      };

      return {
        ...previous,
        children,
      };
    });
  }

  function validateStep(): boolean {
    const result =
      childSchema.safeParse({
        children:
          formData.children,
      });

    if (!result.success) {
      setError(
        result.error.issues[0]?.message ??
        "Revisa los datos de los hijos.",
      );

      return false;
    }

    if (
      formData.children.length !==
      numberOfChildren
    ) {
      setError(
        "El número de hijos no coincide con los datos introducidos.",
      );

      return false;
    }

    return true;
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!validateStep()) {
      return;
    }

    nextStep();
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className="step-title">
        Información de los hijos
      </h2>

      <p className="step-description">
        Indica la edad, sexo y si han recibido
        atención psicológica.
      </p>

      {formData.children.map(
        (child, index) => (
          <div
            key={`child-${index}`}
            className="child-card"
          >
            <h3 className="child-title">
              {
                CHILD_ORDINALS[index]
              }{" "}
              hijo/a
            </h3>

            <div className="child-grid">
              <div className="auth-field">
                <label
                  htmlFor={`child-age-${index}`}
                  className="auth-label"
                >
                  Edad
                </label>

                <input
                  id={`child-age-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="auth-input"
                  placeholder="Edad"
                  aria-invalid={Boolean(
                    error,
                  )}
                  value={child.age}
                  onChange={(event) => {
                    const value =
                      event.target.value.replace(
                        /\D/g,
                        "",
                      );

                    if (
                      value.length > 2
                    ) {
                      return;
                    }

                    updateChild(
                      index,
                      "age",
                      value,
                    );
                  }}
                />
              </div>

              <div className="auth-field">
                <label
                  htmlFor={`child-gender-${index}`}
                  className="auth-label"
                >
                  Sexo
                </label>

                <select
                  id={`child-gender-${index}`}
                  className="auth-input"
                  aria-invalid={Boolean(
                    error,
                  )}
                  value={child.gender}
                  onChange={(event) =>
                    updateChild(
                      index,
                      "gender",
                      event.target.value,
                    )
                  }
                >
                  <option value="">
                    Selecciona una opción
                  </option>

                  {GENDERS.map(
                    (gender) => (
                      <option
                        key={gender}
                        value={gender}
                      >
                        {gender}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="auth-field child-full-width">
                <label
                  htmlFor={`child-support-${index}`}
                  className="auth-label"
                >
                  ¿Alguna vez ha recibido
                  atención psicológica?
                </label>

                <select
                  id={`child-support-${index}`}
                  className="auth-input"
                  aria-invalid={Boolean(
                    error,
                  )}
                  value={
                    child.psychologicalSupport
                      ? "Sí"
                      : "No"
                  }
                  onChange={(event) =>
                    updateChild(
                      index,
                      "psychologicalSupport",
                      event.target.value ===
                      "Sí",
                    )
                  }
                >
                  <option value="No">
                    No
                  </option>

                  <option value="Sí">
                    Sí
                  </option>
                </select>
              </div>
            </div>
          </div>
        ),
      )}

      {error && (
        <p
          className="auth-error"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}

      <div className="step-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={previousStep}
        >
          <ArrowLeft size={18} />
          Atrás
        </button>

        <button
          type="submit"
          className="btn-primary"
        >
          Continuar
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}