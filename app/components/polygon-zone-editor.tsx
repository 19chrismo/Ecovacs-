"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { MapPin, Plus, Trash2, RotateCcw, Edit, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

export interface Point {
  x: number
  y: number
}

export interface PolygonZone {
  id: string
  name: string
  color: string
  priority: number
  area: number
  points: Point[]
  visible: boolean
  type: "regular" | "no_go" | "virtual_wall"
  grassHeight: number
  lastMowed?: number
}

interface PolygonZoneEditorProps {
  mowerStatus: any
  setMowerStatus: (status: any) => void
}

export function PolygonZoneEditor({ mowerStatus, setMowerStatus }: PolygonZoneEditorProps) {
  const [zones, setZones] = useState<PolygonZone[]>([
    {
      id: "1",
      name: "Front Lawn",
      color: "#22c55e",
      priority: 1,
      area: 85,
      points: [
        { x: 50, y: 50 },
        { x: 250, y: 50 },
        { x: 250, y: 170 },
        { x: 50, y: 170 },
      ],
      visible: true,
      type: "regular",
      grassHeight: 35,
    },
    {
      id: "2",
      name: "Backyard",
      color: "#3b82f6",
      priority: 2,
      area: 120,
      points: [
        { x: 280, y: 180 },
        { x: 460, y: 180 },
        { x: 460, y: 320 },
        { x: 280, y: 320 },
      ],
      visible: true,
      type: "regular",
      grassHeight: 40,
    },
    {
      id: "3",
      name: "Side Lawn",
      color: "#f59e0b",
      priority: 3,
      area: 65,
      points: [
        { x: 50, y: 220 },
        { x: 200, y: 220 },
        { x: 200, y: 320 },
        { x: 50, y: 320 },
      ],
      visible: true,
      type: "regular",
      grassHeight: 30,
    },
    {
      id: "4",
      name: "Sidewalk",
      color: "#8b5cf6",
      priority: 4,
      area: 25,
      points: [
        { x: 200, y: 50 },
        { x: 260, y: 50 },
        { x: 260, y: 330 },
        { x: 200, y: 330 },
      ],
      visible: true,
      type: "regular",
      grassHeight: 0,
    },
    {
      id: "5",
      name: "No Go Zone",
      color: "#ef4444",
      priority: 0,
      area: 15,
      points: [
        { x: 100, y: 100 },
        { x: 150, y: 100 },
        { x: 150, y: 150 },
        { x: 100, y: 150 },
      ],
      visible: true,
      type: "no_go",
      grassHeight: 0,
    },
  ])

  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [activePoint, setActivePoint] = useState<{ zoneId: string; pointIndex: number } | null>(null)
  const [isAddingPoint, setIsAddingPoint] = useState(false)
  const [showZonePanel, setShowZonePanel] = useState(true)
  const [showMap, setShowMap] = useState(true)

  const mapRef = useRef<HTMLDivElement>(null)

  const handleZoneClick = (zoneId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (isEditMode) {
      setSelectedZone(selectedZone === zoneId ? null : zoneId)
    } else {
      const zone = zones.find((z) => z.id === zoneId)
      if (zone && zone.type === "regular") {
        setMowerStatus({
          ...mowerStatus,
          status: "mowing",
          currentZone: zone.name,
        })
      }
    }
  }

  const handleMapClick = (e: React.MouseEvent) => {
    if (!isEditMode || !mapRef.current) return

    const rect = mapRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 500
    const y = ((e.clientY - rect.top) / rect.height) * 350

    if (isAddingPoint && selectedZone) {
      setZones((prevZones) =>
        prevZones.map((zone) => {
          if (zone.id === selectedZone) {
            return {
              ...zone,
              points: [...zone.points, { x, y }],
            }
          }
          return zone
        }),
      )
    } else {
      setSelectedZone(null)
      setActivePoint(null)
    }
  }

  const handlePointMouseDown = (e: React.MouseEvent, zoneId: string, pointIndex: number) => {
    e.stopPropagation()
    setActivePoint({ zoneId, pointIndex })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!activePoint || !mapRef.current) return

    const rect = mapRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(500, ((e.clientX - rect.left) / rect.width) * 500))
    const y = Math.max(0, Math.min(350, ((e.clientY - rect.top) / rect.height) * 350))

    setZones((prevZones) =>
      prevZones.map((zone) => {
        if (zone.id === activePoint.zoneId) {
          const newPoints = [...zone.points]
          newPoints[activePoint.pointIndex] = { x, y }
          return {
            ...zone,
            points: newPoints,
            area: calculatePolygonArea(newPoints),
          }
        }
        return zone
      }),
    )
  }

  const handleMouseUp = () => {
    setActivePoint(null)
  }

  const calculatePolygonArea = (points: Point[]): number => {
    if (points.length < 3) return 0

    // Simple polygon area calculation
    let area = 0
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length
      area += points[i].x * points[j].y
      area -= points[j].x * points[i].y
    }
    return Math.abs(area / 2) / 20 // Scale down to reasonable m²
  }

  const addNewZone = () => {
    const newZone: PolygonZone = {
      id: `zone_${Date.now()}`,
      name: "New Zone",
      color: "#10b981",
      priority: zones.length + 1,
      area: 50,
      points: [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 200 },
        { x: 100, y: 200 },
      ],
      visible: true,
      type: "regular",
      grassHeight: 30,
    }
    setZones([...zones, newZone])
    setSelectedZone(newZone.id)
  }

  const addNoGoZone = () => {
    const newZone: PolygonZone = {
      id: `nogo_${Date.now()}`,
      name: "No Go Zone",
      color: "#ef4444",
      priority: 0,
      area: 20,
      points: [
        { x: 150, y: 150 },
        { x: 200, y: 150 },
        { x: 200, y: 200 },
        { x: 150, y: 200 },
      ],
      visible: true,
      type: "no_go",
      grassHeight: 0,
    }
    setZones([...zones, newZone])
    setSelectedZone(newZone.id)
  }

  const addVirtualWall = () => {
    const newZone: PolygonZone = {
      id: `wall_${Date.now()}`,
      name: "Virtual Wall",
      color: "#f97316",
      priority: 0,
      area: 0,
      points: [
        { x: 250, y: 100 },
        { x: 350, y: 100 },
      ],
      visible: true,
      type: "virtual_wall",
      grassHeight: 0,
    }
    setZones([...zones, newZone])
    setSelectedZone(newZone.id)
  }

  const deleteZone = (zoneId: string) => {
    setZones(zones.filter((z) => z.id !== zoneId))
    if (selectedZone === zoneId) {
      setSelectedZone(null)
    }
  }

  const deletePoint = (zoneId: string, pointIndex: number) => {
    setZones((prevZones) =>
      prevZones.map((zone) => {
        if (zone.id === zoneId && zone.points.length > 3) {
          const newPoints = [...zone.points]
          newPoints.splice(pointIndex, 1)
          return {
            ...zone,
            points: newPoints,
            area: calculatePolygonArea(newPoints),
          }
        }
        return zone
      }),
    )
  }

  const toggleZoneVisibility = (zoneId: string) => {
    setZones((prevZones) =>
      prevZones.map((zone) => {
        if (zone.id === zoneId) {
          return {
            ...zone,
            visible: !zone.visible,
          }
        }
        return zone
      }),
    )
  }

  const updateZoneName = (zoneId: string, newName: string) => {
    setZones(zones.map((z) => (z.id === zoneId ? { ...z, name: newName } : z)))
  }

  const updateZoneColor = (zoneId: string, newColor: string) => {
    setZones(zones.map((z) => (z.id === zoneId ? { ...z, color: newColor } : z)))
  }

  const updateZonePriority = (zoneId: string, newPriority: number) => {
    setZones(zones.map((z) => (z.id === zoneId ? { ...z, priority: newPriority } : z)))
  }

  const updateZoneGrassHeight = (zoneId: string, newHeight: number) => {
    setZones(zones.map((z) => (z.id === zoneId ? { ...z, grassHeight: newHeight } : z)))
  }

  const resetZones = () => {
    setZones([
      {
        id: "1",
        name: "Front Lawn",
        color: "#22c55e",
        priority: 1,
        area: 85,
        points: [
          { x: 50, y: 50 },
          { x: 250, y: 50 },
          { x: 250, y: 170 },
          { x: 50, y: 170 },
        ],
        visible: true,
        type: "regular",
        grassHeight: 35,
      },
      {
        id: "2",
        name: "Backyard",
        color: "#3b82f6",
        priority: 2,
        area: 120,
        points: [
          { x: 280, y: 180 },
          { x: 460, y: 180 },
          { x: 460, y: 320 },
          { x: 280, y: 320 },
        ],
        visible: true,
        type: "regular",
        grassHeight: 40,
      },
      {
        id: "3",
        name: "Side Lawn",
        color: "#f59e0b",
        priority: 3,
        area: 65,
        points: [
          { x: 50, y: 220 },
          { x: 200, y: 220 },
          { x: 200, y: 320 },
          { x: 50, y: 320 },
        ],
        visible: true,
        type: "regular",
        grassHeight: 30,
      },
      {
        id: "4",
        name: "Sidewalk",
        color: "#8b5cf6",
        priority: 4,
        area: 25,
        points: [
          { x: 200, y: 50 },
          { x: 260, y: 50 },
          { x: 260, y: 330 },
          { x: 200, y: 330 },
        ],
        visible: true,
        type: "regular",
        grassHeight: 0,
      },
    ])
    setSelectedZone(null)
  }

  const selectedZoneData = zones.find((z) => z.id === selectedZone)

  const toggleZonePanel = () => {
    setShowZonePanel(!showZonePanel)
  }

  const toggleMap = () => {
    setShowMap(!showMap)
  }

  useEffect(() => {
    // Recalculate areas when zones change
    setZones((prevZones) =>
      prevZones.map((zone) => ({
        ...zone,
        area: calculatePolygonArea(zone.points),
      })),
    )
  }, [])

  return (
    <div className="space-y-3">
      {/* Zone Management Controls */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-slate-200 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Advanced Zone Management
              {isEditMode && (
                <Badge className="bg-orange-600/20 text-orange-400 border-orange-500/30 text-xs">Edit Mode</Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditMode(!isEditMode)}
                size="sm"
                className={`text-xs h-6 px-2 ${
                  isEditMode ? "bg-orange-600 hover:bg-orange-700" : "bg-emerald-600 hover:bg-emerald-700"
                } text-white border-0`}
              >
                <Edit className="h-3 w-3 mr-1" />
                {isEditMode ? "Exit Edit" : "Edit Mode"}
              </Button>
              <Button
                onClick={toggleZonePanel}
                size="sm"
                variant="outline"
                className="border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs h-6 px-2"
              >
                {showZonePanel ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        {showZonePanel && (
          <CardContent className="pt-0">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className={`flex-shrink-0 p-2 border rounded-lg cursor-pointer transition-all min-w-[120px] ${
                    selectedZone === zone.id ? "border-emerald-500 bg-slate-700" : "border-slate-600"
                  } ${!zone.visible && "opacity-50"}`}
                  onClick={(e) => handleZoneClick(zone.id, e)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.color }}></div>
                      <span className="font-medium text-xs text-slate-200">{zone.name}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleZoneVisibility(zone.id)
                      }}
                    >
                      {zone.visible ? (
                        <Eye className="h-3 w-3 text-slate-400" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-slate-500" />
                      )}
                    </Button>
                  </div>
                  {zone.type === "regular" && (
                    <>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span>{zone.area}m²</span>
                        <Badge variant="outline" className="bg-slate-700 text-slate-300 border-slate-600 text-xs px-1">
                          P{zone.priority}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        {!isEditMode ? (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setMowerStatus({
                                ...mowerStatus,
                                status: "mowing",
                                currentZone: zone.name,
                              })
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-0 text-xs h-5"
                          >
                            Mow
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteZone(zone.id)
                            }}
                            className="w-full bg-red-600 hover:bg-red-700 text-white border-0 text-xs h-5"
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                  {zone.type === "no_go" && (
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <Badge className="bg-red-600/20 text-red-400 border-red-500/30 text-xs">No Go</Badge>
                      {isEditMode && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteZone(zone.id)
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white border-0 text-xs h-5 px-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                  {zone.type === "virtual_wall" && (
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <Badge className="bg-orange-600/20 text-orange-400 border-orange-500/30 text-xs">Wall</Badge>
                      {isEditMode && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteZone(zone.id)
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white border-0 text-xs h-5 px-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isEditMode && (
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={addNewZone}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Zone
                </Button>
                <Button
                  onClick={addNoGoZone}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white border-0 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  No Go Zone
                </Button>
                <Button
                  onClick={addVirtualWall}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white border-0 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Virtual Wall
                </Button>
                <Button
                  onClick={resetZones}
                  size="sm"
                  variant="outline"
                  className="border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs ml-auto"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Interactive Map Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm text-slate-200">
                <MapPin className="h-4 w-4" />
                Interactive Property Map
              </CardTitle>
              <Button
                onClick={toggleMap}
                size="sm"
                variant="outline"
                className="border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs h-6 px-2"
              >
                {showMap ? "Hide Map" : "Show Map"}
              </Button>
            </div>
          </CardHeader>
          {showMap && (
            <CardContent className="pt-0">
              <div
                ref={mapRef}
                className="relative rounded-lg overflow-hidden border border-slate-700 select-none w-full aspect-[4/3] max-w-2xl mx-auto"
                onClick={handleMapClick}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Property aerial as background */}
                <div className="absolute inset-0">
                  <Image
                    src="/images/property-aerial.png"
                    alt="Property Layout"
                    fill
                    className="object-cover opacity-40"
                  />
                </div>

                {/* Grid overlay for editing */}
                {isEditMode && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `
                linear-gradient(rgba(148, 163, 184, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(148, 163, 184, 0.2) 1px, transparent 1px)
              `,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>
                )}

                {/* 2D Sketch overlay */}
                <div className="absolute inset-0 bg-slate-800 opacity-80">
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 400 300"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Property boundary */}
                    <path
                      d="M 20 20 L 380 20 L 380 280 L 20 280 Z"
                      fill="rgba(34, 197, 94, 0.05)"
                      stroke="rgba(34, 197, 94, 0.3)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />

                    {/* Driveway */}
                    <rect
                      x="150"
                      y="20"
                      width="60"
                      height="30"
                      fill="rgba(71, 85, 105, 0.3)"
                      stroke="rgba(148, 163, 184, 0.5)"
                      strokeWidth="1"
                    />

                    {/* Walkways */}
                    <path d="M 170 50 L 170 90" fill="none" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="2" />
                    <path d="M 190 50 L 190 90" fill="none" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="2" />
                  </svg>
                </div>

                {/* Polygon Zones */}
                {zones.map(
                  (zone) =>
                    zone.visible && (
                      <div
                        key={zone.id}
                        className={`absolute inset-0 ${isEditMode ? "cursor-pointer" : ""}`}
                        onClick={(e) => handleZoneClick(zone.id, e)}
                      >
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox="0 0 400 300"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          {zone.type === "regular" && (
                            <polygon
                              points={zone.points.map((p) => `${(p.x / 500) * 400},${(p.y / 350) * 300}`).join(" ")}
                              fill={`${zone.color}30`}
                              stroke={selectedZone === zone.id ? "#ffffff" : zone.color}
                              strokeWidth={selectedZone === zone.id ? "2" : "1.5"}
                              className="transition-all"
                            />
                          )}
                          {zone.type === "no_go" && (
                            <polygon
                              points={zone.points.map((p) => `${(p.x / 500) * 400},${(p.y / 350) * 300}`).join(" ")}
                              fill="rgba(239, 68, 68, 0.2)"
                              stroke="#ef4444"
                              strokeWidth="2"
                              strokeDasharray="5,3"
                              className="transition-all"
                            />
                          )}
                          {zone.type === "virtual_wall" && (
                            <line
                              x1={(zone.points[0].x / 500) * 400}
                              y1={(zone.points[0].y / 350) * 300}
                              x2={(zone.points[1].x / 500) * 400}
                              y2={(zone.points[1].y / 350) * 300}
                              stroke="#f97316"
                              strokeWidth="3"
                              strokeDasharray="8,4"
                              className="transition-all"
                            />
                          )}

                          {/* Zone label */}
                          {zone.type === "regular" && (
                            <text
                              x={(zone.points.reduce((sum, p) => sum + p.x, 0) / zone.points.length / 500) * 400}
                              y={(zone.points.reduce((sum, p) => sum + p.y, 0) / zone.points.length / 350) * 300}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill="#ffffff"
                              fontSize="8"
                              fontWeight="bold"
                            >
                              {zone.name}
                            </text>
                          )}

                          {/* Edit points */}
                          {isEditMode && selectedZone === zone.id && (
                            <>
                              {zone.points.map((point, index) => (
                                <g key={index}>
                                  <circle
                                    cx={(point.x / 500) * 400}
                                    cy={(point.y / 350) * 300}
                                    r="4"
                                    fill="white"
                                    stroke={zone.color}
                                    strokeWidth="2"
                                    className="cursor-move"
                                    onMouseDown={(e) => handlePointMouseDown(e, zone.id, index)}
                                  />
                                </g>
                              ))}

                              {/* Add midpoints for adding new vertices */}
                              {zone.type !== "virtual_wall" &&
                                zone.points.map((point, index) => {
                                  const nextIndex = (index + 1) % zone.points.length
                                  const nextPoint = zone.points[nextIndex]
                                  const midX = ((point.x + nextPoint.x) / 2 / 500) * 400
                                  const midY = ((point.y + nextPoint.y) / 2 / 350) * 300

                                  return (
                                    <circle
                                      key={`mid-${index}`}
                                      cx={midX}
                                      cy={midY}
                                      r="3"
                                      fill={zone.color}
                                      opacity="0.6"
                                      className="cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setZones((prevZones) =>
                                          prevZones.map((z) => {
                                            if (z.id === zone.id) {
                                              const newPoints = [...z.points]
                                              newPoints.splice(nextIndex, 0, {
                                                x: (point.x + nextPoint.x) / 2,
                                                y: (point.y + nextPoint.y) / 2,
                                              })
                                              return {
                                                ...z,
                                                points: newPoints,
                                                area: calculatePolygonArea(newPoints),
                                              }
                                            }
                                            return z
                                          }),
                                        )
                                      }}
                                    />
                                  )
                                })}
                            </>
                          )}
                        </svg>
                      </div>
                    ),
                )}

                {/* Mower Position */}
                <div
                  className="absolute w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse z-20"
                  style={{
                    left: `${(mowerStatus.position.x / 500) * 100}%`,
                    top: `${(mowerStatus.position.y / 350) * 100}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                </div>

                {/* Add point button when in edit mode */}
                {isEditMode && selectedZone && (
                  <div className="absolute bottom-2 right-2 z-20">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsAddingPoint(!isAddingPoint)
                      }}
                      className={`text-xs h-6 px-2 ${
                        isAddingPoint ? "bg-orange-600 hover:bg-orange-700" : "bg-blue-600 hover:bg-blue-700"
                      } text-white border-0`}
                    >
                      {isAddingPoint ? "Cancel" : "Add Point"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Zone Properties Panel */}
        {selectedZoneData && isEditMode && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-200">Zone Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">Zone Name</Label>
                <Input
                  value={selectedZoneData.name}
                  onChange={(e) => updateZoneName(selectedZoneData.id, e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-200 text-sm h-8"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-slate-400">Color</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"].map((color) => (
                    <button
                      key={color}
                      className={`w-full h-6 rounded border-2 ${
                        selectedZoneData.color === color ? "border-white" : "border-slate-600"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => updateZoneColor(selectedZoneData.id, color)}
                    />
                  ))}
                </div>
              </div>

              {selectedZoneData.type === "regular" && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Priority</Label>
                    <Input
                      type="number"
                      value={selectedZoneData.priority}
                      onChange={(e) => updateZonePriority(selectedZoneData.id, Number(e.target.value) || 1)}
                      className="bg-slate-700 border-slate-600 text-slate-200 text-sm h-8"
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-slate-400">Grass Height (mm)</Label>
                      <span className="text-xs text-slate-300">{selectedZoneData.grassHeight}mm</span>
                    </div>
                    <Slider
                      value={[selectedZoneData.grassHeight]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => updateZoneGrassHeight(selectedZoneData.id, value[0])}
                      className="py-2"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <Label className="text-slate-400">Points</Label>
                  <div className="text-slate-200">{selectedZoneData.points.length}</div>
                </div>
                <div>
                  <Label className="text-slate-400">Area</Label>
                  <div className="text-slate-200">{selectedZoneData.area}m²</div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => setSelectedZone(null)}
                  size="sm"
                  className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs"
                >
                  Done
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
