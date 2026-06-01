"use client";

import UserMenu from "./UserMenu";

export default function Topbar() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-end px-8">

      <UserMenu />

    </header>
  );
}