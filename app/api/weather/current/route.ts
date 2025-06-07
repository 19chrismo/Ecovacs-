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

export async function GET() {
  const apiKey = process.env.WEATHER_API_KEY // Server-side only, no NEXT_PUBLIC_

  if (!apiKey) {
    // Return mock data if no API key
    return NextResponse.json(getMockWeather())
  }

  try {
    // Default location - you can make this configurable
    const lat = 40.7128
    const lon = -74.006

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    )

    if (!response.ok) throw new Error("Weather API failed")

    const data = await response.json()

    const weatherData: WeatherData = {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      precipitation: data.rain?.["1h"] || 0,
      precipitationProbability: 0,
      uvIndex: 0,
      visibility: data.visibility / 1000,
      condition: mapWeatherCondition(data.weather[0].main),
      timestamp: Date.now(),
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Weather fetch failed:", error)
    return NextResponse.json(getMockWeather())
  }
}
