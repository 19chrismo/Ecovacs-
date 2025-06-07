"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Plus, Edit, Play, RotateCcw, Trash2 } from "lucide-react"
import Image from "next/image"

interface EditableZone {
  id: string
  name: string
  color: string
  priority: number
  area: number
  x: number
  y: number
  width: number
  height: number
  isEditing?: boolean
}

interface MapViewProps {
  mowerStatus: any
  setMowerStatus: (status: any) => void
}

export function EditableMapView({ mowerStatus, setMowerStatus }: MapViewProps) {
  const [zones, setZones] = useState<EditableZone[]>([
    { id: "1", name: "Front Lawn", color: "#22c55e", priority: 1, area: 85, x: 50, y: 50, width: 200, height: 120 },
    { id: "2", name: "Backyard", color: "#3b82f6", priority: 2, area: 120, x: 280, y: 180, width: 180, height: 140 },
    { id: "3", name: "Side Lawn", color: "#f59e0b", priority: 3, area: 65, x: 50, y: 220, width: 150, height: 100 },
    { id: "4", name: "Sidewalk", color: "#8b5cf6", priority: 4, area: 25, x: 200, y: 50, width: 60, height: 280 },
  ])

  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [dragState, setDragState] = useState<{
    isDragging: boolean
    dragType: "move" | "resize"
    zoneId: string | null
    startX: number
    startY: number
    resizeHandle?: string
  }>({
    isDragging: false,
    dragType: "move",
    zoneId: null,
    startX: 0,
    startY: 0,
  })

  const mapRef = useRef<HTMLDivElement>(null)

  const handleZoneClick = (zoneId: string) => {
    if (isEditMode) {
      setSelectedZone(selectedZone === zoneId ? null : zoneId)
    } else {
      const zone = zones.find((z) => z.id === zoneId)
      if (zone) {
        setMowerStatus({
          ...mowerStatus,
          status: "mowing",
          currentZone: zone.name,
        })
      }
    }
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, zoneId: string, dragType: "move" | "resize", resizeHandle?: string) => {
      if (!isEditMode) return

      e.preventDefault()
      e.stopPropagation()

      const rect = mapRef.current?.getBoundingClientRect()
      if (!rect) return

      setDragState({
        isDragging: true,
        dragType,
        zoneId,
        startX: e.clientX - rect.left,
        startY: e.clientY - rect.top,
        resizeHandle,
      })
    },
    [isEditMode],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragState.isDragging || !dragState.zoneId || !mapRef.current) return

      const rect = mapRef.current.getBoundingClientRect()
      const currentX = e.clientX - rect.left
      const currentY = e.clientY - rect.top
      const deltaX = currentX - dragState.startX
      const deltaY = currentY - dragState.startY

      setZones((prevZones) =>
        prevZones.map((zone) => {
          if (zone.id !== dragState.zoneId) return zone

          if (dragState.dragType === "move") {
            return {
              ...zone,
              x: Math.max(0, Math.min(460, zone.x + deltaX)),
              y: Math.max(0, Math.min(320, zone.y + deltaY)),
            }
          } else if (dragState.dragType === "resize") {
            const newZone = { ...zone }

            switch (dragState.resizeHandle) {
              case "nw":
                newZone.x = Math.max(0, zone.x + deltaX)
                newZone.y = Math.max(0, zone.y + deltaY)
                newZone.width = Math.max(50, zone.width - deltaX)
                newZone.height = Math.max(50, zone.height - deltaY)
                break
              case "ne":
                newZone.y = Math.max(0, zone.y + deltaY)
                newZone.width = Math.max(50, zone.width + deltaX)
                newZone.height = Math.max(50, zone.height - deltaY)
                break
              case "sw":
                newZone.x = Math.max(0, zone.x + deltaX)
                newZone.width = Math.max(50, zone.width - deltaX)
                newZone.height = Math.max(50, zone.height + deltaY)
                break
              case "se":
                newZone.width = Math.max(50, zone.width + deltaX)
                newZone.height = Math.max(50, zone.height + deltaY)
                break
              case "n":
                newZone.y = Math.max(0, zone.y + deltaY)
                newZone.height = Math.max(50, zone.height - deltaY)
                break
              case "s":
                newZone.height = Math.max(50, zone.height + deltaY)
                break
              case "w":
                newZone.x = Math.max(0, zone.x + deltaX)
                newZone.width = Math.max(50, zone.width - deltaX)
                break
              case "e":
                newZone.width = Math.max(50, zone.width + deltaX)
                break
            }

            // Calculate area based on dimensions (rough estimate)
            newZone.area = Math.round((newZone.width * newZone.height) / 20)

            return newZone
          }

          return zone
        }),
      )

      setDragState((prev) => ({
        ...prev,
        startX: currentX,
        startY: currentY,
      }))
    },
    [dragState],
  )

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      dragType: "move",
      zoneId: null,
      startX: 0,
      startY: 0,
    })
  }, [])

  const addNewZone = () => {
    const newZone: EditableZone = {
      id: `zone_${Date.now()}`,
      name: "New Zone",
      color: "#10b981",
      priority: zones.length + 1,
      area: 50,
      x: 100,
      y: 100,
      width: 120,
      height: 80,
      isEditing: true,
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

  const updateZoneName = (zoneId: string, newName: string) => {
    setZones(zones.map((z) => (z.id === zoneId ? { ...z, name: newName, isEditing: false } : z)))
  }

  const resetZones = () => {
    setZones([
      { id: "1", name: "Front Lawn", color: "#22c55e", priority: 1, area: 85, x: 50, y: 50, width: 200, height: 120 },
      { id: "2", name: "Backyard", color: "#3b82f6", priority: 2, area: 120, x: 280, y: 180, width: 180, height: 140 },
      { id: "3", name: "Side Lawn", color: "#f59e0b", priority: 3, area: 65, x: 50, y: 220, width: 150, height: 100 },
      { id: "4", name: "Sidewalk", color: "#8b5cf6", priority: 4, area: 25, x: 200, y: 50, width: 60, height: 280 },
    ])
    setSelectedZone(null)
  }

  const renderResizeHandles = (zone: EditableZone) => {
    if (!isEditMode || selectedZone !== zone.id) return null

    const handleSize = 8
    const handles = [
      { id: "nw", x: -handleSize / 2, y: -handleSize / 2, cursor: "nw-resize" },
      { id: "ne", x: zone.width - handleSize / 2, y: -handleSize / 2, cursor: "ne-resize" },
      { id: "sw", x: -handleSize / 2, y: zone.height - handleSize / 2, cursor: "sw-resize" },
      { id: "se", x: zone.width - handleSize / 2, y: zone.height - handleSize / 2, cursor: "se-resize" },
      { id: "n", x: zone.width / 2 - handleSize / 2, y: -handleSize / 2, cursor: "n-resize" },
      { id: "s", x: zone.width / 2 - handleSize / 2, y: zone.height - handleSize / 2, cursor: "s-resize" },
      { id: "w", x: -handleSize / 2, y: zone.height / 2 - handleSize / 2, cursor: "w-resize" },
      { id: "e", x: zone.width - handleSize / 2, y: zone.height / 2 - handleSize / 2, cursor: "e-resize" },
    ]

    return (
      <>
        {handles.map((handle) => (
          <div
            key={handle.id}
            className="absolute bg-white border-2 border-blue-500 rounded-sm z-20"
            style={{
              left: handle.x,
              top: handle.y,
              width: handleSize,
              height: handleSize,
              cursor: handle.cursor,
            }}
            onMouseDown={(e) => handleMouseDown(e, zone.id, "resize", handle.id)}
          />
        ))}
      </>
    )
  }

  const selectedZoneData = zones.find((z) => z.id === selectedZone)

  return (
    <div className="space-y-3">
      {/* Zone Management Controls */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-slate-200">Editable Mowing Zones</CardTitle>
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
              {isEditMode && (
                <>
                  <Button
                    onClick={addNewZone}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white border-0 text-xs h-6 px-2"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Zone
                  </Button>
                  <Button
                    onClick={resetZones}
                    size="sm"
                    variant="outline"
                    className="border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs h-6 px-2"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2 overflow-x-auto">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className={`flex-shrink-0 p-2 border rounded-lg cursor-pointer transition-all min-w-[120px] ${
                  selectedZone === zone.id ? "border-emerald-500 bg-slate-700" : "border-slate-600"
                }`}
                onClick={() => handleZoneClick(zone.id)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.color }}></div>
                  {zone.isEditing ? (
                    <Input
                      value={zone.name}
                      onChange={(e) =>
                        setZones(zones.map((z) => (z.id === zone.id ? { ...z, name: e.target.value } : z)))
                      }
                      onBlur={() => updateZoneName(zone.id, zone.name)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateZoneName(zone.id, zone.name)
                        }
                      }}
                      className="text-xs h-4 p-0 bg-transparent border-none text-slate-200"
                      autoFocus
                    />
                  ) : (
                    <span className="font-medium text-xs text-slate-200">{zone.name}</span>
                  )}
                  <Badge variant="outline" className="bg-slate-700 text-slate-300 border-slate-600 text-xs px-1">
                    P{zone.priority}
                  </Badge>
                </div>
                <div className="text-xs text-slate-400 mb-2">{zone.area}m²</div>
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
                      <Play className="h-2 w-2 mr-1" />
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
                      <Trash2 className="h-2 w-2 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Map Display */}
      <div className="flex gap-3">
        <Card className="flex-1 bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-200">
              <MapPin className="h-4 w-4" />
              Interactive Property Map
              {isEditMode && (
                <Badge className="bg-orange-600/20 text-orange-400 border-orange-500/30 text-xs">Edit Mode</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div
              ref={mapRef}
              className="relative rounded-lg overflow-hidden border border-slate-700 select-none"
              style={{ height: "350px", width: "500px" }}
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
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 350">
                  {/* Property boundary */}
                  <path
                    d="M 20 20 L 480 20 L 480 330 L 20 330 Z"
                    fill="rgba(34, 197, 94, 0.05)"
                    stroke="rgba(34, 197, 94, 0.3)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />

                  {/* Driveway */}
                  <rect
                    x="180"
                    y="20"
                    width="80"
                    height="40"
                    fill="rgba(71, 85, 105, 0.3)"
                    stroke="rgba(148, 163, 184, 0.5)"
                    strokeWidth="1"
                  />

                  {/* Walkways */}
                  <path d="M 200 60 L 200 120" fill="none" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="3" />
                  <path d="M 240 60 L 240 120" fill="none" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="3" />
                </svg>
              </div>

              {/* Editable Zones */}
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className={`absolute border-2 transition-all ${
                    selectedZone === zone.id
                      ? "border-white shadow-lg z-10"
                      : isEditMode
                        ? "border-gray-300 hover:border-white"
                        : "border-gray-400"
                  } ${isEditMode ? "cursor-move" : "cursor-pointer"}`}
                  style={{
                    left: zone.x,
                    top: zone.y,
                    width: zone.width,
                    height: zone.height,
                    backgroundColor: zone.color + "30",
                    borderColor: selectedZone === zone.id ? "#ffffff" : zone.color,
                  }}
                  onClick={() => handleZoneClick(zone.id)}
                  onMouseDown={(e) => isEditMode && handleMouseDown(e, zone.id, "move")}
                >
                  <div className="p-1">
                    <Badge style={{ backgroundColor: zone.color }} className="text-white text-xs">
                      {zone.name}
                    </Badge>
                  </div>

                  {/* Resize handles */}
                  {renderResizeHandles(zone)}
                </div>
              ))}

              {/* Mower Position */}
              <div
                className="absolute w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse z-20"
                style={{
                  left: mowerStatus.position.x - 8,
                  top: mowerStatus.position.y - 8,
                }}
              >
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zone Properties Panel */}
        {selectedZoneData && isEditMode && (
          <Card className="w-64 bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-200">Zone Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">Zone Name</Label>
                <Input
                  value={selectedZoneData.name}
                  onChange={(e) =>
                    setZones(zones.map((z) => (z.id === selectedZoneData.id ? { ...z, name: e.target.value } : z)))
                  }
                  className="bg-slate-700 border-slate-600 text-slate-200 text-sm h-8"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-slate-400">Color</Label>
                <div className="flex gap-2">
                  {["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"].map((color) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded border-2 ${
                        selectedZoneData.color === color ? "border-white" : "border-slate-600"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setZones(zones.map((z) => (z.id === selectedZoneData.id ? { ...z, color } : z)))}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <Label className="text-slate-400">Width</Label>
                  <div className="text-slate-200">{selectedZoneData.width}px</div>
                </div>
                <div>
                  <Label className="text-slate-400">Height</Label>
                  <div className="text-slate-200">{selectedZoneData.height}px</div>
                </div>
                <div>
                  <Label className="text-slate-400">Area</Label>
                  <div className="text-slate-200">{selectedZoneData.area}m²</div>
                </div>
                <div>
                  <Label className="text-slate-400">Priority</Label>
                  <Input
                    type="number"
                    value={selectedZoneData.priority}
                    onChange={(e) =>
                      setZones(
                        zones.map((z) =>
                          z.id === selectedZoneData.id ? { ...z, priority: Number.parseInt(e.target.value) || 1 } : z,
                        ),
                      )
                    }
                    className="bg-slate-700 border-slate-600 text-slate-200 text-xs h-6"
                    min="1"
                  />
                </div>
              </div>

              <div className="text-xs text-slate-500">
                Drag to move • Drag handles to resize • Click outside to deselect
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
