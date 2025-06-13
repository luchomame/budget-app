// paychecks/all.tsx
import * as React from "react";
import { type Paycheck } from "../helper";
import {
  useFetcher,
  useNavigate,
  useSearchParams,
  type LoaderFunctionArgs,
} from "react-router";
import { SiteHeader } from "~/components/dashboard/site-header";
import { paychecks } from "~/db/schema";
import { db } from "~/db";
import { desc, eq, gt, lt } from "drizzle-orm";
import type { Route } from "./+types/index";
import { Button } from "~/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

// ---- Loader Logic ----
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const range = url.searchParams.get("range") ?? "30d";

  // Calculate cutoff date
  const days = rangeToDays(range);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  // TODO: remove this when I make a paychecks API. at the moment every filter makes a round trip to the server.
  // POST MVP FIX THIS SHIT PLEASE
  console.log(`Cutoff date: ${cutoff.toISOString()}`);

  const records = await db
    .select()
    .from(paychecks)
    .where(gt(paychecks.depositDate, cutoff.toISOString()))
    .orderBy(desc(paychecks.createdAt));

  return new Response(JSON.stringify(records), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function rangeToDays(range: string): number {
  switch (range) {
    case "30d":
      return 30;
    case "60d":
      return 60;
    case "6m":
      return 180;
    case "1y":
      return 365;
    case "2y":
      return 730;
    case "all":
      return 10000;
    default:
      return 30;
  }
}

function filterPaychecks(
  data: Paycheck[],
  range: number,
  type: string
): Paycheck[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - range);

  return data.filter((p) => {
    const dateOk = p.depositDate && new Date(p.depositDate) >= cutoff;
    const typeOk =
      type === "all"
        ? true
        : type === "recurring"
        ? p.isRecurring
        : !p.isRecurring;

    return dateOk && typeOk;
  });
}

// ---- Component ----

export default function ViewAllPaychecksPage({
  loaderData,
}: Route.ComponentProps) {
  const { result: records }: { result: Paycheck[] } = loaderData;

  const fetcher = useFetcher();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [paychecks, setPaychecks] = React.useState<Paycheck[]>(records || []);

  const type = searchParams.get("type") ?? "all";
  const range = searchParams.get("range") ?? "30d";

  const fetchedDataRef = React.useRef<Paycheck[] | null>(records || []);
  const maxFetchedRange = React.useRef<number>(0);

  const currentDays = rangeToDays(range);

  // Check cache or fetch
  React.useEffect(() => {
    console.log(
      `Current range: ${range}, days: ${currentDays}, max fetched range: ${maxFetchedRange.current}`
    );
    if (!fetchedDataRef.current || currentDays > maxFetchedRange.current) {
      console.log("Fetching new data");
      fetcher.load(`/paychecks/all?range=${range}`); // fetch larger range
    } else {
      console.log("Using cached data");
      // Filter locally
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - currentDays);
      console.log("Cutoff date for filtering:", cutoff.toISOString());
      setPaychecks(filterPaychecks(fetchedDataRef.current, currentDays, type));
    }
  }, [range, type]);

  // On fetcher result
  React.useEffect(() => {
    if (fetcher.data) {
      fetchedDataRef.current = fetcher.data;
      maxFetchedRange.current = currentDays;

      // Immediately filter for current view
      setPaychecks(
        filterPaychecks(fetchedDataRef.current ?? [], currentDays, type)
      );
    }
  }, [fetcher.data]);

  function updateFilter(newType: string, newRange: string) {
    setSearchParams({ type: newType, range: newRange });
  }

  return (
    <>
      {/* <SiteHeader header="View All Paychecks" /> */}
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) sticky top-0 bg-background z-10">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <div className=" flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/paychecks")}
              className="px-2"
            >
              <ArrowLeftIcon
                style={{ width: "20px", height: "20px" }}
                className="mr-1 h-4 w-4"
              />
            </Button>
            <h1 className="text-lg font-semibold">All Paychecks</h1>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <div className="flex gap-2  p-2 rounded-md shadow-sm">
          <button onClick={() => updateFilter("recurring", range)}>
            Recurring
          </button>
          <button onClick={() => updateFilter("one-time", range)}>
            One-Time
          </button>
          <button onClick={() => updateFilter("all", range)}>All</button>

          <button onClick={() => updateFilter(type, "30d")}>30d</button>
          <button onClick={() => updateFilter(type, "60d")}>60d</button>
          <button onClick={() => updateFilter(type, "6m")}>6m</button>
          <button onClick={() => updateFilter(type, "1y")}>1y</button>
          <button onClick={() => updateFilter(type, "2y")}>2y</button>
        </div>

        <ul className="divide-y text-sm">
          {paychecks.map((p) => (
            <li key={p.paycheckId} className="py-2">
              <div className="flex justify-between">
                <span>{p.employer}</span>
                <span className="tabular-nums">
                  ${Number(p.amount).toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {p.depositDate} · {p.isRecurring ? "Recurring" : "One-time"}{" "}
                {p.frequency && `· ${p.frequency}`}{" "}
                {/* {p.expected_day && `· ${p.expected_day}`} */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
