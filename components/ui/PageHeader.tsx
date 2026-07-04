import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

interface PageHeaderProps extends ComponentPropsWithoutRef<"header"> {
  title: string;

  description?: string;

  actions?: ReactNode;
}

/**
 * Cabecera reutilizable de página.
 *
 * Permite mostrar un título, una descripción
 * opcional y un bloque de acciones.
 */
const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(
  ({ title, description, actions, className = "", ...props }, ref) => {
    const classes = ["page-header", className].filter(Boolean).join(" ");

    return (
      <header ref={ref} className={classes} {...props}>
        <div className="page-header__content">
          <h1 className="page-header__title">{title}</h1>

          {description && (
            <p className="page-header__description">{description}</p>
          )}
        </div>

        {actions && <div className="page-header__actions">{actions}</div>}
      </header>
    );
  },
);

PageHeader.displayName = "PageHeader";

export default PageHeader;
