export type AdminRegion = "España" | "Latinoamérica";

export interface AdminSessionRow {
  id: string;
  title: string;
  description: string;
  zoom_url: string;
  zoom_recording_url: string | null;
  thumbnail_url: string;
  session_order: number;
  region: AdminRegion;
  release_date_spain: string | null;
  release_date_latam: string | null;
}

export interface AdminSessionInput {
  title: string;
  description: string;
  zoomUrl: string;
  zoomRecordingUrl?: string;
  thumbnailUrl?: string;
  sessionOrder: number;
  region: AdminRegion;
  sessionDate?: string;
}

export interface SaveAdminSessionResult {
  readonly ok: boolean;
}

const ERROR_LIST = "No se han podido cargar las sesiones.";
const ERROR_SAVE = "No se ha podido guardar la sesión.";
const ERROR_DELETE = "No se ha podido eliminar la sesión.";

export async function listAdminSessions(): Promise<AdminSessionRow[]> {
  const response = await fetch("/api/admin/sessions", { cache: "no-store" });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? ERROR_LIST);
  }
  const { sessions } = await response.json();
  return sessions as AdminSessionRow[];
}

export async function saveAdminSession(input: AdminSessionInput): Promise<SaveAdminSessionResult> {
  const response = await fetch("/api/admin/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? ERROR_SAVE);
  }
  return { ok: true };
}

export async function deleteAdminSession(id: string): Promise<void> {
  const response = await fetch(`/api/admin/sessions/${id}`, { method: "DELETE" });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? ERROR_DELETE);
  }
}
