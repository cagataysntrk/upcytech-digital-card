import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Icon } from "@/components/Icon";
import { company, listPeople } from "@/lib/people";

export default function Home() {
  const people = listPeople();

  return (
    <main className="directory-page">
      <div className="ambient-grid" aria-hidden="true" />

      <section className="directory-shell">
        <header className="identity-nav">
          <a className="brand-link" href={company.website} target="_blank" rel="noreferrer">
            <BrandLogo />
          </a>
          <div className="identity-nav-meta">
            <span className="mono-label">TEAM DIRECTORY / {String(people.length).padStart(2, "0")}</span>
            <a className="team-return" href={company.website} target="_blank" rel="noreferrer">
              UpcyTech
              <Icon name="arrow" className="nav-arrow" />
            </a>
          </div>
        </header>

        <section className="directory-hero">
          <div className="directory-intro">
            <div className="identity-kicker">
              <span className="status-dot" />
              <span>UPCYTECH</span>
              <span className="kicker-separator">/</span>
              <span>FOUNDING TEAM</span>
            </div>
            <h1>Kurucu ekibin dijital kimlikleri.</h1>
            <p>
              İletişim bilgileri, doğrulanmış sosyal profiller ve tek dokunuşla rehbere
              ekleme. Her kişinin QR kodu kalıcı bir profil adresine bağlıdır.
            </p>
          </div>

          <aside className="directory-product">
            <div className="panel-topline">
              <span className="mono-label">WHAT WE BUILD</span>
              <span className="panel-index">D / 01</span>
            </div>
            <div className="dima-wordmark">dima<span>.</span></div>
            <p>
              Optimizasyon ve karar masası. Şirketin operasyonel beyni gibi çalışır;
              izler, denetler, fark eder ve karar için raporlar.
            </p>
          </aside>
        </section>

        <section className="team-section" aria-labelledby="team-title">
          <div className="section-heading">
            <div>
              <span className="mono-label">PEOPLE</span>
              <h2 id="team-title">Ekip</h2>
            </div>
            <span className="section-count">{String(people.length).padStart(2, "0")}</span>
          </div>

          <div className="team-table">
            {people.map((person, index) => (
              <Link className="team-row" href={`/${person.slug}`} key={person.slug}>
                <span className="team-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="team-person">
                  <strong>{person.displayName}</strong>
                  <small>{person.role}</small>
                </span>
                <span className="team-open">Kartı aç</span>
                <Icon name="arrow" className="team-arrow" />
              </Link>
            ))}
          </div>
        </section>

        <footer className="identity-footer">
          <span>Operational software · Auditable AI · Decision intelligence</span>
          <span className="footer-rule" />
          <a href={company.website} target="_blank" rel="noreferrer">
            upcytech.com
          </a>
        </footer>
      </section>
    </main>
  );
}
