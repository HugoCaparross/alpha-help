import Link from "next/link";

import {
  BookOpen,
  ClipboardList,
  User,
  Video,
  type LucideIcon,
} from "lucide-react";

interface QuickAction {
  href: string;

  title: string;

  description: string;

  icon: LucideIcon;
}

const QUICK_ACTIONS: readonly QuickAction[] = [
  {
    href: "/cuestionarios",

    title: "Cuestionarios",

    description: "Completa las evaluaciones del estudio.",

    icon: ClipboardList,
  },
  {
    href: "/sesiones",

    title: "Sesiones",

    description: "Accede a las sesiones disponibles.",

    icon: Video,
  },
  {
    href: "/recursos",

    title: "Materiales",

    description: "Consulta los materiales del programa.",

    icon: BookOpen,
  },
  {
    href: "/perfil",

    title: "Mi perfil",

    description: "Consulta la información asociada a tu participación.",

    icon: User,
  },
];

/**
 * Accesos rápidos
 * a las principales
 * funcionalidades.
 */
export default function DashboardQuickActions() {
  return (
    <section
      className="dashboard-section"
      aria-labelledby="dashboard-actions-title"
    >
      <h2 id="dashboard-actions-title" className="dashboard-section-title">
        Accesos rápidos
      </h2>

      <div className="dashboard-actions-grid">
        {QUICK_ACTIONS.map(({ href, title, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            prefetch
            aria-label={`Ir a ${title}`}
            className="dashboard-action-card"
          >
            <div className="dashboard-action-icon" aria-hidden="true">
              <Icon size={22} />
            </div>

            <h3 className="dashboard-action-title">{title}</h3>

            <p className="dashboard-action-description">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
