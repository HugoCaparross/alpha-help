"use client";

import type { ReactNode } from "react";

interface SupabaseProviderProps {
  children: ReactNode;
}

/**
 * Provider raíz de Supabase.
 *
 * Actualmente actúa como un componente
 * contenedor y permite incorporar
 * proveedores adicionales en el futuro
 * sin modificar el layout principal.
 */
export default function SupabaseProvider({ children }: SupabaseProviderProps) {
  return children;
}
