export default function InformedConsentContent() {
  const pdfPath = "/documentos/Consentimiento-informado-Alpha-Help-2026.pdf";

  return (
    <div className="informed-consent-document">
      <div className="informed-consent-document-actions">
        <a
          href={pdfPath}
          target="_blank"
          rel="noopener noreferrer"
          className="informed-consent-link"
        >
          Leer en una pestaña nueva
        </a>

        <a
          href={pdfPath}
          download
          className="informed-consent-link"
        >
          Descargar PDF
        </a>
      </div>

      <iframe
        src={pdfPath}
        title="Consentimiento informado Alpha-Help 2026"
        className="informed-consent-pdf"
      />
    </div>
  );
}
