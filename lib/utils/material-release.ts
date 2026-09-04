/**
 * Calcula la fecha de liberación de un material a partir de la fecha
 * de la sesión correspondiente. El material se libera el día natural
 * siguiente a la sesión.
 */
export function getMaterialReleaseDate(
    sessionDate: string | null | undefined,
): string | null {
    if (!sessionDate) return null;

    const date = new Date(sessionDate);
    if (Number.isNaN(date.getTime())) return null;

    date.setUTCDate(date.getUTCDate() + 1);
    return date.toISOString();
}
