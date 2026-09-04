import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";
import { generateThumbnail } from "@/lib/pdf/generate-thumbnail";
import { getMaterialReleaseDate } from "@/lib/utils/material-release";

const TABLE = "study_materials";

const PDF_BUCKET = "study-materials";

const THUMBNAIL_BUCKET = "study-material-thumbnails";

const DEFAULT_THUMBNAIL = "/images/logo.png";

const SELECT_FIELDS = `
  id,
  title,
  description,
  pdf_url,
  thumbnail_url,
  material_order,
  material_type,
  region,
  release_date_spain,
  release_date_latam,
  created_at,
  updated_at
`;

async function ensureBucket(
  admin: ReturnType<typeof createAdminClient>,
  bucket: string,
) {
  const { data } = await admin.storage.getBucket(bucket);

  if (data) {
    if (data.public) {
      const { error } = await admin.storage.updateBucket(bucket, {
        public: false,
      });

      if (error) {
        throw new Error(
          `No se ha podido proteger el bucket ${bucket} como privado.`,
        );
      }
    }

    return;
  }

  const isThumbnailBucket = bucket === THUMBNAIL_BUCKET;

  await admin.storage.createBucket(bucket, {
    public: false,
    fileSizeLimit: "25MB",
    allowedMimeTypes: isThumbnailBucket
      ? ["image/png", "image/jpeg", "image/webp"]
      : ["application/pdf"],
  });
}

function sanitizeFileName(name: string): string {
  const extension = name.split(".").pop() ?? "pdf";
  const baseName = name.replace(/\.[^.]+$/, "");

  return (
    baseName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") +
    "." +
    extension.toLowerCase()
  );
}

async function isRealPdf(file: File): Promise<boolean> {
  const header = new Uint8Array(
    await file.slice(0, 5).arrayBuffer(),
  );

  const signature = String.fromCharCode(...header);

  return signature === "%PDF-";
}

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.message },
      { status: auth.status },
    );
  }

  const admin = createAdminClient();

  const { data, error } = await admin
    .from(TABLE)
    .select(SELECT_FIELDS)
    .order("material_type", {
      ascending: true,
    })
    .order("material_order", {
      ascending: true,
    });

  if (error) {
    return NextResponse.json(
      {
        error:
          "No se han podido recuperar los materiales.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    materials: data ?? [],
  });
}

