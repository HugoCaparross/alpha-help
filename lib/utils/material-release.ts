/**
 * Calcula la fecha efectiva de liberación de un material.
 *
 * Regla única del estudio:
 *
 *     sesión → día siguiente → material disponible
 *
 * La fecha de la sesión es la fuente de verdad.
 * No se utilizan fechas de apertura independientes.
 *
 * La función devuelve una fecha ISO para poder
 * compararla de forma segura en servidor.
 */
export function getMaterialReleaseDate(
    sessionDate: string | null | undefined,
): string | null {
    if (!sessionDate) {
        return null;
    }

    const date = new Date(sessionDate);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    date.setDate(date.getDate() + 1);

    return date.toISOString();
}