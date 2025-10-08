// src/components/weather/WeatherCard.tsx
import React from "react";
import type { WeatherData } from "@/hooks/useWeather";
import { computeThreatLevel, flightAdviceFromThreat, ThreatLevel } from "@/lib/weatherUtils";
import { Badge } from "@/components/ui/badge";

type Props = {
  weather: WeatherData | null;
  loading?: boolean;
  error?: string | null;
};

// Map threat variant to shadcn/ui Badge variant
const mapFlightVariant = (v: "success" | "warning" | "destructive") => {
  switch (v) {
    case "success": return "secondary";
    case "warning": return "outline";
    case "destructive": return "destructive";
    default: return "default";
  }
};

// Emoji for weather description
const weatherEmoji = (description?: string) => {
  if (!description) return "🌞";
  const d = description.toLowerCase();
  if (d.includes("clear")) return "🌞";
  if (d.includes("cloud")) return "☁️";
  if (d.includes("rain")) return "🌧️";
  if (d.includes("snow")) return "❄️";
  if (d.includes("thunder")) return "⛈️";
  return "🌞";
};

const WeatherCard: React.FC<Props> = ({ weather, loading, error }) => {
  const threat: ThreatLevel = computeThreatLevel(weather ?? undefined);
  const advice = flightAdviceFromThreat(threat);

  if (loading) return <div className="p-3">Loading weather…</div>;
  if (error) return <div className="p-3 text-destructive">Weather error: {error}</div>;
  if (!weather) return <div className="p-3">No weather data</div>;

  return (
    <div className="p-3 bg-card/60 rounded-md border border-border flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>{weatherEmoji(weather.description)}</span>
          <span>{weather.description}</span>
        </div>
        <Badge variant="outline" className="text-xs">{new Date().toLocaleTimeString()}</Badge>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>🌡️ Temp: <strong>{Math.round(weather.temp)}°C</strong></div>
        <div>💨 Wind: <strong>{(weather.windSpeed * 3.6).toFixed(0)} km/h</strong></div>
        <div>👁 Visibility: <strong>{(weather.visibility ?? 10000) / 1000} km</strong></div>
        <div>🌧 Rain(1h): <strong>{weather.rain ?? 0} mm</strong></div>
      </div>

      {/* Threat Level */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Threat: <span className="ml-1">{threat}</span></div>
        <Badge className="text-xs" variant={mapFlightVariant(advice.variant)}>
          {advice.label}
        </Badge>
      </div>
    </div>
  );
};

export default WeatherCard;
