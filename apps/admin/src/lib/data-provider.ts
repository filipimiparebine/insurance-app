import { orpc } from "./orpc-client";

function asRecord<T>(v: T): Record<string, unknown> {
  return v as unknown as Record<string, unknown>;
}

export const dataProvider = {
  getList: async ({ resource, pagination }) => {
    const page = pagination?.current ?? 1;
    const perPage = pagination?.pageSize ?? 25;

    if (resource === "cancellations") {
      const r = await orpc.admin.cancellations.list({ page, perPage });
      return { data: r.data as Record<string, unknown>[], total: r.total };
    }

    if (resource === "dashboard") {
      await orpc.admin.stats.dashboard({});
      return { data: [], total: 0 };
    }

    if (resource === "policies") {
      const r = await orpc.admin.policies.list({ page, perPage });
      return { data: r.data as Record<string, unknown>[], total: r.total };
    }
    if (resource === "users") {
      const r = await orpc.admin.users.list({ page, perPage });
      return { data: r.data as Record<string, unknown>[], total: r.total };
    }
    if (resource === "payments") {
      const r = await orpc.admin.payments.list({ page, perPage });
      return { data: r.data as Record<string, unknown>[], total: r.total };
    }
    if (resource === "insurers") {
      const r = await orpc.admin.insurers.list({ page, perPage });
      return { data: r.data as Record<string, unknown>[], total: r.total };
    }
    if (resource === "leasing_companies") {
      const r = await orpc.admin.leasing.list({ page, perPage });
      return { data: r.data as Record<string, unknown>[], total: r.total };
    }
    if (resource === "audit_log") {
      const r = await orpc.admin.audit.list({ page, perPage });
      return { data: r.data as Record<string, unknown>[], total: r.total };
    }
    if (resource === "legal_documents") {
      const r = await orpc.admin.legalDocuments.list({ page, perPage });
      return { data: r.data as Record<string, unknown>[], total: r.total };
    }
    if (resource === "apiClients") {
      const r = await orpc.admin.apiClients.list({ page, perPage });
      return { data: r.data as Record<string, unknown>[], total: r.total };
    }

    throw new Error(`Unknown list resource: ${resource}`);
  },

  getOne: async ({ resource, id }) => {
    const sid = String(id);
    switch (resource) {
      case "policies": return { data: asRecord(await orpc.admin.policies.getOne({ id: sid })) };
      case "users": return { data: asRecord(await orpc.admin.users.getOne({ id: sid })) };
      case "payments": return { data: asRecord(await orpc.admin.payments.getOne({ id: sid })) };
      case "insurers": return { data: asRecord(await orpc.admin.insurers.getOne({ code: sid })) };
      case "leasing_companies": return { data: asRecord(await orpc.admin.leasing.getOne({ id: sid })) };
      case "audit_log": return { data: asRecord(await orpc.admin.audit.getOne({ id: sid })) };
      case "legal_documents": return { data: asRecord(await orpc.admin.legalDocuments.getOne({ id: sid })) };
      case "apiClients": return { data: asRecord(await orpc.admin.apiClients.getOne({ id: sid })) };
      default: throw new Error(`Unknown getOne resource: ${resource}`);
    }
  },

  create: async ({ resource, variables }) => {
    switch (resource) {
      case "insurers": return { data: asRecord(await orpc.admin.insurers.create(variables as { code: string; name: string; brokerCommissionPct: number })) };
      case "leasing_companies": return { data: asRecord(await orpc.admin.leasing.create(variables as { name: string; cui: string })) };
      case "legal_documents": return { data: asRecord(await orpc.admin.legalDocuments.create(variables as { type: string; version: string; contentUrl: string; effectiveDate: string; active?: boolean })) };
      case "apiClients": return { data: asRecord(await orpc.admin.apiClients.create(variables as { name: string; rateLimitPerMin?: number })) };
      default: throw new Error(`Unknown create resource: ${resource}`);
    }
  },

  update: async ({ resource, id, variables }) => {
    const sid = String(id);
    switch (resource) {
      case "cancellations": {
        const vars = variables as Record<string, unknown>;
        if (vars.status === "cancelled") {
          return { data: asRecord(await orpc.admin.cancellations.approve({ policyId: sid, processRefund: (vars.processRefund as boolean) ?? false })) };
        }
        if (vars.status === "active") {
          return { data: asRecord(await orpc.admin.cancellations.reject({ policyId: sid, comment: (vars.comment as string) ?? "no reason given" })) };
        }
        throw new Error("Unknown cancellation action");
      }
      case "policies": return { data: asRecord(await orpc.admin.policies.update({ id: sid, ...(variables as Record<string, unknown>) } as { id: string; status?: string })) };
      case "insurers": return { data: asRecord(await orpc.admin.insurers.update({ code: sid, ...(variables as Record<string, unknown>) } as { code: string; name?: string; active?: boolean; brokerCommissionPct?: number })) };
      case "leasing_companies": return { data: asRecord(await orpc.admin.leasing.update({ id: sid, ...(variables as Record<string, unknown>) } as { id: string; name?: string; cui?: string; active?: boolean })) };
      case "legal_documents": return { data: asRecord(await orpc.admin.legalDocuments.update({ id: sid, ...(variables as Record<string, unknown>) } as { id: string; version?: string; contentUrl?: string; effectiveDate?: string; active?: boolean })) };
      case "apiClients": return { data: asRecord(await orpc.admin.apiClients.update({ id: sid, ...(variables as Record<string, unknown>) } as { id: string; name?: string; rateLimitPerMin?: number; active?: boolean })) };
      default: throw new Error(`Unknown update resource: ${resource}`);
    }
  },

  deleteOne: async ({ resource, id }) => {
    const sid = String(id);
    switch (resource) {
      case "policies": await orpc.admin.policies.delete({ id: sid }); break;
      case "insurers": await orpc.admin.insurers.delete({ code: sid }); break;
      case "leasing_companies": await orpc.admin.leasing.delete({ id: sid }); break;
      case "legal_documents": await orpc.admin.legalDocuments.delete({ id: sid }); break;
      case "apiClients": await orpc.admin.apiClients.revoke({ id: sid }); break;
      default: throw new Error(`Unknown delete resource: ${resource}`);
    }
    return { data: { id: sid } };
  },

  getApiUrl: () => "",
} as DataProvider;
