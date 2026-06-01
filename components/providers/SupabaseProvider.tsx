"use client";

import { ReactNode } from "react";

interface SupabaseProviderProps {
  children: ReactNode;
}

export default function SupabaseProvider({
  children,
}: SupabaseProviderProps) {
  return <>{children}</>;
}