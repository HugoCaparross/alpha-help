"use client";

import { useEffect, useState } from "react";

import {
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Globe2,
} from "lucide-react";

import {
    STUDY_CALENDAR,
    type StudyCalendarItem,
} from "@/lib/constants/study-calendar";

import type { Region } from "@/lib/utils/regions";

import { getSessions } from "@/services/sessions/study-session.service";
import type { Session } from "@/types/study-session";

interface SessionCalendarProps {
    region: Region;
}

function getTimeZone(region: Region): string {
    return region === "spain"
        ? "Europe/Madrid"
        : "America/Bogota";
}

function getRegionLabel(region: Region): string {
    return region === "spain" ? "España" : "Latinoamérica";
}

function getSessionOrder(item: StudyCalendarItem): number | null {
    if (item.key === "closing") return null;
    if (item.key === "0-1") return 0;

    const order = Number(item.key);

    return Number.isInteger(order) ? order : null;
}

function getSessionDate(
    sessions: Session[],
    item: StudyCalendarItem,
    region: Region,
): string | null {
    const order = getSessionOrder(item);

    if (order === null) return null;

    const session = sessions.find(
        (entry) => entry.sessionOrder === order,
    );

    if (!session) return null;

    return region === "spain"
        ? session.releaseDateSpain
        : session.releaseDateLatam;
}

function formatDate(
    value: string | null | undefined,
    region: Region,
): string {
    if (!value) return "Fecha por confirmar";

    const timestamp = Date.parse(value);

    if (!Number.isFinite(timestamp)) {
        return "Fecha por confirmar";
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
    if (!value) return "";

    const timestamp = Date.parse(value);

    if (!Number.isFinite(timestamp)) return "";

    return new Intl.DateTimeFormat("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: getTimeZone(region),
    }).format(new Date(timestamp)) + " h";
}

export default function SessionCalendar({
    region,
}: SessionCalendarProps) {
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    const regionLabel = getRegionLabel(region);

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
                    "[SessionCalendar] Error al cargar el calendario:",
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
                            Calendario del programa
                        </p>

                        <h2
                            id="session-calendar-title"
                            className="session-calendar__title"
                        >
                            Consulta las fechas de tus sesiones
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
                Consulta las fechas y los horarios de las sesiones
                programadas para tu región.
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
                            Zona horaria
                        </span>

                        <strong>
                            {region === "spain"
                                ? "España · Hora peninsular"
                                : "Latinoamérica · Hora de Colombia"}
                        </strong>

                        {region === "latam" && (
                            <span className="session-calendar__description">
                                11:00 h en Colombia equivale a 10:00 h en México.
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <button
                type="button"
                className="session-calendar__toggle"
                onClick={() => setCalendarOpen((open) => !open)}
                aria-expanded={calendarOpen}
                aria-controls="session-calendar-content"
            >
                <CalendarDays
                    size={18}
                    strokeWidth={1.8}
                    aria-hidden="true"
                />

                <span>
                    {calendarOpen ? "Ocultar calendario" : "Ver calendario"}
                </span>

                <ChevronDown
                    size={18}
                    strokeWidth={1.8}
                    aria-hidden="true"
                    className={`session-calendar__toggle-icon${calendarOpen
                            ? " session-calendar__toggle-icon--open"
                            : ""
                        }`}
                />
            </button>

            {calendarOpen && (
                <div
                    id="session-calendar-content"
                    className="session-calendar__content"
                >
                    {loading ? (
                        <p className="session-calendar__description">
                            Cargando calendario...
                        </p>
                    ) : loadError ? (
                        <div className="session-calendar__error" role="alert">
                            <p>
                                No se ha podido cargar el calendario actualizado.
                            </p>

                            <button
                                type="button"
                                className="session-calendar__retry"
                                onClick={() => {
                                    setLoadError(false);
                                    setLoading(true);

                                    void getSessions(region)
                                        .then((result) => {
                                            setSessions(result);
                                        })
                                        .catch((error: unknown) => {
                                            console.error(
                                                "[SessionCalendar] Error al reintentar:",
                                                error,
                                            );
                                            setLoadError(true);
                                        })
                                        .finally(() => {
                                            setLoading(false);
                                        });
                                }}
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="session-calendar__list">
                                {STUDY_CALENDAR.map((item) => {
                                    const date = getSessionDate(
                                        sessions,
                                        item,
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

                                                    <span>{formatDate(date, region)}</span>
                                                </div>

                                                {date && (
                                                    <div className="session-calendar__item-date">
                                                        <Clock3
                                                            size={15}
                                                            strokeWidth={1.8}
                                                            aria-hidden="true"
                                                        />

                                                        <span>{formatTime(date, region)}</span>
                                                    </div>
                                                )}

                                                <h3>{item.topic}</h3>

                                                {!item.hasContent && (
                                                    <span className="session-calendar__description">
                                                        Sesión adicional de cierre.
                                                    </span>
                                                )}
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

                            <p className="session-calendar__note">
                                Las fechas se obtienen de la programación guardada
                                en la plataforma. La sesión de cierre no dispone
                                actualmente de una fecha independiente en la tabla
                                de sesiones.
                            </p>
                        </>
                    )}
                </div>
            )}
        </section>
    );
}