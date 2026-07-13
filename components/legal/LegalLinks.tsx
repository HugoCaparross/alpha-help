"use client";

import { useState } from "react";

import LegalModal from "./LegalModal";

import PrivacyContent from "./PrivacyContent";
import CookiesContent from "./CookiesContent";
import LegalContent from "./LegalContent";

interface Props {
  className?: string;
}

export default function LegalLinks({ className = "" }: Props) {
  const [openPrivacy, setOpenPrivacy] = useState(false);

  const [openCookies, setOpenCookies] = useState(false);

  const [openLegal, setOpenLegal] = useState(false);

  return (
    <>
      <ul className="legal-links-list">
        <li>
          <button
            type="button"
            className={className}
            onClick={() => setOpenPrivacy(true)}
          >
            Política de Privacidad
          </button>
        </li>

        <li>
          <button
            type="button"
            className={className}
            onClick={() => setOpenCookies(true)}
          >
            Política de Cookies
          </button>
        </li>

        <li>
          <button
            type="button"
            className={className}
            onClick={() => setOpenLegal(true)}
          >
            Aviso Legal
          </button>
        </li>
      </ul>

      <LegalModal
        open={openPrivacy}
        title="Política de Privacidad"
        onClose={() => setOpenPrivacy(false)}
      >
        <PrivacyContent />
      </LegalModal>

      <LegalModal
        open={openCookies}
        title="Política de Cookies"
        onClose={() => setOpenCookies(false)}
      >
        <CookiesContent />
      </LegalModal>

      <LegalModal
        open={openLegal}
        title="Aviso Legal"
        onClose={() => setOpenLegal(false)}
      >
        <LegalContent />
      </LegalModal>
    </>
  );
}
