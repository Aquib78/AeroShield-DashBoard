import { ReactNode } from "react";

export interface Detection {
  id: number;
  timestamp: string;
  latitude: number;
  longitude: number;
  localTime: string;  // Required IST time
  localDate: string;  // Required IST date
}

export interface DetectionRequest {
  id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
}