import QRCode from "qrcode";
import type { Person } from "@/lib/people";

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1440;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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
  const qrBox = 660;
  const scale = qrBox / Math.max(qrViewW || 41, qrViewH || 41);
  const nameLines = splitName(person.displayName);
  const safeUrl = escapeXml(profileUrl.replace("https://", ""));
  const safeRole = escapeXml(person.role);

  const nameText =
    nameLines.length === 1
      ? `<text x="96" y="270" fill="#F4F5F7" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="700" letter-spacing="-1.8">${escapeXml(nameLines[0])}</text>`
      : `
        <text x="96" y="242" fill="#F4F5F7" font-family="Arial, Helvetica, sans-serif" font-size="54" font-weight="700" letter-spacing="-1.6">${escapeXml(nameLines[0])}</text>
        <text x="96" y="304" fill="#F4F5F7" font-family="Arial, Helvetica, sans-serif" font-size="54" font-weight="700" letter-spacing="-1.6">${escapeXml(nameLines[1])}</text>
      `;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}">
  <defs>
    <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M 72 0 L 0 0 0 72" fill="none" stroke="#FFFFFF" stroke-opacity="0.035" stroke-width="1"/>
    </pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="24" stdDeviation="34" flood-color="#000000" flood-opacity="0.24"/>
    </filter>
  </defs>

  <rect width="1080" height="1440" fill="#111214"/>
  <rect width="1080" height="1440" fill="url(#grid)"/>
  <rect x="34" y="34" width="1012" height="1372" rx="42" fill="none" stroke="#FFFFFF" stroke-opacity="0.10"/>

  <g transform="translate(96 92)">
    <circle cx="7" cy="7" r="7" fill="#0867E8"/>
    <text x="28" y="15" fill="#F4F5F7" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" letter-spacing="-0.6">UpcyTech</text>
  </g>

  <text x="984" y="110" text-anchor="end" fill="#8C929A" font-family="Courier New, monospace" font-size="16" font-weight="700" letter-spacing="2.4">DIGITAL ID / ${escapeXml(person.slug.toUpperCase())}</text>

  ${nameText}
  <text x="96" y="${nameLines.length === 1 ? 314 : 350}" fill="#9EA4AD" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="400">${safeRole}</text>

  <g filter="url(#shadow)">
    <rect x="126" y="418" width="828" height="828" rx="44" fill="#FBFBFA"/>
  </g>
  <rect x="150" y="442" width="780" height="780" rx="32" fill="#FFFFFF" stroke="#E5E7EA" stroke-width="2"/>

  <g transform="translate(210 502) scale(${scale})">
    ${body}
  </g>

  <g transform="translate(96 1310)">
    <rect x="0" y="0" width="4" height="52" rx="2" fill="#0867E8"/>
    <text x="24" y="17" fill="#7F8791" font-family="Courier New, monospace" font-size="15" font-weight="700" letter-spacing="2">SCAN TO CONNECT</text>
    <text x="24" y="46" fill="#E1E4E8" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="500">${safeUrl}</text>
  </g>

  <text x="984" y="1360" text-anchor="end" fill="#686F79" font-family="Courier New, monospace" font-size="14" letter-spacing="1.5">UPCYTECH / IDENTITY SYSTEM</text>
</svg>`.trim();
}

export const brandedQrDimensions = {
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
};
