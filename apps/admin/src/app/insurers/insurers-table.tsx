"use client";

import { useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Search, X, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { InsurerCredentialsModal } from "@/components/insurer-credentials-modal";
import { getInsurers, createInsurer, updateInsurer, deleteInsurer } from "@/lib/actions/insurers";
import { toast } from "sonner";
import useSWR from "swr";

type Insurer = Awaited<ReturnType<typeof getInsurers>>[number];

const fetcher = () => getInsurers();

export function InsurersTable() {
  const { data: insurers, error, isLoading, mutate } = useSWR("insurers", fetcher);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Insurer | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Insurer | null>(null);
  const [credentialsTarget, setCredentialsTarget] = useState<Insurer | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = (insurers ?? []).filter((i) =>
    !search || i.name?.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = useCallback(async (data: {
    code: string; name: string; active?: boolean;
    brokerCommissionPct?: string; apiEndpoint?: string;
  }) => {
    setSaving(true);
    try {
      if (editing) {
        const { code: _code, ...rest } = data;
        await updateInsurer(editing.code, rest);
        toast.success("Insurer updated");
      } else {
        await createInsurer(data);
        toast.success("Insurer created");
      }
      await mutate();
      setEditing(null);
      setCreating(false);
    } catch {
      toast.error(editing ? "Failed to update insurer" : "Failed to create insurer");
    } finally {
      setSaving(false);
    }
  }, [editing, mutate]);

  const handleDelete = useCallback(async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await deleteInsurer(deleting.code);
      toast.success("Insurer deleted");
      await mutate();
      setDeleting(null);
    } catch {
      toast.error("Failed to delete insurer");
    } finally {
      setSaving(false);
    }
  }, [deleting, mutate]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-semibold text-text-primary">Insurers</h1>
        <p className="text-sm text-text-secondary">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-semibold text-text-primary">Insurers</h1>
        <p className="text-sm text-danger">Failed to load insurers</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary">Insurers</h1>
          <p className="mt-1 text-sm text-text-secondary">{filtered.length} insurer{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Add Insurer
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search insurers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-md border border-border-subtle bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-electric focus:outline-none focus:shadow-focus"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Commission %</TableHead>
            <TableHead>API Endpoint</TableHead>
            <TableHead>Credentials</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-text-tertiary py-16">
                No insurers found
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((insurer) => (
              <TableRow key={insurer.code}>
                <TableCell className="font-mono text-xs">{insurer.code}</TableCell>
                <TableCell className="font-medium">{insurer.name}</TableCell>
                <TableCell>
                  <Badge variant={insurer.active ? "default" : "outline"}>
                    {insurer.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="tabular-nums">
                  {insurer.brokerCommissionPct ? `${insurer.brokerCommissionPct}%` : "\u2014"}
                </TableCell>
                <TableCell className="text-xs text-text-secondary max-w-[200px] truncate">
                  {insurer.apiEndpoint ?? "\u2014"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCredentialsTarget(insurer)}
                    className={insurer.apiCredentialsSecretId ? "text-amber-600 hover:text-amber-700" : ""}
                  >
                    <Key className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(insurer)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleting(insurer)}>
                      <Trash2 className="h-4 w-4 text-danger" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={creating || editing !== null} onOpenChange={(o) => { if (!o) { setCreating(false); setEditing(null); } }}>
        <DialogContent className="sm:max-w-[500px]">
          <InsurerForm
            initial={editing}
            saving={saving}
            onSave={handleSave}
            onCancel={() => { setCreating(false); setEditing(null); }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleting !== null} onOpenChange={(o) => { if (!o) setDeleting(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Insurer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleting?.name}</strong> ({deleting?.code})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={saving}>Cancel</Button>
            </DialogClose>
            <Button variant="destructive" disabled={saving} onClick={handleDelete}>
              {saving ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <InsurerCredentialsModal
        open={credentialsTarget !== null}
        onOpenChange={(o) => { if (!o) setCredentialsTarget(null); }}
        insurerCode={credentialsTarget?.code ?? ""}
        insurerName={credentialsTarget?.name ?? ""}
        hasCredentials={!!credentialsTarget?.apiCredentialsSecretId}
      />
    </div>
  );
}

function InsurerForm({
  initial, saving, onSave, onCancel,
}: {
  initial: Insurer | null;
  saving: boolean;
  onSave: (data: { code: string; name: string; active?: boolean; brokerCommissionPct?: string; apiEndpoint?: string }) => Promise<void>;
  onCancel: () => void;
}) {
  const [code, setCode] = useState(initial?.code ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [active, setActive] = useState(initial?.active ?? true);
  const [brokerCommissionPct, setBrokerCommissionPct] = useState(initial?.brokerCommissionPct ?? "");
  const [apiEndpoint, setApiEndpoint] = useState(initial?.apiEndpoint ?? "");

  const isEditing = !!initial;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      code,
      name,
      active: isEditing ? active : undefined,
      brokerCommissionPct: brokerCommissionPct || undefined,
      apiEndpoint: apiEndpoint || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Insurer" : "Add Insurer"}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Update insurer configuration details." : "Add a new insurance company to the platform."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-text-primary">Code *</label>
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. groupama" required disabled={isEditing} />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-text-primary">Name *</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Groupama Asigurari" required />
        </div>
        {isEditing && (
          <div className="flex items-center gap-2">
            <input type="checkbox" id="active" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 rounded border-border-subtle" />
            <label htmlFor="active" className="text-sm text-text-primary">Active</label>
          </div>
        )}
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-text-primary">Broker Commission %</label>
          <Input value={brokerCommissionPct} onChange={(e) => setBrokerCommissionPct(e.target.value)} placeholder="e.g. 5.00" type="number" step="0.01" />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-text-primary">API Endpoint</label>
          <Input value={apiEndpoint} onChange={(e) => setApiEndpoint(e.target.value)} placeholder="https://api.example.com" type="url" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" type="button" disabled={saving} onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : isEditing ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </form>
  );
}
