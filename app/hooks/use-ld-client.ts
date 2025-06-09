import { useLDClient } from "launchdarkly-react-client-sdk";
import { useEffect, useState } from "react";

export function useLDReady(): boolean {
  const ldClient = useLDClient();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ldClient) return;
    ldClient.waitForInitialization().then(() => setReady(true));
  }, [ldClient]);

  return ready;
}
