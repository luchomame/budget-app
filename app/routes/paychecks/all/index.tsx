// paychecks/all.tsx
import * as React from "react";

import type { Paycheck } from "../seed";
import { seedPaychecks } from "../seed";
import {
  useFetcher,
  useSearchParams,
  type LoaderFunctionArgs,
} from "react-router";

// ---- Loader Logic ----

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") ?? "all"; // 'recurring', 'one-time', or 'all'
  const range = url.searchParams.get("range") ?? "30d";

  // Simulate DB filtering
  const days = rangeToDays(range);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  let results = seedPaychecks.filter((p) => {
    const created = new Date(p.created_at);
    if (created < cutoff) return false;

    if (type === "recurring") return p.is_recurring;
    if (type === "one-time") return !p.is_recurring;
    return true;
  });

  // // supabase con here
  // const results = await supabase.from("paychecks").select(...).eq(...)

  return new Response(JSON.stringify(results), {
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
    case "1y":
      return 365;
    case "all":
      return 10000;
    default:
      return 30;
  }
}

// ---- Component ----

export default function ViewAllPaychecksPage() {
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();
  const [paychecks, setPaychecks] = React.useState<Paycheck[]>([]);

  const type = searchParams.get("type") ?? "all";
  const range = searchParams.get("range") ?? "30d";

  const cacheRef = React.useRef<Map<string, Paycheck[]>>(new Map());

  const key = `type=${type}&range=${range}`;

  // Check cache or fetch
  React.useEffect(() => {
    if (cacheRef.current.has(key)) {
      setPaychecks(cacheRef.current.get(key)!);
    } else {
      fetcher.load(`/paychecks/all?${key}`);
    }
  }, [key]);

  // On fetcher result
  React.useEffect(() => {
    if (fetcher.data) {
      cacheRef.current.set(key, fetcher.data);
      setPaychecks(fetcher.data);
    }
  }, [fetcher.data]);

  // For testing: Filter toggles (replace with proper UI later)
  function updateFilter(newType: string, newRange: string) {
    setSearchParams({ type: newType, range: newRange });
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">View All Paychecks</h1>

      <div className="flex gap-2">
        <button onClick={() => updateFilter("recurring", range)}>
          Recurring
        </button>
        <button onClick={() => updateFilter("one-time", range)}>
          One-Time
        </button>
        <button onClick={() => updateFilter("all", range)}>All</button>

        <button onClick={() => updateFilter(type, "30d")}>30d</button>
        <button onClick={() => updateFilter(type, "60d")}>60d</button>
        <button onClick={() => updateFilter(type, "1y")}>1y</button>
      </div>

      <ul className="divide-y text-sm">
        {paychecks.map((p) => (
          <li key={p.id} className="py-2">
            <div className="flex justify-between">
              <span>{p.employer}</span>
              <span className="tabular-nums">${p.amount.toFixed(2)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {p.deposit_date} · {p.is_recurring ? "Recurring" : "One-time"}{" "}
              {p.frequency && `· ${p.frequency}`}{" "}
              {p.expected_day && `· ${p.expected_day}`}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
