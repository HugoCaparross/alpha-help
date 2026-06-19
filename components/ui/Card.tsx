import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = "",
}: CardProps) {
  const classes = ["card", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes}>
      {children}
    </section>
  );
}