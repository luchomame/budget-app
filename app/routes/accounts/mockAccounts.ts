// app/lib/data/mockAccounts.ts

export type Account = {
  id: string;
  name: string;
  type: "bank" | "credit card" | "investment" | "cash";
  createdAt: string;
};

export const mockAccounts: Account[] = [
  {
    id: "1",
    name: "USAA",
    type: "bank",
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Chase",
    type: "bank",
    createdAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "3",
    name: "Amex HYSA",
    type: "investment",
    createdAt: "2024-02-01T00:00:00Z",
  },
];
