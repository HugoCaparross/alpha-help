import { createThumbnail } from "@mkholt/pdf-thumbnail";
import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Genera una miniatura PNG de la primera página de un PDF.
 *
 * La librería trabaja sobre archivos, por lo que
 * escribimos el PDF temporalmente en disco,
 * generamos la miniatura y eliminamos el archivo.
 */
export async function generateThumbnail(
  pdfBuffer: Buffer,
): Promise<Buffer> {
  const tempFile = join(
    tmpdir(),
    `${randomUUID()}.pdf`,
  );

  try {
    await fs.writeFile(tempFile, pdfBuffer);

    const thumbnail = await createThumbnail(tempFile, {
      output: "buffer",
      page: 1,
      scale: 2,
      logLevel: "error",
    });

    if (!thumbnail) {
      throw new Error(
        "No se ha podido generar la miniatura.",
      );
    }

    if (thumbnail.thumbType === "error") {
      throw new Error(thumbnail.thumbData);
    }

    return thumbnail.thumbData;
  } finally {
    await fs.rm(tempFile, {
      force: true,
    });
  }
}