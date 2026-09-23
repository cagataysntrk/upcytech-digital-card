import { NextResponse } from "next/server";
import { getPerson } from "@/lib/people";
import { buildVCard } from "@/lib/vcard";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

function safeFilename(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const person = getPerson(slug);

  if (!person) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  const vcard = buildVCard(person);
  const filename = `${safeFilename(person.displayName) || person.slug}.vcf`;

  return new NextResponse(vcard, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
