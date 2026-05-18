import type { Metadata } from "next";
import { AuditLogContent } from "./audit-log-content";

export const metadata: Metadata = { title: "Audit Log" };
export const dynamic = "force-dynamic";
export default function AuditLogPage() {
  return <AuditLogContent />;
}
