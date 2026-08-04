import * as mupdf from "mupdf";

export async function generateThumbnail(
  pdfBuffer: Buffer,
): Promise<Buffer> {
  try {
    const document = mupdf.Document.openDocument(
      pdfBuffer,
      "application/pdf",
    );

    if (document.countPages() === 0) {
      throw new Error("El PDF no contiene páginas.");
    }

    const page = document.loadPage(0);

    const scale = 2;

    const matrix = mupdf.Matrix.scale(scale, scale);

    const pixmap = page.toPixmap(
      matrix,
      mupdf.ColorSpace.DeviceRGB,
      false,
    );

    return Buffer.from(pixmap.asPNG());
  } catch (error) {
    throw new Error(
      `No se pudo generar la miniatura del PDF: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}