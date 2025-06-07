"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Wrench, AlertTriangle, CheckCircle, Clock, Battery, Scissors } from "lucide-react"

interface MaintenanceItem {
  id: string
  name: string
  type: "blade" | "battery" | "sensor" | "general"
  status: "good" | "warning" | "critical"
  progress: number
  nextDue: string
  lastCompleted: string
}

export function MaintenanceTracker() {
  const [maintenanceItems] = useState<MaintenanceItem[]>([
    {
      id: "1",
      name: "Blade Replacement",
      type: "blade",
      status: "warning",
      progress: 75,
      nextDue: "2024-02-15",
      lastCompleted: "2023-11-15",
    },
    {
      id: "2",
      name: "Battery Health Check",
      type: "battery",
      status: "good",
      progress: 30,
      nextDue: "2024-03-01",
      lastCompleted: "2024-01-01",
    },
    {
      id: "3",
      name: "LIDAR Sensor Cleaning",
      type: "sensor",
      status: "critical",
      progress: 95,
      nextDue: "2024-01-20",
      lastCompleted: "2023-12-20",
    },
    {
      id: "4",
      name: "General Inspection",
      type: "general",
      status: "good",
      progress: 20,
      nextDue: "2024-04-01",
      lastCompleted: "2024-01-01",
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "blade":
        return <Scissors className="h-4 w-4" />
      case "battery":
        return <Battery className="h-4 w-4" />
      case "sensor":
        return <Wrench className="h-4 w-4" />
      default:
        return <Wrench className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Maintenance Tracker</h2>
        <p className="text-muted-foreground">Keep your Ecovacs GX 600 in optimal condition</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="parts">Parts & Supplies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {maintenanceItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(item.type)}
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription>
                          Last completed: {item.lastCompleted} • Next due: {item.nextDue}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <Badge
                        variant={
                          item.status === "good" ? "default" : item.status === "warning" ? "secondary" : "destructive"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Usage Progress</span>
                        <span>{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Mark Complete
                      </Button>
                      <Button size="sm" variant="outline">
                        Schedule Service
                      </Button>
                      <Button size="sm" variant="outline">
                        Order Parts
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Calendar</CardTitle>
                <CardDescription>Upcoming maintenance tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar mode="single" className="rounded-md border" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Wrench className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="font-medium">LIDAR Cleaning</div>
                        <div className="text-sm text-muted-foreground">Jan 20, 2024</div>
                      </div>
                    </div>
                    <Badge variant="destructive">Overdue</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Scissors className="h-4 w-4 text-yellow-500" />
                      <div>
                        <div className="font-medium">Blade Replacement</div>
                        <div className="text-sm text-muted-foreground">Feb 15, 2024</div>
                      </div>
                    </div>
                    <Badge variant="secondary">Due Soon</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Battery className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">Battery Check</div>
                        <div className="text-sm text-muted-foreground">Mar 1, 2024</div>
                      </div>
                    </div>
                    <Badge>Scheduled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
              <CardDescription>Complete record of all maintenance activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "2024-01-01", task: "General Inspection", status: "Completed", cost: "$0" },
                  { date: "2023-12-20", task: "LIDAR Sensor Cleaning", status: "Completed", cost: "$25" },
                  { date: "2023-11-15", task: "Blade Replacement", status: "Completed", cost: "$45" },
                  { date: "2023-10-01", task: "Battery Health Check", status: "Completed", cost: "$0" },
                  { date: "2023-09-15", task: "Wheel Cleaning", status: "Completed", cost: "$15" },
                ].map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">{record.task}</div>
                        <div className="text-sm text-muted-foreground">{record.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{record.cost}</div>
                      <Badge variant="outline">{record.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parts" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Replacement Parts</CardTitle>
                <CardDescription>Order genuine Ecovacs parts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Cutting Blades (Set of 3)", price: "$45", stock: "In Stock" },
                    { name: "LIDAR Sensor Cover", price: "$25", stock: "In Stock" },
                    { name: "Side Brush", price: "$15", stock: "Low Stock" },
                    { name: "Charging Contacts", price: "$20", stock: "In Stock" },
                    { name: "Wheel Assembly", price: "$35", stock: "In Stock" },
                  ].map((part, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{part.name}</div>
                        <div className="text-sm text-muted-foreground">{part.price}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={part.stock === "Low Stock" ? "secondary" : "default"}>{part.stock}</Badge>
                        <Button size="sm">Order</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Supplies</CardTitle>
                <CardDescription>Cleaning and care products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Sensor Cleaning Kit", price: "$12", stock: "In Stock" },
                    { name: "Blade Sharpening Tool", price: "$18", stock: "In Stock" },
                    { name: "Protective Spray", price: "$8", stock: "In Stock" },
                    { name: "Cleaning Cloths (Pack of 5)", price: "$10", stock: "In Stock" },
                  ].map((supply, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{supply.name}</div>
                        <div className="text-sm text-muted-foreground">{supply.price}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>In Stock</Badge>
                        <Button size="sm">Order</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
