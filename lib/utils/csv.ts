/**
 * Escapa un valor para su uso
 * seguro dentro de un CSV.
 */
function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue =
    typeof value === "string" ? value : JSON.stringify(value);

  if (/[",\n;]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Construye un CSV (con BOM UTF-8,
 * para su correcta apertura en Excel)
 * a partir de una lista de columnas
 * y de filas de datos.
 */
export function buildCsv(
  columns: readonly string[],
  rows: readonly Record<string, unknown>[],
): string {
  const header = columns.map(escapeCsvValue).join(",");

  const body = rows
    .map((row) =>
      columns.map((column) => escapeCsvValue(row[column])).join(","),
    )
    .join("\n");

  const BOM = "\uFEFF";

  return `${BOM}${header}\n${body}`;
}

/**
 * Genera la respuesta HTTP
 * de descarga de un archivo CSV.
 */
export function csvResponse(csv: string, filename: string): Response {
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}