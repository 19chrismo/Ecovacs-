"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { mowerBluetooth } from "../services/bluetooth-service"
import { RealBluetoothSetup } from "./real-bluetooth-setup"
import { ArrowLeft, Shield, Settings, Gauge, Bluetooth } from "lucide-react"

interface RealManualControlProps {
  onBack: () => void
}

export function RealManualControl({ onBack }: RealManualControlProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [speed, setSpeed] = useState([50])
  const [realTimeData, setRealTimeData] = useState({
    battery: 0,
    status: "idle",
    temperature: 0,
    position: { x: 0, y: 0 },
    timestamp: 0,
  })

  useEffect(() => {
    // Listen for real mower data
    const handleMowerData = (event: any) => {
      setRealTimeData(event.detail)
    }

    window.addEventListener("mowerDataUpdate", handleMowerData)
    return () => window.removeEventListener("mowerDataUpdate", handleMowerData)
  }, [])

  useEffect(() => {
    // Send joystick data to real mower when position changes
    if (isConnected && (joystickPosition.x !== 0 || joystickPosition.y !== 0)) {
      mowerBluetooth.sendJoystickData(joystickPosition.x, joystickPosition.y, speed[0])
    }
  }, [joystickPosition, speed, isConnected])

  const handleJoystickMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !isConnected) return

    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const x = e.clientX - rect.left - centerX
    const y = e.clientY - rect.top - centerY

    const distance = Math.sqrt(x * x + y * y)
    const maxDistance = Math.min(centerX, centerY) - 20

    if (distance <= maxDistance) {
      setJoystickPosition({ x: (x / maxDistance) * 100, y: (y / maxDistance) * 100 })
    } else {
      const angle = Math.atan2(y, x)
      setJoystickPosition({
        x: Math.cos(angle) * 100,
        y: Math.sin(angle) * 100,
      })
    }
  }

  const handleJoystickRelease = () => {
    setIsDragging(false)
    setJoystickPosition({ x: 0, y: 0 })
  }

  const sendCommand = async (command: string) => {
    if (!isConnected) return

    const success = await mowerBluetooth.sendCommand(command)
    if (!success) {
      console.error(`Failed to send command: ${command}`)
    }
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
            <h1 className="text-2xl font-bold text-slate-200">Real Mower Control</h1>
            <p className="text-sm text-slate-400">Direct connection to GOAT-0050</p>
          </div>
          <Badge
            className={`${isConnected ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/30" : "bg-red-600/20 text-red-400 border-red-500/30"}`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>

        {!isConnected ? (
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <RealBluetoothSetup onConnectionChange={setIsConnected} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Real Joystick Control */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Real Joystick Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Connection Status */}
                <div className="flex items-center gap-2 p-2 bg-emerald-600/10 border border-emerald-500/30 rounded">
                  <Bluetooth className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-emerald-400">Live connection to GOAT-0050</span>
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
                        left: `calc(50% + ${(joystickPosition.x / 100) * 60}px - 16px)`,
                        top: `calc(50% + ${(joystickPosition.y / 100) * 60}px - 16px)`,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-slate-500 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Speed Control */}
                <div className="space-y-2">
                  <Label className="text-slate-200">Speed: {speed[0]}%</Label>
                  <Slider value={speed} onValueChange={setSpeed} max={100} min={10} step={10} className="w-full" />
                </div>

                {/* Real-time Position Display */}
                <div className="text-center text-sm text-slate-400">
                  <div>
                    X: {joystickPosition.x.toFixed(1)}% | Y: {joystickPosition.y.toFixed(1)}%
                  </div>
                  <div>Speed: {speed[0]}%</div>
                </div>
              </CardContent>
            </Card>

            {/* Real-time Data from Mower */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">Live Mower Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Battery</Label>
                    <div className="text-lg font-semibold text-slate-200">{realTimeData.battery}%</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Status</Label>
                    <div className="text-lg font-semibold text-slate-200 capitalize">{realTimeData.status}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Temperature</Label>
                    <div className="text-lg font-semibold text-slate-200">{realTimeData.temperature.toFixed(1)}°C</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Last Update</Label>
                    <div className="text-sm text-slate-200">
                      {realTimeData.timestamp ? new Date(realTimeData.timestamp).toLocaleTimeString() : "N/A"}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <Label className="text-xs text-slate-400">Position</Label>
                  <div className="text-sm text-slate-200">
                    X: {realTimeData.position.x}, Y: {realTimeData.position.y}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real Control Panel */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">Mower Commands</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => sendCommand("start")}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                  >
                    Start
                  </Button>
                  <Button
                    onClick={() => sendCommand("stop")}
                    variant="outline"
                    className="border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                  >
                    Stop
                  </Button>
                  <Button
                    onClick={() => sendCommand("pause")}
                    variant="outline"
                    className="border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                  >
                    Pause
                  </Button>
                  <Button
                    onClick={() => sendCommand("return_home")}
                    variant="outline"
                    className="border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                  >
                    Home
                  </Button>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => sendCommand("blade_on")}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Turn Blade On
                  </Button>
                  <Button
                    onClick={() => sendCommand("blade_off")}
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Turn Blade Off
                  </Button>
                </div>

                <Button
                  onClick={() => sendCommand("emergency_stop")}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Emergency Stop
                </Button>

                <div className="pt-2 border-t border-slate-700">
                  <div className="text-xs text-slate-400">
                    Commands are sent directly to your GOAT-0050 mower via Bluetooth Low Energy
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
