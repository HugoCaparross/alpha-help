export interface AdminSessionRow {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  thumbnail_url: string;
  session_order: number;
  release_date_spain: string;
  release_date_latam: string;
}

export interface AdminSessionInput {
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  sessionOrder: number;
  releaseDateSpain?: string;
  releaseDateLatam?: string;
}

const ERROR_LIST = "No se han podido cargar las sesiones.";
const ERROR_SAVE = "No se ha podido guardar la sesión.";
const ERROR_DELETE = "No se ha podido eliminar la sesión.";

export async function listAdminSessions(): Promise<AdminSessionRow[]> {
  const response = await fetch("/api/admin/sessions", { cache: "no-store" });

  if (!response.ok) {
    throw new Error(ERROR_LIST);
  }

  const { sessions } = await response.json();

  return sessions as AdminSessionRow[];
}

export async function saveAdminSession(input: AdminSessionInput): Promise<void> {
  const response = await fetch("/api/admin/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(data?.error ?? ERROR_SAVE);
  }
}

export async function deleteAdminSession(id: string): Promise<void> {
  const response = await fetch(`/api/admin/sessions/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(ERROR_DELETE);
  }
}