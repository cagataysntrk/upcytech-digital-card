export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return "https://card.upcytech.com";
  return configured.replace(/\/$/, "");
}

export function getProfileUrl(slug: string): string {
  return `${getSiteUrl()}/${encodeURIComponent(slug)}`;
}
