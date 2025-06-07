"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Plus, Edit, Trash2, Play } from "lucide-react"

interface Schedule {
  id: string
  name: string
  zones: string[]
  days: string[]
  time: string
  duration: number
  enabled: boolean
  weather: boolean
}

export function ScheduleManager() {
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: "1",
      name: "Morning Routine",
      zones: ["Front Yard", "Side Garden"],
      days: ["Mon", "Wed", "Fri"],
      time: "08:00",
      duration: 120,
      enabled: true,
      weather: true,
    },
    {
      id: "2",
      name: "Weekend Deep Mowing",
      zones: ["Front Yard", "Back Yard", "Side Garden"],
      days: ["Sat"],
      time: "09:00",
      duration: 180,
      enabled: true,
      weather: true,
    },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)

  const toggleSchedule = (id: string) => {
    setSchedules(schedules.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-200">Schedule Manager</h2>
          <p className="text-slate-400">Automate your mowing with intelligent scheduling</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Schedule
        </Button>
      </div>

      <Tabs defaultValue="schedules" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger
            value="schedules"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            Active Schedules
          </TabsTrigger>
          <TabsTrigger
            value="calendar"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            Calendar View
          </TabsTrigger>
          <TabsTrigger
            value="smart"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            Smart Features
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedules" className="space-y-4">
          <div className="grid gap-4">
            {schedules.map((schedule) => (
              <Card key={schedule.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-slate-200">
                        <Clock className="h-5 w-5" />
                        {schedule.name}
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {schedule.days.join(", ")} at {schedule.time} • {schedule.duration} minutes
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={schedule.enabled} onCheckedChange={() => toggleSchedule(schedule.id)} />
                      <Badge
                        variant={schedule.enabled ? "default" : "secondary"}
                        className={schedule.enabled ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-300"}
                      >
                        {schedule.enabled ? "Active" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-slate-200">Zones</Label>
                      <div className="flex gap-2 mt-1">
                        {schedule.zones.map((zone) => (
                          <Badge key={zone} variant="outline" className="bg-slate-700 text-slate-300 border-slate-600">
                            {zone}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch checked={schedule.weather} />
                          <Label className="text-sm text-slate-200">Weather-aware</Label>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Run Now
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-200">Weekly Schedule Overview</CardTitle>
              <CardDescription className="text-slate-400">
                Visual calendar of all scheduled mowing sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="text-center font-medium p-2 bg-slate-700 text-slate-200 rounded">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className="min-h-[100px] p-2 border border-slate-600 bg-slate-700 rounded">
                    {schedules
                      .filter((s) => s.days.includes(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]))
                      .map((s) => (
                        <div key={s.id} className="text-xs p-1 mb-1 bg-emerald-600 text-white rounded">
                          {s.time} - {s.name}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smart" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Weather Integration</CardTitle>
                <CardDescription className="text-slate-400">
                  Automatically adjust schedules based on weather conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-200">Skip when raining</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-slate-200">Delay after rain</Label>
                  <Select defaultValue="2">
                    <SelectTrigger className="w-20 bg-slate-700 border-slate-600 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="1" className="text-slate-200">
                        1h
                      </SelectItem>
                      <SelectItem value="2" className="text-slate-200">
                        2h
                      </SelectItem>
                      <SelectItem value="4" className="text-slate-200">
                        4h
                      </SelectItem>
                      <SelectItem value="8" className="text-slate-200">
                        8h
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-slate-200">Temperature threshold</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      defaultValue="35"
                      className="w-16 bg-slate-700 border-slate-600 text-slate-200"
                    />
                    <span className="text-sm text-slate-200">°C</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">Adaptive Scheduling</CardTitle>
                <CardDescription className="text-slate-400">AI-powered schedule optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-200">Learn grass growth patterns</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-slate-200">Optimize for energy efficiency</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-slate-200">Avoid peak electricity hours</Label>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
