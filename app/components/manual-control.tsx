"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ArrowLeftIcon,
  ArrowRight,
  RotateCcw,
  RotateCw,
  Shield,
  Settings,
  Zap,
  Camera,
  Gauge,
  Video,
  VideoOff,
  Maximize2,
  RefreshCw,
} from "lucide-react"

interface ManualControlProps {
  mowerStatus: any
  setMowerStatus: (status: any) => void
  onBack: () => void
}

export function ManualControl({ mowerStatus, setMowerStatus, onBack }: ManualControlProps) {
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [speed, setSpeed] = useState([50])
  const [cameraActive, setCameraActive] = useState(true)
  const [cameraQuality, setCameraQuality] = useState("HD")
  const [liveData, setLiveData] = useState({
    temperature: 24,
    humidity: 65,
    vibration: 0.2,
    grassHeight: 45,
    obstacleDistance: 150,
    batteryVoltage: 24.8,
    motorRPM: 2400,
    gpsSignal: 95,
  })

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData((prev) => ({
        ...prev,
        temperature: 24 + Math.random() * 2 - 1,
        vibration: Math.random() * 0.5,
        obstacleDistance: 100 + Math.random() * 100,
        motorRPM: mowerStatus.bladesOn ? 2400 + Math.random() * 200 - 100 : 0,
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [mowerStatus.bladesOn])

  const handleJoystickMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return

    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const x = e.clientX - rect.left - centerX
    const y = e.clientY - rect.top - centerY

    const distance = Math.sqrt(x * x + y * y)
    const maxDistance = Math.min(centerX, centerY) - 20

    if (distance <= maxDistance) {
      setJoystickPosition({ x, y })
    } else {
      const angle = Math.atan2(y, x)
      setJoystickPosition({
        x: Math.cos(angle) * maxDistance,
        y: Math.sin(angle) * maxDistance,
      })
    }
  }

  const handleJoystickRelease = () => {
    setIsDragging(false)
    setJoystickPosition({ x: 0, y: 0 })
  }

  const handleDirectionalMove = (direction: string) => {
    const moveDistance = 30
    switch (direction) {
      case "up":
        setJoystickPosition({ x: 0, y: -moveDistance })
        break
      case "down":
        setJoystickPosition({ x: 0, y: moveDistance })
        break
      case "left":
        setJoystickPosition({ x: -moveDistance, y: 0 })
        break
      case "right":
        setJoystickPosition({ x: moveDistance, y: 0 })
        break
    }

    setTimeout(() => setJoystickPosition({ x: 0, y: 0 }), 200)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-slate-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-200">Manual Control</h1>
            <p className="text-sm text-slate-400">Direct mower operation and live monitoring</p>
          </div>
          <Badge
            className={`${mowerStatus.status === "manual" ? "bg-blue-600/20 text-blue-400 border-blue-500/30" : "bg-slate-600/20 text-slate-400 border-slate-500/30"}`}
          >
            {mowerStatus.status === "manual" ? "Manual Mode" : "Auto Mode"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Joystick Control with Camera View */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Joystick Control
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setCameraActive(!cameraActive)}
                  >
                    {cameraActive ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Live Camera View */}
              <div className="relative w-full h-48 bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                {cameraActive ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50">
                      {/* Simulated camera view with grass texture */}
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M0 0h100v100H0z' fill='%23143601'/%3E%3Cpath d='M30 10v80M10 30h80M70 10v80M10 70h80' stroke='%23195004' strokeWidth='2'/%3E%3Cpath d='M20 20h60v60H20z' fill='%23195004'/%3E%3C/svg%3E")`,
                          backgroundSize: "cover",
                          animation: "cameraPan 30s infinite alternate",
                        }}
                      ></div>

                      {/* Overlay elements */}
                      <div className="absolute top-2 left-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-white">LIVE</span>
                      </div>

                      <div className="absolute top-2 right-2">
                        <Badge className="bg-slate-800/70 text-slate-200 text-xs">{cameraQuality}</Badge>
                      </div>

                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                        <span className="text-xs text-slate-300">ECOVACS GX 600</span>
                        <span className="text-xs text-slate-300">
                          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      {/* Obstacle detection overlay */}
                      {liveData.obstacleDistance < 120 && (
                        <div
                          className="absolute border-2 border-red-500 rounded-lg animate-pulse"
                          style={{
                            left: "30%",
                            top: "40%",
                            width: "20%",
                            height: "15%",
                          }}
                        >
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500/80 px-2 py-0.5 rounded text-xs text-white whitespace-nowrap">
                            {Math.round(liveData.obstacleDistance)}cm
                          </div>
                        </div>
                      )}

                      {/* Grid overlay */}
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `
                            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                          `,
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <VideoOff className="h-8 w-8 mx-auto mb-2 text-slate-500" />
                      <p className="text-slate-500">Camera feed disabled</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="flex justify-between items-center">
                <Label className="text-slate-200">Camera Quality</Label>
                <div className="flex gap-1">
                  {["SD", "HD", "4K"].map((quality) => (
                    <Button
                      key={quality}
                      size="sm"
                      variant={cameraQuality === quality ? "default" : "outline"}
                      onClick={() => setCameraQuality(quality)}
                      className={`h-7 px-2 py-1 text-xs ${
                        cameraQuality === quality
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-slate-700 hover:bg-slate-600 border-slate-600"
                      }`}
                    >
                      {quality}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Virtual Joystick */}
              <div className="flex justify-center">
                <div
                  className="relative w-40 h-40 bg-slate-700 rounded-full border-2 border-slate-600 cursor-pointer"
                  onMouseDown={() => setIsDragging(true)}
                  onMouseMove={handleJoystickMove}
                  onMouseUp={handleJoystickRelease}
                  onMouseLeave={handleJoystickRelease}
                >
                  <div
                    className="absolute w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full border-2 border-white shadow-lg transition-all duration-100"
                    style={{
                      left: `calc(50% + ${joystickPosition.x}px - 16px)`,
                      top: `calc(50% + ${joystickPosition.y}px - 16px)`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-500 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Directional Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <div />
                <Button
                  onMouseDown={() => handleDirectionalMove("up")}
                  className="bg-slate-700 hover:bg-slate-600 border border-slate-600"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <div />
                <Button
                  onMouseDown={() => handleDirectionalMove("left")}
                  className="bg-slate-700 hover:bg-slate-600 border border-slate-600"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setJoystickPosition({ x: 0, y: 0 })}
                  className="bg-slate-700 hover:bg-slate-600 border border-slate-600"
                >
                  <div className="w-2 h-2 bg-slate-400 rounded-full" />
                </Button>
                <Button
                  onMouseDown={() => handleDirectionalMove("right")}
                  className="bg-slate-700 hover:bg-slate-600 border border-slate-600"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <div />
                <Button
                  onMouseDown={() => handleDirectionalMove("down")}
                  className="bg-slate-700 hover:bg-slate-600 border border-slate-600"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <div />
              </div>

              {/* Speed Control */}
              <div className="space-y-2">
                <Label className="text-slate-200">Speed: {speed[0]}%</Label>
                <Slider value={speed} onValueChange={setSpeed} max={100} min={10} step={10} className="w-full" />
              </div>

              {/* Rotation Controls */}
              <div className="grid grid-cols-2 gap-2">
                <Button className="bg-slate-700 hover:bg-slate-600 border border-slate-600">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Rotate Left
                </Button>
                <Button className="bg-slate-700 hover:bg-slate-600 border border-slate-600">
                  <RotateCw className="h-4 w-4 mr-2" />
                  Rotate Right
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Live Data */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Live Data
              </CardTitle>
              <CardDescription className="text-slate-400">Real-time sensor readings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Temperature</Label>
                  <div className="text-lg font-semibold text-slate-200">{liveData.temperature.toFixed(1)}°C</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Humidity</Label>
                  <div className="text-lg font-semibold text-slate-200">{liveData.humidity}%</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Vibration</Label>
                  <div className="text-lg font-semibold text-slate-200">{liveData.vibration.toFixed(2)}g</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Grass Height</Label>
                  <div className="text-lg font-semibold text-slate-200">{liveData.grassHeight}mm</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Obstacle Dist.</Label>
                  <div className="text-lg font-semibold text-slate-200">{liveData.obstacleDistance.toFixed(0)}cm</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Battery Voltage</Label>
                  <div className="text-lg font-semibold text-slate-200">{liveData.batteryVoltage}V</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">Motor RPM</Label>
                  <div className="text-lg font-semibold text-slate-200">{liveData.motorRPM.toFixed(0)}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-400">GPS Signal</Label>
                  <div className="text-lg font-semibold text-slate-200">{liveData.gpsSignal}%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Control Panel */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Control Panel
              </CardTitle>
              <CardDescription className="text-slate-400">Mower functions and safety</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Blade Control */}
              <div className="space-y-2">
                <Label className="text-slate-200">Blade Control</Label>
                <Button
                  onClick={() => setMowerStatus({ ...mowerStatus, bladesOn: !mowerStatus.bladesOn })}
                  className={`w-full ${
                    mowerStatus.bladesOn
                      ? "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                      : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                  }`}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {mowerStatus.bladesOn ? "Turn Blade Off" : "Turn Blade On"}
                </Button>
              </div>

              {/* Emergency Stop */}
              <div className="space-y-2">
                <Label className="text-slate-200">Emergency Controls</Label>
                <Button
                  onClick={() => setMowerStatus({ ...mowerStatus, status: "emergency", bladesOn: false })}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Emergency Stop
                </Button>
              </div>

              {/* Mode Switch */}
              <div className="space-y-2">
                <Label className="text-slate-200">Operation Mode</Label>
                <Button
                  onClick={() =>
                    setMowerStatus({ ...mowerStatus, status: mowerStatus.status === "manual" ? "idle" : "manual" })
                  }
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {mowerStatus.status === "manual" ? "Switch to Auto" : "Switch to Manual"}
                </Button>
              </div>

              {/* Status Display */}
              <div className="space-y-2">
                <Label className="text-slate-200">Current Status</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Badge
                    className={`justify-center ${mowerStatus.bladesOn ? "bg-orange-600/20 text-orange-400 border-orange-500/30" : "bg-gray-600/20 text-gray-400 border-gray-500/30"}`}
                  >
                    Blade: {mowerStatus.bladesOn ? "ON" : "OFF"}
                  </Badge>
                  <Badge
                    className={`justify-center ${mowerStatus.status === "manual" ? "bg-blue-600/20 text-blue-400 border-blue-500/30" : "bg-emerald-600/20 text-emerald-400 border-emerald-500/30"}`}
                  >
                    Mode: {mowerStatus.status === "manual" ? "Manual" : "Auto"}
                  </Badge>
                  <Badge className="justify-center bg-emerald-600/20 text-emerald-400 border-emerald-500/30">
                    Battery: {mowerStatus.battery}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
