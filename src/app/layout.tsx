import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prisma Financeiro",
  description: "Clareza financeira para pessoas e familias.",
  manifest: "/manifest.json",
  icons: {
    icon: "/assets/icon.svg",
    apple: "/assets/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#2D2B6B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
