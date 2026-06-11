"use client";

import UserMenu from "./UserMenu";

export default function RightPanel() {
  return (
    <aside className="hidden xl:flex w-80 border-l border-slate-200 bg-white">
      <div className="flex flex-col w-full p-6">
        <div className="mb-8">
          <UserMenu />
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900">
            Progreso del estudio
          </h3>

          <p className="text-sm text-slate-500 mt-2">
            Próximamente disponible.
          </p>
        </div>
      </div>
    </aside>
  );
}