export async function POST(
  request: Request,
) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.message },
      { status: auth.status },
    );
  }

  const form =
    await request.formData();

  const title =
    form.get("title")?.toString().trim();

  const description =
    form.get("description")?.toString().trim();

  const materialType =
    form.get("materialType")?.toString();

  const materialOrderRaw =
    form.get("materialOrder")?.toString();

  const region =
    form.get("region")?.toString();

  const thumbnailUrl =
    form.get("thumbnailUrl")?.toString().trim();

  const existingPdfUrl =
    form.get("pdfUrl")?.toString().trim();

  const file =
    form.get("file");

  const materialOrder =
    materialOrderRaw
      ? Number(materialOrderRaw)
      : null;

  if (
    !title ||
    !description ||
    (
      materialType !== "support" &&
      materialType !== "extended"
    ) ||
    (
      region !== "España" &&
      region !== "Latinoamérica"
    ) ||
    materialOrder === null ||
    Number.isNaN(materialOrder) ||
    !Number.isInteger(materialOrder) ||
    materialOrder < 0 ||
    materialOrder > 9
  ) {
    return NextResponse.json(
      {
        error:
          "Faltan campos obligatorios o son inválidos.",
      },
      { status: 400 },
    );
  }

  const admin =
    createAdminClient();

  /*
   * La fecha de liberación NO se introduce
   * manualmente.
   *
   * Se obtiene de la sesión correspondiente
   * y se calcula como el día siguiente.
   */
  const {
    data: sessionData,
    error: sessionError,
  } = await admin
    .from("study_sessions")
    .select(
      "release_date_spain, release_date_latam",
    )
    .eq("region", region)
    .eq(
      "session_order",
      materialOrder,
    )
    .maybeSingle();

  if (sessionError) {
    return NextResponse.json(
      {
        error:
          "No se ha podido recuperar el calendario de sesiones.",
      },
      { status: 500 },
    );
  }

  const sessionReleaseDate =
    region === "España"
      ? sessionData?.release_date_spain
      : sessionData?.release_date_latam;

  if (!sessionReleaseDate) {
    return NextResponse.json(
      {
        error:
          "Configura primero la fecha de la sesión correspondiente. El material se libera automáticamente al día siguiente de la sesión.",
      },
      { status: 400 },
    );
  }

  const calculatedReleaseDate =
    getMaterialReleaseDate(
      sessionReleaseDate,
    );

  if (!calculatedReleaseDate) {
    return NextResponse.json(
      {
        error:
          "La fecha de la sesión no es válida.",
      },
      { status: 400 },
    );
  }

  let pdfUrl =
    existingPdfUrl || "";

  let generatedThumbnailUrl =
    "";

  /*
   * Si se sube un PDF nuevo:
   *
   * - Se valida que sea realmente PDF.
   * - Se almacena en un bucket privado.
   * - Se guarda únicamente su path interno.
   * - Nunca se guarda una URL pública.
   */
  if (
    file instanceof File &&
    file.size > 0
  ) {
    if (
      !(await isRealPdf(file))
    ) {
      return NextResponse.json(
        {
          error:
            "El archivo debe ser un PDF válido.",
        },
        { status: 400 },
      );
    }

    await ensureBucket(
      admin,
      PDF_BUCKET,
    );

    await ensureBucket(
      admin,
      THUMBNAIL_BUCKET,
    );

    const storageRegion =
      region === "España"
        ? "spain"
        : "latam";

    const path =
      `${storageRegion}/${materialType}/${materialOrder}-${Date.now()}-${sanitizeFileName(
        file.name ||
        "material.pdf",
      )}`;

    const arrayBuffer =
      await file.arrayBuffer();

    const pdfBuffer =
      Buffer.from(arrayBuffer);

    const {
      error: uploadError,
    } = await admin.storage
      .from(PDF_BUCKET)
      .upload(
        path,
        pdfBuffer,
        {
          contentType:
            "application/pdf",
          upsert: true,
        },
      );

    if (uploadError) {
      console.error(
        uploadError,
      );

      return NextResponse.json(
        {
          error:
            uploadError.message,
          details:
            uploadError,
        },
        { status: 500 },
      );
    }

    /*
     * Importante:
     * pdf_url contiene el path interno,
     * no una URL pública.
     */
    pdfUrl = path;

    try {
      const thumbnailBuffer =
        await generateThumbnail(
          pdfBuffer,
        );

      const thumbnailPath =
        path.replace(
          /\.pdf$/i,
          ".png",
        );

      const {
        error: thumbnailError,
      } = await admin.storage
        .from(
          THUMBNAIL_BUCKET,
        )
        .upload(
          thumbnailPath,
          thumbnailBuffer,
          {
            contentType:
              "image/png",
            upsert: true,
          },
        );

      if (!thumbnailError) {
        generatedThumbnailUrl =
          thumbnailPath;
      }
    } catch (error) {
      console.error(
        "Error generando miniatura:",
        error,
      );
    }
  }

  /*
   * No se puede crear un material sin PDF.
   */
  if (!pdfUrl) {
    return NextResponse.json(
      {
        error:
          "Debes adjuntar un archivo PDF.",
      },
      { status: 400 },
    );
  }

  const now =
    new Date().toISOString();

  /*
   * Un material es único por:
   * - región
   * - tipo
   * - orden
   */
  const {
    data: existing,
  } = await admin
    .from(TABLE)
    .select("id")
    .eq(
      "material_order",
      materialOrder,
    )
    .eq(
      "material_type",
      materialType,
    )
    .eq(
      "region",
      region,
    )
    .maybeSingle();

  const payload = {
    title,
    description,

    /*
     * Path interno del objeto privado.
     */
    pdf_url: pdfUrl,

    thumbnail_url:
      generatedThumbnailUrl ||
      thumbnailUrl ||
      DEFAULT_THUMBNAIL,

    material_order:
      materialOrder,

    material_type:
      materialType,

    region,

    /*
     * Solo se rellena la columna
     * correspondiente a la región.
     *
     * La fecha procede del calendario
     * de sesiones + 1 día.
     */
    release_date_spain:
      region === "España"
        ? calculatedReleaseDate
        : null,

    release_date_latam:
      region ===
        "Latinoamérica"
        ? calculatedReleaseDate
        : null,

    updated_at: now,
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
        .insert(payload);

  const {
    error,
  } = await query;

  if (error) {
    console.error(
      "Error guardando material:",
      {
        code:
          error.code,
        message:
          error.message,
        details:
          error.details,
        hint:
          error.hint,
      },
    );

    return NextResponse.json(
      {
        error:
          error.message,
        code:
          error.code,
        details:
          error.details,
        hint:
          error.hint,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
  });
}