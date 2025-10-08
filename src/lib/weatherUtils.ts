import type { WeatherData } from "@/hooks/useWeather";

export type ThreatLevel = "LOW" | "MODERATE" | "HIGH";

export const computeThreatLevel = (w?: WeatherData): ThreatLevel => {
  if (!w) return "HIGH";
  const windKmh = w.windSpeed * 3.6;
  const visibility = w.visibility ?? 10000;
  if (windKmh > 35 || visibility < 2000) return "HIGH";
  if (windKmh > 18 || visibility < 5000) return "MODERATE";
  return "LOW";
};

export const flightAdviceFromThreat = (level: ThreatLevel) => {
  switch (level) {
    case "LOW":
      return { label: "Good to Fly", variant: "success" as const };
    case "MODERATE":
      return { label: "Caution — Assess", variant: "warning" as const };
    case "HIGH":
      return { label: "Unsafe to Fly", variant: "destructive" as const };
  }
};

export const weatherCodeToEmoji = (code: string | number) => {
  const c = Number(code);
  if ([0,1].includes(c)) return "☀️";
  if ([2,3].includes(c)) return "⛅";
  if ([45,48].includes(c)) return "🌫️";
  if ([51,53,55,61,63,65,80,81,82].includes(c)) return "🌧️";
  if ([71,73,75,85,86].includes(c)) return "❄️";
  if ([95,96,99].includes(c)) return "⛈️";
  return "☀️";
};
