import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;

  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "btn-primary",

  secondary: "btn-secondary",

  outline: "btn-outline",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  ...props
}: ButtonProps) {
  const buttonClassName = [VARIANT_CLASSES[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
      className={buttonClassName}
      {...props}
    >
      {children}
    </button>
  );
}
