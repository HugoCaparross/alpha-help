import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";
import { extractStoragePath } from "@/lib/utils/storage";

const TABLE = "study_materials";

const PDF_BUCKET = "study-materials";

const THUMBNAIL_BUCKET = "study-material-thumbnails";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * DELETE /api/admin/materials/:id
 *
 * Elimina primero los objetos
 * privados de Storage y después
 * el registro de la base de datos.
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json(
      {
        error: auth.message,
      },
      {
        status: auth.status,
      },
    );
  }

  const { id } = await params;

  const admin = createAdminClient();

  const { data: material, error: materialError } = await admin
    .from(TABLE)
    .select("pdf_url, thumbnail_url")
    .eq("id", id)
    .maybeSingle();

  if (materialError) {
    return NextResponse.json(
      {
        error: "No se ha podido recuperar el material.",
      },
      {
        status: 500,
      },
    );
  }

  if (!material) {
    return NextResponse.json(
      {
        error: "El material no existe.",
      },
      {
        status: 404,
      },
    );
  }

  const pdfPath = extractStoragePath(material.pdf_url, PDF_BUCKET);

  const thumbnailPath = extractStoragePath(
    material.thumbnail_url,
    THUMBNAIL_BUCKET,
  );

  if (pdfPath) {
    const { error: storageError } = await admin.storage
      .from(PDF_BUCKET)
      .remove([pdfPath]);

    if (storageError) {
      console.error(storageError);

      return NextResponse.json(
        {
          error: "No se ha podido eliminar el PDF almacenado.",
        },
        {
          status: 500,
        },
      );
    }
  }

  if (thumbnailPath) {
    const { error: storageError } = await admin.storage
      .from(THUMBNAIL_BUCKET)
      .remove([thumbnailPath]);

    if (storageError) {
      console.error(storageError);

      return NextResponse.json(
        {
          error: "No se ha podido eliminar la miniatura almacenada.",
        },
        {
          status: 500,
        },
      );
    }
  }

  const { error } = await admin.from(TABLE).delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      {
        error: "No se ha podido eliminar el material.",
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({
    ok: true,
  });
}
