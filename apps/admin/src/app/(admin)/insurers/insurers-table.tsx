"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { createInsurer, updateInsurer, deleteInsurer } from "@/lib/actions/insurers";

type Insurer = {
  code: string;
  name: string | null;
  active: boolean | null;
  brokerCommissionPct: string | null;
  apiEndpoint: string | null;
  apiCredentialsSecretId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export function InsurersTable({ insurers }: { insurers: Insurer[] }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editInsurer, setEditInsurer] = useState<Insurer | null>(null);
  const [deleteInsurerTarget, setDeleteInsurerTarget] = useState<Insurer | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-secondary">{insurers.length} insurer{insurers.length !== 1 ? "s" : ""} total</p>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Insurer
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>API Endpoint</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {insurers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-text-tertiary py-8">No insurers configured. Add your first insurer to get started.</TableCell>
            </TableRow>
          ) : (
            insurers.map((insurer) => (
              <TableRow key={insurer.code}>
                <TableCell className="font-mono text-sm">{insurer.code}</TableCell>
                <TableCell className="font-medium">{insurer.name ?? "\u2014"}</TableCell>
                <TableCell>{insurer.brokerCommissionPct ? `${insurer.brokerCommissionPct}%` : "\u2014"}</TableCell>
                <TableCell className="font-mono text-xs text-text-secondary max-w-[200px] truncate">{insurer.apiEndpoint ?? "\u2014"}</TableCell>
                <TableCell><Badge variant={insurer.active ? "success" : "outline"}>{insurer.active ? "Active" : "Inactive"}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="p-1.5" onClick={() => setEditInsurer(insurer)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1.5" onClick={() => setDeleteInsurerTarget(insurer)}>
                      <Trash2 className="h-3.5 w-3.5 text-danger" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <InsurerFormDialog open={createOpen} onOpenChange={setCreateOpen}
        onSave={async (d) => { setSaving(true); await createInsurer(d); setSaving(false); setCreateOpen(false); }} saving={saving} />
      <InsurerFormDialog open={editInsurer !== null} onOpenChange={(o) => { if (!o) setEditInsurer(null); }}
        defaultValues={editInsurer ? { code: editInsurer.code, name: editInsurer.name ?? "", active: editInsurer.active ?? true, brokerCommissionPct: editInsurer.brokerCommissionPct ?? "", apiEndpoint: editInsurer.apiEndpoint ?? "" } : undefined}
        isEdit onSave={async (d) => { if (!editInsurer) return; setSaving(true); await updateInsurer(editInsurer.code, d); setSaving(false); setEditInsurer(null); }} saving={saving} />
      <Dialog open={deleteInsurerTarget !== null} onOpenChange={(o) => { if (!o) setDeleteInsurerTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Insurer</DialogTitle>
            <DialogDescription>Are you sure you want to delete <strong>{deleteInsurerTarget?.name ?? deleteInsurerTarget?.code}</strong>? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button variant="destructive" disabled={saving} onClick={async () => { if (!deleteInsurerTarget) return; setSaving(true); await deleteInsurer(deleteInsurerTarget.code); setSaving(false); setDeleteInsurerTarget(null); }}>
              {saving ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function InsurerFormDialog({ open, onOpenChange, defaultValues, isEdit, onSave, saving }: {
  open: boolean; onOpenChange: (o: boolean) => void;
  defaultValues?: { code: string; name: string; active: boolean; brokerCommissionPct: string; apiEndpoint: string };
  isEdit?: boolean; onSave: (d: { code: string; name: string; active: boolean; brokerCommissionPct?: string; apiEndpoint?: string }) => Promise<void>;
  saving: boolean;
}) {
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await onSave({
      code: (f.get("code") as string).trim(),
      name: (f.get("name") as string).trim(),
      active: f.get("active") === "on",
      brokerCommissionPct: (f.get("brokerCommissionPct") as string).trim() || undefined,
      apiEndpoint: (f.get("apiEndpoint") as string).trim() || undefined,
    });
    e.currentTarget.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Insurer" : "Add Insurer"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update the insurer details below." : "Fill in the details to add a new insurance provider."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-text-primary">Insurer Code</label>
            <Input name="code" required placeholder="e.g. ALLIANZ_RO" defaultValue={defaultValues?.code} disabled={isEdit} />
            <p className="text-xs text-text-tertiary">Unique identifier used across the system.</p>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-text-primary">Name</label>
            <Input name="name" required placeholder="e.g. Allianz-Tiriac Asigurari" defaultValue={defaultValues?.name} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-text-primary">Broker Commission (%)</label>
            <Input name="brokerCommissionPct" placeholder="e.g. 10.00" defaultValue={defaultValues?.brokerCommissionPct} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-text-primary">API Endpoint</label>
            <Input name="apiEndpoint" placeholder="e.g. https://api.allianz.ro/rca/v2" defaultValue={defaultValues?.apiEndpoint} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="active" id="ia" defaultChecked={defaultValues?.active ?? true} className="h-4 w-4 rounded border-border-default text-brand-primary focus:ring-brand-primary" />
            <label htmlFor="ia" className="text-sm text-text-primary">Active</label>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : isEdit ? "Save Changes" : "Create Insurer"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
