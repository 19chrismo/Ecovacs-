"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mowerBluetooth } from "../services/bluetooth-service"
import { Bluetooth, CheckCircle, Loader2, AlertCircle } from "lucide-react"

interface RealBluetoothSetupProps {
  onConnectionChange: (connected: boolean) => void
}

export function RealBluetoothSetup({ onConnectionChange }: RealBluetoothSetupProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [connectionStep, setConnectionStep] = useState(0)

  useEffect(() => {
    // Check if already connected
    setIsConnected(mowerBluetooth.isConnected())
    if (mowerBluetooth.isConnected()) {
      setDeviceInfo(mowerBluetooth.getDeviceInfo())
    }
  }, [])

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)
    setConnectionStep(1)

    try {
      // Check if Web Bluetooth is supported
      if (!navigator.bluetooth) {
        throw new Error("Web Bluetooth is not supported in this browser")
      }

      setConnectionStep(2)

      // Connect to the actual GOAT-0050 mower
      const connected = await mowerBluetooth.connect()

      if (connected) {
        setConnectionStep(3)
        setIsConnected(true)
        setDeviceInfo(mowerBluetooth.getDeviceInfo())
        onConnectionChange(true)

        // Listen for real-time data updates
        window.addEventListener("mowerDataUpdate", handleMowerDataUpdate)
      } else {
        throw new Error("Failed to connect to GOAT-0050 mower")
      }
    } catch (err: any) {
      setError(err.message)
      setIsConnected(false)
      onConnectionChange(false)
    } finally {
      setIsConnecting(false)
      setConnectionStep(0)
    }
  }

  const handleDisconnect = async () => {
    await mowerBluetooth.disconnect()
    setIsConnected(false)
    setDeviceInfo(null)
    onConnectionChange(false)
    window.removeEventListener("mowerDataUpdate", handleMowerDataUpdate)
  }

  const handleMowerDataUpdate = (event: any) => {
    console.log("Real mower data received:", event.detail)
    // Update UI with real sensor data
  }

  const getConnectionStepText = () => {
    switch (connectionStep) {
      case 1:
        return "Checking Bluetooth support..."
      case 2:
        return "Scanning for GOAT-0050..."
      case 3:
        return "Establishing connection..."
      default:
        return ""
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-200">
          <Bluetooth className="h-5 w-5" />
          Real Mower Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <>
            <div className="text-center space-y-4">
              <div className="text-slate-300">Connect to your actual GOAT-0050 mower via Bluetooth</div>

              {isConnecting && (
                <div className="space-y-2">
                  <Progress value={(connectionStep / 3) * 100} className="h-2" />
                  <div className="text-sm text-slate-400">{getConnectionStepText()}</div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Bluetooth className="h-4 w-4 mr-2" />
                    Connect to GOAT-0050
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">Connected to Real Mower</span>
            </div>

            {deviceInfo && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-slate-400">Device Name</div>
                    <div className="text-slate-200 font-medium">{deviceInfo.name}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Serial Number</div>
                    <div className="text-slate-200 font-mono text-xs">{deviceInfo.serial}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Firmware</div>
                    <div className="text-slate-200">{deviceInfo.firmwareVersion}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Status</div>
                    <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30">Online</Badge>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>WiFi: {deviceInfo.wifiAddress}</div>
                    <div>Bluetooth: {deviceInfo.bluetoothAddress}</div>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleDisconnect}
              variant="outline"
              className="w-full border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
            >
              Disconnect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
