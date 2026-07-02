import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface CardProps extends ComponentPropsWithoutRef<"section"> {
  children: ReactNode;
}

export default function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  const cardClassName = ["card", className].filter(Boolean).join(" ");

  return (
    <section className={cardClassName} {...props}>
      {children}
    </section>
  );
}
