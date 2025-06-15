// app/routes/accounts/columns.tsx

// app/routes/accounts/columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { Account } from "./mockAccounts";

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "name",
    header: "Account Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "createdAt",
    header: "Created On",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
];
