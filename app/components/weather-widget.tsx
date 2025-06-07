"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Sun, CloudRain, Thermometer } from "lucide-react"

export function WeatherWidget() {
  // Mock weather data - replace with actual weather API
  const weather = {
    condition: "partly-cloudy",
    temperature: 22,
    humidity: 65,
    windSpeed: 8,
    rainChance: 20,
    suitable: true,
  }

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case "sunny":
        return <Sun className="h-4 w-4 text-yellow-400" />
      case "cloudy":
        return <Cloud className="h-4 w-4 text-slate-400" />
      case "rainy":
        return <CloudRain className="h-4 w-4 text-blue-400" />
      default:
        return <Cloud className="h-4 w-4 text-slate-400" />
    }
  }

  return (
    <Card className="w-40 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-lg">
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getWeatherIcon()}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Thermometer className="h-3 w-3 text-slate-400" />
                <span className="text-sm font-medium text-slate-200">{weather.temperature}°C</span>
              </div>
              <div className="text-xs text-slate-400">Rain: {weather.rainChance}%</div>
            </div>
          </div>
          <Badge
            variant={weather.suitable ? "default" : "destructive"}
            className={
              weather.suitable
                ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/30"
                : "bg-red-600/20 text-red-400 border-red-500/30"
            }
          >
            {weather.suitable ? "Good" : "Wait"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
