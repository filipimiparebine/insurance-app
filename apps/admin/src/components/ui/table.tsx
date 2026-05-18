import * as React from "react";
import { cn } from "@/lib/utils";

function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return <div className="relative w-full overflow-auto rounded-lg border border-border-subtle"><table className={cn("w-full caption-bottom text-sm", className)} {...props} /></div>;
}
function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-neutral-100/60 border-b border-border-subtle", className)} {...props} />;
}
function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}
function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("border-b border-border-subtle transition-colors hover:bg-hover-overlay", className)} {...props} />;
}
function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("h-11 px-4 text-left align-middle font-medium text-text-secondary text-xs uppercase tracking-wider", className)} {...props} />;
}
function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3 align-middle text-text-primary", className)} {...props} />;
}

Table.displayName = "Table"; TableHeader.displayName = "TableHeader"; TableBody.displayName = "TableBody";
TableRow.displayName = "TableRow"; TableHead.displayName = "TableHead"; TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
