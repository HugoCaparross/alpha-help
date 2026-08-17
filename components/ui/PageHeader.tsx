import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

import BackToDashboard from "@/components/ui/BackToDashboard";

interface PageHeaderProps extends ComponentPropsWithoutRef<"header"> {
  title: string;
  description?: string;
  actions?: ReactNode;
  showDashboardLink?: boolean;
}

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
          {showDashboardLink && <BackToDashboard />}

          <div className="page-header__text">
            <h1 className="page-header__title">{title}</h1>

            {description && (
              <p className="page-header__description">{description}</p>
            )}
          </div>
        </div>

        {actions && <div className="page-header__actions">{actions}</div>}
      </header>
    );
  },
);

PageHeader.displayName = "PageHeader";

export default PageHeader;