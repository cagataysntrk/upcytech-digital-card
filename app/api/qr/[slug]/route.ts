import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { getPerson } from "@/lib/people";
import { getProfileUrl } from "@/lib/site-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

const qrOptions = {
  errorCorrectionLevel: "H" as const,
  margin: 4,
  width: 1200,
  color: {
    dark: "#07111f",
    light: "#ffffff",
  },
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { slug } = await params;
  const person = getPerson(slug);

  if (!person) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  const format = request.nextUrl.searchParams.get("format") === "png" ? "png" : "svg";
  const download = request.nextUrl.searchParams.get("download") === "1";
  const profileUrl = getProfileUrl(person.slug);
  const filename = `upcytech-${person.slug}-qr.${format}`;

  if (format === "png") {
    const buffer = await QRCode.toBuffer(profileUrl, {
      ...qrOptions,
      type: "png",
    });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  const svg = await QRCode.toString(profileUrl, {
    ...qrOptions,
    type: "svg",
  });

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
