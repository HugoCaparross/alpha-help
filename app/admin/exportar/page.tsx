"use client";

import { Download } from "lucide-react";

export default function AdminExportPage() {
  return (
    <section className="admin-page admin-page--exports">
      <header className="admin-header">
        <h1 className="admin-header__title">Exportar datos</h1>

        <p className="admin-header__description">
          Descarga los datos del estudio en formato CSV, listos para abrir en
          Excel. Cada archivo contiene una fila por participante.
        </p>
      </header>

      <div className="admin-export-grid">
        <div className="admin-export-card">
          <span className="admin-export-card__title">
            Registro de participantes
          </span>

          <p className="admin-export-card__description">
            Toda la información del formulario de registro: datos personales,
            familiares, académicos y de contacto. Una fila por usuario.
          </p>

          <a
            href="/api/admin/export/users"
            className="admin-export-card__button"
          >
            <Download size={16} />
            <span>Descargar CSV</span>
          </a>
        </div>

        <div className="admin-export-card">
          <span className="admin-export-card__title">
            Cuestionarios (pre y post)
          </span>

          <p className="admin-export-card__description">
            Respuestas a los cuestionarios pre y post en una única fila por
            participante, con una columna por cada pregunta.
          </p>

          <a
            href="/api/admin/export/questionnaires"
            className="admin-export-card__button"
          >
            <Download size={16} />
            <span>Descargar CSV</span>
          </a>
        </div>
      </div>
    </section>
  );
}