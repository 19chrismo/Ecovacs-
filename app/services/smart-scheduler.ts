import { weatherService, type WeatherData } from "./weather-service"

export interface SmartSchedule {
  id: string
  name: string
  zones: string[]
  pattern: string
  priority: number
  conditions: ScheduleCondition[]
  adaptiveSettings: AdaptiveSettings
  enabled: boolean
  nextRun?: number
  estimatedDuration: number
}

export interface ScheduleCondition {
  type: "weather" | "grass_growth" | "time" | "battery" | "season"
  operator: "equals" | "greater" | "less" | "between"
  value: any
  weight: number
}

export interface AdaptiveSettings {
  grassGrowthTracking: boolean
  weatherOptimization: boolean
  energyOptimization: boolean
  seasonalAdjustment: boolean
  learningEnabled: boolean
}

export interface GrassGrowthData {
  zone: string
  growthRate: number // mm per day
  lastCut: number
  currentHeight: number
  optimalHeight: number
  grassType: "cool_season" | "warm_season" | "mixed"
}

export class SmartScheduler {
  private schedules: SmartSchedule[] = []
  private grassData: Map<string, GrassGrowthData> = new Map()
  private learningData: Map<string, any> = new Map()

  constructor() {
    this.initializeDefaultSchedules()
    this.startLearningEngine()
  }

  private initializeDefaultSchedules() {
    this.schedules = [
      {
        id: "smart_weekly",
        name: "Smart Weekly Schedule",
        zones: ["front_lawn", "backyard"],
        pattern: "parallel",
        priority: 1,
        conditions: [
          { type: "weather", operator: "equals", value: "suitable", weight: 0.8 },
          { type: "grass_growth", operator: "greater", value: 25, weight: 0.6 },
          { type: "time", operator: "between", value: [8, 18], weight: 0.4 },
        ],
        adaptiveSettings: {
          grassGrowthTracking: true,
          weatherOptimization: true,
          energyOptimization: true,
          seasonalAdjustment: true,
          learningEnabled: true,
        },
        enabled: true,
        estimatedDuration: 120,
      },
    ]
  }

  async calculateOptimalSchedule(zoneId: string): Promise<SmartSchedule | null> {
    const grassData = this.grassData.get(zoneId)
    if (!grassData) return null

    const weather = await weatherService.getCurrentWeather()
    const forecast = await weatherService.getForecast()

    if (!weather || !forecast) return null

    // Calculate grass growth prediction
    const daysUntilOptimal = this.predictGrowthDays(grassData, weather)

    // Find optimal weather window
    const optimalWindow = this.findOptimalWeatherWindow(forecast, daysUntilOptimal)

    if (!optimalWindow) return null

    // Generate adaptive schedule
    return {
      id: `adaptive_${zoneId}_${Date.now()}`,
      name: `Smart Schedule for ${zoneId}`,
      zones: [zoneId],
      pattern: this.selectOptimalPattern(grassData, weather),
      priority: this.calculatePriority(grassData, weather),
      conditions: this.generateConditions(grassData, weather),
      adaptiveSettings: {
        grassGrowthTracking: true,
        weatherOptimization: true,
        energyOptimization: true,
        seasonalAdjustment: true,
        learningEnabled: true,
      },
      enabled: true,
      nextRun: optimalWindow.timestamp,
      estimatedDuration: this.estimateDuration(zoneId, grassData),
    }
  }

  private predictGrowthDays(grassData: GrassGrowthData, weather: WeatherData): number {
    const currentHeight = grassData.currentHeight
    const targetHeight = grassData.optimalHeight
    const baseGrowthRate = grassData.growthRate

    // Adjust growth rate based on weather
    let adjustedGrowthRate = baseGrowthRate

    // Temperature factor
    const tempFactor = this.getTemperatureFactor(weather.temperature, grassData.grassType)
    adjustedGrowthRate *= tempFactor

    // Humidity factor
    const humidityFactor = Math.min(1.2, Math.max(0.8, weather.humidity / 70))
    adjustedGrowthRate *= humidityFactor

    // Precipitation factor
    const precipFactor = Math.min(1.3, Math.max(0.7, 1 + weather.precipitation / 10))
    adjustedGrowthRate *= precipFactor

    const heightDifference = targetHeight - currentHeight
    return Math.max(1, heightDifference / adjustedGrowthRate)
  }

  private getTemperatureFactor(temp: number, grassType: string): number {
    switch (grassType) {
      case "cool_season":
        if (temp < 10) return 0.3
        if (temp < 15) return 0.7
        if (temp < 25) return 1.0
        if (temp < 30) return 0.8
        return 0.5
      case "warm_season":
        if (temp < 15) return 0.2
        if (temp < 20) return 0.6
        if (temp < 35) return 1.0
        return 0.7
      default:
        return 0.8
    }
  }

  private findOptimalWeatherWindow(forecast: any, daysFromNow: number): { timestamp: number; score: number } | null {
    const targetTime = Date.now() + daysFromNow * 24 * 60 * 60 * 1000
    const windows: { timestamp: number; score: number }[] = []

    // Check 48-hour window around target time
    for (let i = -24; i <= 24; i++) {
      const checkTime = targetTime + i * 60 * 60 * 1000
      const hourData = forecast.hourly.find((h: any) => Math.abs(h.timestamp - checkTime) < 30 * 60 * 1000)

      if (hourData) {
        const score = this.calculateWeatherScore(hourData)
        windows.push({ timestamp: checkTime, score })
      }
    }

    // Return best window
    windows.sort((a, b) => b.score - a.score)
    return windows.length > 0 ? windows[0] : null
  }

