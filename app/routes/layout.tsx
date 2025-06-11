// routes/home.tsx
import { db } from "~/db";
import { debts } from "~/db/schema";
import type { Route } from "./+types/layout";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Outlet } from "react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useLDReadyWithStreaming } from "@/hooks/use-ld-client";
import { LoadingSpinner } from "~/components/Spinner";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const data = await db.select().from(debts);
    return { data };
  } catch (error) {
    console.error("Error fetching debts:", error);
    return new Response("Error fetching debts", { status: 500 });
  }
}

export default function Layout() {
  const flagsReady = useLDReadyWithStreaming();
  if (!flagsReady) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <LoadingSpinner size={100} />
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
