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
import { createLeasingCompany, updateLeasingCompany, deleteLeasingCompany } from "@/lib/actions/leasing-companies";

type LeasingCompany = {
  id: string; name: string; cui: string | null; active: boolean | null;
  isUserAdded: boolean | null; createdAt: Date | null; updatedAt: Date | null;
};

export function LeasingCompaniesTable({ companies }: { companies: LeasingCompany[] }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editCompany, setEditCompany] = useState<LeasingCompany | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LeasingCompany | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-secondary">{companies.length} compan{companies.length !== 1 ? "ies" : "y"} total</p>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Company
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>CUI</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-text-tertiary py-8">No leasing companies yet. Add one to get started.</TableCell>
            </TableRow>
          ) : (
            companies.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="font-mono text-sm">{c.cui ?? "\u2014"}</TableCell>
                <TableCell><Badge variant={c.isUserAdded ? "brand" : "default"}>{c.isUserAdded ? "Manual" : "Seed"}</Badge></TableCell>
                <TableCell><Badge variant={c.active ? "success" : "outline"}>{c.active ? "Active" : "Inactive"}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="p-1.5" onClick={() => setEditCompany(c)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1.5" onClick={() => setDeleteTarget(c)}>
                      <Trash2 className="h-3.5 w-3.5 text-danger" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <LeasingCompanyFormDialog open={createOpen} onOpenChange={setCreateOpen}
        onSave={async (d) => { setSaving(true); await createLeasingCompany(d); setSaving(false); setCreateOpen(false); }} saving={saving} />
      <LeasingCompanyFormDialog open={editCompany !== null} onOpenChange={(o) => { if (!o) setEditCompany(null); }}
        defaultValues={editCompany ? { name: editCompany.name, cui: editCompany.cui ?? "", active: editCompany.active ?? true } : undefined}
        isEdit onSave={async (d) => { if (!editCompany) return; setSaving(true); await updateLeasingCompany(editCompany.id, d); setSaving(false); setEditCompany(null); }} saving={saving} />
      <Dialog open={deleteTarget !== null} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Leasing Company</DialogTitle>
            <DialogDescription>Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button variant="destructive" disabled={saving} onClick={async () => { if (!deleteTarget) return; setSaving(true); await deleteLeasingCompany(deleteTarget.id); setSaving(false); setDeleteTarget(null); }}>
              {saving ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function LeasingCompanyFormDialog({ open, onOpenChange, defaultValues, isEdit, onSave, saving }: {
  open: boolean; onOpenChange: (o: boolean) => void;
  defaultValues?: { name: string; cui: string; active: boolean };
  isEdit?: boolean; onSave: (d: { name: string; cui?: string; active?: boolean }) => Promise<void>;
  saving: boolean;
}) {
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await onSave({
      name: (f.get("name") as string).trim(),
      cui: (f.get("cui") as string).trim() || undefined,
      active: f.get("active") === "on",
    });
    e.currentTarget.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Company" : "Add Leasing Company"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update the leasing company details below." : "Fill in the details to add a new leasing company."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-text-primary">Company Name</label>
            <Input name="name" required placeholder="e.g. BCR Leasing" defaultValue={defaultValues?.name} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-text-primary">CUI (Tax ID)</label>
            <Input name="cui" placeholder="e.g. RO12345678" defaultValue={defaultValues?.cui} />
            <p className="text-xs text-text-tertiary">Romanian tax identification code (optional).</p>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="active" id="ca" defaultChecked={defaultValues?.active ?? true} className="h-4 w-4 rounded border-border-default text-brand-primary focus:ring-brand-primary" />
            <label htmlFor="ca" className="text-sm text-text-primary">Active</label>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : isEdit ? "Save Changes" : "Create Company"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
