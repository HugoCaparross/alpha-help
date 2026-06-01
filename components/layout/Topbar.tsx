"use client";

import UserMenu from "./UserMenu";

export default function Topbar() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">ALPHA-HELP</h2>

        <p className="text-sm text-slate-500">
          Formación para la intervención eficaz
        </p>
      </div>

      <UserMenu />
    </header>
  );
}
