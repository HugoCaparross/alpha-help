"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ClipboardList,
  Video,
  FileText,
  CircleHelp,
  Mail,
  User,
} from "lucide-react";

const items = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/cuestionarios",
    label: "Cuestionarios",
    icon: ClipboardList,
  },
  {
    href: "/sesiones",
    label: "Sesiones",
    icon: Video,
  },
  {
    href: "/recursos",
    label: "Recursos",
    icon: FileText,
  },
  {
    href: "/faq",
    label: "FAQ",
    icon: CircleHelp,
  },
  {
    href: "/contacto",
    label: "Contacto",
    icon: Mail,
  },
  {
    href: "/perfil",
    label: "Perfil",
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-white h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">
          ALPHA-HELP
        </h1>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg p-3 transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />

              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}