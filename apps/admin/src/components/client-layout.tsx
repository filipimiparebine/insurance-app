"use client";

import { UserButton } from "@clerk/nextjs";
import { AdminSidebar } from "@/components/admin-sidebar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <AdminSidebar />
      <div className="pl-[260px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border-subtle bg-surface/80 backdrop-blur-sm px-8">
          <span className="text-sm font-medium text-text-secondary">
            Admin Panel <span className="text-text-tertiary font-normal">v1.0</span>
          </span>
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: "h-8 w-8" } }}
          />
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
