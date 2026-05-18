"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@blaj/ui"
import { Button } from "@blaj/ui"
import { Input } from "@blaj/ui"
import { Label } from "@blaj/ui"
import { Separator } from "@blaj/ui"
import { UserCog, Mail, Phone, Bell, Trash2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api-client"

export function ProfileTab({
  locale,
  profileData,
}: {
  locale: string
  profileData: Record<string, unknown> | null
}) {
  const { user } = useUser()
  const isRo = locale === "ro"

  const [preferences, setPreferences] = useState({
    emailReminders: (profileData?.user as { preferences?: { emailReminders?: boolean } })?.preferences?.emailReminders ?? true,
    smsReminders: (profileData?.user as { preferences?: { smsReminders?: boolean } })?.preferences?.smsReminders ?? false,
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteReason, setDeleteReason] = useState("")

  const handleSavePreferences = async () => {
    setSaving(true)
    try {
      await api.account.updatePreferences(preferences)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // Silent fail
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      await api.account.delete(deleteReason || undefined)
      window.location.href = `/${locale}`
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 font-display">
          {isRo ? "Profil" : "Profile"}
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          {isRo
            ? "Gestionează-ți informațiile contului și preferințele."
            : "Manage your account information and preferences."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <div className="flex items-center gap-2">
              <UserCog className="h-4 w-4 text-neutral-500" />
              {isRo ? "Informații cont" : "Account info"}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-500">
                {isRo ? "Email" : "Email"}
              </Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-neutral-400" />
                <span className="text-sm text-neutral-900">
                  {user?.emailAddresses?.[0]?.emailAddress ?? "—"}
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-500">
                {isRo ? "Telefon" : "Phone"}
              </Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-neutral-400" />
                <span className="text-sm text-neutral-900">
                  {user?.phoneNumbers?.[0]?.phoneNumber ?? "—"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-neutral-500" />
              {isRo ? "Preferințe notificări" : "Notification preferences"}
            </div>
          </CardTitle>
          <CardDescription>
            {isRo
              ? "Alege cum vrei să fii notificat despre polițele tale."
              : "Choose how you want to be notified about your policies."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-neutral-900">
                {isRo ? "Notificări prin email" : "Email notifications"}
              </p>
              <p className="text-xs text-neutral-500">
                {isRo
                  ? "Reamintiri de expirare și reînnoire."
                  : "Expiry and renewal reminders."}
              </p>
            </div>
            <Toggle
              checked={preferences.emailReminders}
              onChange={(v) => setPreferences((p) => ({ ...p, emailReminders: v }))}
            />
          </label>

          <Separator />

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-neutral-900">
                {isRo ? "Notificări prin SMS" : "SMS notifications"}
              </p>
              <p className="text-xs text-neutral-500">
                {isRo
                  ? "Alerte rapide cu 7 zile înainte de expirare."
                  : "Quick alerts 7 days before expiry."}
              </p>
            </div>
            <Toggle
              checked={preferences.smsReminders}
              onChange={(v) => setPreferences((p) => ({ ...p, smsReminders: v }))}
            />
          </label>

          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSavePreferences}
              disabled={saving}
            >
              {saving
                ? (isRo ? "Se salvează..." : "Saving...")
                : saved
                  ? (isRo ? "Salvat ✓" : "Saved ✓")
                  : (isRo ? "Salvează preferințele" : "Save preferences")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-base text-red-700">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {isRo ? "Zonă periculoasă" : "Danger zone"}
            </div>
          </CardTitle>
          <CardDescription className="text-red-600/70">
            {isRo
              ? "Ștergerea contului este permanentă. Datele tale vor fi anonimizate conform GDPR."
              : "Account deletion is permanent. Your data will be anonymized per GDPR."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showDeleteConfirm ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4" />
              {isRo ? "Șterge contul" : "Delete account"}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-neutral-500">
                  {isRo ? "Motiv (opțional)" : "Reason (optional)"}
                </Label>
                <Input
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder={isRo ? "De ce dorești să ștergi contul?" : "Why do you want to delete your account?"}
                  className="h-9 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
                  {deleting
                    ? (isRo ? "Se șterge..." : "Deleting...")
                    : (isRo ? "Confirmă ștergerea" : "Confirm deletion")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  {isRo ? "Renunță" : "Cancel"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-fast",
        checked ? "bg-brand-primary" : "bg-neutral-200",
      )}
    >
      <span
        className={cn(
          "inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-fast",
          checked ? "translate-x-[18px]" : "translate-x-[3px]",
        )}
      />
    </button>
  )
}
