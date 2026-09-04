export interface AdminMaterialRow {
  id: string;
  title: string;
  description: string;
  pdf_url: string;
  thumbnail_url: string;
  material_order: number;
  material_type: "support" | "extended";

  region: "España" | "Latinoamérica";

  release_date_spain: string;
  release_date_latam: string;
}

export interface AdminMaterialInput {
  title: string;
  description: string;
  materialType: "support" | "extended";
  materialOrder: number;

  region: "España" | "Latinoamérica";


  thumbnailUrl?: string;
  pdfUrl?: string;
  file?: File | null;
}

const ERROR_LIST = "No se han podido cargar los materiales.";
const ERROR_SAVE = "No se ha podido guardar el material.";
const ERROR_DELETE = "No se ha podido eliminar el material.";

export async function listAdminMaterials(): Promise<AdminMaterialRow[]> {
  const response = await fetch("/api/admin/materials", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(ERROR_LIST);
  }

  const { materials } = await response.json();

  return materials as AdminMaterialRow[];
}

export async function saveAdminMaterial(
  input: AdminMaterialInput,
): Promise<void> {
  const form = new FormData();

  form.set("title", input.title);
  form.set("description", input.description);
  form.set("materialType", input.materialType);
  form.set("materialOrder", String(input.materialOrder));

  form.set("region", input.region);


  if (input.thumbnailUrl) {
    form.set("thumbnailUrl", input.thumbnailUrl);
  }

  if (input.pdfUrl) {
    form.set("pdfUrl", input.pdfUrl);
  }

  if (input.file) {
    form.set("file", input.file);
  }

  const response = await fetch("/api/admin/materials", {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(data?.error ?? ERROR_SAVE);
  }
}

export async function deleteAdminMaterial(
  id: string,
): Promise<void> {
  const response = await fetch(
    `/api/admin/materials/${id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(ERROR_DELETE);
  }
}