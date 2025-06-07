"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { lidarProcessor, type LidarScan, type Obstacle } from "../services/lidar-processor"
import { pathPlanner } from "../services/path-planner"
import { Radar, Navigation, Zap, Eye, Target, Route, AlertTriangle, CheckCircle, Activity } from "lucide-react"

export function AdvancedMapping() {
  const [lidarData, setLidarData] = useState<LidarScan | null>(null)
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [selectedPattern, setSelectedPattern] = useState("parallel")
  const [pathPoints, setPathPoints] = useState<any[]>([])
  const [scanResolution, setScanResolution] = useState([5])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Simulate LIDAR data updates
    const interval = setInterval(() => {
      if (isScanning) {
        // Generate mock LIDAR data
        const mockData = generateMockLidarData()
        const scan = lidarProcessor.processLidarData(mockData)
        setLidarData(scan)
        setObstacles(lidarProcessor.getObstacles())

        // Update canvas visualization
        updateCanvas(scan)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isScanning])

  const generateMockLidarData = (): Uint8Array => {
    const data = new Uint8Array(360 * 6) // 360 points, 6 bytes each

    for (let i = 0; i < 360; i++) {
      const angle = i
      let distance = 200 + Math.random() * 300 // Base distance 2-5m

      // Add some obstacles
      if (angle > 45 && angle < 75) distance = 80 + Math.random() * 40 // Obstacle at 1m
      if (angle > 180 && angle < 220) distance = 150 + Math.random() * 50 // Another obstacle

      const intensity = Math.floor(Math.random() * 255)

      const offset = i * 6
      data[offset] = (angle >> 8) & 0xff
      data[offset + 1] = angle & 0xff
      data[offset + 2] = (distance >> 8) & 0xff
      data[offset + 3] = distance & 0xff
      data[offset + 4] = intensity
      data[offset + 5] = 0 // Reserved
    }

    return data
  }

  const updateCanvas = (scan: LidarScan) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const scale = 0.5 // 1 pixel = 2cm

    // Clear canvas
    ctx.fillStyle = "#1e293b"
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = "#334155"
    ctx.lineWidth = 1
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, height)
      ctx.stroke()
    }
    for (let i = 0; i < height; i += 20) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(width, i)
      ctx.stroke()
    }

    // Draw LIDAR points
    ctx.fillStyle = "#10b981"
    scan.points.forEach((point) => {
      const x = centerX + point.distance * Math.cos((point.angle * Math.PI) / 180) * scale
      const y = centerY + point.distance * Math.sin((point.angle * Math.PI) / 180) * scale

      ctx.beginPath()
      ctx.arc(x, y, 2, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw obstacles
    obstacles.forEach((obstacle) => {
      const x = centerX + obstacle.position.x * scale
      const y = centerY + obstacle.position.y * scale

      ctx.fillStyle = obstacle.type === "dynamic" ? "#ef4444" : "#f59e0b"
      ctx.beginPath()
      ctx.arc(x, y, (obstacle.size.width * scale) / 2, 0, 2 * Math.PI)
      ctx.fill()

      // Draw confidence indicator
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, (obstacle.size.width * scale) / 2 + 5, 0, 2 * Math.PI * obstacle.confidence)
      ctx.stroke()
    })

    // Draw mower position
    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI)
    ctx.fill()

    // Draw planned path
    if (pathPoints.length > 0) {
      ctx.strokeStyle = "#8b5cf6"
      ctx.lineWidth = 3
      ctx.beginPath()
      pathPoints.forEach((point, index) => {
        const x = centerX + point.x * scale
        const y = centerY + point.y * scale

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()
    }
  }

  const generatePath = () => {
    const mockZone = {
      id: "test_zone",
      name: "Test Zone",
      boundary: [
        { x: -100, y: -100 },
        { x: 100, y: -100 },
        { x: 100, y: 100 },
        { x: -100, y: 100 },
      ],
      obstacles: obstacles.map((obs) => ({
        x: obs.position.x,
        y: obs.position.y,
        radius: obs.size.width / 2,
      })),
      grassType: "mixed" as const,
      priority: 1,
      lastMowed: Date.now(),
    }

    const path = pathPlanner.generatePath(mockZone, selectedPattern, 20)
    setPathPoints(path)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-200">Advanced Mapping & Navigation</h2>
        <p className="text-slate-400">LIDAR-based mapping and intelligent path planning</p>
      </div>

      <Tabs defaultValue="lidar" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger
            value="lidar"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            LIDAR Mapping
          </TabsTrigger>
          <TabsTrigger
            value="pathplanning"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            Path Planning
          </TabsTrigger>
          <TabsTrigger
            value="obstacles"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            Obstacle Detection
          </TabsTrigger>
          <TabsTrigger
            value="navigation"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            Navigation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lidar" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* LIDAR Controls */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <Radar className="h-5 w-5" />
                  LIDAR Scanner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-200">Scanner Status</span>
                  <Badge
                    className={
                      isScanning
                        ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/30"
                        : "bg-slate-600/20 text-slate-400 border-slate-500/30"
                    }
                  >
                    {isScanning ? "Active" : "Stopped"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">Scan Resolution: {scanResolution[0]}cm</Label>
                  <Slider
                    value={scanResolution}
                    onValueChange={setScanResolution}
                    max={20}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <Button
                  onClick={() => setIsScanning(!isScanning)}
                  className={
                    isScanning
                      ? "w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                      : "w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                  }
                >
                  <Radar className="h-4 w-4 mr-2" />
                  {isScanning ? "Stop Scanning" : "Start Scanning"}
                </Button>

                {lidarData && (
                  <div className="space-y-2">
                    <div className="text-sm text-slate-200">Scan Data:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-slate-400">Points</div>
                        <div className="text-slate-200">{lidarData.points.length}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Obstacles</div>
                        <div className="text-slate-200">{obstacles.length}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* LIDAR Visualization */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">Real-time LIDAR View</CardTitle>
              </CardHeader>
              <CardContent>
                <canvas ref={canvasRef} width={400} height={300} className="w-full border border-slate-600 rounded" />
                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span>• Green: LIDAR points</span>
                  <span>• Blue: Mower</span>
                  <span>• Orange/Red: Obstacles</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pathplanning" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Path Planning Controls */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <Route className="h-5 w-5" />
                  Path Planning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">Cutting Pattern</Label>
                  <select
                    value={selectedPattern}
                    onChange={(e) => setSelectedPattern(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-200"
                  >
                    <option value="parallel">Parallel Lines</option>
                    <option value="spiral">Spiral Pattern</option>
                    <option value="random">Random Pattern</option>
                    <option value="edge_first">Edge First</option>
                    <option value="checkerboard">Checkerboard</option>
                  </select>
                </div>

                <Button
                  onClick={generatePath}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Generate Path
                </Button>

                {pathPoints.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm text-slate-200">Path Statistics:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-slate-400">Waypoints</div>
                        <div className="text-slate-200">{pathPoints.length}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Est. Time</div>
                        <div className="text-slate-200">{pathPlanner.estimateTime(pathPoints).toFixed(1)}min</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pattern Information */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">Pattern Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pathPlanner.getPatterns().map((pattern) => (
                  <div
                    key={pattern.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedPattern === pattern.id
                        ? "border-emerald-500 bg-slate-700"
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                    onClick={() => setSelectedPattern(pattern.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-200">{pattern.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {pattern.efficiency}% efficient
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-400">{pattern.description}</div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400">Quality: </span>
                        <span className="text-slate-200">{pattern.grassQuality}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Time: </span>
                        <span className="text-slate-200">{pattern.timeEstimate}x</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="obstacles" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Obstacle List */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <AlertTriangle className="h-5 w-5" />
                  Detected Obstacles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {obstacles.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No obstacles detected</p>
                      <p className="text-xs">Start LIDAR scanning to detect obstacles</p>
                    </div>
                  ) : (
                    obstacles.map((obstacle) => (
                      <div key={obstacle.id} className="p-3 border border-slate-600 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-200">
                            {obstacle.type.charAt(0).toUpperCase() + obstacle.type.slice(1)} Object
                          </span>
                          <Badge
                            variant={obstacle.type === "dynamic" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {obstacle.type}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-400">Position: </span>
                            <span className="text-slate-200">
                              {obstacle.position.x.toFixed(0)}, {obstacle.position.y.toFixed(0)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Confidence: </span>
                            <span className="text-slate-200">{(obstacle.confidence * 100).toFixed(0)}%</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Size: </span>
                            <span className="text-slate-200">
                              {obstacle.size.width.toFixed(0)}×{obstacle.size.height.toFixed(0)}cm
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Last Seen: </span>
                            <span className="text-slate-200">
                              {Math.round((Date.now() - obstacle.lastSeen) / 1000)}s ago
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Obstacle Detection Settings */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">Detection Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">Detection Sensitivity</Label>
                  <Slider defaultValue={[75]} max={100} min={10} step={5} className="w-full" />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">Minimum Object Size (cm)</Label>
                  <Slider defaultValue={[10]} max={50} min={5} step={1} className="w-full" />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">Detection Range (m)</Label>
                  <Slider defaultValue={[300]} max={800} min={50} step={10} className="w-full" />
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <div className="text-sm text-slate-200 mb-2">Detection Statistics</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-slate-400">Static Objects</div>
                      <div className="text-slate-200">{obstacles.filter((o) => o.type === "static").length}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Dynamic Objects</div>
                      <div className="text-slate-200">{obstacles.filter((o) => o.type === "dynamic").length}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="navigation" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Navigation Status */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <Target className="h-5 w-5" />
                  Navigation Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-slate-200">GPS Lock</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-slate-200">LIDAR Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-slate-200">IMU Calibrated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-slate-200">Path Planned</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>Position Accuracy: ±2cm</div>
                    <div>Heading Accuracy: ±1°</div>
                    <div>Update Rate: 10Hz</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Position */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">Current Position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400">X Position</div>
                    <div className="text-slate-200 font-mono">0.00m</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Y Position</div>
                    <div className="text-slate-200 font-mono">0.00m</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Heading</div>
                    <div className="text-slate-200 font-mono">45.2°</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Speed</div>
                    <div className="text-slate-200 font-mono">0.5m/s</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <div className="text-xs text-slate-400">
                    <div>GPS: 40.7128°N, 74.0060°W</div>
                    <div>Satellites: 12/12</div>
                    <div>HDOP: 0.8</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Controls */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">Navigation Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800">
                  <Target className="h-4 w-4 mr-2" />
                  Set Waypoint
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Recalibrate
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Emergency Stop
                </Button>

                <div className="pt-2 border-t border-slate-700 text-xs text-slate-400">
                  Navigation system uses RTK-GPS, LIDAR SLAM, and IMU fusion for centimeter-level accuracy
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
