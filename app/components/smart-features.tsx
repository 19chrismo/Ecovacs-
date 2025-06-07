"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { weatherService } from "../services/weather-service"
import {
  Brain,
  Cloud,
  Leaf,
  Shield,
  Smartphone,
  Wifi,
  Battery,
  Droplets,
  Sun,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

export function SmartFeatures() {
  const [weatherData, setWeatherData] = useState<any>(null)
  const [grassGrowthData, setGrassGrowthData] = useState<any>({
    frontLawn: { height: 32, growthRate: 2.5, lastCut: Date.now() - 5 * 24 * 60 * 60 * 1000 },
    backyard: { height: 28, growthRate: 3.1, lastCut: Date.now() - 3 * 24 * 60 * 60 * 1000 },
    sideLawn: { height: 35, growthRate: 2.8, lastCut: Date.now() - 7 * 24 * 60 * 60 * 1000 },
  })
  const [smartFeatures, setSmartFeatures] = useState({
    adaptiveScheduling: true,
    weatherOptimization: true,
    grassGrowthTracking: true,
    energyOptimization: true,
    antiTheft: true,
    rainSensor: true,
    nightMode: false,
    ecoMode: true,
    learningMode: true,
  })

  useEffect(() => {
    // Load weather data
    weatherService.getCurrentWeather().then(setWeatherData)

    // Simulate grass growth updates
    const interval = setInterval(() => {
      setGrassGrowthData((prev: any) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((zone) => {
          updated[zone].height += updated[zone].growthRate / 24 // Growth per hour
        })
        return updated
      })
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const getGrassStatus = (height: number) => {
    if (height < 25) return { status: "Short", color: "text-emerald-400", icon: CheckCircle }
    if (height < 35) return { status: "Optimal", color: "text-blue-400", icon: CheckCircle }
    if (height < 45) return { status: "Long", color: "text-yellow-400", icon: AlertTriangle }
    return { status: "Overgrown", color: "text-red-400", icon: AlertTriangle }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return Sun
      case "cloudy":
        return Cloud
      case "rainy":
        return Droplets
      default:
        return Cloud
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-200">Smart Features & AI</h2>
        <p className="text-slate-400">Intelligent automation and advanced mower capabilities</p>
      </div>

      <Tabs defaultValue="ai" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger
            value="ai"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            AI & Learning
          </TabsTrigger>
          <TabsTrigger
            value="weather"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            Weather Integration
          </TabsTrigger>
          <TabsTrigger
            value="grass"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            Grass Intelligence
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            Security & Safety
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* AI Learning Engine */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <Brain className="h-5 w-5" />
                  AI Learning Engine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-200">Adaptive Scheduling</Label>
                    <Switch
                      checked={smartFeatures.adaptiveScheduling}
                      onCheckedChange={(checked) =>
                        setSmartFeatures((prev) => ({ ...prev, adaptiveScheduling: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-slate-200">Learning Mode</Label>
                    <Switch
                      checked={smartFeatures.learningMode}
                      onCheckedChange={(checked) => setSmartFeatures((prev) => ({ ...prev, learningMode: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-slate-200">Energy Optimization</Label>
                    <Switch
                      checked={smartFeatures.energyOptimization}
                      onCheckedChange={(checked) =>
                        setSmartFeatures((prev) => ({ ...prev, energyOptimization: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <div className="text-sm text-slate-200 mb-2">Learning Progress</div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Pattern Recognition</span>
                        <span className="text-slate-200">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Weather Prediction</span>
                        <span className="text-slate-200">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Grass Growth Model</span>
                        <span className="text-slate-200">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smart Recommendations */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <TrendingUp className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-600/10 border border-emerald-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-400">Optimal Timing</span>
                    </div>
                    <div className="text-xs text-slate-300">Best mowing window: Tomorrow 9:00 AM - 11:00 AM</div>
                  </div>

                  <div className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Leaf className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-blue-400">Pattern Suggestion</span>
                    </div>
                    <div className="text-xs text-slate-300">Use spiral pattern for side lawn - 15% more efficient</div>
                  </div>

                  <div className="p-3 bg-yellow-600/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Battery className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-400">Energy Tip</span>
                    </div>
                    <div className="text-xs text-slate-300">
                      Charge during off-peak hours (11 PM - 6 AM) to save 23%
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  <Brain className="h-4 w-4 mr-2" />
                  Apply AI Suggestions
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weather" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Current Weather */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  {weatherData && React.createElement(getWeatherIcon(weatherData.condition), { className: "h-5 w-5" })}
                  Current Weather
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {weatherData ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-slate-400">Temperature</div>
                        <div className="text-slate-200 font-medium">{weatherData.temperature.toFixed(1)}°C</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Humidity</div>
                        <div className="text-slate-200 font-medium">{weatherData.humidity}%</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Wind</div>
                        <div className="text-slate-200 font-medium">{weatherData.windSpeed.toFixed(1)} km/h</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Rain</div>
                        <div className="text-slate-200 font-medium">{weatherData.precipitation.toFixed(1)}mm</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700">
                      <Badge
                        className={
                          weatherService.isSuitableForMowing(weatherData)
                            ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/30"
                            : "bg-red-600/20 text-red-400 border-red-500/30"
                        }
                      >
                        {weatherService.isSuitableForMowing(weatherData)
                          ? "Good for Mowing"
                          : "Wait for Better Weather"}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-400">Loading weather data...</div>
                )}
              </CardContent>
            </Card>

            {/* Weather Settings */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">Weather Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-200">Weather Optimization</Label>
                    <Switch
                      checked={smartFeatures.weatherOptimization}
                      onCheckedChange={(checked) =>
                        setSmartFeatures((prev) => ({ ...prev, weatherOptimization: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-slate-200">Rain Sensor</Label>
                    <Switch
                      checked={smartFeatures.rainSensor}
                      onCheckedChange={(checked) => setSmartFeatures((prev) => ({ ...prev, rainSensor: checked }))}
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-700">
                    <div className="text-xs text-slate-400 space-y-1">
                      <div>• Skip mowing when rain probability &gt; 30%</div>
                      <div>• Delay after rain for 2 hours</div>
                      <div>• Avoid high wind conditions (&gt;25 km/h)</div>
                      <div>• Optimize for temperature and humidity</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather Forecast */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">24-Hour Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { time: "Now", temp: 22, rain: 0, icon: Sun },
                    { time: "3h", temp: 24, rain: 10, icon: Cloud },
                    { time: "6h", temp: 26, rain: 5, icon: Sun },
                    { time: "9h", temp: 25, rain: 20, icon: Cloud },
                    { time: "12h", temp: 23, rain: 60, icon: Droplets },
                    { time: "15h", temp: 21, rain: 80, icon: Droplets },
                  ].map((forecast, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 w-8">{forecast.time}</span>
                      <forecast.icon className="h-4 w-4 text-slate-300" />
                      <span className="text-slate-200 w-8">{forecast.temp}°</span>
                      <span className="text-blue-400 w-8">{forecast.rain}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="grass" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Grass Growth Tracking */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <Leaf className="h-5 w-5" />
                  Grass Growth Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(grassGrowthData).map(([zone, data]: [string, any]) => {
                    const status = getGrassStatus(data.height)
                    const StatusIcon = status.icon

                    return (
                      <div key={zone} className="p-3 border border-slate-600 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-200 capitalize">
                            {zone.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`h-4 w-4 ${status.color}`} />
                            <Badge variant="outline" className={`text-xs ${status.color}`}>
                              {status.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <div className="text-slate-400">Height</div>
                            <div className="text-slate-200">{data.height.toFixed(1)}mm</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Growth Rate</div>
                            <div className="text-slate-200">{data.growthRate}mm/day</div>
                          </div>
                          <div>
                            <div className="text-slate-400">Last Cut</div>
                            <div className="text-slate-200">
                              {Math.round((Date.now() - data.lastCut) / (24 * 60 * 60 * 1000))}d ago
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-slate-200">Growth Tracking</Label>
                  <Switch
                    checked={smartFeatures.grassGrowthTracking}
                    onCheckedChange={(checked) =>
                      setSmartFeatures((prev) => ({ ...prev, grassGrowthTracking: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cutting Recommendations */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">Smart Cutting Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-red-600/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <span className="text-sm font-medium text-red-400">Urgent</span>
                    </div>
                    <div className="text-xs text-slate-300">
                      Side Lawn needs cutting - grass is 35mm (optimal: 25mm)
                    </div>
                    <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700 text-white">
                      Schedule Now
                    </Button>
                  </div>

                  <div className="p-3 bg-yellow-600/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-400">Soon</span>
                    </div>
                    <div className="text-xs text-slate-300">Front Lawn will need cutting in 2 days</div>
                  </div>

                  <div className="p-3 bg-emerald-600/10 border border-emerald-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-400">Good</span>
                    </div>
                    <div className="text-xs text-slate-300">Backyard is at optimal height</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <div className="text-xs text-slate-400">
                    AI analyzes grass growth patterns, weather conditions, and seasonal changes to optimize cutting
                    schedules
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Security Features */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <Shield className="h-5 w-5" />
                  Security & Anti-Theft
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-200">Anti-Theft Protection</Label>
                    <Switch
                      checked={smartFeatures.antiTheft}
                      onCheckedChange={(checked) => setSmartFeatures((prev) => ({ ...prev, antiTheft: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-slate-200">Night Mode</Label>
                    <Switch
                      checked={smartFeatures.nightMode}
                      onCheckedChange={(checked) => setSmartFeatures((prev) => ({ ...prev, nightMode: checked }))}
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-700">
                    <div className="text-sm text-slate-200 mb-2">Security Status</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm text-slate-200">GPS Tracking Active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm text-slate-200">Lift Sensor Armed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm text-slate-200">Tilt Alarm Enabled</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm text-slate-200">PIN Lock Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smart Connectivity */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <Smartphone className="h-5 w-5" />
                  Smart Connectivity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm text-slate-200">WiFi Connection</span>
                    </div>
                    <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30">Connected</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-slate-200">Mobile App</span>
                    </div>
                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">Synced</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-slate-200">Cloud Backup</span>
                    </div>
                    <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">Active</Badge>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <div className="text-sm text-slate-200 mb-2">Remote Features</div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>• Remote start/stop from anywhere</div>
                    <div>• Real-time status notifications</div>
                    <div>• GPS location tracking</div>
                    <div>• Firmware updates over-the-air</div>
                    <div>• Cloud data analytics</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
