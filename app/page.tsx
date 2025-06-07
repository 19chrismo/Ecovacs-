"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScheduleManager } from "./components/schedule-manager"
import { MowerControls } from "./components/mower-controls"
import { AdvancedSettings } from "./components/advanced-settings"
import { MaintenanceTracker } from "./components/maintenance-tracker"
import { WeatherWidget } from "./components/weather-widget"
import { SetupWizard } from "./components/setup-wizard"
import { RealManualControl } from "./components/real-manual-control"
import { AIReverseEngineer } from "./components/ai-reverse-engineer"
import { AutomationDashboard } from "./components/automation-dashboard"
import { AdvancedMapping } from "./components/advanced-mapping"
import { SmartFeatures } from "./components/smart-features"
import { PolygonZoneEditor } from "./components/polygon-zone-editor"
import {
  Battery,
  Wifi,
  MapPin,
  Clock,
  Settings,
  Play,
  Pause,
  Square,
  Home,
  Shield,
  Bluetooth,
  Gamepad2,
  Cog,
  Brain,
  Zap,
  Radar,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import { MapIcon, CalendarIcon, SettingsIcon, PenToolIcon as ToolIcon, HomeIcon } from "lucide-react"

export default function MowerPortal() {
  const [currentPage, setCurrentPage] = useState<
    "main" | "setup" | "manual" | "ai" | "automation" | "mapping" | "smart"
  >("main")
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const [mowerStatus, setMowerStatus] = useState({
    status: "mowing",
    battery: 85,
    area: 45,
    totalArea: 120,
    currentZone: "Front Lawn",
    connected: true,
    bluetoothConnected: true,
    position: { x: 150, y: 200 },
    bladesOn: true,
    speed: 50,
    direction: 0,
  })
  const [connected, setConnected] = useState(true)

  const handleStart = () => {
    setMowerStatus({ ...mowerStatus, status: "mowing" })
  }

  const handlePause = () => {
    setMowerStatus({ ...mowerStatus, status: "paused" })
  }

  const handleStop = () => {
    setMowerStatus({ ...mowerStatus, status: "idle" })
  }

  const handleReturnHome = () => {
    setMowerStatus({ ...mowerStatus, status: "returning" })
  }

  const handleEmergencyStop = () => {
    setMowerStatus({ ...mowerStatus, status: "emergency", bladesOn: false })
  }

  if (currentPage === "setup") {
    return (
      <SetupWizard
        onComplete={() => {
          setIsSetupComplete(true)
          setCurrentPage("main")
        }}
        onBack={() => setCurrentPage("main")}
      />
    )
  }

  if (currentPage === "manual") {
    return <RealManualControl onBack={() => setCurrentPage("main")} />
  }

  if (currentPage === "ai") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setCurrentPage("main")}
              variant="outline"
              className="border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-slate-200"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-slate-200">AI Reverse Engineering</h1>
            <div />
          </div>
          <AIReverseEngineer />
        </div>
      </div>
    )
  }

  if (currentPage === "automation") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setCurrentPage("main")}
              variant="outline"
              className="border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-slate-200"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-slate-200">Automation Dashboard</h1>
            <div />
          </div>
          <AutomationDashboard />
        </div>
      </div>
    )
  }

  if (currentPage === "mapping") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setCurrentPage("main")}
              variant="outline"
              className="border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-slate-200"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-slate-200">Advanced Mapping</h1>
            <div />
          </div>
          <AdvancedMapping />
        </div>
      </div>
    )
  }

  if (currentPage === "smart") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setCurrentPage("main")}
              variant="outline"
              className="border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-slate-200"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-slate-200">Smart Features</h1>
            <div />
          </div>
          <SmartFeatures />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Enhanced Status Bar */}
      <div className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50 px-4 py-2 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Battery className={`h-3 w-3 ${mowerStatus.battery > 20 ? "text-emerald-400" : "text-red-400"}`} />
              <span className="font-medium">{mowerStatus.battery}%</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-emerald-400" />
              <span className="capitalize">{mowerStatus.status}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-emerald-400" />
              <span>{Math.round((mowerStatus.area / mowerStatus.totalArea) * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="h-3 w-3 text-emerald-400" />
              <span>2h 15m</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-300">{mowerStatus.currentZone}</div>
            <div className="flex items-center gap-2">
              <Wifi className={`h-3 w-3 ${mowerStatus.connected ? "text-emerald-400" : "text-red-400"}`} />
              <Bluetooth
                className={`h-3 w-3 ${mowerStatus.bluetoothConnected ? "text-emerald-400" : "text-red-400"}`}
              />
              <Badge
                variant={mowerStatus.connected ? "default" : "destructive"}
                className={`text-xs px-2 py-1 ${mowerStatus.connected ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/30" : "bg-red-600/20 text-red-400 border-red-500/30"}`}
              >
                {mowerStatus.connected ? "Online" : "Offline"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Enhanced Mower Logo */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 relative bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-2 border border-slate-600/50 shadow-lg">
                  <Image
                    src="/images/ecovacs-mower.png"
                    alt="Ecovacs GX 600 Mower"
                    fill
                    className="object-contain"
                    style={{
                      filter: "brightness(0.9) contrast(1.1)",
                      mixBlendMode: "multiply",
                    }}
                  />
                </div>
                <div className="text-xs text-slate-400 mt-1 text-center">
                  <div className="font-semibold text-slate-200 text-xs">GOAT</div>
                  <div className="text-slate-500 text-xs">0050</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <WeatherWidget />
              <Button
                onClick={() => setCurrentPage("smart")}
                variant="outline"
                size="sm"
                className="border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-slate-200 backdrop-blur-sm w-8 h-8 p-0"
                title="Smart Features"
              >
                <Sparkles className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => setCurrentPage("mapping")}
                variant="outline"
                size="sm"
                className="border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-slate-200 backdrop-blur-sm w-8 h-8 p-0"
                title="Advanced Mapping"
              >
                <Radar className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => setCurrentPage("ai")}
                variant="outline"
                size="sm"
                className="border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-slate-200 backdrop-blur-sm w-8 h-8 p-0"
                title="AI Tools"
              >
                <Brain className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => setCurrentPage("automation")}
                variant="outline"
                size="sm"
                className="border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-slate-200 backdrop-blur-sm w-8 h-8 p-0"
                title="Automation"
              >
                <Zap className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => setCurrentPage("setup")}
                variant="outline"
                size="sm"
                className="border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-slate-200 backdrop-blur-sm w-8 h-8 p-0"
                title="Settings"
              >
                <Cog className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-xl">
            <CardContent className="p-2">
              <div className="grid grid-cols-7 gap-1">
                <Button
                  onClick={handleStart}
                  disabled={mowerStatus.status === "mowing"}
                  className="h-8 flex-col gap-0.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border-0 text-xs px-1 shadow-lg"
                >
                  <Play className="h-3 w-3" />
                  <span className="text-xs">Start</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePause}
                  disabled={mowerStatus.status !== "mowing"}
                  className="h-8 flex-col gap-0.5 border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-slate-200 text-xs px-1 backdrop-blur-sm"
                >
                  <Pause className="h-3 w-3" />
                  <span className="text-xs">Pause</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleStop}
                  className="h-8 flex-col gap-0.5 border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-slate-200 text-xs px-1 backdrop-blur-sm"
                >
                  <Square className="h-3 w-3" />
                  <span className="text-xs">Stop</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReturnHome}
                  className="h-8 flex-col gap-0.5 border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-slate-200 text-xs px-1 backdrop-blur-sm"
                >
                  <Home className="h-3 w-3" />
                  <span className="text-xs">Dock</span>
                </Button>
                <Button
                  onClick={() => setCurrentPage("manual")}
                  className="h-8 flex-col gap-0.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 text-xs px-1 shadow-lg"
                >
                  <Gamepad2 className="h-3 w-3" />
                  <span className="text-xs">Control</span>
                </Button>
                <Button
                  onClick={handleEmergencyStop}
                  className="h-8 flex-col gap-0.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0 text-xs px-1 shadow-lg text-white"
                >
                  <Shield className="h-3 w-3" />
                  <span className="text-xs">Emergency</span>
                </Button>
                <Button
                  onClick={() => setMowerStatus({ ...mowerStatus, bladesOn: !mowerStatus.bladesOn })}
                  className={`h-8 flex-col gap-0.5 border-0 text-xs px-1 shadow-lg text-white ${
                    mowerStatus.bladesOn
                      ? "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                      : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                  }`}
                >
                  <Settings className="h-3 w-3" />
                  <span className="text-xs">{mowerStatus.bladesOn ? "Blade On" : "Blade Off"}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Polygon Zone Editor */}
          <PolygonZoneEditor mowerStatus={mowerStatus} setMowerStatus={setMowerStatus} />

          {/* Enhanced Features Tabs */}
          <Tabs defaultValue="schedule" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700/50 h-10 backdrop-blur-sm">
              <TabsTrigger
                value="schedule"
                className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white h-8 transition-all duration-200"
              >
                Schedule
              </TabsTrigger>
              <TabsTrigger
                value="controls"
                className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white h-8 transition-all duration-200"
              >
                Advanced
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white h-8 transition-all duration-200"
              >
                Settings
              </TabsTrigger>
              <TabsTrigger
                value="maintenance"
                className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white h-8 transition-all duration-200"
              >
                Maintenance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="space-y-4">
              <ScheduleManager />
            </TabsContent>

            <TabsContent value="controls" className="space-y-4">
              <MowerControls mowerStatus={mowerStatus} setMowerStatus={setMowerStatus} />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <AdvancedSettings />
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <MaintenanceTracker />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* New Dashboard Layout */}
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto p-4">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">GOAT-0050 Control</h1>
            <Button
              variant={connected ? "default" : "outline"}
              onClick={() => setConnected(!connected)}
              className={connected ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {connected ? "Connected" : "Connect Mower"}
            </Button>
          </header>

          <Tabs defaultValue="map">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="map">
                <MapIcon className="mr-2" size={16} />
                Map
              </TabsTrigger>
              <TabsTrigger value="schedule">
                <CalendarIcon className="mr-2" size={16} />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="control">
                <HomeIcon className="mr-2" size={16} />
                Control
              </TabsTrigger>
              <TabsTrigger value="maintenance">
                <ToolIcon className="mr-2" size={16} />
                Maintenance
              </TabsTrigger>
              <TabsTrigger value="settings">
                <SettingsIcon className="mr-2" size={16} />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="map">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="aspect-video bg-slate-700 rounded-lg flex items-center justify-center">
                    <p className="text-slate-400">Interactive Map View</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tab contents would go here */}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
