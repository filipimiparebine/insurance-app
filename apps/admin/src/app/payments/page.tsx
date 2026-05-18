import type { Metadata } from "next";
import { PaymentsContent } from "./payments-content";

export const metadata: Metadata = { title: "Plăți" };
export const dynamic = "force-dynamic";

export default function PaymentsPage() {
  return <PaymentsContent />;
}
