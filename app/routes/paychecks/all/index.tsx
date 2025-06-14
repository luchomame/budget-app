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
import { desc, eq, gt } from "drizzle-orm";
import type { Route } from "./+types/index";
import { Button } from "~/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import EditSheet from "./EditSheet";
import FilterSheet from "./FilterSheet";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";

const paycheckSchema = z.object({
  paycheckId: z.string().uuid(), // MUST be a valid UUID string
  employer: z.string().trim().min(1).max(100), // Trim whitespace, require length ≥ 1
  amount: z
    .string() // comes in from form as a string
    .transform((val) => parseFloat(val)) // convert to number
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Amount must be a valid number",
    })
    .transform((val) => val.toFixed(2)), // Convert to string with 2 decimal places
  is_recurring: z.string().transform((val) => val === "true"), // "true" or "false" → boolean
  deposit_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  frequency: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || ["weekly", "biweekly", "monthly", "semimonthly"].includes(val),
      {
        message: "Frequency must be one of the allowed options",
      }
    ),
});

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

  const records = await db
    .select()
    .from(paychecks)
    .where(gt(paychecks.depositDate, cutoff.toISOString()))
    .orderBy(desc(paychecks.depositDate));

  return new Response(JSON.stringify(records), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const raw = Object.fromEntries(formData.entries()); // Converts FormData -> JS object
  const parsed = paycheckSchema.safeParse(raw);

  if (!parsed.success) {
    // You can handle this with error messages, redirect, etc.
    console.error(parsed.error.format());
    return new Response("Invalid input", { status: 400 });
  }

  const {
    paycheckId,
    employer,
    amount,
    is_recurring,
    deposit_date,
    frequency,
  } = parsed.data;

  const updatedRecord = await db
    .update(paychecks)
    .set({
      employer,
      amount: amount,
      isRecurring: is_recurring,
      depositDate: deposit_date,
      frequency: is_recurring ? frequency ?? null : null,
      expectedDay: null,
    })
    .where(eq(paychecks.paycheckId, paycheckId))
    .returning();

  return new Response(JSON.stringify({ ...updatedRecord, isUpdate: true }), {
    status: 200,
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

  const fetcher = useFetcher<Paycheck[] & { isUpdate: boolean }>();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [paychecks, setPaychecks] = useState<Paycheck[]>(records || []);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedPaycheck, setSelectedPaycheck] = useState<Paycheck | null>(
    null
  );
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const type: "all" | "one-time" | "recurring" =
    searchParams.get("type") == "all"
      ? "all"
      : searchParams.get("type") === "recurring"
      ? "recurring"
      : "one-time";
  const range = searchParams.get("range") ?? "30d";

  const fetchedDataRef = useRef<Paycheck[] | null>(records || []);
  const maxFetchedRange = useRef<number>(0);

  const currentDays = rangeToDays(range);

  // Check cache or fetch
  useEffect(() => {
    if (!fetchedDataRef.current || currentDays > maxFetchedRange.current) {
      fetcher.load(`/paychecks/all?range=${range}`); // fetch larger range
    } else {
      // Filter locally
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - currentDays);
      setPaychecks(filterPaychecks(fetchedDataRef.current, currentDays, type));
    }
  }, [range, type]);

  useEffect(() => {
    if (!fetcher.data) return;

    const isUpdate = fetcher.data?.isUpdate === true;

    if (isUpdate && fetcher.state === "idle") {
      const updated = fetcher.data[0];
      if (!updated) return;

      setPaychecks((prev) =>
        prev.map((p) =>
          p.paycheckId === updated.paycheckId ? { ...p, ...updated } : p
        )
      );

      fetchedDataRef.current =
        fetchedDataRef.current?.map((p) =>
          p.paycheckId === updated.paycheckId ? { ...p, ...updated } : p
        ) ?? null;

      setEditSheetOpen(false);
      setIsEditing(false);
    }

    if (!isUpdate) {
      // Handle fresh fetch (array of records)
      fetchedDataRef.current = fetcher.data;
      maxFetchedRange.current = currentDays;
      setPaychecks(
        filterPaychecks(fetchedDataRef.current ?? [], currentDays, type)
      );
    }
  }, [fetcher.data, fetcher.state]);

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
                setSelectedPaycheck(p);
                setEditSheetOpen(true);
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
