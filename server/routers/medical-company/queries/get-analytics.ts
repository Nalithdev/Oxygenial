import { medicalStaffProcedure } from "@/server/middleware/roles";
import { database } from "@/db";
import { membershipRequestsTable } from "@/db/schema/global";
import { eq } from "drizzle-orm";

export const getAnalytics = medicalStaffProcedure.handler(async ({ context }) => {
  const requests = await database.query.membershipRequestsTable.findMany({
    where: eq(membershipRequestsTable.medicalCompanyId, context.medicalCompany.id),
    with: { clientCompany: true },
    orderBy: (r, { desc }) => [desc(r.createdAt)],
  });

  const total = requests.length;
  const accepted = requests.filter((r) => r.status === "accepted").length;
  const pending = requests.filter((r) => r.status === "pending").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;
  const conversionRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

  const sectorMap: Record<string, number> = {};
  const cityMap: Record<string, number> = {};

  for (const r of requests) {
    const sector = r.clientCompany?.sector ?? "Non renseigné";
    sectorMap[sector] = (sectorMap[sector] ?? 0) + 1;

    const city = r.clientCompany?.city ?? "Non renseignée";
    cityMap[city] = (cityMap[city] ?? 0) + 1;
  }

  const topSectors = Object.entries(sectorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  const topCities = Object.entries(cityMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  return { total, accepted, pending, rejected, conversionRate, topSectors, topCities };
});
