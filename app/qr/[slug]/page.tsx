import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { Icon } from "@/components/Icon";
import { company, getPerson, personSlugs } from "@/lib/people";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return personSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const person = getPerson(slug);

  return {
    title: person ? `${person.displayName} QR` : "QR bulunamadı",
    robots: { index: false, follow: false },
  };
}

export default async function QrDisplayPage({ params }: PageProps) {
  const { slug } = await params;
  const person = getPerson(slug);

  if (!person) notFound();

  return (
    <main className="qr-display-page">
      <div className="ambient-grid" aria-hidden="true" />

      <header className="qr-display-nav">
        <a className="brand-link" href={company.website} target="_blank" rel="noreferrer">
          <BrandLogo />
        </a>
        <a className="team-return" href={`/${person.slug}`}>
          Karta dön
          <Icon name="arrow" className="nav-arrow" />
        </a>
      </header>

      <section className="qr-display-stage" aria-label={`${person.displayName} QR kartı`}>
        <img
          src={`/api/qr/${person.slug}?format=svg`}
          alt={`${person.displayName} UpcyTech dijital kimlik QR kartı`}
          className="qr-display-card"
        />
      </section>

      <footer className="qr-display-actions">
        <span className="mono-label">1080 × 1440 / 3:4</span>
        <div>
          <a href={`/api/qr/${person.slug}?format=png&download=1`}>PNG indir</a>
          <a href={`/api/qr/${person.slug}?format=svg&download=1`}>SVG indir</a>
        </div>
      </footer>
    </main>
  );
}
