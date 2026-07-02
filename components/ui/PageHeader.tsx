import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface PageHeaderProps extends ComponentPropsWithoutRef<"header"> {
  title: string;

  description?: string;

  actions?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  actions,
  className = "",
  ...props
}: PageHeaderProps) {
  const headerClassName = ["page-header", className].filter(Boolean).join(" ");

  return (
    <header className={headerClassName} {...props}>
      <div className="page-header__content">
        <h1 className="page-header__title">{title}</h1>

        {description && (
          <p className="page-header__description">{description}</p>
        )}
      </div>

      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}
