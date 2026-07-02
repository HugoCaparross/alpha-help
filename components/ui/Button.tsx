import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;

  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "btn-primary",

  secondary: "btn-secondary",

  outline: "btn-outline",
};

/**
 * Botón reutilizable del sistema de diseño.
 */
export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  ...props
}: ButtonProps) {
  const classes = [VARIANT_CLASSES[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  );
}
