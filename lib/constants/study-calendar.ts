export interface StudyCalendarItem {
    readonly key: string;
    readonly label: string;
    readonly topic: string;
    readonly spainDate: string;
    readonly latamDate: string;
    readonly hasContent: boolean;
}

/**
 * Calendario oficial del programa.
 *
 * España:
 * jueves a las 19:00 h.
 *
 * Latinoamérica:
 * mismas fechas que España.
 * 11:00 h Colombia.
 * 10:00 h México.
 *
 * La fila 0+1 comparte fecha
 * (introducción + primera sesión).
 *
 * El cierre es una sesión adicional
 * informativa sin contenidos.
 */
export const STUDY_CALENDAR:
    readonly StudyCalendarItem[] = [
        {
            key: "0-1",
            label: "0 + 1",
            topic:
                "Salud mental, emociones y familia",
            spainDate:
                "2026-10-01",
            latamDate:
                "2026-10-01",
            hasContent: true,
        },

        {
            key: "2",
            label: "2",
            topic:
                "Relación y comunicación familiar",
            spainDate:
                "2026-10-29",
            latamDate:
                "2026-10-29",
            hasContent: true,
        },

        {
            key: "3",
            label: "3",
            topic:
                "Acoso escolar",
            spainDate:
                "2026-11-26",
            latamDate:
                "2026-11-26",
            hasContent: true,
        },

        {
            key: "4",
            label: "4",
            topic:
                "Bienestar digital",
            spainDate:
                "2026-12-10",
            latamDate:
                "2026-12-10",
            hasContent: true,
        },

        {
            key: "5",
            label: "5",
            topic:
                "Adicciones a sustancias",
            spainDate:
                "2027-01-21",
            latamDate:
                "2027-01-21",
            hasContent: true,
        },

        {
            key: "6",
            label: "6",
            topic:
                "Ansiedad y depresión",
            spainDate:
                "2027-02-25",
            latamDate:
                "2027-02-25",
            hasContent: true,
        },

        {
            key: "7",
            label: "7",
            topic:
                "Autolesiones",
            spainDate:
                "2027-03-11",
            latamDate:
                "2027-03-11",
            hasContent: true,
        },

        {
            key: "8",
            label: "8",
            topic:
                "Riesgos de la conducta alimentaria",
            spainDate:
                "2027-04-22",
            latamDate:
                "2027-04-22",
            hasContent: true,
        },

        {
            key: "9",
            label: "9",
            topic:
                "Relaciones, sexualidad y pornografía",
            spainDate:
                "2027-05-20",
            latamDate:
                "2027-05-20",
            hasContent: true,
        },

        {
            key: "closing",
            label: "Cierre",
            topic:
                "Sesión adicional de cierre",
            spainDate:
                "2027-06-10",
            latamDate:
                "2027-06-10",
            hasContent: false,
        },
    ];

export const SPAIN_SESSION_DATES:
    Readonly<Record<number, string>> = {
    0: "2026-10-01",
    1: "2026-10-01",
    2: "2026-10-29",
    3: "2026-11-26",
    4: "2026-12-10",
    5: "2027-01-21",
    6: "2027-02-25",
    7: "2027-03-11",
    8: "2027-04-22",
    9: "2027-05-20",
};