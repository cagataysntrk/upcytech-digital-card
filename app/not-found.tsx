import Link from "next/link";

export default function NotFound() {
  return (
    <main className="directory-shell">
      <section className="empty-state">
        <img src="/upcytech-logo.svg" alt="UpcyTech" className="brand-logo" />
        <p className="eyebrow">404</p>
        <h1>Kart bulunamadı.</h1>
        <p>Bağlantıyı kontrol edin veya ekip kartlarına geri dönün.</p>
        <Link className="primary-button" href="/">Ekip kartları</Link>
      </section>
    </main>
  );
}
