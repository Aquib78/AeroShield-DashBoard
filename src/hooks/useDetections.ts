import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Detection } from "@/types/detection";

const useDetections = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  // Convert UTC timestamp to IST
  const formatDetection = (d: Detection): Detection => {
    // Ensure timestamp treated as UTC
    const date = new Date(d.timestamp.endsWith("Z") ? d.timestamp : d.timestamp + "Z");

    // Time in HH:MM:SS (24-hour)
    const timeOptions: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Kolkata",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const localTime = date.toLocaleTimeString("en-GB", timeOptions);

    // Date in DD/MM/YYYY
    const dateOptions: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    const localDate = date.toLocaleDateString("en-GB", dateOptions);

    return {
      ...d,
      localTime,
      localDate,
    };
  };

  useEffect(() => {
    let isMounted = true;

    const fetchDetections = async () => {
      const { data, error } = await supabase
        .from("detections")
        .select("id, timestamp, latitude, longitude")
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Supabase fetch error:", error);
        return;
      }

      if (isMounted && data) {
        const formatted = (data as Detection[]).map(formatDetection);
        setDetections(formatted);
      }
    };

    fetchDetections();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("detections_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "detections" },
        (payload: any) => {
          if (isMounted && payload?.new) {
            const newDetection = formatDetection(payload.new as Detection);
            setDetections(prev => [newDetection, ...prev].slice(0, 50));
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const addDetection = (detection: Detection) => {
    const formatted = formatDetection(detection);
    setDetections(prev => [formatted, ...prev].slice(0, 50));
  };

  return {
    detections,
    isOnline,
    addDetection,
    lastDetection: detections[0] || null,
  };
};

export default useDetections;
