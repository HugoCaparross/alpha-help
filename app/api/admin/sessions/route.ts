import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import {
  createServerClient as createAdminClient,
} from "@/lib/supabase/admin";

const TABLE = "study_sessions";

const IMAGE_BUCKET =
  "study-session-images";

const REGIONS = [
  "España",
  "Latinoamérica",
] as const;

const MIN_SESSION_ORDER = 0;
const MAX_SESSION_ORDER = 9;

const MAX_IMAGE_SIZE =
  25 * 1024 * 1024;

const SELECT_FIELDS = `
  id,
  title,
  description,
  zoom_url,
  zoom_recording_url,
  thumbnail_url,
  session_order,
  region,
  release_date_spain,
  release_date_latam,
  live_ended_at,
  created_at,
  updated_at
`;

function sanitizeFileName(
  name: string,
): string {
  const extension = name.includes(".")
    ? `.${name.split(".").pop()?.toLowerCase() ?? "img"}`
    : "";

  const baseName =
    name.replace(
      /\.[^.]+$/,
      "",
    );

  const safeBase =
    baseName
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        "",
      )
      .replace(
        /[^a-zA-Z0-9_-]/g,
        "-",
      )
      .replace(
        /-+/g,
        "-",
      )
      .replace(
        /^-|-$/g,
        "",
      ) || "imagen";

  return `${safeBase}${extension}`;
}

async function ensureImageBucket(
  admin: ReturnType<
    typeof createAdminClient
  >,
) {
  const {
    data,
    error,
  } =
    await admin.storage.getBucket(
      IMAGE_BUCKET,
    );

  if (error && !data) {
    const {
      error: createError,
    } =
      await admin.storage.createBucket(
        IMAGE_BUCKET,
        {
          public: true,
          fileSizeLimit: "25MB",
        },
      );

    if (createError) {
      throw new Error(
        `No se ha podido preparar el almacenamiento de imágenes: ${createError.message}`,
      );
    }

    return;
  }

  if (data && !data.public) {
    const {
      error: updateError,
    } =
      await admin.storage.updateBucket(
        IMAGE_BUCKET,
        {
          public: true,
          fileSizeLimit: "25MB",
        },
      );

    if (updateError) {
      throw new Error(
        `No se ha podido configurar el almacenamiento de imágenes: ${updateError.message}`,
      );
    }
  }
}

function isManagedImageUrl(
  value: string,
): boolean {
  return value.includes(
    `/storage/v1/object/public/${IMAGE_BUCKET}/`,
  );
}

function getStoragePathFromPublicUrl(
  value: string,
): string | null {
  const marker =
    `/storage/v1/object/public/${IMAGE_BUCKET}/`;

  const index =
    value.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return (
    value
      .slice(
        index +
        marker.length,
      )
      .split("?")[0] ||
    null
  );
}

function parseLocalDateTime(
  value: string,
  timeZone: string,
): string | null {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(
      value,
    );

  if (!match) {
    return null;
  }

  const [
    ,
    year,
    month,
    day,
    hour,
    minute,
  ] = match;

  const candidate =
    Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      0,
      0,
    );

  const parts =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      },
    ).formatToParts(
      new Date(candidate),
    );

  const values =
    Object.fromEntries(
      parts
        .filter(
          (part) =>
            part.type !==
            "literal",
        )
        .map((part) => [
          part.type,
          part.value,
        ]),
    ) as Record<
      string,
      string
    >;

  const localAsUtc =
    Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day),
      Number(values.hour),
      Number(values.minute),
      0,
      0,
    );

  const offset =
    localAsUtc -
    candidate;

  return new Date(
    candidate - offset,
  ).toISOString();
}

function normalizeSessionDate(
  value: string,
  region: (typeof REGIONS)[number],
): string | null {
  return parseLocalDateTime(
    value,
    region ===
      "Latinoamérica"
      ? "America/Bogota"
      : "Europe/Madrid",
  );
}

