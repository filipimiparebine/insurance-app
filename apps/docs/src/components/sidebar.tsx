"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Overview", icon: "H" },
  { href: "/getting-started", label: "Getting Started", icon: "S" },
  { href: "/reference", label: "API Reference", icon: "R" },
  { href: "/authentication", label: "Authentication", icon: "A" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: "var(--sidebar-width)",
        background: "var(--color-bg-card)",
        borderRight: "1px solid var(--color-border)",
        padding: "2rem 1.25rem",
        overflowY: "auto",
        zIndex: 10,
      }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/"
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#0f172a",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              background: "var(--color-accent)",
              color: "white",
              width: 28,
              height: 28,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.85rem",
              fontWeight: 800,
            }}
          >
            B
          </span>
          blaj.io Docs
        </Link>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <li key={item.href} style={{ marginBottom: "0.25rem" }}>
              <Link
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.5rem 0.75rem",
                  borderRadius: 6,
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--color-accent)" : "#475569",
                  background: isActive ? "#eff6ff" : "transparent",
                  textDecoration: "none",
                  transition: "background 0.1s, color 0.1s",
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    background: isActive
                      ? "var(--color-accent)"
                      : "var(--color-border)",
                    color: isActive ? "white" : "#64748b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div
        style={{
          marginTop: "auto",
          paddingTop: "2rem",
          borderTop: "1px solid var(--color-border)",
          position: "absolute",
          bottom: "2rem",
          left: "1.25rem",
          right: "1.25rem",
        }}
      >
        <p style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: 1.5 }}>
          blaj.io API v1.0.0
          <br />
          <a
            href="https://blaj.io"
            target="_blank"
            rel="noopener"
            style={{ color: "var(--color-accent)" }}
          >
            blaj.io
          </a>
        </p>
      </div>
    </nav>
  );
}
