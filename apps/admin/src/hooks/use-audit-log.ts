"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { orpc } from "@/lib/orpc-client";

export type AuditLogFilters = {
  search: string;
  action: string;
  from: string;
  to: string;
};

type AuditEntry = {
  id: string;
  userId: string | null;
  actorId: string | null;
  action: string | null;
  fieldName: string | null;
  recordId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
};

const PER_PAGE = 25;

export function useAuditLog(filters: AuditLogFilters) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const filterKeyRef = useRef("");

  const currentFilterKey = `${filters.search}|${filters.action}|${filters.from}|${filters.to}`;

  const loadMore = useCallback(() => {
    if (fetchingRef.current || !hasMoreRef.current) return;
    setPage((p) => p + 1);
  }, []);

  const sentinelRef = useCallback(
    (el: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) loadMore();
        },
        { rootMargin: "200px" },
      );
      observer.observe(el);
      observerRef.current = observer;
    },
    [loadMore],
  );

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentFilterKey === filterKeyRef.current) return;
    filterKeyRef.current = currentFilterKey;
    hasMoreRef.current = true;
    fetchingRef.current = false;
    setEntries([]);
    setTotal(0);
    setPage(1);
    setHasMore(true);
  }, [currentFilterKey]);

  useEffect(() => {
    let cancelled = false;
    const isFirstPage = page === 1;

    async function fetchPage() {
      if (isFirstPage) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      fetchingRef.current = true;

      try {
        const params: Record<string, unknown> = { page, perPage: PER_PAGE };
        if (filters.action && filters.action !== "all") params.action = filters.action;
        if (filters.search) params.search = filters.search;
        if (filters.from) params.from = filters.from;
        if (filters.to) params.to = filters.to;

        const r = await orpc.admin.audit.list(
          params as Parameters<typeof orpc.admin.audit.list>[0],
        );

        if (cancelled) return;

        setTotal(r.total);
        setEntries((prev) => {
          const next = isFirstPage
            ? (r.data as AuditEntry[])
            : [...prev, ...(r.data as AuditEntry[])];
          hasMoreRef.current = next.length < r.total;
          return next;
        });
        setHasMore(hasMoreRef.current);
      } catch {
        if (!cancelled) {
          hasMoreRef.current = false;
          setHasMore(false);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsLoadingMore(false);
          fetchingRef.current = false;
        }
      }
    }

    fetchPage();
    return () => { cancelled = true; };
  }, [page, currentFilterKey]);

  const availableActions = Array.from(
    new Set(entries.map((e) => e.action).filter(Boolean) as string[]),
  ).sort();

  return {
    entries,
    total,
    isLoading,
    isLoadingMore,
    hasMore,
    sentinelRef,
    availableActions,
  };
}
