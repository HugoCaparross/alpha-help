import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createServerClient as createAdminClient } from "@/lib/supabase/admin";

const TABLE = "study_materials";

const BUCKET = "study-materials";

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
) {
  const { data } = await admin.storage.getBucket(BUCKET);

  if (!data) {
    await admin.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: "25MB",
    });
  }
}

function sanitizeFileName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "-");
}

/**
 * Comprueba la firma binaria ("magic
 * bytes") del archivo en lugar de
 * confiar en `file.type` o en la
 * extensión del nombre, que el cliente
 * puede declarar como lo que quiera.
 * Todo PDF válido empieza por la
 * cabecera ASCII "%PDF-".
 */
async function isRealPdf(file: File): Promise<boolean> {
  const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());

  const signature = String.fromCharCode(...header);

  return signature === "%PDF-";
}

/**
 * GET /api/admin/materials
 */
export async function GET() {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const admin = createAdminClient();

  const { data, error } = await admin
    .from(TABLE)
    .select(SELECT_FIELDS)
    .order("material_type", { ascending: true })
    .order("material_order", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "No se han podido recuperar los materiales." },
      { status: 500 },
    );
  }

  return NextResponse.json({ materials: data ?? [] });
}

/**
 * POST /api/admin/materials
 *
 * Recibe multipart/form-data con:
 * title, description, materialType ("support" | "extended"),
  * materialOrder (0-10 para support y extended),
 * region ("España" | "Latinoamérica"), releaseDateSpain?,
 * releaseDateLatam?, thumbnailUrl?, file (PDF, opcional si
 * ya existe pdfUrl).
 */
export async function POST(request: Request) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const form = await request.formData();

  const title = form.get("title")?.toString().trim();
  const description = form.get("description")?.toString().trim();
  const materialType = form.get("materialType")?.toString();
  const materialOrderRaw = form.get("materialOrder")?.toString();
  const region = form.get("region")?.toString();
  const releaseDateSpain = form.get("releaseDateSpain")?.toString();
  const releaseDateLatam = form.get("releaseDateLatam")?.toString();
  const thumbnailUrl = form.get("thumbnailUrl")?.toString().trim();
  const existingPdfUrl = form.get("pdfUrl")?.toString().trim();
  const file = form.get("file");

  const materialOrder = materialOrderRaw ? Number(materialOrderRaw) : null;

  if (
  !title ||
  !description ||
  (materialType !== "support" && materialType !== "extended") ||
  (region !== "España" && region !== "Latinoamérica") ||
  materialOrder === null ||
  Number.isNaN(materialOrder) ||
  materialOrder < 0 ||
  materialOrder > 10
) {
  return NextResponse.json(
    { error: "Faltan campos obligatorios o son inválidos." },
    { status: 400 },
  );
}

  const admin = createAdminClient();

  let pdfUrl = existingPdfUrl || "";

  if (file instanceof File && file.size > 0) {
    if (!(await isRealPdf(file))) {
      return NextResponse.json(
        { error: "El archivo debe ser un PDF válido." },
        { status: 400 },
      );
    }

    await ensureBucket(admin);

    const path = `${region}/${materialType}/${materialOrder}-${Date.now()}-${sanitizeFileName(
      file.name || "material.pdf",
    )}`;

    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await admin.storage
      .from(BUCKET)
      .upload(path, Buffer.from(arrayBuffer), {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "No se ha podido subir el PDF." },
        { status: 500 },
      );
    }

    const { data: publicUrlData } = admin.storage.from(BUCKET).getPublicUrl(path);

    pdfUrl = publicUrlData.publicUrl;
  }

  if (!pdfUrl) {
    return NextResponse.json(
      { error: "Debes adjuntar un archivo PDF." },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();

  const { data: existing } = await admin
    .from(TABLE)
    .select("id")
    .eq("material_order", materialOrder)
    .eq("material_type", materialType)
    .eq("region", region)
    .maybeSingle();

  const payload = {
    title,
    description,
    pdf_url: pdfUrl,
    thumbnail_url: thumbnailUrl || DEFAULT_THUMBNAIL,
    material_order: materialOrder,
    material_type: materialType,
    region,
    release_date_spain: releaseDateSpain || now,
    release_date_latam: releaseDateLatam || now,
    updated_at: now,
  };

  const query = existing
    ? admin.from(TABLE).update(payload).eq("id", existing.id)
    : admin.from(TABLE).insert(payload);

  const { error } = await query;

  if (error) {
    return NextResponse.json(
      { error: "No se ha podido guardar el material." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}