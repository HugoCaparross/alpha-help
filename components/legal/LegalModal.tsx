"use client";

import { X } from "lucide-react";

interface LegalModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}

export default function LegalModal({
  open,
  title,
  children,
  onClose,
  className,
}: LegalModalProps) {
  if (!open) return null;

  return (
    <div
      className="legal-modal-overlay"
      onClick={onClose}
    >
      <div
        className={`legal-modal${className ? ` ${className}` : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="legal-modal-header">
          <h2>{title}</h2>

          <button
            type="button"
            className="legal-modal-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="legal-modal-content">
          {children}
        </div>
      </div>
    </div>
  );
}