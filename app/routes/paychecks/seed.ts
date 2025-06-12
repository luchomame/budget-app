// seed data
export type Paycheck = {
  id: number;
  employer: string;
  amount: number;
  is_recurring: boolean;
  created_at: string;
  deposit_date?: string;
  frequency?: "weekly" | "biweekly" | "monthly" | "semimonthly";
  expected_day?: string;
};

export const seedPaychecks: Paycheck[] = [
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
