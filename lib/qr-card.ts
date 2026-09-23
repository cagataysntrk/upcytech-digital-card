import { readFileSync } from "node:fs";
import { join } from "node:path";
import QRCode from "qrcode";
import type { Person } from "@/lib/people";

const TextToSVG = require("text-to-svg");
const textToSvg = TextToSVG.loadSync(
  join(process.cwd(), "node_modules", "text-to-svg", "fonts", "ipag.ttf"),
);

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1920;

type Anchor =
  | "left top"
  | "left middle"
  | "left baseline"
  | "center top"
  | "center middle"
  | "right top"
  | "right middle";

function pathText(
  text: string,
  x: number,
  y: number,
  fontSize: number,
  fill: string,
  anchor: Anchor = "left top",
  letterSpacing = 0,
): string {
  // IPA Gothic handles most Turkish Latin glyphs well, but its ğ/Ğ outline
  // is not reliable in our server-side SVG pipeline. Compose those two
  // characters from g/G + a vector breve so exports stay font-independent.
  if ((text.includes("ğ") || text.includes("Ğ")) && anchor === "left top") {
    let cursor = x;
    const parts: string[] = [];

    for (const char of text) {
      const base = char === "ğ" ? "g" : char === "Ğ" ? "G" : char;
      parts.push(
        textToSvg.getPath(base, {
          x: cursor,
          y,
          fontSize,
          anchor: "left top",
          letterSpacing,
          attributes: { fill },
        }),
      );

      const width = textWidth(base, fontSize, letterSpacing);
      if (char === "ğ" || char === "Ğ") {
        const cx = cursor + width * 0.5;
        const breveWidth = Math.max(12, fontSize * 0.24);
        const breveY = y + Math.max(1, fontSize * 0.025);
        parts.push(
          `<path d="M ${(cx - breveWidth).toFixed(2)} ${breveY.toFixed(2)} Q ${cx.toFixed(2)} ${(breveY + fontSize * 0.12).toFixed(2)} ${(cx + breveWidth).toFixed(2)} ${breveY.toFixed(2)}" fill="none" stroke="${fill}" stroke-width="${Math.max(3, fontSize * 0.055).toFixed(2)}" stroke-linecap="round"/>`,
        );
      }

      cursor += width;
    }

    return parts.join("");
  }

  return textToSvg.getPath(text, {
    x,
    y,
    fontSize,
    anchor,
    letterSpacing,
    attributes: { fill },
  });
}

function textWidth(text: string, fontSize: number, letterSpacing = 0): number {
  return textToSvg.getMetrics(text, {
    fontSize,
    letterSpacing,
    anchor: "left top",
  }).width;
}

function fitFontSize(
  text: string,
  maxWidth: number,
  preferred: number,
  minimum: number,
  letterSpacing = 0,
): number {
  let size = preferred;
  while (size > minimum && textWidth(text, size, letterSpacing) > maxWidth) {
    size -= 1;
  }
  return size;
}

function officialMarkDataUri(): string {
  const mark = readFileSync(
    join(process.cwd(), "public", "upcytech-mark-official.png"),
  );
  return `data:image/png;base64,${mark.toString("base64")}`;
}

function extractQrSvg(svg: string): { viewBox: string; body: string } {
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 41 41";
  const body = svg
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "");
  return { viewBox, body };
}

function splitName(name: string): string[] {
  const words = name.trim().split(/\s+/);
  if (name.length <= 24 || words.length < 3) return [name];

  let bestIndex = 1;
  let bestDiff = Number.POSITIVE_INFINITY;
  for (let i = 1; i < words.length; i += 1) {
    const left = words.slice(0, i).join(" ");
    const right = words.slice(i).join(" ");
    const diff = Math.abs(left.length - right.length);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = i;
    }
  }

  return [words.slice(0, bestIndex).join(" "), words.slice(bestIndex).join(" ")];
}

export async function buildRawQrSvg(profileUrl: string): Promise<string> {
  return QRCode.toString(profileUrl, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 4,
    color: {
      dark: "#111316",
      light: "#ffffff",
    },
  });
}

export async function buildRawQrPng(profileUrl: string): Promise<Buffer> {
  return QRCode.toBuffer(profileUrl, {
    type: "png",
    errorCorrectionLevel: "H",
    margin: 4,
    width: 1200,
    color: {
      dark: "#111316",
      light: "#ffffff",
    },
  });
}

