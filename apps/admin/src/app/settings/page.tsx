import type { Metadata } from "next";
import { SettingsContent } from "./settings-content";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return <SettingsContent />;
}
