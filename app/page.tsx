import Link from "next/link";
import { company, listPeople } from "@/lib/people";

export default function Home() {
  return (
    <main className="directory-shell">
      <section className="directory-panel">
        <header className="brand-row">
          <img src="/upcytech-logo.svg" alt="UpcyTech" className="brand-logo" />
          <span className="verified-pill">
            <span className="verified-dot" />
            Ekip
          </span>
        </header>

        <div className="directory-copy">
          <p className="eyebrow">Dijital iletişim kartları</p>
          <h1>UpcyTech ekibi</h1>
          <p>
            Bir kişiyi seçin, iletişim bilgilerini görüntüleyin veya tek dokunuşla rehberinize ekleyin.
          </p>
        </div>

        <div className="people-list">
          {listPeople().map((person) => (
            <Link className="person-row" href={`/${person.slug}`} key={person.slug}>
              <span className="mini-avatar">{person.initials}</span>
              <span className="person-row-copy">
                <strong>{person.displayName}</strong>
                <small>{person.role}</small>
              </span>
              <span className="row-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>

        <footer className="directory-footer">
          <a href={company.website} target="_blank" rel="noreferrer">upcytech.com</a>
        </footer>
      </section>
    </main>
  );
}
