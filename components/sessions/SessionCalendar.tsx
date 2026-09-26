"use client";

import { useState } from "react";
import {
    CalendarDays,
    Clock3,
} from "lucide-react";

import Modal from "@/components/ui/Modal";
import type { Region } from "@/lib/utils/regions";
import {
    STUDY_CALENDAR,
} from "@/lib/constants/study-calendar";

interface SessionCalendarProps {
    readonly region: Region;
}

const dateFormatter =
    new Intl.DateTimeFormat(
        "es-ES",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        },
    );

const REGION_COPY: Record<
    Region,
    {
        label: string;
        description: string;
        columnTitle: string;
        time: string;
    }
> = {
    spain: {
        label: "España",
        description:
            "Consulta las fechas oficiales de las sesiones del programa para España.",
        columnTitle:
            "España · jueves",
        time: "19:00 h",
    },

    latam: {
        label:
            "Latinoamérica",
        description:
            "Consulta las fechas oficiales de las sesiones del programa para Latinoamérica.",
        columnTitle:
            "Latinoamérica · jueves",
        time:
            "10:00 MEX · 11:00 COL",
    },
};

function formatDate(
    value: string | null,
): string {
    if (!value) {
        return "Pendiente de confirmar";
    }

    return dateFormatter.format(
        new Date(
            `${value}T12:00:00`,
        ),
    );
}

export default function SessionCalendar({
    region,
}: SessionCalendarProps) {
    const [
        calendarOpen,
        setCalendarOpen,
    ] = useState(false);

    const copy =
        REGION_COPY[region];

    return (
        <>
            <section
                className="sesiones-calendar-trigger"
                aria-labelledby="sesiones-calendar-trigger-title"
            >
                <div
                    className="sesiones-calendar-trigger__icon"
                    aria-hidden="true"
                >
                    <CalendarDays
                        size={22}
                    />
                </div>

                <div className="sesiones-calendar-trigger__content">
                    <p className="sesiones-calendar-trigger__eyebrow">
                        Calendario del programa
                    </p>

                    <h2
                        id="sesiones-calendar-trigger-title"
                        className="sesiones-calendar-trigger__title"
                    >
                        Consulta las fechas de tus
                        sesiones
                    </h2>

                    <p className="sesiones-calendar-trigger__description">
                        {copy.description}
                    </p>
                </div>

                <button
                    type="button"
                    className="sesiones-calendar-trigger__button"
                    onClick={() =>
                        setCalendarOpen(true)
                    }
                    aria-haspopup="dialog"
                >
                    <CalendarDays
                        size={17}
                        aria-hidden="true"
                    />

                    <span>
                        Ver calendario
                    </span>
                </button>
            </section>

            <Modal
                open={calendarOpen}
                title={`Calendario de sesiones · ${copy.label}`}
                onClose={() =>
                    setCalendarOpen(false)
                }
                maxWidth={1050}
            >
                <div className="sesiones-calendar-modal">
                    <div className="sesiones-calendar-modal__intro">
                        <div
                            className="sesiones-calendar-modal__intro-icon"
                            aria-hidden="true"
                        >
                            <CalendarDays
                                size={20}
                            />
                        </div>

                        <div>
                            <h3>
                                Fechas de las sesiones
                            </h3>

                            <p>
                                {copy.description}
                            </p>
                        </div>
                    </div>

                    <div className="sesiones-calendar__table-wrap">
                        <table className="sesiones-calendar__table">
                            <thead>
                                <tr>
                                    <th>
                                        Sesión
                                    </th>

                                    <th>
                                        Temática
                                    </th>

                                    <th>
                                        {copy.columnTitle}
                                        <br />
                                        {copy.time}
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {STUDY_CALENDAR.map(
                                    (item) => (
                                        <tr
                                            key={
                                                item.key
                                            }
                                            className={
                                                !item.hasContent
                                                    ? "sesiones-calendar__closing"
                                                    : undefined
                                            }
                                        >
                                            <td>
                                                <span className="sesiones-calendar__session-badge">
                                                    {item.label}
                                                </span>
                                            </td>

                                            <td>
                                                <strong>
                                                    {item.topic}
                                                </strong>

                                                {!item.hasContent && (
                                                    <span className="sesiones-calendar__no-content">
                                                        Sin contenidos
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                <span className="sesiones-calendar__date">
                                                    <Clock3
                                                        size={15}
                                                        aria-hidden="true"
                                                    />

                                                    {formatDate(
                                                        region ===
                                                            "spain"
                                                            ? item.spainDate
                                                            : item.latamDate,
                                                    )}
                                                </span>
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>

                    <p className="sesiones-calendar__note">
                        La sesión de cierre es una
                        sesión adicional de anuncio y
                        cierre del programa; no tiene
                        contenidos asociados.
                    </p>
                </div>
            </Modal>
        </>
    );
}