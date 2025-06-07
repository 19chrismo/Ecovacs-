"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Wifi, Bluetooth, CheckCircle, Loader2 } from "lucide-react"

interface SetupWizardProps {
  onComplete: () => void
  onBack: () => void
}

export function SetupWizard({ onComplete, onBack }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [wifiConnecting, setWifiConnecting] = useState(false)
  const [bluetoothConnecting, setBluetoothConnecting] = useState(false)
  const [wifiConnected, setWifiConnected] = useState(false)
  const [bluetoothConnected, setBluetoothConnected] = useState(false)
  const [wifiCredentials, setWifiCredentials] = useState({ ssid: "", password: "" })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleWifiConnect = async () => {
    setWifiConnecting(true)
    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setWifiConnected(true)
    setWifiConnecting(false)
  }

  const handleBluetoothConnect = async () => {
    setBluetoothConnecting(true)
    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setBluetoothConnected(true)
    setBluetoothConnecting(false)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-200 mb-2">Welcome to ECOVACS GX 600 Setup</h2>
              <p className="text-slate-400">Let's get your robotic mower connected and ready to work</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <Wifi className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-slate-200">WiFi Connection</h3>
                  <p className="text-xs text-slate-400">Connect to your home network</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <Bluetooth className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-slate-200">Bluetooth Pairing</h3>
                  <p className="text-xs text-slate-400">Pair with your device</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-slate-200">Final Setup</h3>
                  <p className="text-xs text-slate-400">Configure your preferences</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-200 mb-2">WiFi Connection</h2>
              <p className="text-slate-400">Connect your mower to your home WiFi network</p>
            </div>
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">Network Name (SSID)</Label>
                  <Input
                    value={wifiCredentials.ssid}
                    onChange={(e) => setWifiCredentials({ ...wifiCredentials, ssid: e.target.value })}
                    placeholder="Enter WiFi network name"
                    className="bg-slate-700 border-slate-600 text-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">Password</Label>
                  <Input
                    type="password"
                    value={wifiCredentials.password}
                    onChange={(e) => setWifiCredentials({ ...wifiCredentials, password: e.target.value })}
                    placeholder="Enter WiFi password"
                    className="bg-slate-700 border-slate-600 text-slate-200"
                  />
                </div>
                <Button
                  onClick={handleWifiConnect}
                  disabled={wifiConnecting || wifiConnected || !wifiCredentials.ssid || !wifiCredentials.password}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                >
                  {wifiConnecting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {wifiConnected ? "Connected!" : wifiConnecting ? "Connecting..." : "Connect to WiFi"}
                </Button>
                {wifiConnected && (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Successfully connected to {wifiCredentials.ssid}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-200 mb-2">Bluetooth Pairing</h2>
              <p className="text-slate-400">Pair your device with the mower for direct control</p>
            </div>
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <Bluetooth className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <p className="text-slate-300 mb-4">Make sure your mower is in pairing mode</p>
                  <Button
                    onClick={handleBluetoothConnect}
                    disabled={bluetoothConnecting || bluetoothConnected}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    {bluetoothConnecting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {bluetoothConnected ? "Paired!" : bluetoothConnecting ? "Pairing..." : "Start Pairing"}
                  </Button>
                  {bluetoothConnected && (
                    <div className="flex items-center justify-center gap-2 text-blue-400 mt-4">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Successfully paired with ECOVACS GX 600</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-200 mb-2">Setup Complete!</h2>
              <p className="text-slate-400">Your ECOVACS GX 600 is ready to use</p>
            </div>
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span className="text-slate-200">WiFi Connected</span>
                    <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30">
                      {wifiCredentials.ssid}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-400" />
                    <span className="text-slate-200">Bluetooth Paired</span>
                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">ECOVACS GX 600</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span className="text-slate-200">Ready for Operation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-slate-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-slate-200">Setup Wizard</h1>
            <p className="text-sm text-slate-400">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2 bg-slate-700" />
        </div>

        {/* Step Content */}
        <div className="mb-8">{renderStep()}</div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            variant="outline"
            className="border-slate-600 bg-slate-700/50 hover:bg-slate-600 text-slate-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep === totalSteps ? (
            <Button
              onClick={onComplete}
              disabled={!wifiConnected || !bluetoothConnected}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
            >
              Complete Setup
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
              disabled={(currentStep === 2 && !wifiConnected) || (currentStep === 3 && !bluetoothConnected)}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
