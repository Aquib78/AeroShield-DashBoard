import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface SystemStatus {
  drone_active: boolean;
  monitoring: boolean;
  last_updated: string;
}

const useSystemStatus = () => {
  const [status, setStatus] = useState<SystemStatus>({
    drone_active: false,
    monitoring: false,
    last_updated: new Date().toISOString(),
  });

  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("system_status")
          .select("drone_active, monitoring, last_updated")
          .limit(1)
          .single<SystemStatus>();

        if (error) {
          console.error("Supabase fetch error (system_status):", error);
          return;
        }

        if (isMounted && data) {
          setStatus(data);
          console.log("Fetched system status:", data);
        }
      } catch (err) {
        console.error("Unexpected error fetching system status:", err);
      }
    };

    fetchStatus();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("system_status_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "system_status" },
        (payload: any) => {
          if (isMounted && payload?.new) {
            setStatus(payload.new as SystemStatus);
            console.log("Realtime update received:", payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return status;
};

export default useSystemStatus;
