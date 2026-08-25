export type AdminRegion = "España" | "Latinoamérica";

export type AdminYoutubeStatus =
  | "live"
  | "upcoming"
  | "completed"
  | "video"
  | "unknown";

export interface AdminSessionRow {
  id: string;

  title: string;

  description: string;

  youtube_url: string;

  thumbnail_url: string;

  session_order: number;

  region: AdminRegion;

  release_date_spain: string;

  release_date_latam: string;

  is_live: boolean;

  youtube_status: AdminYoutubeStatus | null;

  youtube_checked_at: string | null;
}

export interface AdminSessionInput {
  title: string;

  description: string;

  youtubeUrl: string;

  sessionOrder: number;

  region: AdminRegion;

  releaseDateSpain?: string;

  releaseDateLatam?: string;
}

export interface SaveAdminSessionResult {
  readonly isLive: boolean;

  readonly youtubeStatus: AdminYoutubeStatus;

  readonly youtubeStatusSource: "youtube-api" | "pending-sync";

  readonly youtubeCheckedAt: string | null;
}

const ERROR_LIST = "No se han podido cargar las sesiones.";

const ERROR_SAVE = "No se ha podido guardar la sesión.";

const ERROR_DELETE = "No se ha podido eliminar la sesión.";

export async function listAdminSessions(): Promise<AdminSessionRow[]> {
  const response = await fetch("/api/admin/sessions", {
    cache: "no-store",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(data?.error ?? ERROR_LIST);
  }

  const { sessions } = await response.json();

  return sessions as AdminSessionRow[];
}

export async function saveAdminSession(
  input: AdminSessionInput,
): Promise<SaveAdminSessionResult> {
  const response = await fetch("/api/admin/sessions", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(data?.error ?? ERROR_SAVE);
  }

  const data = (await response.json().catch(() => null)) as {
    isLive?: boolean;

    youtubeStatus?: AdminYoutubeStatus;

    youtubeStatusSource?: "youtube-api" | "pending-sync";

    youtubeCheckedAt?: string | null;
  } | null;

  return {
    isLive: Boolean(data?.isLive),

    youtubeStatus:
      data?.youtubeStatus === "live" ||
      data?.youtubeStatus === "upcoming" ||
      data?.youtubeStatus === "completed" ||
      data?.youtubeStatus === "video" ||
      data?.youtubeStatus === "unknown"
        ? data.youtubeStatus
        : "unknown",

    youtubeStatusSource:
      data?.youtubeStatusSource === "youtube-api"
        ? "youtube-api"
        : "pending-sync",

    youtubeCheckedAt: data?.youtubeCheckedAt ?? null,
  };
}

export async function deleteAdminSession(id: string): Promise<void> {
  const response = await fetch(`/api/admin/sessions/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(data?.error ?? ERROR_DELETE);
  }
}
