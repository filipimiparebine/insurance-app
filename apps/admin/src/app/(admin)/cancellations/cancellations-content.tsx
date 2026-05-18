"use client";

import { useState, useMemo } from "react";
import { useList, useUpdate } from "@refinedev/core";
import {
  Search,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  X,
  FileText,
  ExternalLink,
  BadgeCheck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";

type Document = {
  id: string;
  type: string | null;
  fileUrl: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string | null;
};

type RefundInfo = {
  eligible: boolean;
  withinWithdrawal: boolean;
  amount: number | null;
  currency: string | null;
};

type Policy = {
  id: string;
  userId: string;
  policyType: string;
  policyNumber: string;
  insurerCode: string;
  status: string;
  startDate: string;
  endDate: string;
  premiumNet: string;
  totalAmount: string;
  currency: string;
  cancelledAt: string | null;
  cancellationReason: string | null;
  withdrawalUntil: string | null;
  createdAt: string;
  pdfUrl: string | null;
  ipidUrl: string | null;
  documents: Document[];
  refund: RefundInfo;
};

const DOC_LABELS: Record<string, string> = {
  ci_both: "CI (both sides)",
  ci_front: "CI (front)",
  ci_back: "CI (back)",
  driver_license: "Driver License",
  vehicle_registration: "Vehicle Registration",
  proof_of_sale: "Proof of Sale",
  other: "Other Document",
};

function docLabel(type: string | null): string {
  if (!type) return "Document";
  return DOC_LABELS[type] ?? type.replace(/_/g, " ");
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatRon(value: string | null | undefined): string {
  if (!value) return "\u2014";
  return `${Number(value).toLocaleString("ro-RO", {
    minimumFractionDigits: 2,
  })} RON`;
}

export function CancellationsContent() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Policy | null>(null);
  const [rejectComment, setRejectComment] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [approveRefund, setApproveRefund] = useState<
    Record<string, boolean>
  >({});

  const { data, isLoading, refetch } = useList({
    resource: "cancellations",
    pagination: { current: 1, pageSize: 50 },
  });

  const { mutate: updatePolicy } = useUpdate();

  const policies = useMemo(() => {
    const list = (data?.data ?? []) as unknown as Policy[];
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter(
      (p) =>
        p.policyNumber?.toLowerCase().includes(q) ||
        p.insurerCode?.toLowerCase().includes(q),
    );
  }, [data, search]);

  const handleApprove = async (policy: Policy) => {
    setActionLoading(policy.id);
    const shouldRefund =
      approveRefund[policy.id] ?? policy.refund.eligible;
    await updatePolicy(
      {
        resource: "cancellations",
        id: policy.id,
        values: {
          status: "cancelled",
          processRefund: shouldRefund,
        },
      },
      {
        onSuccess: () => {
          setApproveRefund((prev) => {
            const next = { ...prev };
            delete next[policy.id];
            return next;
          });
          refetch();
        },
        onSettled: () => setActionLoading(null),
      },
    );
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    setActionLoading(rejectTarget.id);
    await updatePolicy(
      {
        resource: "cancellations",
        id: rejectTarget.id,
        values: {
          status: "active",
          comment: rejectComment || "no reason given",
        },
      },
      {
        onSuccess: () => {
          refetch();
          setRejectTarget(null);
          setRejectComment("");
        },
        onSettled: () => setActionLoading(null),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-semibold text-text-primary">
          Cancellation Queue
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
            Cancellation Queue
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {policies.length} pending cancellation
            {policies.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search by policy number or insurer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-md border border-border-subtle bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-electric focus:outline-none focus:shadow-focus"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8" />
            <TableHead>Policy</TableHead>
            <TableHead>Insurer</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Refund</TableHead>
            <TableHead>Period</TableHead>
            <TableHead className="w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-text-tertiary py-16"
              >
                No pending cancellations
              </TableCell>
            </TableRow>
          ) : (
            policies.map((policy) => (
              <>
                <TableRow
                  key={policy.id}
                  className="cursor-pointer"
                  onClick={() =>
                    setExpandedId(
                      expandedId === policy.id ? null : policy.id,
                    )
                  }
                >
                  <TableCell>
                    {expandedId === policy.id ? (
                      <ChevronDown className="h-4 w-4 text-text-tertiary" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-text-tertiary" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {policy.policyNumber ?? "\u2014"}
                  </TableCell>
                  <TableCell>{policy.insurerCode}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{policy.policyType}</Badge>
                  </TableCell>
                  <TableCell className="tabular-nums font-mono">
                    {policy.totalAmount
                      ? `${Number(policy.totalAmount).toLocaleString("ro-RO", { minimumFractionDigits: 2 })} ${policy.currency ?? "RON"}`
                      : "\u2014"}
                  </TableCell>
                  <TableCell>
                    <RefundBubble info={policy.refund} />
                  </TableCell>
                  <TableCell className="text-text-secondary text-xs">
                    {policy.startDate} \u2014 {policy.endDate}
                  </TableCell>
                  <TableCell>
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={actionLoading === policy.id}
                        onClick={() => handleApprove(policy)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={actionLoading === policy.id}
                        onClick={() => setRejectTarget(policy)}
                      >
                        <XCircle className="h-4 w-4 text-danger" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedId === policy.id && (
                  <TableRow key={`${policy.id}-detail`}>
                    <TableCell
                      colSpan={8}
                      className="bg-neutral-50/50 p-4"
                    >
                      <div className="grid grid-cols-3 gap-x-6 gap-y-4 text-sm">
                        <div>
                          <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">
                            User ID
                          </p>
                          <p className="font-mono text-xs">
                            {policy.userId}
                          </p>
                        </div>
                        <div>
                          <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">
                            Created
                          </p>
                          <p>
                            {policy.createdAt
                              ? new Date(
                                  policy.createdAt,
                                ).toLocaleString("ro-RO")
                              : "\u2014"}
                          </p>
                        </div>
                        <div>
                          <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">
                            Cancellation Reason
                          </p>
                          <p>{policy.cancellationReason ?? "\u2014"}</p>
                        </div>
                        <div>
                          <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">
                            Premium Net
                          </p>
                          <p className="font-mono">
                            {formatRon(policy.premiumNet)}
                          </p>
                        </div>
                        <div>
                          <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">
                            Status
                          </p>
                          <StatusBadge status={policy.status} />
                        </div>
                        <div>
                          <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">
                            Withdrawal Until
                          </p>
                          <p>
                            {policy.withdrawalUntil
                              ? new Date(
                                  policy.withdrawalUntil,
                                ).toLocaleDateString("ro-RO")
                              : "\u2014"}
                          </p>
                        </div>
                      </div>

                      {/* Refund calculation */}
                      <RefundDetail info={policy.refund} />

                      {/* Policy documents */}
                      {(policy.pdfUrl || policy.ipidUrl) && (
                        <div className="mt-4 pt-4 border-t border-border-subtle">
                          <p className="text-text-tertiary text-xs uppercase tracking-wider mb-2">
                            Policy Documents
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {policy.pdfUrl && (
                              <a
                                href={policy.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-md bg-electric-soft px-3 py-1.5 text-xs font-medium text-electric hover:bg-electric/10 transition-colors"
                              >
                                <FileText className="h-3.5 w-3.5" />
                                Policy PDF
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            {policy.ipidUrl && (
                              <a
                                href={policy.ipidUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-md bg-electric-soft px-3 py-1.5 text-xs font-medium text-electric hover:bg-electric/10 transition-colors"
                              >
                                <FileText className="h-3.5 w-3.5" />
                                IPID
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Uploaded documents */}
                      {policy.documents.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border-subtle">
                          <p className="text-text-tertiary text-xs uppercase tracking-wider mb-2">
                            Uploaded Documents (
                            {policy.documents.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {policy.documents.map((doc) => (
                              <a
                                key={doc.id}
                                href={doc.fileUrl ?? "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  "inline-flex items-center gap-1.5 rounded-md border border-border-subtle px-3 py-1.5 text-xs font-medium hover:bg-surface-hover transition-colors",
                                  !doc.fileUrl &&
                                    "opacity-50 cursor-not-allowed",
                                )}
                                onClick={(e) => {
                                  if (!doc.fileUrl) e.preventDefault();
                                }}
                              >
                                <FileText className="h-3.5 w-3.5 text-text-tertiary" />
                                {docLabel(doc.type)}
                                {doc.sizeBytes != null && (
                                  <span className="text-text-tertiary ml-0.5">
                                    ({formatBytes(doc.sizeBytes)})
                                  </span>
                                )}
                                {doc.fileUrl && (
                                  <ExternalLink className="h-3 w-3 text-text-tertiary" />
                                )}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {policy.documents.length === 0 && (
                        <div className="mt-4 pt-4 border-t border-border-subtle">
                          <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">
                            Uploaded Documents
                          </p>
                          <p className="text-xs text-text-tertiary italic">
                            No documents uploaded for this policy.
                          </p>
                        </div>
                      )}

                      {/* Refund processing toggle */}
                      {policy.refund.eligible && (
                        <div className="mt-4 pt-4 border-t border-border-subtle">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={
                                approveRefund[policy.id] ??
                                policy.refund.eligible
                              }
                              onChange={(e) =>
                                setApproveRefund((prev) => ({
                                  ...prev,
                                  [policy.id]: e.target.checked,
                                }))
                              }
                              className="h-4 w-4 rounded border-border-subtle text-electric focus:ring-electric cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="text-xs text-text-secondary">
                              Process refund on approval
                            </span>
                          </label>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog
        open={rejectTarget !== null}
        onOpenChange={(o) => {
          if (!o) {
            setRejectTarget(null);
            setRejectComment("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Cancellation</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting the cancellation of policy{" "}
              <strong>{rejectTarget?.policyNumber}</strong>. This will restore
              the policy to active status.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-text-primary">
              Internal Comment
            </label>
            <textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="Reason for rejection..."
              rows={4}
              className="w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-electric focus:outline-none focus:shadow-focus resize-none"
            />
            <p className="text-xs text-text-tertiary">
              This comment is stored as the cancellation reason and visible in
              the audit log.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="primary"
              disabled={actionLoading !== null}
              onClick={handleReject}
            >
              {actionLoading === rejectTarget?.id
                ? "Processing..."
                : "Reject & Restore"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RefundBubble({ info }: { info: RefundInfo }) {
  if (!info.eligible) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-text-tertiary">
        <Clock className="h-3 w-3" />
        No refund
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs text-success">
      <BadgeCheck className="h-3 w-3" />
      {info.amount != null
        ? `${info.amount.toLocaleString("ro-RO", { minimumFractionDigits: 2 })} ${info.currency ?? "RON"}`
        : "Eligible"}
    </span>
  );
}

function RefundDetail({ info }: { info: RefundInfo }) {
  if (!info.eligible) {
    return (
      <div className="mt-4 pt-4 border-t border-border-subtle">
        <p className="text-text-tertiary text-xs uppercase tracking-wider mb-2">
          Refund Status
        </p>
        <div className="rounded-md bg-neutral-50 p-3 text-sm">
          <p className="text-text-secondary">
            Outside the 14-day withdrawal period. No refund is due.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-border-subtle">
      <p className="text-text-tertiary text-xs uppercase tracking-wider mb-2">
        Refund Status
      </p>
      <div className="rounded-md bg-success-soft/30 p-3 text-sm space-y-1">
        <p className="text-success font-medium">
          Full refund eligible (within 14-day withdrawal period)
        </p>
        {info.amount != null && (
          <p className="text-text-secondary">
            Refund amount:{" "}
            <span className="font-mono font-medium text-text-primary">
              {info.amount.toLocaleString("ro-RO", {
                minimumFractionDigits: 2,
              })}{" "}
              {info.currency ?? "RON"}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
