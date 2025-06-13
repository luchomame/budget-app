import React, { useState } from "react";
import { Form, Link } from "react-router";
// UI
import { SiteHeader } from "~/components/dashboard/site-header";
import { SectionCard } from "~/components/SectionCard";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "~/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { PlusIcon } from "lucide-react";
// DB
import { paychecks } from "~/db/schema";
import { db } from "~/db";
import { desc, eq } from "drizzle-orm";
// utility
import { getNextDepositDate } from "./helper";
import type { Route } from "./+types/index";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    // Top 5 recurring paychecks (is_recurring = true)
    const recurring = await db
      .select()
      .from(paychecks)
      .where(eq(paychecks.isRecurring, true))
      .orderBy(desc(paychecks.depositDate))
      .limit(5);

    // Top 5 one-time paychecks (is_recurring = false)
    const oneTime = await db
      .select()
      .from(paychecks)
      .where(eq(paychecks.isRecurring, false))
      .orderBy(desc(paychecks.depositDate))
      .limit(5);

    return { recurring, oneTime };
  } catch (error) {
    console.error("Error fetching paychecks:", error);
    return new Response("Error fetching paychecks", { status: 500 });
  }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const [employer, setEmployer] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [depositDate, setDepositDate] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("");
  const [expectedDay, setExpectedDay] = useState<string>("");

  const [sheetOpen, setSheetOpen] = useState<boolean>(false);

  const { recurring: recurringPaychecks, oneTime: oneTimePaychecks } =
    loaderData;

  console.log("Recurring Paychecks:", recurringPaychecks);
  console.log("One-Time Paychecks:", oneTimePaychecks);

  const getExpectedDayOptions = (frequency: string) => {
    if (frequency === "weekly" || frequency === "biweekly") {
      return ["monday", "tuesday", "wednesday", "thursday", "friday"];
    }

    if (frequency === "monthly") {
      return ["1st", "last"];
    }

    return [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert(
      `Paycheck submitted: \nEmployer: ${employer} \nAmount: ${amount} \nRecurring: ${isRecurring} \nDeposit Date: ${depositDate}`
    );
  };

  return (
    <>
      {/* Add Paycheck Section */}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button
            onClick={() => setSheetOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-0 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
            size="fab"
          >
            <PlusIcon
              style={{ width: "24px", height: "24px" }}
              strokeWidth={2.5}
            />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold">Add Paycheck</h2>
          <Separator className="mb-2" />
          <Form
            onSubmit={handleSubmit}
            method="POST"
            className="flex flex-col gap-4"
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

            <div className="flex items-center gap-1 w-full justify-between">
              <Label htmlFor="deposit_date" className="text-md">
                Deposit Date
              </Label>
              <Input
                type="date"
                id="deposit_date"
                name="deposit_date"
                value={depositDate}
                onChange={(e) => setDepositDate(e.target.value)}
                className="w-1/2"
              />
            </div>

            <div className="flex mb-2 justify-between">
              <span className="flex items-center gap-2 py-2">
                <Checkbox
                  id="is_recurring"
                  checked={isRecurring}
                  onCheckedChange={(checked) => {
                    setIsRecurring(checked === true);
                    if (!checked) {
                      setFrequency("");
                      setExpectedDay("");
                    }
                  }}
                />
                <Label htmlFor="is_recurring" className="text-md">
                  Is Recurring
                </Label>
              </span>
              {isRecurring && (
                <Select
                  value={frequency}
                  onValueChange={(val) => {
                    setFrequency(val);
                    if (val === "semimonthly") {
                      setExpectedDay("1st and 15th");
                    } else {
                      setExpectedDay("");
                    }
                  }}
                >
                  <SelectTrigger id="frequency" className="text-md">
                    <span>
                      {frequency.charAt(0).toUpperCase() + frequency.slice(1) ||
                        "Select frequency"}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Biweekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="semimonthly">Semimonthly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <Button type="submit">Submit</Button>
          </Form>
        </SheetContent>
      </Sheet>

      <SiteHeader header="Paychecks" />
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 pb-8">
        {/* Recurring Paychecks Table */}
        <SectionCard
          title="Recurring Paychecks"
          description="Paychecks set to repeat automatically"
          action={
            <Link
              to="/paychecks/all?type=recurring"
              className="text-sm text-primary hover:underline font-medium"
            >
              View All
            </Link>
          }
        >
          <ul className="space-y-2 text-sm">
            {recurringPaychecks.slice(0, 4).map((paycheck) => {
              const next = getNextDepositDate(paycheck);
              return (
                <li
                  className="flex flex-col border-b pb-2"
                  key={paycheck.paycheckId}
                >
                  <div className="flex justify-between font-medium">
                    <span>{paycheck.employer}</span>
                    <span className="tabular-nums">
                      ${Number(paycheck.amount).toFixed(2)}
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
        </SectionCard>

        {/* One-Time Paychecks Table */}
        <SectionCard
          title="One-Time Paychecks"
          description="Single-instance paychecks"
          action={
            <Link
              to="/paychecks/all?type=one-time"
              className="text-sm text-primary hover:underline font-medium"
            >
              View All
            </Link>
          }
        >
          <ul className="space-y-2 text-sm">
            {oneTimePaychecks.slice(0, 4).map((paycheck) => (
              <li
                className="flex flex-col border-b pb-2"
                key={paycheck.paycheckId}
              >
                <div className="flex justify-between font-medium">
                  <span>{paycheck.employer}</span>
                  <span className="tabular-nums">
                    ${Number(paycheck.amount).toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {paycheck.depositDate && `Paid on: ${paycheck.depositDate}`}
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
