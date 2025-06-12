import type { InferSelectModel } from "drizzle-orm";
import { parseISO, addDays, isAfter } from "date-fns";
import { paychecks } from "~/db/schema";

export type Paycheck = InferSelectModel<typeof paychecks>;

export function getNextDepositDate(paycheck: Paycheck): string | null {
  const { depositDate: deposit_date, frequency } = paycheck;
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
