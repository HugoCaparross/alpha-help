"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Video,
  CircleHelp,
  Mail,
  User,
} from "lucide-react";

const navigation = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/estudio",
    label: "El estudio",
    icon: FileText,
  },
  {
    href: "/cuestionarios",
    label: "Cuestionarios",
    icon: ClipboardList,
  },
  {
    href: "/recursos",
    label: "Recursos",
    icon: FileText,
  },
  {
    href: "/sesiones",
    label: "Sesiones",
    icon: Video,
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
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-slate-200">
      <div className="px-8 py-8 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">
          ALPHA-HELP
        </h1>

        <p className="text-sm text-slate-500 mt-2">
          Bienestar emocional y acompañamiento familiar
        </p>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  active
                    ? "bg-sky-500 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon size={18} />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200">
        <Link
          href="/perfil"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-100"
        >
          <User size={18} />

          <span>Perfil</span>
        </Link>
      </div>
    </aside>
  );
}