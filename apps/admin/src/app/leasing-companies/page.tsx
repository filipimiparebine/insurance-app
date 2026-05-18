import type { Metadata } from "next";
import { LeasingCompaniesTable } from "./leasing-companies-table";

export const metadata: Metadata = { title: "Leasing Companies" };
export const dynamic = "force-dynamic";

export default function LeasingCompaniesPage() {
  return <LeasingCompaniesTable />;
}
