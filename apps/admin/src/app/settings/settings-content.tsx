"use client";

import { useState, useCallback } from "react";
import { ShieldCheck, Percent, FlaskConical, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getSettings, updateSetting } from "@/lib/actions/settings";
import { toast } from "sonner";
import useSWR from "swr";

type Setting = Awaited<ReturnType<typeof getSettings>>[number];

const fetcher = () => getSettings();

export function SettingsContent() {
  const { data: settings, error, isLoading, mutate } = useSWR("settings", fetcher);
  const [saving, setSaving] = useState<string | null>(null);

  const getSetting = useCallback((key: string): Setting | undefined => {
    return settings?.find((s) => s.key === key);
  }, [settings]);

  const handleToggle = useCallback(async (key: string, currentValue: string) => {
    setSaving(key);
    try {
      const newValue = currentValue === "true" ? "false" : "true";
      await updateSetting(key, newValue);
      toast.success(`"${key}" ${newValue === "true" ? "enabled" : "disabled"}`);
      await mutate();
    } catch {
      toast.error("Failed to update setting");
    } finally {
      setSaving(null);
    }
  }, [mutate]);

  const handleUpdate = useCallback(async (key: string, value: string) => {
    setSaving(key);
    try {
      await updateSetting(key, value);
      toast.success(`"${key}" updated`);
      await mutate();
    } catch {
      toast.error("Failed to update setting");
    } finally {
      setSaving(null);
    }
  }, [mutate]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-semibold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-semibold text-text-primary">Settings</h1>
        <p className="text-sm text-danger">Failed to load settings</p>
      </div>
    );
  }

  const maintenanceMode = getSetting("maintenance_mode");
  const maxCommission = getSetting("max_broker_commission_pct");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-semibold text-text-primary">Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">Application configuration and feature flags</p>
      </div>

      <div className="grid gap-6">
        <section className="rounded-lg border border-border-subtle bg-surface p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <ShieldCheck className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold text-text-primary">Maintenance Mode</h2>
              <p className="text-sm text-text-secondary">Blocks all user-facing requests when enabled</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant={maintenanceMode?.value === "true" ? "default" : "outline"}>
                {maintenanceMode?.value === "true" ? "Enabled" : "Disabled"}
              </Badge>
              {maintenanceMode?.description && (
                <span className="text-xs text-text-tertiary">{maintenanceMode.description}</span>
              )}
            </div>
            <Button
              variant={maintenanceMode?.value === "true" ? "destructive" : "primary"}
              size="sm"
              disabled={saving === "maintenance_mode"}
              onClick={() => handleToggle("maintenance_mode", maintenanceMode?.value ?? "false")}
            >
              {saving === "maintenance_mode" ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : maintenanceMode?.value === "true" ? (
                "Disable"
              ) : (
                "Enable"
              )}
            </Button>
          </div>
        </section>

        <section className="rounded-lg border border-border-subtle bg-surface p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <Percent className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold text-text-primary">Max Broker Commission</h2>
              <p className="text-sm text-text-secondary">Maximum commission percentage brokers can earn</p>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <div className="max-w-[200px]">
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Percentage (%)</label>
              <Input
                type="number"
                step="0.01"
                defaultValue={maxCommission?.value ?? "10.00"}
                onBlur={(e) => {
                  const val = e.target.value;
                  if (val && val !== maxCommission?.value) {
                    handleUpdate("max_broker_commission_pct", val);
                  }
                }}
              />
            </div>
            {saving === "max_broker_commission_pct" && (
              <RefreshCw className="h-4 w-4 animate-spin text-text-tertiary mb-2" />
            )}
          </div>
        </section>

        <section className="rounded-lg border border-border-subtle bg-surface p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <FlaskConical className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold text-text-primary">Feature Flags</h2>
              <p className="text-sm text-text-secondary">A/B testing and feature toggles</p>
            </div>
          </div>
          <div className="space-y-3">
            {(settings ?? [])
              .filter((s) => s.key.startsWith("feature_flag_"))
              .map((flag) => (
                <div key={flag.key} className="flex items-center justify-between rounded-md bg-neutral-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {flag.key.replace("feature_flag_", "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </p>
                    <p className="text-xs text-text-tertiary">{flag.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {flag.type === "boolean" ? (
                      <Button
                        variant={flag.value === "true" ? "primary" : "outline"}
                        size="sm"
                        disabled={saving === flag.key}
                        onClick={() => handleToggle(flag.key, flag.value)}
                      >
                        {saving === flag.key ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : flag.value === "true" ? (
                          "On"
                        ) : (
                          "Off"
                        )}
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        {flag.value}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
