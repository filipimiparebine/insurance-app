import type { Metadata } from "next";
import { Sidebar } from "../components/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "blaj.io API Docs",
    template: "%s — blaj.io API Docs",
  },
  description:
    "blaj.io public API documentation. Create quotes, compare offers, and issue RCA policies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="docs-layout">
          <Sidebar />
          <main className="docs-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
