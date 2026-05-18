import type { Metadata } from "next";
import { PoliciesContent } from "./policies-content";

export const metadata: Metadata = { title: "Polițe" };

export default function PoliciesPage() {
  return <PoliciesContent />;
}
