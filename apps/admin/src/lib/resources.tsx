import type { IResourceItem } from "@refinedev/core";
import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  Building2,
  Building,
  History,
  Settings,
  Webhook,
  XCircle,
  FileCheck,
} from "lucide-react";

export const resources: IResourceItem[] = [
  {
    name: "dashboard",
    list: "/",
    meta: {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
  },
  {
    name: "insurers",
    list: "/insurers",
    meta: {
      label: "Insurers",
      icon: <Building2 className="h-4 w-4" />,
    },
  },
  {
    name: "leasing_companies",
    list: "/leasing-companies",
    meta: {
      label: "Leasing Companies",
      icon: <Building className="h-4 w-4" />,
    },
  },
  {
    name: "policies",
    list: "/policies",
    meta: {
      label: "Policies",
      icon: <FileText className="h-4 w-4" />,
    },
  },
  {
    name: "cancellations",
    list: "/cancellations",
    meta: {
      label: "Cancellations",
      icon: <XCircle className="h-4 w-4" />,
    },
  },
  {
    name: "users",
    list: "/users",
    meta: {
      label: "Users",
      icon: <Users className="h-4 w-4" />,
    },
  },
  {
    name: "payments",
    list: "/payments",
    meta: {
      label: "Payments",
      icon: <CreditCard className="h-4 w-4" />,
    },
  },
  {
    name: "audit_log",
    list: "/audit-log",
    meta: {
      label: "Audit Log",
      icon: <History className="h-4 w-4" />,
    },
  },
  {
    name: "legal_documents",
    list: "/legal-documents",
    meta: {
      label: "Legal Documents",
      icon: <FileCheck className="h-4 w-4" />,
    },
  },
  {
    name: "api_clients",
    list: "/api-clients",
    meta: {
      label: "API Clients",
      icon: <Webhook className="h-4 w-4" />,
    },
  },
  {
    name: "settings",
    list: "/settings",
    meta: {
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  },
];
