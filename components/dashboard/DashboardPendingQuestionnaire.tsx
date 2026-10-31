"use client";

import Link from "next/link";

import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    ClipboardCheck,
} from "lucide-react";

interface DashboardPendingQuestionnaireProps {
    preCompleted: boolean;
}

export default function DashboardPendingQuestionnaire({
    preCompleted,
}: DashboardPendingQuestionnaireProps) {
    // ESTADO 1: CUESTIONARIO INICIAL COMPLETADO
    if (preCompleted) {
        return (
            <section
                className="dashboard-questionnaire-status dashboard-questionnaire-status--completed"
                aria-labelledby="dashboard-questionnaire-status-title"
                aria-live="polite"
            >
                <div className="dashboard-questionnaire-status__accent" />

                <div className="dashboard-questionnaire-status__icon">
                    <CheckCircle2
                        size={24}
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                </div>

                <div className="dashboard-questionnaire-status__content">
                    <span className="dashboard-questionnaire-status__eyebrow">
                        Primer paso completado
                    </span>

                    <h2
                        id="dashboard-questionnaire-status-title"
                        className="dashboard-questionnaire-status__title"
                    >
                        Cuestionario inicial completado
                    </h2>

                    <p className="dashboard-questionnaire-status__description">
                        ¡Perfecto! Tus respuestas se han guardado correctamente.
                        Ya has completado el primer paso de tu participación
                        en el estudio. Te recomendamos consultar ahora los
                        manuales disponibles en el apartado Manuales, donde
                        encontrarás información y orientaciones para seguir
                        el programa.
                    </p>
                </div>

                <Link
                    href="/recursos"
                    className="dashboard-questionnaire-status__action"
                    aria-label="Consultar los manuales del programa"
                >
                    <BookOpen
                        size={18}
                        strokeWidth={2}
                        aria-hidden="true"
                    />

                    <span>Consultar manuales</span>

                    <ArrowRight
                        size={17}
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                </Link>
            </section>
        );
    }

    // ESTADO 2: CUESTIONARIO INICIAL PENDIENTE
    return (
        <section
            className="dashboard-questionnaire-status dashboard-questionnaire-status--pending"
            aria-labelledby="dashboard-questionnaire-status-title"
            aria-live="polite"
        >
            <div className="dashboard-questionnaire-status__accent" />

            <div className="dashboard-questionnaire-status__icon">
                <ClipboardCheck
                    size={24}
                    strokeWidth={2}
                    aria-hidden="true"
                />
            </div>

            <div className="dashboard-questionnaire-status__content">
                <span className="dashboard-questionnaire-status__eyebrow">
                    Primer paso
                </span>

                <h2
                    id="dashboard-questionnaire-status-title"
                    className="dashboard-questionnaire-status__title"
                >
                    Cuestionario inicial pendiente
                </h2>

                <p className="dashboard-questionnaire-status__description">
                    Para comenzar tu participación en el estudio, completa
                    primero el cuestionario inicial. Después podrás acceder
                    al resto de contenidos del programa.
                </p>
            </div>

            <Link
                href="/cuestionarios/pre"
                className="dashboard-questionnaire-status__action"
                aria-label="Completar el cuestionario inicial"
            >
                <span>Completar cuestionario</span>

                <ArrowRight
                    size={17}
                    strokeWidth={2}
                    aria-hidden="true"
                />
            </Link>
        </section>
    );
}