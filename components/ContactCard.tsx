import { BrandLogo } from "@/components/BrandLogo";
import { Icon, type IconName } from "@/components/Icon";
import { ShareButton } from "@/components/ShareButton";
import { company, type Person } from "@/lib/people";
import { getProfileUrl } from "@/lib/site-url";

type Props = {
  person: Person;
};

type ContactAction = {
  label: string;
  detail: string;
  href: string;
  icon: IconName;
  meta?: string;
};

function normalizePhoneHref(phone: string): string {
  return phone.replace(/[^+\d]/g, "");
}

function socialMeta(kind: string): string {
  if (kind === "linkedin") return "Kişisel profil";
  if (kind === "instagram") return "Instagram";
  if (kind === "github") return "GitHub";
  return "Web";
}

function socialIcon(kind: string): IconName {
  if (kind === "linkedin") return "linkedin";
  if (kind === "instagram") return "instagram";
  if (kind === "github") return "github";
  return "globe";
}

export function ContactCard({ person }: Props) {
  const profileUrl = getProfileUrl(person.slug);
  const actions: ContactAction[] = [
    ...(person.phone
      ? [{
          label: "Telefon",
          detail: person.phone,
          href: `tel:${normalizePhoneHref(person.phone)}`,
          icon: "phone" as const,
          meta: "Ara",
        }]
      : []),
    ...(person.email
      ? [{
          label: "E-posta",
          detail: person.email,
          href: `mailto:${person.email}`,
          icon: "mail" as const,
          meta: "Yaz",
        }]
      : []),
    {
      label: "UpcyTech",
      detail: "upcytech.com",
      href: company.website,
      icon: "globe",
      meta: "Şirket",
    },
    {
      label: "LinkedIn",
      detail: "UpcyTech",
      href: company.linkedin,
      icon: "linkedin",
      meta: "Şirket",
    },
    ...(company.instagram
      ? [{
          label: "Instagram",
          detail: "UpcyTech",
          href: company.instagram,
          icon: "instagram" as const,
          meta: "Şirket",
        }]
      : []),
    ...(person.socials ?? []).map((social) => ({
      label: social.label,
      detail: social.kind === "github" ? social.url.replace("https://github.com/", "@") : socialMeta(social.kind),
      href: social.url,
      icon: socialIcon(social.kind),
      meta: social.kind === "linkedin" ? "Kişisel" : social.kind === "instagram" ? "Kişisel" : undefined,
    })),
  ];

  const showSetupNote =
    process.env.NODE_ENV !== "production" && (!person.phone || !person.email);

  return (
    <main className="profile-page">
      <div className="ambient-grid" aria-hidden="true" />

      <section className="identity-shell" aria-labelledby="person-name">
        <header className="identity-nav">
          <a className="brand-link" href={company.website} target="_blank" rel="noreferrer">
            <BrandLogo />
          </a>
          <div className="identity-nav-meta">
            <span className="mono-label">DIGITAL ID / {person.slug.toUpperCase()}</span>
            <a className="team-return" href="/">
              Ekip
              <Icon name="arrow" className="nav-arrow" />
            </a>
          </div>
        </header>

        <div className="hero-grid">
          <section className="identity-hero">
            <div className="identity-copy">
              <div className="identity-kicker">
                <span className="status-dot" />
                <span>{company.name}</span>
                <span className="kicker-separator">/</span>
                <span>{company.location}</span>
              </div>
              <h1 id="person-name">{person.displayName}</h1>
              <p className="identity-role">{person.role}</p>
              <p className="identity-summary">{person.summary}</p>
            </div>

            <div className="identity-actions">
              <a className="button button-primary" href={`/api/contact/${person.slug}`}>
                <Icon name="plus" className="button-svg" />
                Rehbere ekle
              </a>
              <ShareButton title={`${person.displayName} · ${company.name}`} url={profileUrl} />
            </div>

            <div className="protocol-row" aria-label="Kart özellikleri">
              <span>vCard 3.0</span>
              <span>iOS / Android</span>
              <span>Kalıcı QR</span>
            </div>
          </section>

          <aside className="dima-panel" aria-label="UpcyTech ana ürünü Dima">
            <div className="panel-topline">
              <span className="mono-label">MAIN PRODUCT</span>
              <span className="panel-index">01</span>
            </div>
            <div className="dima-wordmark" aria-label="dima">
              dima<span>.</span>
            </div>
            <p>
              Dima, optimizasyon ve karar masasıdır. Şirketin operasyonel beyni gibi
              çalışır; veriyi izler, denetler, sapmaları fark eder ve karar için raporlar.
            </p>
            <a href={company.website} target="_blank" rel="noreferrer" className="panel-link">
              UpcyTech&apos;i incele
              <Icon name="arrow" className="panel-link-icon" />
            </a>
          </aside>
        </div>

        {showSetupNote ? (
          <p className="setup-note">
            Geliştirme notu: telefon/e-posta eksik. Production&apos;da bu not gösterilmez.
          </p>
        ) : null}

        <section className="contact-section" aria-labelledby="contact-title">
          <div className="section-heading">
            <div>
              <span className="mono-label">CONTACT CHANNELS</span>
              <h2 id="contact-title">İletişim</h2>
            </div>
            <span className="section-count">{String(actions.length).padStart(2, "0")}</span>
          </div>

          <div className="contact-table">
            {actions.map((action, index) => {
              const external = action.href.startsWith("http");
              return (
                <a
                  className="contact-row"
                  href={action.href}
                  key={`${action.label}-${action.href}`}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                >
                  <span className="contact-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="contact-icon">
                    <Icon name={action.icon} />
                  </span>
                  <span className="contact-main">
                    <strong>{action.label}</strong>
                    <small>{action.detail}</small>
                  </span>
                  <span className="contact-meta">{action.meta ?? "Aç"}</span>
                  <Icon name="arrow" className="contact-arrow" />
                </a>
              );
            })}
          </div>
        </section>

        <section className="qr-module" aria-labelledby="qr-title">
          <div className="qr-copy">
            <div className="section-heading section-heading-inverse">
              <div>
                <span className="mono-label">STABLE ENDPOINT</span>
                <h2 id="qr-title">Tek QR, güncel kimlik.</h2>
              </div>
              <Icon name="qr" className="qr-heading-icon" />
            </div>
            <p>
              Bu QR kalıcı profil adresine bağlıdır. Telefon, e-posta veya sosyal hesaplar
              değişse de kodu yeniden basmanız gerekmez.
            </p>
            <div className="qr-actions">
              <a href={`/api/qr/${person.slug}?format=png&download=1`}>PNG</a>
              <a href={`/api/qr/${person.slug}?format=svg&download=1`}>SVG</a>
              <span>{profileUrl.replace("https://", "")}</span>
            </div>
          </div>

          <div className="qr-object">
            <img
              src={`/api/qr/${person.slug}?format=svg`}
              alt={`${person.displayName} dijital kart QR kodu`}
            />
            <div className="qr-object-footer">
              <span>{person.initials}</span>
              <span>UPCYTECH ID</span>
            </div>
          </div>
        </section>

        <footer className="identity-footer">
          <span>UpcyTech / Digital Identity System</span>
          <span className="footer-rule" />
          <a href={company.website} target="_blank" rel="noreferrer">
            upcytech.com
          </a>
        </footer>
      </section>
    </main>
  );
}
