export type AdminRegion = "España" | "Latinoamérica";

export interface AdminSessionRow {
  id: string;
  title: string;
  description: string;
  zoom_url: string;
  zoom_recording_url: string | null;
  thumbnail_url: string;
  session_order: number;
  live_ended_at: string | null;
  region: AdminRegion;
  release_date_spain: string | null;
  release_date_latam: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AdminSessionInput {
  title: string;
  description: string;
  zoomUrl: string;
  zoomRecordingUrl?: string;
  thumbnailUrl?: string;
  thumbnailFile?: File | null;
  sessionOrder: number;
  region: AdminRegion;
  /**
   * Fecha/hora introducida por el administrador en la zona horaria
   * correspondiente a la región.
   */
  sessionDate?: string;
}

export interface SaveAdminSessionResult {
  readonly ok: boolean;
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

    throw new Error(
      data?.error ?? ERROR_LIST,
    );
  }

  const data = await response.json();

  return (data.sessions ?? []) as AdminSessionRow[];
}

export async function saveAdminSession(
  input: AdminSessionInput,
): Promise<SaveAdminSessionResult> {
  const formData = new FormData();

  formData.append(
    "title",
    input.title,
  );

  formData.append(
    "description",
    input.description,
  );

  formData.append(
    "zoomUrl",
    input.zoomUrl,
  );

  formData.append(
    "zoomRecordingUrl",
    input.zoomRecordingUrl ?? "",
  );

  formData.append(
    "thumbnailUrl",
    input.thumbnailUrl ?? "",
  );

  formData.append(
    "sessionOrder",
    String(input.sessionOrder),
  );

  formData.append(
    "region",
    input.region,
  );

  if (input.sessionDate) {
    formData.append(
      "sessionDate",
      input.sessionDate,
    );
  }

  if (input.thumbnailFile) {
    formData.append(
      "thumbnailFile",
      input.thumbnailFile,
      input.thumbnailFile.name,
    );
  }

  const response = await fetch(
    "/api/admin/sessions",
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.error ?? ERROR_SAVE,
    );
  }

  return {
    ok: true,
  };
}

export async function setAdminSessionLiveEnded(
  id: string,
  ended: boolean,
): Promise<void> {
  const response = await fetch(
    `/api/admin/sessions/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        liveEnded: ended,
      }),
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.error ??
      "No se ha podido actualizar el estado de la sesión.",
    );
  }
}

export async function deleteAdminSession(
  id: string,
): Promise<void> {
  const response = await fetch(
    `/api/admin/sessions/${id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.error ?? ERROR_DELETE,
    );
  }
}