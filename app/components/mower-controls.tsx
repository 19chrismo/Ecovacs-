"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Play, Pause, Square, Home, Shield } from "lucide-react"

interface MowerControlsProps {
  mowerStatus: any
  setMowerStatus: (status: any) => void
}

export function MowerControls({ mowerStatus, setMowerStatus }: MowerControlsProps) {
  const [cuttingHeight, setCuttingHeight] = useState([35])
  const [mowingSpeed, setMowingSpeed] = useState([50])
  const [edgeMode, setEdgeMode] = useState(false)

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mower Controls</h2>
        <p className="text-muted-foreground">Direct control and advanced settings for your Ecovacs GX 600</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Main Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Primary Controls
            </CardTitle>
            <CardDescription>Start, stop, and navigate your mower</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleStart} disabled={mowerStatus.status === "mowing"} className="h-12">
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
              <Button
                variant="outline"
                onClick={handlePause}
                disabled={mowerStatus.status !== "mowing"}
                className="h-12"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button variant="outline" onClick={handleStop} className="h-12">
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
              <Button variant="outline" onClick={handleReturnHome} className="h-12">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </div>

            <div className="pt-4 border-t">
              <Button variant="destructive" className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Emergency Stop
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cutting Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Cutting Settings</CardTitle>
            <CardDescription>Adjust cutting height and mowing patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Cutting Height: {cuttingHeight[0]}mm</Label>
              <Slider
                value={cuttingHeight}
                onValueChange={setCuttingHeight}
                max={70}
                min={20}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>20mm</span>
                <span>70mm</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mowing Speed: {mowingSpeed[0]}%</Label>
              <Slider
                value={mowingSpeed}
                onValueChange={setMowingSpeed}
                max={100}
                min={10}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Slow</span>
                <span>Fast</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Edge Cutting Mode</Label>
              <Switch checked={edgeMode} onCheckedChange={setEdgeMode} />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Features */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Features</CardTitle>
            <CardDescription>LIDAR and sensor configurations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>LIDAR Precision</Label>
                <Select defaultValue="high">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="ultra">Ultra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label>Obstacle Detection</Label>
                <Select defaultValue="sensitive">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="sensitive">Sensitive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label>Rain Sensor</Label>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <Label>Anti-theft Alarm</Label>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pattern & Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Mowing Patterns</CardTitle>
            <CardDescription>Choose cutting patterns and navigation modes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label>Cutting Pattern</Label>
                <Select defaultValue="random">
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random">Random</SelectItem>
                    <SelectItem value="parallel">Parallel Lines</SelectItem>
                    <SelectItem value="spiral">Spiral</SelectItem>
                    <SelectItem value="zigzag">Zigzag</SelectItem>
                    <SelectItem value="edge-first">Edge First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Navigation Mode</Label>
                <Select defaultValue="smart">
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smart">Smart Navigation</SelectItem>
                    <SelectItem value="systematic">Systematic</SelectItem>
                    <SelectItem value="eco">Eco Mode</SelectItem>
                    <SelectItem value="turbo">Turbo Mode</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label>Multi-zone Optimization</Label>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
