import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface PersonDetection {
  id: number;
  person_count: number;
  detected_at: string;
  localTime: string; // IST time
  localDate: string; // IST date
}

// Convert UTC timestamp to IST properly
const formatToIST = (utcDate: string) => {
  const date = new Date(utcDate + "Z"); // Treat as UTC
  return {
    localTime: date.toLocaleTimeString("en-IN", { hour12: false, timeZone: "Asia/Kolkata" }),
    localDate: date.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }),
  };
};

const usePersonDetections = () => {
  const [detections, setDetections] = useState<PersonDetection[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchPersonDetections = async () => {
      const { data, error } = await supabase
        .from("person_count")
        .select("*")
        .order("detected_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching person detections:", error);
        return;
      }

      if (isMounted && data) {
        const formatted = (data as PersonDetection[]).map(d => {
          const { localTime, localDate } = formatToIST(d.detected_at);
          return { ...d, localTime, localDate };
        });
        setDetections(formatted);
      }
    };

    fetchPersonDetections();

    // Realtime subscription
    const channel = supabase
      .channel("person_count_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "person_count" },
        (payload: any) => {
          if (isMounted && payload?.new) {
            const { localTime, localDate } = formatToIST(payload.new.detected_at);
            const formattedNew = { ...payload.new, localTime, localDate };
            setDetections(prev => [formattedNew, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return detections;
};

export default usePersonDetections;
