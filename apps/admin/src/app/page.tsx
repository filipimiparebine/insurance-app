import type { Metadata } from "next";
import { DashboardContent } from "./dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard",
};
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return <DashboardContent />;
}
