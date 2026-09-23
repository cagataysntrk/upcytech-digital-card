import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export default function NotFound() {
  return (
    <main className="directory-shell">
      <section className="empty-state">
        <BrandLogo />
        <p className="eyebrow">404</p>
        <h1>Kart bulunamadı.</h1>
        <p>Bağlantıyı kontrol edin veya ekip kartlarına geri dönün.</p>
        <Link className="primary-button" href="/">Ekip kartları</Link>
      </section>
    </main>
  );
}
