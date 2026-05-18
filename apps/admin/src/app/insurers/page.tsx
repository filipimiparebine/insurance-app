import type { Metadata } from "next";
import { InsurersTable } from "./insurers-table";

export const metadata: Metadata = { title: "Insurers" };
export const dynamic = "force-dynamic";

export default function InsurersPage() {
  return <InsurersTable />;
}
