/// <reference types="vite/types/importMeta.d.ts" />
import { createBrowserClient } from "@supabase/ssr";

function createClient() {
  return createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  );
}

export const supabase = createClient();