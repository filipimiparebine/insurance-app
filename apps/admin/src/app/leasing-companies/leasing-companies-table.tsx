"use client";

import { useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
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
import { getLeasingCompanies, createLeasingCompany, updateLeasingCompany, deleteLeasingCompany } from "@/lib/actions/leasing-companies";
import { toast } from "sonner";
import useSWR from "swr";

type LeasingCompany = Awaited<ReturnType<typeof getLeasingCompanies>>[number];

const fetcher = () => getLeasingCompanies();

export function LeasingCompaniesTable() {
  const { data: companies, error, isLoading, mutate } = useSWR("leasing-companies", fetcher);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<LeasingCompany | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<LeasingCompany | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = (companies ?? []).filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.cui?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = useCallback(async (data: { name: string; cui?: string; active?: boolean }) => {
    setSaving(true);
    try {
      if (editing) {
        await updateLeasingCompany(editing.id, data);
        toast.success("Company updated");
      } else {
        await createLeasingCompany(data);
        toast.success("Company created");
      }
      await mutate();
      setEditing(null);
      setCreating(false);
    } catch {
      toast.error(editing ? "Failed to update company" : "Failed to create company");
    } finally {
      setSaving(false);
    }
  }, [editing, mutate]);

  const handleDelete = useCallback(async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await deleteLeasingCompany(deleting.id);
      toast.success("Company deleted");
      await mutate();
      setDeleting(null);
    } catch {
      toast.error("Failed to delete company");
    } finally {
      setSaving(false);
    }
  }, [deleting, mutate]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-semibold text-text-primary">Leasing Companies</h1>
        <p className="text-sm text-text-secondary">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-semibold text-text-primary">Leasing Companies</h1>
        <p className="text-sm text-danger">Failed to load leasing companies</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary">Leasing Companies</h1>
          <p className="mt-1 text-sm text-text-secondary">{filtered.length} compan{filtered.length !== 1 ? "ies" : "y"}</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Add Company
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search by name or CUI..."
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
            <TableHead>Name</TableHead>
            <TableHead>CUI</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-text-tertiary py-16">
                No leasing companies found
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell className="font-mono text-xs">{company.cui ?? "\u2014"}</TableCell>
                <TableCell>
                  <Badge variant={company.active ? "default" : "outline"}>
                    {company.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-text-secondary">
                  {company.createdAt ? new Date(company.createdAt).toLocaleDateString("ro-RO") : "\u2014"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(company)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleting(company)}>
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
        <DialogContent className="sm:max-w-[450px]">
          <LeasingCompanyForm
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
            <DialogTitle>Delete Leasing Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleting?.name}</strong>? This action cannot be undone.
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
    </div>
  );
}

function LeasingCompanyForm({
  initial, saving, onSave, onCancel,
}: {
  initial: LeasingCompany | null;
  saving: boolean;
  onSave: (data: { name: string; cui?: string; active?: boolean }) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [cui, setCui] = useState(initial?.cui ?? "");
  const [active, setActive] = useState(initial?.active ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ name, cui: cui || undefined, active: initial ? active : undefined });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{initial ? "Edit Leasing Company" : "Add Leasing Company"}</DialogTitle>
        <DialogDescription>
          {initial ? "Update leasing company details." : "Add a new leasing company to the platform."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-text-primary">Name *</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. BCR Leasing" required />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm font-medium text-text-primary">CUI</label>
          <Input value={cui} onChange={(e) => setCui(e.target.value)} placeholder="e.g. RO1333318" />
        </div>
        {initial && (
          <div className="flex items-center gap-2">
            <input type="checkbox" id="active" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 rounded border-border-subtle" />
            <label htmlFor="active" className="text-sm text-text-primary">Active</label>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" type="button" disabled={saving} onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : initial ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </form>
  );
}
