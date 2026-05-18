import { os } from "@orpc/server";
import type { AppContext } from "../context";
import { policiesRouter } from "./policies";
import { usersRouter } from "./users";
import { paymentsRouter } from "./payments";
import { insurersRouter } from "./insurers";
import { leasingRouter } from "./leasing";
import { auditRouter } from "./audit";
import { legalDocsRouter } from "./legal-docs";
import { statsRouter } from "./stats";
import { apiClientsRouter } from "./api-clients";
import { settingsRouter } from "./settings";
import { cancellationsRouter } from "./cancellations";

export const adminRouter = os.$context<AppContext>().router({
  policies: policiesRouter,
  users: usersRouter,
  payments: paymentsRouter,
  insurers: insurersRouter,
  leasing: leasingRouter,
  audit: auditRouter,
  legalDocuments: legalDocsRouter,
  stats: statsRouter,
  apiClients: apiClientsRouter,
  settings: settingsRouter,
  cancellations: cancellationsRouter,
});
