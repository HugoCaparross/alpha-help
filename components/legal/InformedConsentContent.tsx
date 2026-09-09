import { Download, ExternalLink } from "lucide-react";

const INFORMED_CONSENT_PDF =
  "/documentos/Consentimiento-informado-Alpha-Help-2026.pdf";

export default function InformedConsentContent() {
  return (
    <div className="informed-consent-viewer">
      <div className="informed-consent-pdf-wrapper">
        <iframe
          src={`${INFORMED_CONSENT_PDF}#toolbar=1&navpanes=0&scrollbar=1`}
          title="Consentimiento informado Alpha-Help 2026"
          className="informed-consent-pdf"
        />
      </div>

      <div className="informed-consent-actions">
        <a
          href={INFORMED_CONSENT_PDF}
          target="_blank"
          rel="noopener noreferrer"
          className="informed-consent-action"
        >
          <ExternalLink size={17} aria-hidden="true" />
          <span>Leer en una pestaña nueva</span>
        </a>

        <a
          href={INFORMED_CONSENT_PDF}
          download
          className="informed-consent-action informed-consent-action-primary"
        >
          <Download size={17} aria-hidden="true" />
          <span>Descargar PDF</span>
        </a>
      </div>
    </div>
  );
}