import { BrandLogo } from "@/components/BrandLogo";
import { ShareButton } from "@/components/ShareButton";
import { company, type Person } from "@/lib/people";
import { getProfileUrl } from "@/lib/site-url";

type Props = {
  person: Person;
};

function normalizePhoneHref(phone: string): string {
  return phone.replace(/[^+\d]/g, "");
}

export function ContactCard({ person }: Props) {
  const profileUrl = getProfileUrl(person.slug);
  const actions = [
    person.phone
      ? { label: "Ara", detail: person.phone, href: `tel:${normalizePhoneHref(person.phone)}`, icon: "☎" }
      : null,
    person.email
      ? { label: "E-posta", detail: person.email, href: `mailto:${person.email}`, icon: "✉" }
      : null,
    { label: "UpcyTech", detail: "Web sitesi", href: company.website, icon: "↗" },
    { label: "LinkedIn", detail: "UpcyTech", href: company.linkedin, icon: "in" },
    company.instagram
      ? { label: "Instagram", detail: "UpcyTech", href: company.instagram, icon: "◎" }
      : null,
    ...(person.socials ?? []).map((social) => ({
      label: social.label,
      detail:
        social.kind === "instagram"
          ? "Instagram"
          : social.kind === "linkedin"
            ? "Kişisel profil"
            : social.kind === "github"
              ? "GitHub"
              : "Web",
      href: social.url,
      icon: social.kind === "linkedin" ? "in" : social.kind === "instagram" ? "◎" : social.kind === "github" ? "⌘" : "↗",
    })),
  ].filter(Boolean) as Array<{ label: string; detail: string; href: string; icon: string }>;

  const showSetupNote =
    process.env.NODE_ENV !== "production" && (!person.phone || !person.email);

  return (
    <main className="page-shell">
      <section className="contact-card" aria-labelledby="person-name">
        <header className="brand-row">
          <BrandLogo />
          <span className="verified-pill">
            <span className="verified-dot" />
            Dijital Kart
          </span>
        </header>

        <div className="identity-block">
          <div className="avatar" aria-hidden="true">
            <span>{person.initials}</span>
          </div>

          <div className="identity-copy">
            <p className="eyebrow">{company.name}</p>
            <h1 id="person-name">{person.displayName}</h1>
            <p className="role">{person.role}</p>
            <p className="summary">{person.summary}</p>
          </div>
        </div>

        <div className="primary-actions">
          <a className="primary-button" href={`/api/contact/${person.slug}`}>
            <span className="button-icon" aria-hidden="true">＋</span>
            Rehbere Ekle
          </a>
          <ShareButton title={`${person.displayName} · ${company.name}`} url={profileUrl} />
        </div>

        <div className="action-grid" aria-label="İletişim bağlantıları">
          {actions.map((action) => {
            const external = action.href.startsWith("http");
            return (
              <a
                className="action-card"
                href={action.href}
                key={`${action.label}-${action.href}`}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
              >
                <span className="action-icon" aria-hidden="true">{action.icon}</span>
                <span>
                  <strong>{action.label}</strong>
                  <small>{action.detail}</small>
                </span>
              </a>
            );
          })}
        </div>

        {showSetupNote ? (
          <p className="setup-note">
            Geliştirme notu: telefon/e-posta eksik. Production'da bu not gösterilmez.
          </p>
        ) : null}

        <section className="qr-section" aria-labelledby="qr-title">
          <div>
            <p className="eyebrow">Paylaşılabilir QR</p>
            <h2 id="qr-title">Bu kartı başka bir telefonda aç</h2>
            <p>
              QR sabit profil adresine gider. İletişim bilgileri değişse bile QR kodunu yeniden basmanız gerekmez.
            </p>
            <div className="download-row">
              <a href={`/api/qr/${person.slug}?format=png&download=1`}>PNG indir</a>
              <a href={`/api/qr/${person.slug}?format=svg&download=1`}>SVG indir</a>
            </div>
          </div>

          <div className="qr-frame">
            <img src={`/api/qr/${person.slug}?format=svg`} alt={`${person.displayName} dijital kart QR kodu`} />
            <span>{company.name}</span>
          </div>
        </section>

        <footer className="card-footer">
          <span>{company.location}</span>
          <span className="footer-separator">•</span>
          <a href={company.website} target="_blank" rel="noreferrer">upcytech.com</a>
        </footer>
      </section>
    </main>
  );
}
