import { createDb } from "../client";
import { leasingCompanies, insurers, appConfig } from "../schema";
import { leasingCompanies as leasingData, insurers as insurerData, appConfig as appConfigData } from "./data";

async function seed() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL is required for seeding");
    process.exit(1);
  }

  const db = createDb(dbUrl);

  for (const item of insurerData) {
    const existing = await db.query.insurers.findFirst({
      where: (t, { eq }) => eq(t.code, item.code),
    });
    if (!existing) {
      await db.insert(insurers).values({
        code: item.code,
        name: item.name,
        brokerCommissionPct: item.brokerCommissionPct,
        apiEndpoint: item.apiEndpoint,
      });
      console.log(`Seeded insurer: ${item.name}`);
    } else {
      console.log(`Insurer already exists: ${item.name}`);
    }
  }

  for (const item of leasingData) {
    const existing = await db.query.leasingCompanies.findFirst({
      where: (t, { eq }) => eq(t.name, item.name),
    });
    if (!existing) {
      await db.insert(leasingCompanies).values({
        name: item.name,
        cui: item.cui,
      });
      console.log(`Seeded leasing company: ${item.name}`);
    } else {
      console.log(`Leasing company already exists: ${item.name}`);
    }
  }

  for (const item of appConfigData) {
    const existing = await db.query.appConfig.findFirst({
      where: (t, { eq }) => eq(t.key, item.key),
    });
    if (!existing) {
      await db.insert(appConfig).values(item);
      console.log(`Seeded app config: ${item.key}=${item.value}`);
    } else {
      console.log(`App config already exists: ${item.key}`);
    }
  }

  console.log("Seed complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
