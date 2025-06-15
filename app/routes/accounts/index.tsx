import { mockAccounts } from "./mockAccounts";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AccountsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <Button variant="default">
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>
      <DataTable columns={columns} data={mockAccounts} />
    </div>
  );
}