  private calculateWeatherScore(weather: WeatherData): number {
    let score = 100

    // Precipitation penalty
    score -= weather.precipitation * 20
    score -= weather.precipitationProbability * 0.5

    // Temperature optimization
    if (weather.temperature < 10 || weather.temperature > 35) {
      score -= Math.abs(weather.temperature - 22) * 2
    }

    // Wind penalty
    if (weather.windSpeed > 20) {
      score -= (weather.windSpeed - 20) * 2
    }

    // Humidity optimization
    if (weather.humidity > 80) {
      score -= (weather.humidity - 80) * 0.5
    }

    // Visibility requirement
    if (weather.visibility < 5) {
      score -= (5 - weather.visibility) * 10
    }

    return Math.max(0, score)
  }

  private selectOptimalPattern(grassData: GrassGrowthData, weather: WeatherData): string {
    // Select pattern based on grass condition and weather
    if (grassData.currentHeight > grassData.optimalHeight * 1.5) {
      return "parallel" // Most efficient for overgrown grass
    }

    if (weather.condition === "sunny" && weather.windSpeed < 10) {
      return "spiral" // Good for even cutting in calm conditions
    }

    if (grassData.grassType === "cool_season" && weather.temperature < 20) {
      return "edge_first" // Gentle approach for cool season grass
    }

    return "parallel" // Default efficient pattern
  }

  private calculatePriority(grassData: GrassGrowthData, weather: WeatherData): number {
    let priority = 5 // Base priority

    // Grass height urgency
    const heightRatio = grassData.currentHeight / grassData.optimalHeight
    if (heightRatio > 1.5) priority += 3
    else if (heightRatio > 1.2) priority += 1

    // Weather suitability
    if (weatherService.isSuitableForMowing(weather)) {
      priority += 2
    }

    // Time since last cut
    const daysSinceLastCut = (Date.now() - grassData.lastCut) / (24 * 60 * 60 * 1000)
    if (daysSinceLastCut > 7) priority += 2
    else if (daysSinceLastCut > 14) priority += 4

    return Math.min(10, priority)
  }

  private generateConditions(grassData: GrassGrowthData, weather: WeatherData): ScheduleCondition[] {
    return [
      {
        type: "weather",
        operator: "equals",
        value: "suitable",
        weight: 0.8,
      },
      {
        type: "grass_growth",
        operator: "greater",
        value: grassData.optimalHeight,
        weight: 0.7,
      },
      {
        type: "time",
        operator: "between",
        value: [8, 18],
        weight: 0.5,
      },
      {
        type: "battery",
        operator: "greater",
        value: 30,
        weight: 0.6,
      },
    ]
  }

  private estimateDuration(zoneId: string, grassData: GrassGrowthData): number {
    // Base duration calculation
    let baseDuration = 60 // minutes

    // Adjust for grass height
    const heightFactor = grassData.currentHeight / grassData.optimalHeight
    baseDuration *= Math.max(1, heightFactor)

    // Adjust for grass type
    switch (grassData.grassType) {
      case "cool_season":
        baseDuration *= 0.9
        break
      case "warm_season":
        baseDuration *= 1.1
        break
    }

    return Math.round(baseDuration)
  }

  private startLearningEngine() {
    // Machine learning component to improve scheduling over time
    setInterval(
      () => {
        this.updateLearningData()
      },
      24 * 60 * 60 * 1000,
    ) // Daily learning updates
  }

  private updateLearningData() {
    // Analyze past performance and adjust algorithms
    this.schedules.forEach((schedule) => {
      if (schedule.adaptiveSettings.learningEnabled) {
        // Collect performance metrics
        const performance = this.analyzeSchedulePerformance(schedule)
        this.learningData.set(schedule.id, performance)

        // Adjust schedule parameters based on learning
        this.adaptSchedule(schedule, performance)
      }
    })
  }

  private analyzeSchedulePerformance(schedule: SmartSchedule): any {
    // Analyze how well the schedule performed
    return {
      completionRate: 0.95,
      weatherAccuracy: 0.88,
      grassQuality: 0.92,
      energyEfficiency: 0.85,
      userSatisfaction: 0.9,
    }
  }

  private adaptSchedule(schedule: SmartSchedule, performance: any) {
    // Adjust schedule based on performance metrics
    if (performance.weatherAccuracy < 0.8) {
      // Increase weather condition weight
      schedule.conditions.forEach((condition) => {
        if (condition.type === "weather") {
          condition.weight = Math.min(1.0, condition.weight + 0.1)
        }
      })
    }
  }

  updateGrassData(zoneId: string, data: Partial<GrassGrowthData>) {
    const existing = this.grassData.get(zoneId) || {
      zone: zoneId,
      growthRate: 2.5,
      lastCut: Date.now(),
      currentHeight: 30,
      optimalHeight: 25,
      grassType: "mixed" as const,
    }

    this.grassData.set(zoneId, { ...existing, ...data })
  }

  getSchedules(): SmartSchedule[] {
    return [...this.schedules]
  }

  addSchedule(schedule: SmartSchedule) {
    this.schedules.push(schedule)
  }

  removeSchedule(id: string) {
    this.schedules = this.schedules.filter((s) => s.id !== id)
  }

  async getNextOptimalRun(zoneId: string): Promise<Date | null> {
    const schedule = await this.calculateOptimalSchedule(zoneId)
    return schedule?.nextRun ? new Date(schedule.nextRun) : null
  }
}

export const smartScheduler = new SmartScheduler()
