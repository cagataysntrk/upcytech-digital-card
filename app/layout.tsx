import type { Metadata, Viewport } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "UpcyTech · Dijital Kart",
    template: "%s · UpcyTech",
  },
  description: "UpcyTech dijital iletişim kartı.",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/upcytech-mark.svg",
    apple: "/upcytech-mark.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f9fd" },
    { media: "(prefers-color-scheme: dark)", color: "#07101c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
