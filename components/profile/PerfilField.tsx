import { forwardRef, type ComponentPropsWithoutRef } from "react";

interface PerfilFieldProps extends ComponentPropsWithoutRef<"div"> {
  label: string;

  value: string | number | null | undefined;
}

/**
 * Campo informativo reutilizable del perfil.
 */
const PerfilField = forwardRef<HTMLDivElement, PerfilFieldProps>(
  ({ label, value, className = "", ...props }, ref) => {
    const displayValue =
      value === null || value === undefined || value === ""
        ? "No disponible"
        : value;

    const classes = ["perfil-field", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...props}>
        <span className="perfil-label">{label}</span>

        <span className="perfil-value">{displayValue}</span>
      </div>
    );
  },
);

PerfilField.displayName = "PerfilField";

export default PerfilField;
