import { NextResponse } from "next/server"

interface WeatherData {
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

interface WeatherForecast {
  hourly: WeatherData[]
  daily: WeatherData[]
}

function mapWeatherCondition(condition: string): WeatherData["condition"] {
  switch (condition.toLowerCase()) {
    case "clear":
      return "sunny"
    case "clouds":
      return "cloudy"
    case "rain":
      return "rainy"
    case "thunderstorm":
      return "stormy"
    case "mist":
    case "fog":
      return "foggy"
    default:
      return "cloudy"
  }
}

function getMockWeather(): WeatherData {
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

function getMockForecast(): WeatherForecast {
  const hourly: WeatherData[] = []
  for (let i = 0; i < 24; i++) {
    hourly.push({
      ...getMockWeather(),
      timestamp: Date.now() + i * 3600000, // Each hour
    })
  }

  return { hourly, daily: [] }
}

export async function GET() {
  const apiKey = process.env.WEATHER_API_KEY // Server-side only

  if (!apiKey) {
    // Return mock data if no API key
    return NextResponse.json(getMockForecast())
  }

  try {
    // Default location - you can make this configurable
    const lat = 40.7128
    const lon = -74.006

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    )

    if (!response.ok) throw new Error("Forecast API failed")

    const data = await response.json()

    const forecast: WeatherForecast = {
      hourly: data.list.slice(0, 24).map((item: any) => ({
        temperature: item.main.temp,
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        windSpeed: item.wind.speed,
        windDirection: item.wind.deg,
        precipitation: item.rain?.["3h"] || 0,
        precipitationProbability: item.pop * 100,
        uvIndex: 0,
        visibility: item.visibility / 1000,
        condition: mapWeatherCondition(item.weather[0].main),
        timestamp: item.dt * 1000,
      })),
      daily: [], // Would process daily data similarly
    }

    return NextResponse.json(forecast)
  } catch (error) {
    console.error("Forecast fetch failed:", error)
    return NextResponse.json(getMockForecast())
  }
}
