import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { getPerson } from "@/lib/people";
import { getProfileUrl } from "@/lib/site-url";
import {
  buildBrandedQrSvg,
  buildRawQrPng,
  buildRawQrSvg,
} from "@/lib/qr-card";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { slug } = await params;
  const person = getPerson(slug);

  if (!person) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  const format = request.nextUrl.searchParams.get("format") === "png" ? "png" : "svg";
  const download = request.nextUrl.searchParams.get("download") === "1";
  const variant = request.nextUrl.searchParams.get("variant") === "raw" ? "raw" : "card";
  const profileUrl = getProfileUrl(person.slug);
  const suffix = variant === "raw" ? "qr" : "digital-id";
  const filename = `upcytech-${person.slug}-${suffix}.${format}`;

  if (format === "png") {
    const buffer =
      variant === "raw"
        ? await buildRawQrPng(profileUrl)
        : await sharp(Buffer.from(await buildBrandedQrSvg(person, profileUrl)))
            .png()
            .toBuffer();

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  const svg =
    variant === "raw"
      ? await buildRawQrSvg(profileUrl)
      : await buildBrandedQrSvg(person, profileUrl);

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
