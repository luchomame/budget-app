// routes/home.tsx
import { db } from "~/db";
import { debts } from "~/db/schema";
import type { Route } from "./+types/drizzle";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { SectionCards } from "@/components/dashboard/section-cards";
import { SiteHeader } from "@/components/dashboard/site-header";

import data from "@/data.json";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const data = await db.select().from(debts);
    console.log("Fetched debts:", data);
    return { data };
  } catch (error) {
    console.error("Error fetching debts:", error);
    return new Response("Error fetching debts", { status: 500 });
  }
}

export default function Page() {
  return (
    <>
      <SiteHeader header="Drizzle" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
