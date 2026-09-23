import { company, type Person } from "@/lib/people";
import { getProfileUrl } from "@/lib/site-url";

function esc(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

export function buildVCard(person: Person): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(person.familyName)};${esc(person.givenName)};;;`,
    `FN:${esc(person.displayName)}`,
    `ORG:${esc(company.name)}`,
    `TITLE:${esc(person.role)}`,
  ];

  if (person.phone) lines.push(`TEL;TYPE=CELL:${esc(person.phone)}`);
  if (person.email) lines.push(`EMAIL;TYPE=INTERNET,WORK:${esc(person.email)}`);

  lines.push(
    `URL;TYPE=WORK:${company.website}`,
    `URL;TYPE=HOME:${getProfileUrl(person.slug)}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${company.linkedin}`,
  );

  for (const social of person.socials ?? []) {
    lines.push(`X-SOCIALPROFILE;TYPE=${social.kind}:${social.url}`);
  }

  lines.push(
    `NOTE:${esc(`${person.role} · ${company.name}`)}`,
    "END:VCARD",
  );

  return lines.join("\r\n") + "\r\n";
}
