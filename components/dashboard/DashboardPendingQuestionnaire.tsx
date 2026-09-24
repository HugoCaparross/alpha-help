import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    ClipboardCheck,
} from "lucide-react";

interface DashboardPendingQuestionnaireProps {
    readonly preCompleted: boolean;
}

/**
 * Tarjeta contextual del cuestionario inicial.
 *
 * Antes de completar el PRE:
 * - comunica que falta una tarea;
 * - explica que es el primer paso;
 * - lleva directamente al cuestionario.
 *
 * Después de completar el PRE:
 * - confirma que el primer paso ya está realizado;
 * - refuerza el progreso conseguido;
 * - dirige directamente a los materiales del programa.
 */
export default function DashboardPendingQuestionnaire({
    preCompleted,
}: DashboardPendingQuestionnaireProps) {
    if (!preCompleted) {
        return (
            <section
                className="dashboard-pending-questionnaire dashboard-pending-questionnaire--pending"
                aria-labelledby="dashboard-pending-questionnaire-title"
            >
                <div
                    className="dashboard-pending-questionnaire__icon"
                    aria-hidden="true"
                >
                    <ClipboardCheck
                        size={24}
                        strokeWidth={2}
                    />
                </div>

                <div className="dashboard-pending-questionnaire__content">
                    <span className="dashboard-pending-questionnaire__eyebrow">
                        Primer paso
                    </span>

                    <h2
                        id="dashboard-pending-questionnaire-title"
                        className="dashboard-pending-questionnaire__title"
                    >
                        Cuestionario inicial pendiente
                    </h2>

                    <p className="dashboard-pending-questionnaire__description">
                        Para comenzar tu participación, primero debes completar el
                        cuestionario inicial. Es el primer paso antes de acceder al resto
                        del programa.
                    </p>
                </div>

                <Link
                    href="/cuestionarios/pre"
                    prefetch
                    className="dashboard-pending-questionnaire__cta btn-primary"
                    aria-label="Completar el cuestionario inicial"
                >
                    <span>Completar cuestionario inicial</span>

                    <ArrowRight
                        size={18}
                        aria-hidden="true"
                    />
                </Link>
            </section>
        );
    }

    return (
        <section
            className="dashboard-pending-questionnaire dashboard-pending-questionnaire--completed"
            aria-labelledby="dashboard-completed-questionnaire-title"
        >
            <div
                className="dashboard-pending-questionnaire__icon"
                aria-hidden="true"
            >
                <CheckCircle2
                    size={24}
                    strokeWidth={2}
                />
            </div>

            <div className="dashboard-pending-questionnaire__content">
                <span className="dashboard-pending-questionnaire__eyebrow">
                    Primer paso completado
                </span>

                <h2
                    id="dashboard-completed-questionnaire-title"
                    className="dashboard-pending-questionnaire__title"
                >
                    Cuestionario inicial completado
                </h2>

                <p className="dashboard-pending-questionnaire__description">
                    ¡Ya has completado el primer paso! Ahora puedes continuar con los
                    materiales del programa y avanzar en tu participación.
                </p>
            </div>

            <Link
                href="/recursos"
                prefetch
                className="dashboard-pending-questionnaire__cta btn-primary"
                aria-label="Acceder a los materiales del programa"
            >
                <BookOpen
                    size={18}
                    aria-hidden="true"
                />

                <span>Ver materiales</span>

                <ArrowRight
                    size={18}
                    aria-hidden="true"
                />
            </Link>
        </section>
    );
}