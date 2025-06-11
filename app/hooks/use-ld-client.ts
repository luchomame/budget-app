import { useLDClient } from "launchdarkly-react-client-sdk";
import { useEffect, useState } from "react";

export function useLDReadyWithStreaming(): boolean {
  const ldClient = useLDClient();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ldClient) return;
    ldClient.waitForInitialization(5).then(() => {
      setReady(true);

      // Start listening for any flag changes
      ldClient.on("change", () => {
        console.debug("[LD] Flags changed via streaming");
      });
    });
  }, [ldClient]);

  return ready;
}
