"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMenu } from "@refinedev/core";
import { ShieldCheck, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AdminSidebar() {
  const pathname = usePathname();
  const { menuItems } = useMenu();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-border-subtle bg-surface">
      <div className="flex h-16 items-center gap-3 border-b border-border-subtle px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary">
          <ShieldCheck className="h-5 w-5 text-on-brand" />
        </div>
        <div>
          <p className="font-display font-semibold text-base text-brand-primary leading-tight">
            blaj.io
          </p>
          <p className="text-[10px] text-text-tertiary uppercase tracking-widest">
            Admin
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="flex flex-col gap-0.5">
          {menuItems.map((item) => {
            const href = item.list ?? item.route ?? "/";
            if (typeof href !== "string") return null;

            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);

            const Icon = item.meta?.icon;
            const label = item.meta?.label ?? item.name;

            return (
              <li key={item.key}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-fast",
                    isActive
                      ? "bg-brand-primary text-on-brand"
                      : "text-text-secondary hover:text-text-primary hover:bg-hover-overlay"
                  )}
                >
                  {Icon && <span className="flex h-4 w-4 items-center justify-center [&>svg]:h-4 [&>svg]:w-4">{Icon}</span>}
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border-subtle p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-text-secondary"
          asChild
        >
          <Link href="/">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </aside>
  );
}
