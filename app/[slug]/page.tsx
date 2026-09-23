import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactCard } from "@/components/ContactCard";
import { company, getPerson, personSlugs } from "@/lib/people";
import { getProfileUrl } from "@/lib/site-url";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return personSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const person = getPerson(slug);

  if (!person) return { title: "Kart bulunamadı" };

  return {
    title: person.displayName,
    description: `${person.displayName} — ${person.role}, ${company.name}.`,
    alternates: { canonical: getProfileUrl(slug) },
    robots: { index: false, follow: false },
    openGraph: {
      title: `${person.displayName} · ${company.name}`,
      description: person.role,
      type: "profile",
      url: getProfileUrl(slug),
      siteName: company.name,
    },
  };
}

export default async function PersonPage({ params }: PageProps) {
  const { slug } = await params;
  const person = getPerson(slug);

  if (!person) notFound();

  return <ContactCard person={person} />;
}
