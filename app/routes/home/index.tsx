import { useEffect } from "react";
import { createClient } from "~/db/supabase/server";
import type { Route } from "./+types/index";
import { useLoaderData } from "react-router";
import { supabase } from "~/db/supabase/client";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createClient(request);

  const { data, error } = await supabase.from("debts").select("*");

  if (error) {
    console.error("Error fetching debts:", error);
    return new Response("Error fetching debts", { status: 500 });
  }
  // console.log("Fetched debts:", data);
  return { data: data };
}

export default function Home() {
  const { data: debts } = useLoaderData<{ data: any[] }>();

  useEffect(() => {
    const fetchData = async () => {
    const { data, error } = await supabase.from("expenses").select("*");

    if (error) {
      console.error("Error fetching expenses:", error);
    } else {
      console.log("Fetched expenses:", data);
    }
    }

    fetchData();
  } , []);

  
  return (
    <div>
      <h1>Debts</h1>
      <ul>
        {debts.map((debt) => (
          <li key={debt.debt_id}>
            {debt.name}: ${debt.amount}
            {debt.type}
            {debt.payment_schedule}
          </li>
        ))}
      </ul>
    </div>
  );
}
