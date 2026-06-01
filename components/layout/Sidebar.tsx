"use client";

import Image from "next/image";
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
    <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200">

      <div className="p-6 border-b">

        <Image
          src="/logo.png"
          alt="ALPHA HELP"
          width={70}
          height={70}
        />

        <h1 className="mt-4 text-xl font-bold">
          ALPHA-HELP
        </h1>

        <p className="text-sm text-slate-500">
          Formación para la intervención eficaz
        </p>

      </div>

      <nav className="flex-1 p-4">

        <div className="space-y-2">

          {items.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  active
                    ? "bg-sky-500 text-white"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <Icon size={18} />

                {item.label}
              </Link>
            );
          })}

        </div>

      </nav>

    </aside>
  );
}