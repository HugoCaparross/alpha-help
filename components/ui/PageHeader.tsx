import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

interface PageHeaderProps extends ComponentPropsWithoutRef<"header"> {
  title: string;
  description?: string;
  actions?: ReactNode;
  showDashboardLink?: boolean;
}

/** Cabecera reutilizable de las páginas del área privada. */
const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(
  (
    {
      title,
      description,
      actions,
      showDashboardLink = true,
      className = "",
      ...props
    },
    ref,
  ) => {
    const classes = ["page-header", className].filter(Boolean).join(" ");

    return (
      <header ref={ref} className={classes} {...props}>
        <div className="page-header__content">
          {showDashboardLink && (
            <Link
              href="/dashboard"
              className="page-header__back"
              aria-label="Volver al Dashboard"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Volver al Dashboard</span>
            </Link>
          )}

          <h1 className="page-header__title">{title}</h1>

          {description && (
            <p className="page-header__description">{description}</p>
          )}
        </div>

        {actions && (
          <div className="page-header__actions">{actions}</div>
        )}
      </header>
    );
  },
);

PageHeader.displayName = "PageHeader";

export default PageHeader;