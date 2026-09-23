import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export default function NotFound() {
  return (
    <main className="directory-page">
      <div className="ambient-grid" aria-hidden="true" />
      <section className="empty-state">
        <BrandLogo />
        <p className="mono-label">ERROR / 404</p>
        <h1>Kart bulunamadı.</h1>
        <p>Bağlantıyı kontrol edin veya UpcyTech ekip dizinine geri dönün.</p>
        <Link className="button button-primary" href="/">Ekip kartları</Link>
      </section>
    </main>
  );
}
