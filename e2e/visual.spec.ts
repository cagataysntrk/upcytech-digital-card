import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";

const output = "visual-artifacts";

test.beforeAll(() => {
  mkdirSync(output, { recursive: true });
});

test("directory is responsive and visually stable", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Kurucu ekibin dijital kimlikleri." })).toBeVisible();
  await expect(page.locator(".brand-wordmark")).toHaveText("UpcyTech");
  await expect(page.locator(".team-monogram")).toHaveCount(0);
  await expect(page.getByText("Dima, optimizasyon ve karar masasıdır.", { exact: false })).toBeVisible();

  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  const viewport = page.viewportSize();
  expect(width).toBeLessThanOrEqual(viewport?.width ?? width);

  await page.screenshot({
    path: `${output}/directory-${testInfo.project.name}.png`,
    fullPage: true,
  });
});

test("profile keeps identity, actions, contact list and QR in one coherent flow", async ({ page }, testInfo) => {
  await page.goto("/cagatay");

  await expect(page.getByRole("heading", { name: "Cevat Çağatay Şentürk" })).toBeVisible();
  await expect(page.locator(".brand-wordmark")).toHaveText("UpcyTech");
  await expect(page.locator(".identity-node")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Rehbere ekle/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "İletişim" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tek QR, güncel kimlik." })).toBeVisible();
  await expect(page.getByText("Şirketin otonom beyni", { exact: false })).toBeVisible();

  const overflow = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  expect(overflow.scroll).toBeLessThanOrEqual(overflow.client);

  const vcardResponse = await page.request.get("/api/contact/cagatay");
  expect(vcardResponse.ok()).toBeTruthy();
  const vcard = await vcardResponse.text();
  expect(vcard).toContain("FN:Cevat Çağatay Şentürk");
  expect(vcard).toContain("ORG:UpcyTech");
  expect(vcard).toContain("TEL;TYPE=CELL:");
  expect(vcard).toContain("EMAIL;TYPE=INTERNET,WORK:");
  expect(vcard).not.toContain("TITLE:");
  expect(vcard).not.toContain("ADR;");
  expect(vcard).not.toContain("URL;");
  expect(vcard).not.toContain("X-SOCIALPROFILE");
  expect(vcard).not.toContain("NOTE:");

  await page.screenshot({
    path: `${output}/profile-${testInfo.project.name}.png`,
    fullPage: true,
  });
});


test("branded QR card is screen-ready and downloadable", async ({ page }, testInfo) => {
  await page.goto("/qr/cagatay");

  await expect(page.locator(".qr-display-card")).toBeVisible();

  const svgResponse = await page.request.get("/api/qr/cagatay?format=svg");
  expect(svgResponse.ok()).toBeTruthy();
  const svg = await svgResponse.text();
  expect(svg).toContain('width="1080"');
  expect(svg).toContain('height="1440"');
  expect(svg).toContain("SCAN TO CONNECT");
  expect(svg).toContain("card.upcytech.com/cagatay");

  const pngResponse = await page.request.get("/api/qr/cagatay?format=png");
  expect(pngResponse.ok()).toBeTruthy();
  expect(pngResponse.headers()["content-type"]).toContain("image/png");
  expect((await pngResponse.body()).byteLength).toBeGreaterThan(40_000);

  const overflow = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  expect(overflow.scroll).toBeLessThanOrEqual(overflow.client);

  await page.screenshot({
    path: `${output}/qr-card-${testInfo.project.name}.png`,
    fullPage: true,
  });
});
