// paychecks/all.tsx
// TODO: Make these shits editable!!! want to be able to click on a paycheck, pull up a sheet, and edit it!!!!!!!!!!!!!!!!!!!!!!!!!!!!
import * as React from "react";
import { type Paycheck } from "../helper";
import {
  useFetcher,
  useNavigate,
  useSearchParams,
  type LoaderFunctionArgs,
} from "react-router";
import { paychecks } from "~/db/schema";
import { db } from "~/db";
import { desc, gt } from "drizzle-orm";
import type { Route } from "./+types/index";
import { Button } from "~/components/ui/button";
import { ArrowLeftIcon, Pencil, SlidersHorizontal } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Separator } from "~/components/ui/separator";
import EditSheet from "./EditSheet";
import FilterSheet from "./FilterSheet";

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
  const [filterSheetOpen, setFilterSheetOpen] = React.useState(false);
  const [selectedPaycheck, setSelectedPaycheck] =
    React.useState<Paycheck | null>(null);
  const [editSheetOpen, setEditSheetOpen] = React.useState(false);

  const [isEditing, setIsEditing] = React.useState(false);

  const type: "all" | "one-time" | "recurring" =
    searchParams.get("type") == "all"
      ? "all"
      : searchParams.get("type") === "recurring"
      ? "recurring"
      : "one-time";
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

      <div className="pl-2 pr-2 mb-2 space-y-4 ">
        <ul className="divide-y text-sm">
          {paychecks.map((p) => (
            <li
              key={p.paycheckId}
              className="py-2 cursor-pointer px-2 rounded-sm transition-colors hover:bg-muted/50 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => {
                console.log("Selected paycheck:", p);
                setSelectedPaycheck(p);
                setEditSheetOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  console.log("Key down on paycheck:", p);
                  e.preventDefault();
                  setSelectedPaycheck(p);
                  setEditSheetOpen(true);
                }
              }}
            >
              <div className="flex justify-between">
                <span>{p.employer}</span>
                <span className="tabular-nums">
                  ${Number(p.amount).toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {p.depositDate} · {p.isRecurring ? "Recurring" : "One-time"}{" "}
                {p.frequency && `· ${p.frequency}`}{" "}
              </div>
            </li>
          ))}
          <p className="flex justify-center  mt-4 text-sm text-muted-foreground">
            End of Paychecks
          </p>
        </ul>

        <EditSheet
          fetcher={fetcher}
          editSheetOpen={editSheetOpen}
          setEditSheetOpen={setEditSheetOpen}
          selectedPaycheck={selectedPaycheck}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
        />

        <FilterSheet
          filterSheetOpen={filterSheetOpen}
          setFilterSheetOpen={setFilterSheetOpen}
          type={type}
          range={range}
          updateFilter={updateFilter}
        />
      </div>
    </>
  );
}
