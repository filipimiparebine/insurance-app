import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "blaj.io — Asigurari fara labirint",
  description:
    "Compara 9 asiguratori RCA in 3 minute. Platesti cu Apple Pay sau card. Polita ajunge instant pe email.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
