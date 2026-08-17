import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackToDashboardProps {
    readonly className?: string;
}

export default function BackToDashboard({
    className = "",
}: BackToDashboardProps) {
    const classes = ["btn-secondary", className]
        .filter(Boolean)
        .join(" ");

    return (
        <Link
            href="/dashboard"
            className={classes}
            aria-label="Volver al Dashboard"
        >
            <ArrowLeft size={16} aria-hidden="true" />

            <span>Volver al Dashboard</span>
        </Link>
    );
}