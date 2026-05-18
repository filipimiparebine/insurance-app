"use client";

import { useState, useMemo } from "react";
import { useList, useCreate, useUpdate, useDelete } from "@refinedev/core";
import { Plus, Pencil, Trash2, FileText, ExternalLink, History } from "lucide-react";
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

type LegalDocument = {
  id: string;
  type: string;
  version: number;
  contentUrl: string;
  effectiveDate: string | null;
  active: boolean;
  createdAt: string;
};

const DOC_TYPES = [
  { value: "terms_of_service", label: "Terms of Service" },
  { value: "privacy_policy", label: "Privacy Policy" },
  { value: "cookie_policy", label: "Cookie Policy" },
  { value: "withdrawal_form", label: "Withdrawal Form" },
  { value: "ipid", label: "IPID" },
  { value: "contract", label: "Contract Template" },
];

const docTypeLabel = (type: string) =>
  DOC_TYPES.find((d) => d.value === type)?.label ?? type;

export function LegalDocumentsContent() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editDoc, setEditDoc] = useState<LegalDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LegalDocument | null>(null);
  const [saving, setSaving] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [historyType, setHistoryType] = useState<string | null>(null);

  const { data, isLoading, refetch } = useList({
    resource: "legal_documents",
    pagination: { current: 1, pageSize: 100 },
  });

  const { mutate: createDoc } = useCreate();
  const { mutate: updateDoc } = useUpdate();
  const { mutate: deleteDoc } = useDelete();

  const docs = useMemo(
    () => (data?.data ?? []) as unknown as LegalDocument[],
    [data],
  );

  const filtered = useMemo(
    () =>
      typeFilter === "all"
        ? docs
        : docs.filter((d) => d.type === typeFilter),
    [docs, typeFilter],
  );

  const historyDocs = useMemo(
    () =>
      historyType ? docs.filter((d) => d.type === historyType) : [],
    [docs, historyType],
  );

  const handleCreate = async (formData: {
    type: string;
    version: number;
    contentUrl: string;
    effectiveDate: string;
  }) => {
    setSaving(true);
    await createDoc(
      {
        resource: "legal_documents",
        values: { ...formData, active: true },
      },
      { onSuccess: () => { refetch(); setCreateOpen(false); }, onSettled: () => setSaving(false) },
    );
  };

  const handleUpdate = async (
    id: string,
    formData: {
      type?: string;
      version?: number;
      contentUrl?: string;
      effectiveDate?: string;
    },
  ) => {
    setSaving(true);
    await updateDoc(
      {
        resource: "legal_documents",
        id,
        values: formData,
      },
      { onSuccess: () => { refetch(); setEditDoc(null); }, onSettled: () => setSaving(false) },
    );
  };

  const handleToggleActive = async (doc: LegalDocument) => {
    setTogglingId(doc.id);
    await updateDoc(
      {
        resource: "legal_documents",
        id: doc.id,
        values: { active: !doc.active },
      },
      { onSuccess: () => { refetch(); }, onSettled: () => setTogglingId(null) },
    );
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    await deleteDoc(
      {
        resource: "legal_documents",
        id,
      },
      { onSuccess: () => { refetch(); setDeleteTarget(null); }, onSettled: () => setSaving(false) },
    );
  };

  const formatDate = (d: string | null) =>
    d
      ? new Date(d).toLocaleDateString("ro-RO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "\u2014";

  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-semibold text-text-primary">
          Legal Documents
        </h1>
        <p className="text-sm text-text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary">
            Legal Documents
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {docs.length} document{docs.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New Document Version
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-text-secondary">Filter:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-md border border-border-subtle bg-surface px-3 text-sm text-text-primary focus:border-electric focus:outline-none"
          >
            <option value="all">All Types</option>
            {DOC_TYPES.map((dt) => (
              <option key={dt.value} value={dt.value}>
                {dt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Effective Date</TableHead>
            <TableHead>Document</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[160px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-text-tertiary py-16">
                No legal documents published yet
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((doc) => (
              <TableRow key={doc.id} className={!doc.active ? "opacity-60" : ""}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-text-tertiary" />
                    {docTypeLabel(doc.type)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">v{doc.version}</Badge>
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(doc)}
                    disabled={togglingId === doc.id}
                    className="relative inline-flex h-6 w-10 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-electric focus:ring-offset-2 disabled:cursor-wait"
                    role="switch"
                    aria-checked={doc.active}
                    style={{
                      backgroundColor: doc.active ? "#3b82f6" : "#d1d5db",
                    }}
                  >
                    <span
                      className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
                      style={{
                        transform: doc.active ? "translateX(18px)" : "translateX(2px)",
                      }}
                    />
                  </button>
                </TableCell>
                <TableCell className="text-sm">{formatDate(doc.effectiveDate)}</TableCell>
                <TableCell className="max-w-[200px]">
                  {doc.contentUrl ? (
                    <a
                      href={doc.contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-electric hover:underline text-sm"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View
                    </a>
                  ) : (
                    <span className="text-text-tertiary text-sm">\u2014</span>
                  )}
                </TableCell>
                <TableCell className="text-text-secondary text-xs">
                  {formatDate(doc.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1.5"
                      onClick={() => setHistoryType(doc.type)}
                      title="Version history"
                    >
                      <History className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1.5"
                      onClick={() => setEditDoc(doc)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1.5"
                      onClick={() => setDeleteTarget(doc)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-danger" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DocumentFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={handleCreate}
        saving={saving}
      />

      <DocumentFormDialog
        open={editDoc !== null}
        onOpenChange={(o) => { if (!o) setEditDoc(null); }}
        defaultValues={
          editDoc
            ? {
                type: editDoc.type,
                version: editDoc.version,
                contentUrl: editDoc.contentUrl,
                effectiveDate: editDoc.effectiveDate ?? "",
              }
            : undefined
        }
        isEdit
        onSave={(d) => editDoc ? handleUpdate(editDoc.id, d) : Promise.resolve()}
        saving={saving}
      />

      <Dialog open={deleteTarget !== null} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete version{" "}
              <strong>v{deleteTarget?.version}</strong> of{" "}
              <strong>{deleteTarget ? docTypeLabel(deleteTarget.type) : ""}</strong>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="primary"
              disabled={saving}
              onClick={() => deleteTarget && handleDelete(deleteTarget.id)}
            >
              {saving ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={historyType !== null} onOpenChange={(o) => { if (!o) setHistoryType(null); }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Version History — {historyType ? docTypeLabel(historyType) : ""}
            </DialogTitle>
            <DialogDescription>
              All published versions of this document type.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Document</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyDocs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-text-tertiary py-8">
                      No versions found
                    </TableCell>
                  </TableRow>
                ) : (
                  [...historyDocs]
                    .sort((a, b) => b.version - a.version)
                    .map((doc) => (
                      <TableRow key={doc.id} className={!doc.active ? "opacity-60" : ""}>
                        <TableCell>
                          <Badge variant="outline">v{doc.version}</Badge>
                        </TableCell>
                        <TableCell>
                          {doc.active ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <span className="text-xs text-text-tertiary">Inactive</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(doc.effectiveDate)}</TableCell>
                        <TableCell className="text-text-secondary text-xs">
                          {formatDate(doc.createdAt)}
                        </TableCell>
                        <TableCell>
                          {doc.contentUrl ? (
                            <a
                              href={doc.contentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-electric hover:underline text-sm"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              View
                            </a>
                          ) : (
                            <span className="text-text-tertiary text-sm">\u2014</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DocumentFormDialog({
  open,
  onOpenChange,
  defaultValues,
  isEdit,
  onSave,
  saving,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  defaultValues?: {
    type: string;
    version: number;
    contentUrl: string;
    effectiveDate: string;
  };
  isEdit?: boolean;
  onSave: (d: {
    type: string;
    version: number;
    contentUrl: string;
    effectiveDate: string;
  }) => Promise<void>;
  saving: boolean;
}) {
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await onSave({
      type: f.get("type") as string,
      version: Number(f.get("version")),
      contentUrl: (f.get("contentUrl") as string).trim(),
      effectiveDate: (f.get("effectiveDate") as string).trim(),
    });
    e.currentTarget.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Document" : "New Document Version"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the document details below."
              : "Publish a new version of a legal document."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-text-primary">
              Document Type
            </label>
            <select
              name="type"
              required
              defaultValue={defaultValues?.type ?? "terms_of_service"}
              className="h-10 w-full rounded-md border border-border-subtle bg-surface px-3 text-sm text-text-primary focus:border-electric focus:outline-none focus:shadow-focus"
            >
              {DOC_TYPES.map((dt) => (
                <option key={dt.value} value={dt.value}>
                  {dt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-text-primary">
              Version
            </label>
            <Input
              name="version"
              type="number"
              min={1}
              step={1}
              required
              placeholder="e.g. 2"
              defaultValue={defaultValues?.version ?? 1}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-text-primary">
              Content URL
            </label>
            <Input
              name="contentUrl"
              required
              placeholder="https://storage.blaj.io/legal/tos-v2.pdf"
              defaultValue={defaultValues?.contentUrl}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-text-primary">
              Effective Date
            </label>
            <Input
              name="effectiveDate"
              type="date"
              required
              defaultValue={defaultValues?.effectiveDate}
            />
            <p className="text-xs text-text-tertiary">
              The date this document version becomes legally effective.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Publish Version"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
