"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { aiAssistant } from "../services/ai-assistant"
import { protocolAnalyzer, type PacketData } from "../services/protocol-analyzer"
import { networkMonitor } from "../services/network-monitor"
import {
  Brain,
  Zap,
  Network,
  Code,
  Download,
  Play,
  CircleStopIcon as Stop,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  Wifi,
} from "lucide-react"

export function AIReverseEngineer() {
  const [aiApiKey, setAiApiKey] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState("")
  const [packets, setPackets] = useState<PacketData[]>([])
  const [networkCaptures, setNetworkCaptures] = useState<any[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [streamingAnalysis, setStreamingAnalysis] = useState("")

  useEffect(() => {
    // Update packets from protocol analyzer
    const interval = setInterval(() => {
      setPackets(protocolAnalyzer.getPackets())
      setNetworkCaptures(networkMonitor.getCaptures())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleAnalyzeProtocol = async () => {
    setIsAnalyzing(true)
    setAnalysis("")

    try {
      const data = {
        packets: protocolAnalyzer.getPackets(),
        characteristics: [], // Would be populated from BLE service
        services: [],
        deviceInfo: {
          name: "GOAT-0050",
          serial: "E03C35162F09HVXP0050",
          firmware: "1.2.120",
        },
      }

      const result = await aiAssistant.analyzeBluetoothData(data)
      setAnalysis(result)
    } catch (error) {
      setAnalysis(`Error: ${error.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerateCode = async () => {
    setIsAnalyzing(true)
    setGeneratedCode("")

    try {
      const observedData = protocolAnalyzer.getPackets().slice(-20)
      const code = await aiAssistant.generateProtocolCommands(observedData)
      setGeneratedCode(code)
    } catch (error) {
      setGeneratedCode(`Error: ${error.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleStreamAnalysis = async () => {
    setStreamingAnalysis("")

    try {
      const data = {
        recentPackets: protocolAnalyzer.getPackets().slice(-10),
        networkActivity: networkMonitor.getEcovacsCaptures().slice(-5),
      }

      for await (const chunk of aiAssistant.streamAnalysis(data)) {
        setStreamingAnalysis((prev) => prev + chunk)
      }
    } catch (error) {
      setStreamingAnalysis(`Error: ${error.message}`)
    }
  }

  const toggleNetworkMonitoring = () => {
    if (isMonitoring) {
      networkMonitor.stopMonitoring()
      setIsMonitoring(false)
    } else {
      networkMonitor.startMonitoring()
      setIsMonitoring(true)
    }
  }

  const exportAnalysis = () => {
    const data = {
      protocolAnalysis: protocolAnalyzer.exportAnalysis(),
      networkCaptures: networkMonitor.exportCaptures(),
      aiAnalysis: analysis,
      generatedCode: generatedCode,
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mower-analysis-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-200">AI Reverse Engineering Suite</h2>
        <p className="text-slate-400">Advanced tools for protocol analysis and automation</p>
      </div>

      {/* AI Configuration */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-200">
            <Brain className="h-5 w-5" />
            AI Assistant Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-200">OpenAI API Key</Label>
            <Input
              type="password"
              value={aiApiKey}
              onChange={(e) => setAiApiKey(e.target.value)}
              placeholder="sk-..."
              className="bg-slate-700 border-slate-600 text-slate-200"
            />
            <p className="text-xs text-slate-400">Required for AI-powered protocol analysis and troubleshooting</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="protocol" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger
            value="protocol"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            Protocol Analysis
          </TabsTrigger>
          <TabsTrigger
            value="network"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            Network Monitor
          </TabsTrigger>
          <TabsTrigger
            value="automation"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            Automation
          </TabsTrigger>
          <TabsTrigger
            value="tools"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            Tools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="protocol" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Bluetooth Packet Analysis */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">BLE Packet Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-200">Captured Packets</span>
                  <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30">{packets.length}</Badge>
                </div>

                <ScrollArea className="h-40 w-full border border-slate-600 rounded p-2 bg-slate-900">
                  {packets.slice(-10).map((packet, index) => (
                    <div key={index} className="text-xs text-slate-300 mb-1 font-mono">
                      <span className={packet.direction === "sent" ? "text-blue-400" : "text-green-400"}>
                        {packet.direction === "sent" ? "→" : "←"}
                      </span>{" "}
                      {packet.hex}
                    </div>
                  ))}
                </ScrollArea>

                <div className="flex gap-2">
                  <Button
                    onClick={handleAnalyzeProtocol}
                    disabled={isAnalyzing || packets.length === 0}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Brain className="h-4 w-4 mr-2" />
                    )}
                    Analyze with AI
                  </Button>
                  <Button
                    onClick={handleGenerateCode}
                    disabled={isAnalyzing}
                    variant="outline"
                    className="border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Generate Code
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis Results */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">AI Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-60 w-full">
                  {analysis ? (
                    <div className="text-sm text-slate-300 whitespace-pre-wrap">{analysis}</div>
                  ) : (
                    <div className="text-slate-400 text-center py-8">
                      No analysis yet. Capture some packets and click "Analyze with AI"
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Generated Code */}
          {generatedCode && (
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">Generated Code</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40 w-full">
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap">{generatedCode}</pre>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Network Monitoring */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <Network className="h-5 w-5" />
                  Network Traffic Monitor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-200">Status</span>
                  <Badge
                    className={
                      isMonitoring
                        ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/30"
                        : "bg-slate-600/20 text-slate-400 border-slate-500/30"
                    }
                  >
                    {isMonitoring ? "Monitoring" : "Stopped"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-200">Captured Requests</span>
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">{networkCaptures.length}</Badge>
                </div>

                <Button
                  onClick={toggleNetworkMonitoring}
                  className={
                    isMonitoring
                      ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                      : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                  }
                >
                  {isMonitoring ? (
                    <>
                      <Stop className="h-4 w-4 mr-2" />
                      Stop Monitoring
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Monitoring
                    </>
                  )}
                </Button>

                <div className="text-xs text-slate-400">
                  Monitor network traffic to reverse engineer the Ecovacs app API
                </div>
              </CardContent>
            </Card>

            {/* Network Captures */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">Recent Network Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-60 w-full">
                  {networkCaptures.slice(-10).map((capture, index) => (
                    <div key={index} className="text-xs text-slate-300 mb-2 p-2 border border-slate-600 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {capture.method}
                        </Badge>
                        <span className="text-slate-400 truncate">{new URL(capture.url).pathname}</span>
                      </div>
                      {capture.body && (
                        <div className="text-slate-500 truncate">
                          Body: {JSON.stringify(capture.body).slice(0, 50)}...
                        </div>
                      )}
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Live AI Analysis */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <Zap className="h-5 w-5" />
                  Live AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleStreamAnalysis}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Start Live Analysis
                </Button>

                <ScrollArea className="h-40 w-full border border-slate-600 rounded p-2 bg-slate-900">
                  <div className="text-sm text-slate-300 whitespace-pre-wrap">
                    {streamingAnalysis || "Click 'Start Live Analysis' to begin real-time AI analysis"}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Command Testing */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">Command Testing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">Test Command (Hex)</Label>
                  <Input
                    placeholder="01 01 (start command)"
                    className="bg-slate-700 border-slate-600 text-slate-200 font-mono"
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800">
                  <Zap className="h-4 w-4 mr-2" />
                  Send Test Command
                </Button>

                <div className="text-xs text-slate-400">
                  ⚠️ Use with caution. Test commands may affect mower behavior.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Export Tools */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">Export & Backup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={exportAnalysis}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Analysis
                </Button>

                <div className="text-xs text-slate-400">
                  Export all captured data, analysis results, and generated code
                </div>
              </CardContent>
            </Card>

            {/* Protocol Patterns */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">Detected Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-32 w-full">
                  {protocolAnalyzer.getPatterns().map((pattern, index) => (
                    <div key={index} className="text-xs text-slate-300 mb-1">
                      <div className="flex items-center justify-between">
                        <span>{pattern.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(pattern.likelihood * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Status */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  {aiApiKey ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  )}
                  <span className="text-sm text-slate-200">AI Assistant</span>
                </div>

                <div className="flex items-center gap-2">
                  {isMonitoring ? (
                    <Eye className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                  <span className="text-sm text-slate-200">Network Monitor</span>
                </div>

                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-slate-200">Protocol Analyzer</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
