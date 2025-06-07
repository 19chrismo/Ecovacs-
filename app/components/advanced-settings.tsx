"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Wifi, Bluetooth, Settings, Shield, Zap, Volume2, Bell } from "lucide-react"

export function AdvancedSettings() {
  const [wifiConnected, setWifiConnected] = useState(true)
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Advanced Settings</h2>
        <p className="text-muted-foreground">Configure your Ecovacs GX 600 for optimal performance</p>
      </div>

      <Tabs defaultValue="connectivity" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="connectivity">Connectivity</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="notifications">Alerts</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="connectivity" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  WiFi Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>WiFi Connection</Label>
                  <Badge variant={wifiConnected ? "default" : "destructive"}>
                    {wifiConnected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label>Network Name</Label>
                  <Input value="HomeNetwork_5G" readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Signal Strength</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                    <span className="text-sm">85%</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Change Network
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bluetooth className="h-5 w-5" />
                  Bluetooth & Remote
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Bluetooth</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Remote Control</Label>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Paired Devices</Label>
                  <div className="text-sm text-muted-foreground">
                    • iPhone 15 Pro
                    <br />• Samsung Galaxy S24
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Manage Devices
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Anti-theft Protection</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>PIN Lock</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Lift Sensor</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Tilt Alarm</Label>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Change PIN</Label>
                  <div className="flex gap-2">
                    <Input type="password" placeholder="Current PIN" />
                    <Button variant="outline">Update</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Authorized Users</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Admin (You)</span>
                      <Badge>Owner</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Family Member</span>
                      <Badge variant="outline">User</Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Add User
                </Button>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label>Guest Access</Label>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Power Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Power Mode</Label>
                  <Select defaultValue="balanced">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eco">Eco Mode</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="turbo">Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Auto Sleep</Label>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Sleep Timer (minutes)</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="60">60</SelectItem>
                      <SelectItem value="120">120</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>LIDAR & Sensors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>LIDAR Sensitivity</Label>
                  <Select defaultValue="high">
                    <SelectTrigger>
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
                <div className="space-y-2">
                  <Label>Mapping Frequency</Label>
                  <Select defaultValue="realtime">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="realtime">Real-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Obstacle Avoidance</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Cliff Detection</Label>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Push Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Notifications</Label>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Mowing Complete</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Low Battery</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Error Alerts</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Weather Delays</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Maintenance Reminders</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Sound Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Sound Alerts</Label>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Volume Level</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Startup Sound</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Error Beeps</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Completion Chime</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Model:</span>
                    <span className="text-sm font-medium">Ecovacs GX 600</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Firmware:</span>
                    <span className="text-sm font-medium">v2.1.4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Serial Number:</span>
                    <span className="text-sm font-medium">GX600-2024-001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Runtime:</span>
                    <span className="text-sm font-medium">127 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Area Covered:</span>
                    <span className="text-sm font-medium">2,450 m²</span>
                  </div>
                </div>
                <Separator />
                <Button variant="outline" className="w-full">
                  Check for Updates
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Export Logs
                </Button>
                <Button variant="outline" className="w-full">
                  Backup Settings
                </Button>
                <Button variant="outline" className="w-full">
                  Restore Settings
                </Button>
                <Separator />
                <Button variant="outline" className="w-full">
                  Calibrate Sensors
                </Button>
                <Button variant="outline" className="w-full">
                  Reset Map Data
                </Button>
                <Separator />
                <Button variant="destructive" className="w-full">
                  Factory Reset
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
