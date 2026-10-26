"use client";

import {
    useEffect,
    useState,
} from "react";

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

import type { Region } from "@/lib/utils/regions";

import {
    getSessions,
} from "@/services/sessions/study-session.service";

import type {
    Session,
} from "@/types/study-session";

interface SessionCalendarProps {
    region: Region;
}

function getTimeZone(region: Region): string {
    return region === "spain"
        ? "Europe/Madrid"
        : "America/Bogota";
}

function getRegionLabel(region: Region): string {
    return region === "spain"
        ? "España"
        : "Latinoamérica";
}

function getSessionOrder(
    item: StudyCalendarItem,
): number | null {
    if (item.key === "closing") {
        return null;
    }

    if (item.key === "0-1") {
        return 0;
    }

    const order = Number(item.key);

    return Number.isInteger(order)
        ? order
        : null;
}

function getSessionDate(
    sessions: Session[],
    item: StudyCalendarItem,
    region: Region,
): string | null {
    const order = getSessionOrder(item);

    if (order === null) {
        return null;
    }

    const session = sessions.find(
        (entry) => entry.sessionOrder === order,
    );

    if (!session) {
        return null;
    }

    return region === "spain"
        ? session.releaseDateSpain
        : session.releaseDateLatam;
}

function formatDate(
    value: string | null | undefined,
    region: Region,
): string {
    if (!value) {
        return "Por confirmar";
    }

    const timestamp = Date.parse(value);

    if (!Number.isFinite(timestamp)) {
        return "Por confirmar";
    }

    return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: getTimeZone(region),
    }).format(new Date(timestamp));
}

function formatTime(
    value: string | null | undefined,
    region: Region,
): string {
    if (!value) {
        return "";
    }

    const timestamp = Date.parse(value);

    if (!Number.isFinite(timestamp)) {
        return "";
    }

    return new Intl.DateTimeFormat("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: getTimeZone(region),
    }).format(new Date(timestamp)) + " h";
}

function getRegionDescription(
    region: Region,
): string {
    return region === "spain"
        ? "Las fechas y horas corresponden a la programación vigente en España."
        : "Las fechas y horas corresponden a la programación vigente en Latinoamérica. Los horarios se muestran en hora de Colombia.";
}

function getRegionTimeLabel(
    region: Region,
): string {
    return region === "spain"
        ? "Hora peninsular española"
        : "Hora de Colombia";
}

export default function SessionCalendar({
    region,
}: SessionCalendarProps) {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadCalendar() {
            setLoading(true);
            setLoadError(false);

            try {
                const result = await getSessions(region);

                if (!cancelled) {
                    setSessions(result);
                }
            } catch (error) {
                console.error(
                    "[SessionCalendar] No se pudo cargar el calendario:",
                    error,
                );

                if (!cancelled) {
                    setSessions([]);
                    setLoadError(true);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadCalendar();

        return () => {
            cancelled = true;
        };
    }, [region]);

    const regionLabel = getRegionLabel(region);
    const regionDescription = getRegionDescription(region);
    const regionTimeLabel = getRegionTimeLabel(region);

    return (
        <section
            className="session-calendar"
            aria-labelledby="session-calendar-title"
        >
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

                        <h2
                            id="session-calendar-title"
                            className="session-calendar__title"
                        >
                            Programa de sesiones
                        </h2>
                    </div>
                </div>

                <div
                    className="session-calendar__region"
                    aria-label={`Región: ${regionLabel}`}
                >
                    <Globe2
                        size={17}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />

                    <span>{regionLabel}</span>
                </div>
            </header>

            <p className="session-calendar__description">
                {regionDescription}
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
                            Horario
                        </span>

                        <strong>{regionTimeLabel}</strong>
                    </div>
                </div>
            </div>

            {loadError && (
                <p
                    className="session-calendar__description"
                    role="alert"
                >
                    No se ha podido cargar el calendario actualizado.
                    Inténtalo de nuevo más tarde.
                </p>
            )}

            {loading ? (
                <p className="session-calendar__description">
                    Cargando calendario...
                </p>
            ) : (
                <div className="session-calendar__list">
                    {STUDY_CALENDAR.map((item) => {
                        const date = getSessionDate(
                            sessions,
                            item,
                            region,
                        );

                        const formattedDate = formatDate(
                            date,
                            region,
                        );

                        const formattedTime = formatTime(
                            date,
                            region,
                        );

                        return (
                            <article
                                key={item.key}
                                className={`session-calendar__item${!item.hasContent
                                        ? " session-calendar__item--closing"
                                        : ""
                                    }`}
                            >
                                <div className="session-calendar__item-number">
                                    {item.label}
                                </div>

                                <div className="session-calendar__item-main">
                                    <div className="session-calendar__item-date">
                                        <CalendarDays
                                            size={15}
                                            strokeWidth={1.8}
                                            aria-hidden="true"
                                        />

                                        <span>{formattedDate}</span>
                                    </div>

                                    {formattedTime && (
                                        <div className="session-calendar__item-date">
                                            <Clock3
                                                size={15}
                                                strokeWidth={1.8}
                                                aria-hidden="true"
                                            />

                                            <span>{formattedTime}</span>
                                        </div>
                                    )}

                                    <h3>{item.topic}</h3>
                                </div>

                                <div className="session-calendar__item-status">
                                    {item.hasContent ? (
                                        <CheckCircle2
                                            size={18}
                                            strokeWidth={1.8}
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <span>Cierre</span>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}