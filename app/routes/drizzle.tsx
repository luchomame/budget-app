// routes/home.tsx
import { db } from "~/db"; 
import { debts } from "~/db/schema"; 
import type { Route } from "./+types/home";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const data = await db.select().from(debts);
    return { data };
  } catch (error) {
    console.error("Error fetching debts:", error);
    return new Response("Error fetching debts", { status: 500 });
  }
}
