import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer-simple">
      <div className="container-custom footer-simple__content">
        <div className="footer-simple__left">
          <Image
            src="/images/unir.svg"
            alt="UNIR"
            width={140}
            height={40}
          />
        </div>

        <div className="footer-simple__right">
          <p>© 2026 ALPHA-HELP</p>
          <span>Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  );
}