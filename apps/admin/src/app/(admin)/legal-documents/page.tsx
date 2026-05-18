import type { Metadata } from "next";
import { LegalDocumentsContent } from "./legal-documents-content";

export const metadata: Metadata = { title: "Legal Documents" };
export const dynamic = "force-dynamic";
export default function LegalDocumentsPage() {
  return <LegalDocumentsContent />;
}
