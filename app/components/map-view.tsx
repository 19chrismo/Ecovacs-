"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus, Edit, Play, Ban, Pencil } from "lucide-react"
import Image from "next/image"

interface Zone {
  id: string
  name: string
  color: string
  priority: number
  area: number
  x: number
  y: number
  width: number
  height: number
}

interface MapViewProps {
  mowerStatus: any
  setMowerStatus: (status: any) => void
}

export function MapView({ mowerStatus, setMowerStatus }: MapViewProps) {
  const [zones, setZones] = useState<Zone[]>([
    { id: "1", name: "Front Lawn", color: "#22c55e", priority: 1, area: 65, x: 50, y: 50, width: 150, height: 100 },
    { id: "2", name: "Back Lawn", color: "#3b82f6", priority: 2, area: 85, x: 280, y: 200, width: 180, height: 120 },
    { id: "3", name: "Side Lawn", color: "#f59e0b", priority: 3, area: 45, x: 50, y: 250, width: 120, height: 80 },
  ])

  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [isDrawingNoGo, setIsDrawingNoGo] = useState(false)

  const handleZoneClick = (zoneId: string) => {
    setSelectedZone(selectedZone === zoneId ? null : zoneId)
  }

  const startMowingZone = (zoneId: string) => {
    const zone = zones.find((z) => z.id === zoneId)
    if (zone) {
      setMowerStatus({
        ...mowerStatus,
        status: "mowing",
        currentZone: zone.name,
      })
    }
  }

  return (
    <div className="space-y-3">
      {/* Zones in one row */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-slate-200">Mowing Zones</CardTitle>
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
                  <span className="font-medium text-xs">{zone.name}</span>
                  <Badge variant="outline" className="bg-slate-700 text-slate-300 border-slate-600 text-xs px-1">
                    P{zone.priority}
                  </Badge>
                </div>
                <div className="text-xs text-slate-400 mb-2">{zone.area}m²</div>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    startMowingZone(zone.id)
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-0 text-xs h-5"
                >
                  <Play className="h-2 w-2 mr-1" />
                  Mow
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Map Display with editing buttons */}
      <div className="flex gap-3">
        <Card className="flex-1 bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-200">
              <MapPin className="h-4 w-4" />
              Property Map & Live View
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="relative rounded-lg overflow-hidden border border-slate-700" style={{ height: "350px" }}>
              {/* Property aerial as background */}
              <div className="absolute inset-0">
                <Image
                  src="/images/property-aerial.png"
                  alt="Property Layout"
                  fill
                  className="object-cover opacity-60"
                />
              </div>

              {/* 2D Sketch overlay for portal-style appearance */}
              <div className="absolute inset-0 bg-slate-800 opacity-90">
                {/* Grid pattern for sketch effect */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                    linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
                  `,
                    backgroundSize: "20px 20px",
                  }}
                ></div>

                {/* Property boundary sketch */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 350">
                  {/* Property outline */}
                  <path
                    d="M 30 30 L 470 30 L 470 320 L 30 320 Z"
                    fill="rgba(34, 197, 94, 0.1)"
                    stroke="rgba(34, 197, 94, 0.3)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />

                  {/* Driveway */}
                  <rect
                    x="200"
                    y="30"
                    width="80"
                    height="60"
                    fill="rgba(71, 85, 105, 0.3)"
                    stroke="rgba(148, 163, 184, 0.5)"
                    strokeWidth="1"
                  />

                  {/* Walkways */}
                  <path d="M 200 90 L 200 150" fill="none" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="3" />
                  <path d="M 280 90 L 280 150" fill="none" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="3" />
                </svg>
              </div>

              {/* House outline - updated to match new property layout */}
              <div
                className="absolute border-2 border-slate-400 bg-slate-600/50"
                style={{
                  left: "35%",
                  top: "35%",
                  width: "30%",
                  height: "35%",
                }}
              >
                <div className="p-1">
                  <Badge className="text-white text-xs bg-slate-600">House 1233</Badge>
                </div>
              </div>

              {/* Neighbor house outline */}
              <div
                className="absolute border-2 border-slate-500 bg-slate-700/30"
                style={{
                  left: "65%",
                  top: "30%",
                  width: "25%",
                  height: "30%",
                }}
              >
                <div className="p-1">
                  <Badge className="text-slate-300 text-xs bg-slate-700">Neighbor</Badge>
                </div>
              </div>

              {/* Zones */}
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className={`absolute border-2 cursor-pointer transition-all ${
                    selectedZone === zone.id ? "border-white shadow-lg" : "border-gray-300"
                  }`}
                  style={{
                    left: zone.x,
                    top: zone.y,
                    width: zone.width,
                    height: zone.height,
                    backgroundColor: zone.color + "30",
                    borderColor: zone.color,
                  }}
                  onClick={() => handleZoneClick(zone.id)}
                >
                  <div className="p-1">
                    <Badge style={{ backgroundColor: zone.color }} className="text-white text-xs">
                      {zone.name}
                    </Badge>
                  </div>
                </div>
              ))}

              {/* Mower Position */}
              <div
                className="absolute w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse z-10"
                style={{
                  left: mowerStatus.position.x - 8,
                  top: mowerStatus.position.y - 8,
                }}
              >
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
              </div>

              {/* No-go drawing overlay */}
              {isDrawingNoGo && (
                <div className="absolute inset-0 cursor-crosshair bg-red-500/10 border-2 border-red-500 border-dashed">
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-red-600 text-white text-xs">Drawing No-Go Zone</Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Map editing buttons */}
        <div className="flex flex-col gap-2">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 text-xs h-8 px-2">
            <Plus className="h-3 w-3 mr-1" />
            Add Zone
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs h-8 px-2"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit Map
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsDrawingNoGo(!isDrawingNoGo)}
            className={`border-slate-600 text-xs h-8 px-2 ${
              isDrawingNoGo
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-slate-700 hover:bg-slate-600 text-slate-200"
            }`}
          >
            <Ban className="h-3 w-3 mr-1" />
            No-Go Zone
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs h-8 px-2"
          >
            <Pencil className="h-3 w-3 mr-1" />
            Draw Path
          </Button>
        </div>
      </div>
    </div>
  )
}
