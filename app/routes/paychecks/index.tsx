import React, { useState } from "react";
import { Form, Link } from "react-router";
import { SiteHeader } from "~/components/dashboard/site-header";
import { SectionCard } from "~/components/SectionCard";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { parseISO, addDays, addMonths, isAfter } from "date-fns";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// TODO: Implement action to handle form submission

// seed data
type Paycheck = {
  id: number;
  employer: string;
  amount: number;
  is_recurring: boolean;
  created_at: string;
  deposit_date?: string;
  frequency?: "weekly" | "biweekly" | "monthly" | "semimonthly";
  expected_day?: string;
};

const seedPaychecks: Paycheck[] = [
  {
    id: 1,
    employer: "Acme Corp",
    amount: 2000,
    is_recurring: true,
    created_at: "2025-06-01T08:00:00Z",
    deposit_date: "2025-06-14",
    frequency: "biweekly",
    expected_day: "Fridays",
  },
  {
    id: 2,
    employer: "Side Hustle",
    amount: 150,
    is_recurring: false,
    created_at: "2025-05-28T12:00:00Z",
    deposit_date: "2025-05-28",
  },
  {
    id: 3,
    employer: "Government Stipend",
    amount: 500,
    is_recurring: true,
    created_at: "2025-06-01T09:00:00Z",
    deposit_date: "2025-06-01",
    frequency: "monthly",
    expected_day: "1st of month",
  },
  {
    id: 4,
    employer: "Freelance Client",
    amount: 800,
    is_recurring: false,
    created_at: "2025-05-15T11:30:00Z",
    deposit_date: "2025-05-15",
  },
  {
    id: 5,
    employer: "TechCo",
    amount: 2500,
    is_recurring: true,
    created_at: "2025-06-03T10:45:00Z",
    deposit_date: "2025-06-15",
    frequency: "semimonthly",
    expected_day: "1st and 15th",
  },
  {
    id: 6,
    employer: "Funko Corp",
    amount: 2000,
    is_recurring: true,
    created_at: "2025-06-04T14:20:00Z",
    deposit_date: "2025-06-21",
    frequency: "weekly",
    expected_day: "Fridays",
  },
  {
    id: 7,
    employer: "Over Hustle",
    amount: 150,
    is_recurring: false,
    created_at: "2025-05-30T16:00:00Z",
    deposit_date: "2025-05-30",
  },
  {
    id: 8,
    employer: "Government Stupid",
    amount: 500,
    is_recurring: true,
    created_at: "2025-06-01T07:30:00Z",
    deposit_date: "2025-06-01",
    frequency: "monthly",
    expected_day: "1st of month",
  },
  {
    id: 9,
    employer: "Poorlance Client",
    amount: 800,
    is_recurring: false,
    created_at: "2025-05-18T13:45:00Z",
    deposit_date: "2025-05-18",
  },
  {
    id: 10,
    employer: "FinHub",
    amount: 2500,
    is_recurring: true,
    created_at: "2025-06-06T08:15:00Z",
    deposit_date: "2025-06-15",
    frequency: "semimonthly",
    expected_day: "1st and 15th",
  },
];

function getNextDepositDate(paycheck: Paycheck): string | null {
  const { deposit_date, frequency } = paycheck;
  if (!deposit_date || !frequency) return null;

  let current = parseISO(deposit_date);
  const today = new Date();

  // Guard in case unknown frequency
  let intervalDays: number | undefined = undefined;

  switch (frequency) {
    case "weekly":
      intervalDays = 7;
      break;
    case "biweekly":
      intervalDays = 14;
      break;
    case "monthly":
      intervalDays = 30;
      break;
    case "semimonthly":
      break;
    default:
      return null;
  }

  if (frequency === "semimonthly") {
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const fifteenth = new Date(currentYear, currentMonth, 15);
    const first = new Date(currentYear, currentMonth, 1);

    const nextDate =
      isAfter(first, today) && isAfter(fifteenth, today)
        ? first
        : isAfter(fifteenth, today)
        ? fifteenth
        : new Date(currentYear, currentMonth + 1, 1);

    return nextDate.toISOString().split("T")[0];
  }

  // Default recurring case (weekly, biweekly, monthly)
  while (!isAfter(current, today)) {
    current = addDays(current, intervalDays!);
  }

  return current.toISOString().split("T")[0];
}

export default function Page() {
  const [employer, setEmployer] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isRecurring, setIsRecurring] = useState<boolean>(false);

  const recurringPaychecks = seedPaychecks.filter(
    (paycheck) => paycheck.is_recurring
  );
  const oneTimePaychecks = seedPaychecks.filter(
    (paycheck) => !paycheck.is_recurring
  );

  recurringPaychecks.sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  oneTimePaychecks.sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert(
      `Paycheck submitted: \nEmployer: ${employer} \nAmount: ${amount} \nRecurring: ${isRecurring}`
    );
  };

  return (
    <>
      <SiteHeader header="Paychecks" />
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 pb-8">
        {/* Add Paycheck Section */}
        <SectionCard
          title="Add Paycheck"
          description="Enter paycheck info and add it to your records"
          action={<Button variant="default">Submit</Button>}
        >
          <Form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            method="POST"
          >
            <Input
              placeholder="Employer"
              value={employer}
              onChange={(e) => setEmployer(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_recurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked === true)}
              />
              <label htmlFor="is_recurring" className="text-sm">
                Recurring
              </label>
            </div>
            <Button variant="default">Submit</Button>
          </Form>
        </SectionCard>

        {/* Recurring Paychecks Table */}
        <SectionCard
          title="Recurring Paychecks"
          description="Paychecks set to repeat automatically"
        >
          <ul className="space-y-2 text-sm">
            {recurringPaychecks.slice(0, 3).map((paycheck) => {
              const next = getNextDepositDate(paycheck);
              return (
                <li className="flex flex-col border-b pb-2" key={paycheck.id}>
                  <div className="flex justify-between font-medium">
                    <span>{paycheck.employer}</span>
                    <span className="tabular-nums">
                      ${paycheck.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex text-xs text-muted-foreground justify-start">
                    <span>
                      {String(paycheck.frequency).charAt(0).toUpperCase() +
                        String(paycheck.frequency).slice(1)}
                    </span>
                    <span>{next && ` · Next: ${next}`}</span>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex justify-end items-center">
            <Link
              to="#"
              className="text-sm text-primary hover:underline font-medium"
            >
              View All
            </Link>
          </div>
        </SectionCard>

        {/* One-Time Paychecks Table */}
        <SectionCard
          title="One-Time Paychecks"
          description="Single-instance paychecks"
        >
          <ul className="space-y-2 text-sm">
            {oneTimePaychecks.slice(0, 3).map((paycheck) => (
              <li className="flex flex-col border-b pb-2" key={paycheck.id}>
                <div className="flex justify-between font-medium">
                  <span>{paycheck.employer}</span>
                  <span className="tabular-nums">
                    ${paycheck.amount.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {paycheck.deposit_date && `Paid on: ${paycheck.deposit_date}`}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-end items-center">
            <Link
              to="#"
              className="text-sm text-primary hover:underline font-medium"
            >
              View all
            </Link>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
