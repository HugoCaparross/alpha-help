"use client";

import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    Globe2,
} from "lucide-react";

import {
    STUDY_CALENDAR,
    type StudyCalendarItem,
} from "@/lib/constants/study-calendar";

interface SessionCalendarProps {
    region:
    | "España"
    | "Latinoamérica";
}

function formatDate(
    value:
        | string
        | null
        | undefined,
): string {
    if (!value) {
        return "Por confirmar";
    }

    const date =
        new Date(
            `${value}T12:00:00`,
        );

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return "Por confirmar";
    }

    return new Intl.DateTimeFormat(
        "es-ES",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        },
    ).format(date);
}

function getRegionDate(
    item: StudyCalendarItem,
    region:
        | "España"
        | "Latinoamérica",
): string {
    return region ===
        "España"
        ? item.spainDate
        : item.latamDate;
}

function getRegionDay(
    region:
        | "España"
        | "Latinoamérica",
): string {
    return region ===
        "España"
        ? "Jueves"
        : "Sábado";
}

function getRegionTime(
    region:
        | "España"
        | "Latinoamérica",
): string {
    return region ===
        "España"
        ? "19:00 h"
        : "10:00 h MEX · 11:00 h COL";
}

function getRegionDescription(
    region:
        | "España"
        | "Latinoamérica",
): string {
    return region ===
        "España"
        ? "Sesiones en directo los jueves a las 19:00 h."
        : "Sesiones en directo los sábados a las 11:00 h en Colombia y 10:00 h en México.";
}

export function SessionCalendar({
    region,
}: SessionCalendarProps) {
    const regionDay =
        getRegionDay(
            region,
        );

    const regionTime =
        getRegionTime(
            region,
        );

    const regionDescription =
        getRegionDescription(
            region,
        );

    return (
        <section className="session-calendar">
            <header className="session-calendar__header">
                <div className="session-calendar__heading">
                    <span className="session-calendar__icon">
                        <CalendarDays
                            size={20}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    </span>

                    <div>
                        <p className="session-calendar__eyebrow">
                            Calendario
                        </p>

                        <h2 className="session-calendar__title">
                            Programa de sesiones
                        </h2>
                    </div>
                </div>

                <div className="session-calendar__region">
                    <Globe2
                        size={17}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />

                    <span>
                        {region}
                    </span>
                </div>
            </header>

            <p className="session-calendar__description">
                {
                    regionDescription
                }
            </p>

            <div className="session-calendar__schedule">
                <div className="session-calendar__schedule-item">
                    <Clock3
                        size={17}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />

                    <div>
                        <span className="session-calendar__schedule-label">
                            Día y hora
                        </span>

                        <strong>
                            {regionDay} ·{" "}
                            {
                                regionTime
                            }
                        </strong>
                    </div>
                </div>
            </div>

            <div className="session-calendar__list">
                {STUDY_CALENDAR.map(
                    (
                        item,
                    ) => {
                        const date =
                            getRegionDate(
                                item,
                                region,
                            );

                        return (
                            <article
                                key={
                                    item.key
                                }
                                className={`session-calendar__item${!item.hasContent
                                        ? " session-calendar__item--closing"
                                        : ""
                                    }`}
                            >
                                <div className="session-calendar__item-number">
                                    {
                                        item.label
                                    }
                                </div>

                                <div className="session-calendar__item-main">
                                    <div className="session-calendar__item-date">
                                        <CalendarDays
                                            size={
                                                15
                                            }
                                            strokeWidth={
                                                1.8
                                            }
                                            aria-hidden="true"
                                        />

                                        <span>
                                            {formatDate(
                                                date,
                                            )}
                                        </span>
                                    </div>

                                    <h3>
                                        {
                                            item.topic
                                        }
                                    </h3>
                                </div>

                                <div className="session-calendar__item-status">
                                    {item.hasContent ? (
                                        <CheckCircle2
                                            size={
                                                18
                                            }
                                            strokeWidth={
                                                1.8
                                            }
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <span>
                                            Cierre
                                        </span>
                                    )}
                                </div>
                            </article>
                        );
                    },
                )}
            </div>
        </section>
    );
}