import {
  forwardRef,
  type ComponentPropsWithoutRef,
} from "react";

interface PerfilFieldProps
  extends ComponentPropsWithoutRef<"div"> {
  label: string;

  value:
  | string
  | number
  | null
  | undefined;
}

function getDisplayValue(
  value:
    | string
    | number
    | null
    | undefined,
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "No disponible";
  }

  return String(value);
}

/**
 * Campo informativo reutilizable
 * del perfil.
 */
const PerfilField = forwardRef<
  HTMLDivElement,
  PerfilFieldProps
>(
  (
    {
      label,
      value,
      className = "",
      ...props
    },
    ref,
  ) => {
    const isEmpty =
      value === null ||
      value === undefined ||
      value === "";

    const classes = [
      "perfil-field",
      isEmpty && "perfil-field--empty",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        data-empty={isEmpty ? "true" : "false"}
        {...props}
      >
        <span className="perfil-label">
          {label}
        </span>

        <span className="perfil-value">
          {getDisplayValue(value)}
        </span>
      </div>
    );
  },
);

PerfilField.displayName =
  "PerfilField";

export default PerfilField;