export async function GET() {
  const auth =
    await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json(
      {
        error:
          auth.message,
      },
      {
        status:
          auth.status,
      },
    );
  }

  const admin =
    createAdminClient();

  const {
    data,
    error,
  } =
    await admin
      .from(TABLE)
      .select(
        SELECT_FIELDS,
      )
      .order(
        "region",
        {
          ascending: true,
        },
      )
      .order(
        "session_order",
        {
          ascending: true,
        },
      );

  if (error) {
    console.error(
      "[admin/sessions][GET]",
      error,
    );

    return NextResponse.json(
      {
        error:
          "No se han podido recuperar las sesiones.",
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({
    sessions: data ?? [],
  });
}

export async function POST(
  request: Request,
) {
  const auth =
    await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json(
      {
        error:
          auth.message,
      },
      {
        status:
          auth.status,
      },
    );
  }

  let form: FormData;

  try {
    form =
      await request.formData();
  } catch {
    return NextResponse.json(
      {
        error:
          "La petición contiene datos inválidos.",
      },
      {
        status: 400,
      },
    );
  }

  const title =
    form
      .get("title")
      ?.toString()
      .trim() ?? "";

  const description =
    form
      .get("description")
      ?.toString()
      .trim() ?? "";

  const zoomUrl =
    form
      .get("zoomUrl")
      ?.toString()
      .trim() ?? "";

  const zoomRecordingUrl =
    form
      .get("zoomRecordingUrl")
      ?.toString()
      .trim() ?? "";

  const thumbnailUrlInput =
    form
      .get("thumbnailUrl")
      ?.toString()
      .trim() ?? "";

  const region =
    form
      .get("region")
      ?.toString();

  const sessionOrder =
    Number(
      form.get(
        "sessionOrder",
      ),
    );

  const sessionDate =
    form
      .get("sessionDate")
      ?.toString()
      .trim() ?? "";

  const imageFile =
    form.get(
      "thumbnailFile",
    );

  if (!title) {
    return NextResponse.json(
      {
        error:
          "El título de la sesión es obligatorio.",
      },
      {
        status: 400,
      },
    );
  }

  if (!description) {
    return NextResponse.json(
      {
        error:
          "La descripción de la sesión es obligatoria.",
      },
      {
        status: 400,
      },
    );
  }

  if (!zoomUrl) {
    return NextResponse.json(
      {
        error:
          "La URL de Zoom es obligatoria.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    new URL(
      zoomUrl,
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "La URL de Zoom no es válida.",
      },
      {
        status: 400,
      },
    );
  }

  if (zoomRecordingUrl) {
    try {
      new URL(
        zoomRecordingUrl,
      );
    } catch {
      return NextResponse.json(
        {
          error:
            "La URL de la grabación de Zoom no es válida.",
        },
        {
          status: 400,
        },
      );
    }
  }

  if (!sessionDate) {
    return NextResponse.json(
      {
        error:
          "La fecha de la sesión es obligatoria.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    !REGIONS.includes(
      region as (typeof REGIONS)[number],
    )
  ) {
    return NextResponse.json(
      {
        error:
          "La región de la sesión no es válida.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    !Number.isInteger(
      sessionOrder,
    ) ||
    sessionOrder <
    MIN_SESSION_ORDER ||
    sessionOrder >
    MAX_SESSION_ORDER
  ) {
    return NextResponse.json(
      {
        error:
          "El orden de la sesión no es válido.",
      },
      {
        status: 400,
      },
    );
  }

  const normalizedSessionDate =
    normalizeSessionDate(
      sessionDate,
      region as (typeof REGIONS)[number],
    );

  if (!normalizedSessionDate) {
    return NextResponse.json(
      {
        error:
          "La fecha de la sesión no es válida.",
      },
      {
        status: 400,
      },
    );
  }

  if (thumbnailUrlInput) {
    try {
      const parsed =
        new URL(
          thumbnailUrlInput,
        );

      if (
        ![
          "http:",
          "https:",
        ].includes(
          parsed.protocol,
        )
      ) {
        throw new Error(
          "unsupported protocol",
        );
      }
    } catch {
      return NextResponse.json(
        {
          error:
            "La URL de la imagen no es válida.",
        },
        {
          status: 400,
        },
      );
    }
  }

  if (
    imageFile !==
    null &&
    imageFile !==
    undefined &&
    !(imageFile instanceof File)
  ) {
    return NextResponse.json(
      {
        error:
          "El archivo de imagen no es válido.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    imageFile instanceof File &&
    imageFile.size > 0
  ) {
    if (
      !imageFile.type.startsWith(
        "image/",
      )
    ) {
      return NextResponse.json(
        {
          error:
            "El archivo seleccionado no es una imagen compatible.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      imageFile.size >
      MAX_IMAGE_SIZE
    ) {
      return NextResponse.json(
        {
          error:
            "La imagen no puede superar los 25 MB.",
        },
        {
          status: 400,
        },
      );
    }
  }

  const admin =
    createAdminClient();

  const {
    data: existing,
    error:
    existingError,
  } =
    await admin
      .from(TABLE)
      .select(
        "id, release_date_spain, release_date_latam, thumbnail_url",
      )
      .eq(
        "region",
        region,
      )
      .eq(
        "session_order",
        sessionOrder,
      )
      .maybeSingle();

  if (existingError) {
    console.error(
      "[admin/sessions][CHECK_EXISTING]",
      existingError,
    );

    return NextResponse.json(
      {
        error:
          "No se ha podido comprobar la sesión existente.",
      },
      {
        status: 500,
      },
    );
  }

  let uploadedThumbnailUrl =
    "";

  let uploadedThumbnailPath =
    "";

  if (
    imageFile instanceof File &&
    imageFile.size > 0
  ) {
    try {
      await ensureImageBucket(
        admin,
      );

      const safeName =
        sanitizeFileName(
          imageFile.name ||
          "imagen",
        );

      const path =
        `${region ===
          "España"
          ? "spain"
          : "latam"
        }/${sessionOrder}/${crypto.randomUUID()}-${safeName}`;

      const buffer =
        Buffer.from(
          await imageFile.arrayBuffer(),
        );

      const {
        error:
        uploadError,
      } =
        await admin.storage
          .from(
            IMAGE_BUCKET,
          )
          .upload(
            path,
            buffer,
            {
              contentType:
                imageFile.type,
              upsert: false,
              cacheControl:
                "31536000",
            },
          );

      if (uploadError) {
        throw new Error(
          uploadError.message,
        );
      }

      const {
        data:
        publicUrlData,
      } =
        admin.storage
          .from(
            IMAGE_BUCKET,
          )
          .getPublicUrl(
            path,
          );

      uploadedThumbnailUrl =
        publicUrlData.publicUrl;

      uploadedThumbnailPath =
        path;
    } catch (error) {
      console.error(
        "[admin/sessions][IMAGE_UPLOAD]",
        error,
      );

      return NextResponse.json(
        {
          error:
            error instanceof
              Error
              ? error.message
              : "No se ha podido subir la imagen.",
        },
        {
          status: 500,
        },
      );
    }
  }

  const thumbnailUrl =
    uploadedThumbnailUrl ||
    thumbnailUrlInput;

  const now =
    new Date().toISOString();

  const payload = {
    title,
    description,
    zoom_url: zoomUrl,
    zoom_recording_url:
      zoomRecordingUrl ||
      null,
    thumbnail_url:
      thumbnailUrl,
    session_order:
      sessionOrder,
    region,
    release_date_spain:
      region === "España"
        ? normalizedSessionDate
        : existing?.release_date_spain ??
        null,
    release_date_latam:
      region ===
        "Latinoamérica"
        ? normalizedSessionDate
        : existing?.release_date_latam ??
        null,
    updated_at:
      now,
  };

  const query =
    existing
      ? admin
        .from(TABLE)
        .update(payload)
        .eq(
          "id",
          existing.id,
        )
      : admin
        .from(TABLE)
        .insert(
          payload,
        );

  const {
    error,
  } = await query;

  if (error) {
    if (
      uploadedThumbnailPath
    ) {
      await admin.storage
        .from(
          IMAGE_BUCKET,
        )
        .remove([
          uploadedThumbnailPath,
        ]);
    }

    console.error(
      "[admin/sessions][SAVE]",
      {
        error,
        payload,
      },
    );

    return NextResponse.json(
      {
        error:
          "No se ha podido guardar la sesión.",
      },
      {
        status: 500,
      },
    );
  }

  if (
    existing?.thumbnail_url &&
    isManagedImageUrl(
      existing.thumbnail_url,
    ) &&
    existing.thumbnail_url !==
    thumbnailUrl
  ) {
    const oldPath =
      getStoragePathFromPublicUrl(
        existing.thumbnail_url,
      );

    if (oldPath) {
      await admin.storage
        .from(
          IMAGE_BUCKET,
        )
        .remove([
          oldPath,
        ]);
    }
  }

  return NextResponse.json({
    ok: true,
  });
}