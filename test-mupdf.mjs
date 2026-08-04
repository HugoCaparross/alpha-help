import * as mupdf from "mupdf";
import { readFile, writeFile } from "node:fs/promises";

const pdf = await readFile("0. Introduccion_version_reducida_SPA.pdf");

const document = mupdf.Document.openDocument(
  pdf,
  "application/pdf",
);

const page = document.loadPage(0);

const scale = 2;

const matrix = mupdf.Matrix.scale(scale, scale);

const pixmap = page.toPixmap(
  matrix,
  mupdf.ColorSpace.DeviceRGB,
  false,
);

const png = pixmap.asPNG();

await writeFile("./thumbnail.png", png);

console.log("Miniatura creada correctamente.");