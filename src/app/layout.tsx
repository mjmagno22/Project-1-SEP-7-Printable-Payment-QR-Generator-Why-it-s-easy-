import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SEP-7 QR — Printable Stellar Payment QR Codes",
  description:
    "Generate printable SEP-7 QR codes for Stellar payments. Perfect for newspapers, posters, church bulletins, and any static print media.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-dvh flex flex-col bg-[var(--background)]">{children}</body>
    </html>
  );
}
