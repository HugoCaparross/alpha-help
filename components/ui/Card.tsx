import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

interface CardProps extends ComponentPropsWithoutRef<"section"> {
  children: ReactNode;
}

/**
 * Contenedor reutilizable del sistema de diseño.
 */
const Card = forwardRef<HTMLElement, CardProps>(
  ({ children, className = "", ...props }, ref) => {
    const classes = ["card", className].filter(Boolean).join(" ");

    return (
      <section ref={ref} className={classes} {...props}>
        {children}
      </section>
    );
  },
);

Card.displayName = "Card";

export default Card;
