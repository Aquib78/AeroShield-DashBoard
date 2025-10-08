import { useState, useEffect } from "react";

export interface WeatherData {
  temp: number;
  windSpeed: number;
  visibility: number;
  condition: string;   // weather code
  description: string; // human-readable
  rain?: number;
  clouds?: number;
  safe: "Good" | "Risky" | "Dangerous";
}

const weatherCodes: Record<number, string> = {
  0: "Clear",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime Fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Dense Drizzle",
  56: "Freezing Drizzle Light",
  57: "Freezing Drizzle Dense",
  61: "Rain Slight",
  63: "Rain Moderate",
  65: "Rain Heavy",
  66: "Freezing Rain Light",
  67: "Freezing Rain Heavy",
  71: "Snow Slight",
  73: "Snow Moderate",
  75: "Snow Heavy",
  77: "Snow Grains",
  80: "Rain Showers Slight",
  81: "Rain Showers Moderate",
  82: "Rain Showers Violent",
  85: "Snow Showers Slight",
  86: "Snow Showers Heavy",
  95: "Thunderstorm",
  96: "Thunderstorm Slight Hail",
  99: "Thunderstorm Heavy Hail",
};

const useWeather = (latitude: number = 13.0735, longitude: number = 77.5741) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=visibility,precipitation,cloudcover`
        );
        const data = await res.json();

        const temp = data.current_weather.temperature;
        const windSpeed = data.current_weather.windspeed;
        const code = data.current_weather.weathercode;
        const condition = code.toString();
        const description = weatherCodes[code] ?? "Unknown";
        const visibility = data.hourly?.visibility?.[0] ?? 10000;
        const rain = data.hourly?.precipitation?.[0] ?? 0;
        const clouds = data.hourly?.cloudcover?.[0] ?? 0;

        let safe: "Good" | "Risky" | "Dangerous" = "Good";
        if (windSpeed > 20 || visibility < 5000) safe = "Risky";
        if (windSpeed > 30 || visibility < 2000) safe = "Dangerous";

        setWeather({ temp, windSpeed, visibility, condition, description, rain, clouds, safe });
      } catch (err) {
        console.error("Weather fetch failed:", err);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, [latitude, longitude]);

  return weather;
};

export default useWeather;
