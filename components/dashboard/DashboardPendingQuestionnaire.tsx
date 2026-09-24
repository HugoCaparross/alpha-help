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
    if (preCompleted) {
        return (
            <section
                className="dashboard-questionnaire-status dashboard-questionnaire-status--completed"
                aria-labelledby="dashboard-questionnaire-status-title"
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
                        Ya has completado el cuestionario inicial. Puedes continuar
                        consultando los materiales disponibles del programa.
                    </p>
                </div>

                <Link
                    href="/recursos"
                    className="dashboard-questionnaire-status__action"
                >
                    <BookOpen
                        size={18}
                        strokeWidth={2}
                        aria-hidden="true"
                    />

                    <span>Consultar materiales</span>

                    <ArrowRight
                        size={17}
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                </Link>
            </section>
        );
    }

    return (
        <section
            className="dashboard-questionnaire-status dashboard-questionnaire-status--pending"
            aria-labelledby="dashboard-questionnaire-status-title"
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
                    Para comenzar tu participación en el estudio, completa primero el
                    cuestionario inicial. Después podrás acceder al resto de contenidos
                    del programa.
                </p>
            </div>

            <Link
                href="/cuestionarios/pre"
                className="dashboard-questionnaire-status__action"
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