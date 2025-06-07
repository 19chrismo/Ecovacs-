export interface WeatherData {
  temperature: number
  humidity: number
  pressure: number
  windSpeed: number
  windDirection: number
  precipitation: number
  precipitationProbability: number
  uvIndex: number
  visibility: number
  condition: "sunny" | "cloudy" | "rainy" | "stormy" | "foggy"
  timestamp: number
}

export interface WeatherForecast {
  hourly: WeatherData[]
  daily: WeatherData[]
}

export class WeatherService {
  private currentWeather: WeatherData | null = null
  private forecast: WeatherForecast | null = null

  async getCurrentWeather(): Promise<WeatherData | null> {
    try {
      const response = await fetch("/api/weather/current")
      if (!response.ok) throw new Error("Weather API failed")

      this.currentWeather = await response.json()
      return this.currentWeather
    } catch (error) {
      console.error("Weather fetch failed:", error)
      return this.getMockWeather()
    }
  }

  async getForecast(): Promise<WeatherForecast | null> {
    try {
      const response = await fetch("/api/weather/forecast")
      if (!response.ok) throw new Error("Forecast API failed")

      this.forecast = await response.json()
      return this.forecast
    } catch (error) {
      console.error("Forecast fetch failed:", error)
      return this.getMockForecast()
    }
  }

  private getMockWeather(): WeatherData {
    return {
      temperature: 22 + Math.random() * 10 - 5,
      humidity: 60 + Math.random() * 20 - 10,
      pressure: 1013 + Math.random() * 20 - 10,
      windSpeed: Math.random() * 15,
      windDirection: Math.random() * 360,
      precipitation: Math.random() * 5,
      precipitationProbability: Math.random() * 100,
      uvIndex: Math.random() * 11,
      visibility: 10 + Math.random() * 5,
      condition: ["sunny", "cloudy", "rainy"][Math.floor(Math.random() * 3)] as WeatherData["condition"],
      timestamp: Date.now(),
    }
  }

  private getMockForecast(): WeatherForecast {
    const hourly: WeatherData[] = []
    for (let i = 0; i < 24; i++) {
      hourly.push({
        ...this.getMockWeather(),
        timestamp: Date.now() + i * 3600000, // Each hour
      })
    }

    return { hourly, daily: [] }
  }

  isSuitableForMowing(weather?: WeatherData): boolean {
    const w = weather || this.currentWeather
    if (!w) return false

    return (
      w.precipitation < 1 && // Less than 1mm rain
      w.precipitationProbability < 30 && // Less than 30% chance
      w.windSpeed < 25 && // Less than 25 km/h wind
      w.visibility > 5 && // More than 5km visibility
      w.condition !== "stormy"
    )
  }
}

export const weatherService = new WeatherService()
