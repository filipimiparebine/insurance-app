"use client";

import { useState } from "react";
import {
  Search, Filter, X, CalendarDays,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAuditLog } from "@/hooks/use-audit-log";

const DATE_INPUT =
  "h-10 rounded-md border border-border-subtle bg-surface px-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-electric focus:outline-none focus:shadow-focus";

function formatTimestamp(ts: string) {
  const d = new Date(ts);
  return d.toLocaleString("ro-RO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function truncateId(id: string | null) {
  if (!id) return "\u2014";
  return id.length > 8 ? `${id.slice(0, 8)}...` : id;
}

export function AuditLogContent() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const {
    entries,
    total,
    isLoading,
    isLoadingMore,
    hasMore,
    sentinelRef,
    availableActions,
  } = useAuditLog({
    search,
    action: actionFilter,
    from: dateFrom,
    to: dateTo,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-text-primary">
          Audit Log
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Read-only record of all administrative actions ({total} total)
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search by ID, action, field, IP..."
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

        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-text-tertiary shrink-0" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className={`${DATE_INPUT} w-[150px]`}
            aria-label="From date"
          />
          <span className="text-text-tertiary text-sm">\u2013</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className={`${DATE_INPUT} w-[150px]`}
            aria-label="To date"
          />
          {(dateFrom || dateTo) && (
            <button
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
              className="p-2 text-text-tertiary hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Filter className="h-4 w-4 text-text-tertiary" />
        <Select
          value={actionFilter}
          onValueChange={(v) => setActionFilter(v)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {availableActions.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && entries.length === 0 ? (
        <p className="text-sm text-text-secondary">Loading audit log...</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Record</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-text-tertiary py-16">
                    No audit log entries match your filters
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-xs font-mono whitespace-nowrap">
                      {formatTimestamp(entry.createdAt)}
                    </TableCell>
                    <TableCell>
                      <span
                        className="font-mono text-xs"
                        title={`User: ${entry.userId ?? "\u2014"}`}
                      >
                        {truncateId(entry.actorId)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.action}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-text-secondary max-w-[120px] truncate">
                      {entry.fieldName ?? "\u2014"}
                    </TableCell>
                    <TableCell className="font-mono text-xs max-w-[120px] truncate">
                      {truncateId(entry.recordId)}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-text-secondary">
                      {entry.ipAddress ?? "\u2014"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {entries.length > 0 && (
            <div
              ref={sentinelRef}
              className="py-4 text-center text-sm text-text-tertiary"
            >
              {isLoadingMore
                ? "Loading more..."
                : hasMore
                  ? `${entries.length} of ${total} entries shown`
                  : `All ${total} entries loaded`}
            </div>
          )}
        </>
      )}
    </div>
  );
}
