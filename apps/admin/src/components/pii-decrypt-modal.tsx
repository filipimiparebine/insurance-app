"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Eye, EyeOff, Shield, Clock, Loader2 } from "lucide-react";
import { Button } from "@blaj/ui";
import { cn } from "@/lib/utils";
import { orpc } from "@/lib/orpc-client";

const AUTO_WIPE_MS = 60_000;

async function adminDecrypt(recordId: string, fieldName: string, reason: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (orpc as any).admin?.users?.decryptPii?.mutate({
    recordId,
    field: fieldName,
    reason,
  });

  if (!result || !result.value) {
    return { success: false, decryptedValue: "" };
  }

  return { success: true, decryptedValue: result.value };
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  fieldLabel: string;
  fieldName: string;
  maskedValue: string;
}

export function PiiDecryptModal({ open, onOpenChange, userId, fieldLabel, fieldName, maskedValue }: Props) {
  const [reason, setReason] = useState("");
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wipeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timeLeft, setTimeLeft] = useState(AUTO_WIPE_MS / 1000);

  const wipe = useCallback(() => {
    setValue(null); setRevealed(false); setTimeLeft(AUTO_WIPE_MS / 1000);
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (wipeRef.current) { clearInterval(wipeRef.current); wipeRef.current = null; }
  }, []);

  useEffect(() => {
    if (!open) { wipe(); setReason(""); setError(null); }
    else { setValue(null); setRevealed(false); setError(null); setTimeLeft(AUTO_WIPE_MS / 1000); }
  }, [open, wipe]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); if (wipeRef.current) clearInterval(wipeRef.current); }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (wipeRef.current) clearInterval(wipeRef.current);
    setTimeLeft(AUTO_WIPE_MS / 1000);
    wipeRef.current = setInterval(() => setTimeLeft((p) => { if (p <= 1) { if (wipeRef.current) clearInterval(wipeRef.current); return 0; } return p - 1; }), 1000);
    timerRef.current = setTimeout(() => wipe(), AUTO_WIPE_MS);
  }, [wipe]);

  const decrypt = async () => {
    if (!reason.trim()) { setError("Reason is required."); return; }
    setLoading(true); setError(null);
    try {
      const r = await adminDecrypt(userId, fieldName, reason.trim());
      if (r.success) { setValue(r.decryptedValue); setRevealed(true); startTimer(); }
      else setError("Decryption failed.");
    } catch { setError("Unexpected error."); }
    finally { setLoading(false); }
  };

  const close = () => { wipe(); setReason(""); setError(null); onOpenChange(false); };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={close} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-neutral-200 bg-white p-8 shadow-2xl">
        <button onClick={close} className="absolute right-4 top-4 rounded-sm opacity-60 hover:opacity-100"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
        <div className="flex flex-col gap-1.5 mb-6"><h2 className="font-display font-semibold text-lg">Decrypt PII</h2><p className="text-sm text-text-secondary">Temporarily view {fieldLabel}.</p></div>
        <div className="space-y-5">
          <div className="space-y-1.5"><label className="text-sm text-text-secondary">Field</label><div className="flex items-center gap-2 px-3 py-2.5 bg-neutral-50 border rounded-md"><Shield className="h-4 w-4 text-text-tertiary shrink-0" /><span className="text-sm font-mono">{fieldLabel}</span></div></div>
          <div className="space-y-1.5"><label className="text-sm text-text-secondary">Masked Value</label><div className="flex items-center gap-2 px-3 py-2.5 bg-neutral-50 border rounded-md"><span className="text-sm font-mono">{maskedValue}</span></div></div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Reason <span className="text-danger">*</span></label>
            <textarea rows={3} placeholder="Explain why you need to view this PII..." value={reason} onChange={(e) => { setReason(e.target.value); if (error) setError(null); }} disabled={!!value}
              className={cn("flex w-full rounded-md border bg-white px-4 py-3 text-sm placeholder:text-text-tertiary transition-colors hover:border-neutral-400 focus:border-electric focus:outline-none disabled:opacity-50", error ? "border-danger" : "border-neutral-300")} />
            {error && <p className="text-sm text-danger">{error}</p>}
          </div>
          {value && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between"><label className="text-sm text-text-secondary">Decrypted</label><button onClick={() => setRevealed((p) => !p)} className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary">{revealed ? <><EyeOff className="h-3.5 w-3.5" /> Hide</> : <><Eye className="h-3.5 w-3.5" /> Reveal</>}</button></div>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-success-soft border border-success/20 rounded-md"><Shield className="h-4 w-4 text-success shrink-0" /><span className="text-sm font-mono font-medium text-success">{revealed ? value : "••••••••••••"}</span></div>
              <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-warning" /><span className="text-xs text-warning">Auto-wipes in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span></div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-8">
          {!value ? <Button onClick={decrypt} disabled={loading || !reason.trim()} variant="primary" size="md">{loading && <Loader2 className="h-4 w-4 animate-spin" />}{loading ? "Decrypting..." : "Decrypt & View"}</Button>
            : <Button onClick={wipe} variant="secondary" size="md">Wipe Now</Button>}
        </div>
      </div>
    </div>
  );
}
