/**
 * Recupera todas las filas de una consulta de Supabase mediante paginación.
 *
 * Supabase/PostgREST puede limitar el número de filas devueltas en una
 * petición individual. Esta función continúa solicitando páginas hasta
 * recuperar todos los registros existentes.
 *
 * No existe un límite máximo de registros impuesto por esta función.
 */
export async function fetchAllRows<T>(
    queryPage: (
        from: number,
        to: number,
    ) => PromiseLike<{
        data: T[] | null;
        error: { message?: string } | null;
    }>,
    pageSize = 1000,
): Promise<{ data: T[]; error: { message?: string } | null }> {
    if (!Number.isInteger(pageSize) || pageSize <= 0) {
        throw new Error("El tamaño de página debe ser un entero positivo.");
    }

    const rows: T[] = [];
    let from = 0;

    while (true) {
        const to = from + pageSize - 1;

        const result = await queryPage(from, to);

        if (result.error) {
            return {
                data: rows,
                error: result.error,
            };
        }

        const page = result.data ?? [];

        rows.push(...page);

        /*
         * Si hemos recibido menos registros que el tamaño solicitado,
         * significa que hemos llegado al final.
         */
        if (page.length < pageSize) {
            break;
        }

        from += pageSize;
    }

    return {
        data: rows,
        error: null,
    };
}