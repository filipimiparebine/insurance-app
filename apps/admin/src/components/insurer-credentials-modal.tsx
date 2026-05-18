"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Eye, EyeOff, Shield, Clock, Key, Loader2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { orpc } from "@/lib/orpc-client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const AUTO_WIPE_MS = 60_000;

type Mode = "store" | "rotate" | "decrypt";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insurerCode: string;
  insurerName: string;
  hasCredentials: boolean;
}

export function InsurerCredentialsModal({
  open,
  onOpenChange,
  insurerCode,
  insurerName,
  hasCredentials,
}: Props) {
  const [mode, setMode] = useState<Mode>(hasCredentials ? "decrypt" : "store");
  const [reason, setReason] = useState("");
  const [credentials, setCredentials] = useState("");
  const [decrypted, setDecrypted] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wipeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timeLeft, setTimeLeft] = useState(AUTO_WIPE_MS / 1000);
  const [success, setSuccess] = useState<string | null>(null);

  const wipe = useCallback(() => {
    setDecrypted(null);
    setRevealed(false);
    setTimeLeft(AUTO_WIPE_MS / 1000);
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (wipeRef.current) { clearInterval(wipeRef.current); wipeRef.current = null; }
  }, []);

  const reset = useCallback(() => {
    wipe();
    setReason("");
    setCredentials("");
    setError(null);
    setSuccess(null);
    setMode(hasCredentials ? "decrypt" : "store");
  }, [wipe, hasCredentials]);

  useEffect(() => {
    if (!open) reset();
    else reset();
  }, [open]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (wipeRef.current) clearInterval(wipeRef.current);
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (wipeRef.current) clearInterval(wipeRef.current);
    setTimeLeft(AUTO_WIPE_MS / 1000);
    wipeRef.current = setInterval(() => setTimeLeft((p) => {
      if (p <= 1) { if (wipeRef.current) clearInterval(wipeRef.current); return 0; }
      return p - 1;
    }), 1000);
    timerRef.current = setTimeout(() => wipe(), AUTO_WIPE_MS);
  }, [wipe]);

  const handleStore = async () => {
    if (!credentials.trim()) { setError("Credentials are required."); return; }
    if (!reason.trim()) { setError("Reason is required."); return; }
    setLoading(true);
    setError(null);
    try {
      await orpc.admin.insurers.storeCredentials({
        code: insurerCode,
        credentials: credentials.trim(),
        reason: reason.trim(),
      });
      setSuccess("Credentials stored successfully.");
      setCredentials("");
      setReason("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to store credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRotate = async () => {
    if (!credentials.trim()) { setError("New credentials are required."); return; }
    if (!reason.trim()) { setError("Reason is required."); return; }
    setLoading(true);
    setError(null);
    try {
      await orpc.admin.insurers.rotateCredentials({
        code: insurerCode,
        newCredentials: credentials.trim(),
        reason: reason.trim(),
      });
      setSuccess("Credentials rotated successfully.");
      setCredentials("");
      setReason("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rotate credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!reason.trim()) { setError("Reason is required."); return; }
    setLoading(true);
    setError(null);
    try {
      const result = await orpc.admin.insurers.decryptCredentials({
        code: insurerCode,
        reason: reason.trim(),
      });
      if (result.credentials) {
        setDecrypted(result.credentials);
        setRevealed(true);
        startTimer();
      } else {
        setError("No credentials stored for this insurer.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decryption failed.");
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) close(); }}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-amber-600" />
            API Credentials
          </DialogTitle>
          <DialogDescription>
            Manage API credentials for <strong>{insurerName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {hasCredentials && (
            <div className="flex gap-2">
              <Button
                variant={mode === "decrypt" ? "primary" : "outline"}
                size="sm"
                onClick={() => { setMode("decrypt"); wipe(); setError(null); setSuccess(null); }}
              >
                View
              </Button>
              <Button
                variant={mode === "rotate" ? "primary" : "outline"}
                size="sm"
                onClick={() => { setMode("rotate"); setError(null); setSuccess(null); }}
              >
                <RotateCw className="h-3.5 w-3.5 mr-1" />
                Rotate
              </Button>
              <Button
                variant={mode === "store" ? "primary" : "outline"}
                size="sm"
                onClick={() => { setMode("store"); setError(null); setSuccess(null); }}
              >
                Replace
              </Button>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-success-soft border border-success/20 px-4 py-3 text-sm text-success">
              {success}
            </div>
          )}

          {(mode === "store" || mode === "rotate") && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  {mode === "rotate" ? "New Credentials" : "API Credentials"} <span className="text-danger">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Paste API credentials (API key, secret, etc.)"
                  value={credentials}
                  onChange={(e) => { setCredentials(e.target.value); if (error) setError(null); }}
                  disabled={loading}
                  className={cn(
                    "flex w-full rounded-md border bg-white px-4 py-3 text-sm font-mono placeholder:text-text-tertiary transition-colors focus:border-electric focus:outline-none disabled:opacity-50",
                    error ? "border-danger" : "border-neutral-300"
                  )}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Reason <span className="text-danger">*</span></label>
                <textarea
                  rows={2}
                  placeholder={mode === "rotate" ? "Why are you rotating these credentials?" : "Why are you storing these credentials?"}
                  value={reason}
                  onChange={(e) => { setReason(e.target.value); if (error) setError(null); }}
                  disabled={loading}
                  className={cn(
                    "flex w-full rounded-md border bg-white px-4 py-3 text-sm placeholder:text-text-tertiary transition-colors focus:border-electric focus:outline-none disabled:opacity-50",
                    error ? "border-danger" : "border-neutral-300"
                  )}
                />
              </div>
              {error && <p className="text-sm text-danger">{error}</p>}
              <Button
                variant="primary"
                size="md"
                className="w-full"
                disabled={loading}
                onClick={mode === "rotate" ? handleRotate : handleStore}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {loading ? "Saving..." : mode === "rotate" ? "Rotate Credentials" : "Store Credentials"}
              </Button>
            </div>
          )}

          {mode === "decrypt" && !decrypted && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-text-tertiary" />
                  <span className="text-sm text-text-secondary">Credentials are encrypted at rest (Tier 1 KMS)</span>
                </div>
                <label className="text-sm font-medium">Reason <span className="text-danger">*</span></label>
                <textarea
                  rows={3}
                  placeholder="Explain why you need to view these credentials..."
                  value={reason}
                  onChange={(e) => { setReason(e.target.value); if (error) setError(null); }}
                  disabled={loading}
                  className={cn(
                    "flex w-full rounded-md border bg-white px-4 py-3 text-sm placeholder:text-text-tertiary transition-colors focus:border-electric focus:outline-none disabled:opacity-50",
                    error ? "border-danger" : "border-neutral-300"
                  )}
                />
              </div>
              {error && <p className="text-sm text-danger">{error}</p>}
              <Button
                variant="primary"
                size="md"
                className="w-full"
                disabled={loading || !reason.trim()}
                onClick={handleDecrypt}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {loading ? "Decrypting..." : "Decrypt & View"}
              </Button>
            </div>
          )}

          {mode === "decrypt" && decrypted && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-text-secondary">Decrypted Credentials</label>
                  <button
                    onClick={() => setRevealed((p) => !p)}
                    className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary"
                  >
                    {revealed ? <><EyeOff className="h-3.5 w-3.5" /> Hide</> : <><Eye className="h-3.5 w-3.5" /> Reveal</>}
                  </button>
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-success-soft border border-success/20 rounded-md">
                  <Shield className="h-4 w-4 text-success shrink-0" />
                  <span className="text-sm font-mono font-medium text-success break-all">
                    {revealed ? decrypted : "••••••••••••••••••••"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-warning" />
                  <span className="text-xs text-warning">
                    Auto-wipes in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="md" className="w-full" onClick={wipe}>
                Wipe Now
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