export async function buildBrandedQrSvg(
  person: Person,
  profileUrl: string,
): Promise<string> {
  const raw = await buildRawQrSvg(profileUrl);
  const { viewBox, body } = extractQrSvg(raw);
  const [, , qrViewW, qrViewH] = viewBox.split(/\s+/).map(Number);
  const qrBox = 690;
  const scale = qrBox / Math.max(qrViewW || 41, qrViewH || 41);
  const nameLines = splitName(person.displayName);
  const profileLabel = profileUrl.replace("https://", "");
  const mark = officialMarkDataUri();

  const wordmark = pathText("UpcyTech", 144, 86, 34, "#F4F5F7", "left top", -0.025);
  const idLabel = pathText(
    `DIGITAL ID / ${person.slug.toUpperCase()}`,
    984,
    90,
    16,
    "#858C95",
    "right top",
    0.12,
  );

  const identityLabel = pathText(
    "UPCYTECH / DIGITAL IDENTITY",
    96,
    214,
    16,
    "#737B86",
    "left top",
    0.11,
  );

  const namePaths = nameLines
    .map((line, index) => {
      const size = fitFontSize(line, 888, nameLines.length === 1 ? 70 : 61, 44, -0.025);
      return pathText(
        line,
        96,
        nameLines.length === 1 ? 258 : 252 + index * 72,
        size,
        "#F4F5F7",
        "left top",
        -0.025,
      );
    })
    .join("\n");

  const roleY = nameLines.length === 1 ? 348 : 404;
  const roleSize = fitFontSize(person.role, 840, 25, 19);
  const rolePath = pathText(person.role, 96, roleY, roleSize, "#A0A6AE");

  const scanLabel = pathText(
    "SCAN TO CONNECT",
    126,
    1524,
    17,
    "#838B95",
    "left top",
    0.11,
  );
  const urlSize = fitFontSize(profileLabel, 690, 25, 19, -0.01);
  const urlPath = pathText(
    profileLabel,
    126,
    1572,
    urlSize,
    "#F0F2F5",
    "left top",
    -0.01,
  );

  const footerLeft = pathText(
    "UPCYTECH / DIGITAL IDENTITY SYSTEM",
    96,
    1784,
    14,
    "#636B75",
    "left top",
    0.09,
  );
  const footerRight = pathText(
    "CARD.UPCYTECH.COM",
    984,
    1784,
    14,
    "#636B75",
    "right top",
    0.09,
  );

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}">
  <defs>
    <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M 72 0 L 0 0 0 72" fill="none" stroke="#FFFFFF" stroke-opacity="0.032" stroke-width="1"/>
    </pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="24" stdDeviation="34" flood-color="#000000" flood-opacity="0.24"/>
    </filter>
  </defs>

  <rect width="1080" height="1920" fill="#111214"/>
  <rect width="1080" height="1920" fill="url(#grid)"/>
  <rect x="34" y="34" width="1012" height="1852" rx="44" fill="none" stroke="#FFFFFF" stroke-opacity="0.10"/>

  <g>
    <image href="${mark}" x="96" y="77" width="34" height="34" preserveAspectRatio="xMidYMid meet"/>
    ${wordmark}
    ${idLabel}
  </g>

  <line x1="96" y1="160" x2="984" y2="160" stroke="#FFFFFF" stroke-opacity="0.09"/>

  ${identityLabel}
  ${namePaths}
  ${rolePath}

  <g filter="url(#shadow)">
    <rect x="100" y="500" width="880" height="880" rx="46" fill="#FAFAF9"/>
  </g>
  <rect x="122" y="522" width="836" height="836" rx="34" fill="#FFFFFF" stroke="#E4E7EA" stroke-width="2"/>

  <g transform="translate(195 595) scale(${scale})">
    ${body}
  </g>

  <g>
    <rect x="96" y="1468" width="888" height="174" rx="26" fill="#FFFFFF" fill-opacity="0.028" stroke="#FFFFFF" stroke-opacity="0.09"/>
    <rect x="96" y="1468" width="5" height="174" rx="2.5" fill="#0867E8"/>
    ${scanLabel}
    ${urlPath}
    <circle cx="930" cy="1555" r="22" fill="#0867E8" fill-opacity="0.13"/>
    <circle cx="930" cy="1555" r="6" fill="#0867E8"/>
  </g>

  <line x1="96" y1="1742" x2="984" y2="1742" stroke="#FFFFFF" stroke-opacity="0.08"/>
  ${footerLeft}
  ${footerRight}
</svg>`.trim();
}

export const brandedQrDimensions = {
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
};
