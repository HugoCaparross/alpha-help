export type AdminRegion =
  | "España"
  | "Latinoamérica";

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
  sessionDate?: string;
}

export interface SaveAdminSessionResult {
  readonly ok: boolean;
}

const ERROR_LIST =
  "No se han podido cargar las sesiones.";

const ERROR_SAVE =
  "No se ha podido guardar la sesión.";

const ERROR_DELETE =
  "No se ha podido eliminar la sesión.";

export async function listAdminSessions(): Promise<
  AdminSessionRow[]
> {
  const response = await fetch(
    "/api/admin/sessions",
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const data =
      await response
        .json()
        .catch(() => null);

    throw new Error(
      data?.error ??
      ERROR_LIST,
    );
  }

  const { sessions } =
    await response.json();

  return sessions as AdminSessionRow[];
}

export async function saveAdminSession(
  input: AdminSessionInput,
): Promise<SaveAdminSessionResult> {
  const formData =
    new FormData();

  formData.set(
    "title",
    input.title,
  );

  formData.set(
    "description",
    input.description,
  );

  formData.set(
    "zoomUrl",
    input.zoomUrl,
  );

  formData.set(
    "zoomRecordingUrl",
    input.zoomRecordingUrl ??
    "",
  );

  formData.set(
    "thumbnailUrl",
    input.thumbnailUrl ??
    "",
  );

  formData.set(
    "sessionOrder",
    String(input.sessionOrder),
  );

  formData.set(
    "region",
    input.region,
  );

  formData.set(
    "sessionDate",
    input.sessionDate ??
    "",
  );

  if (
    input.thumbnailFile &&
    input.thumbnailFile.size > 0
  ) {
    formData.set(
      "thumbnailFile",
      input.thumbnailFile,
    );
  }

  const response =
    await fetch(
      "/api/admin/sessions",
      {
        method: "POST",
        body: formData,
      },
    );

  if (!response.ok) {
    const data =
      await response
        .json()
        .catch(() => null);

    throw new Error(
      data?.error ??
      ERROR_SAVE,
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
  const response =
    await fetch(
      `/api/admin/sessions/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          liveEnded: ended,
        }),
      },
    );

  if (!response.ok) {
    const data =
      await response
        .json()
        .catch(() => null);

    throw new Error(
      data?.error ??
      "No se ha podido actualizar el estado de la sesión.",
    );
  }
}

export async function deleteAdminSession(
  id: string,
): Promise<void> {
  const response =
    await fetch(
      `/api/admin/sessions/${id}`,
      {
        method: "DELETE",
      },
    );

  if (!response.ok) {
    const data =
      await response
        .json()
        .catch(() => null);

    throw new Error(
      data?.error ??
      ERROR_DELETE,
    );
  }
}