import type { Metadata } from "next";
import { CancellationsContent } from "./cancellations-content";

export const metadata: Metadata = { title: "Cancellation Queue" };
export const dynamic = "force-dynamic";
export default function CancellationsPage() {
  return <CancellationsContent />;
}
