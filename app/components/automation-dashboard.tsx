"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { commandAutomation, type CommandSequence, type AutomationRule } from "../services/command-automation"
import {
  Play,
  CircleStopIcon as Stop,
  Zap,
  Search,
  Code,
  Settings,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export function AutomationDashboard() {
  const [sequences, setSequences] = useState<CommandSequence[]>([])
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [isDiscovering, setIsDiscovering] = useState(false)
  const [discoveredCommands, setDiscoveredCommands] = useState<string[]>([])
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    setSequences(commandAutomation.getSequences())
    setRules(commandAutomation.getRules())
  }, [])

  const handleExecuteSequence = async (sequenceId: string) => {
    const success = await commandAutomation.executeSequence(sequenceId)
    if (success) {
      console.log("Sequence executed successfully")
    } else {
      console.error("Sequence execution failed")
    }
  }

  const handleDiscoverCommands = async () => {
    setIsDiscovering(true)
    try {
      const commands = await commandAutomation.discoverCommands()
      setDiscoveredCommands(commands)
    } catch (error) {
      console.error("Command discovery failed:", error)
    } finally {
      setIsDiscovering(false)
    }
  }

  const handleAnalyzePatterns = async () => {
    setIsAnalyzing(true)
    try {
      const results = await commandAutomation.analyzeResponsePatterns()
      setAnalysisResults(results)
    } catch (error) {
      console.error("Pattern analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-200">Automation Dashboard</h2>
        <p className="text-slate-400">Command sequences and intelligent automation</p>
      </div>

      <Tabs defaultValue="sequences" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger
            value="sequences"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            Command Sequences
          </TabsTrigger>
          <TabsTrigger
            value="discovery"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            Command Discovery
          </TabsTrigger>
          <TabsTrigger
            value="automation"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            Automation Rules
          </TabsTrigger>
          <TabsTrigger
            value="analysis"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300"
          >
            Pattern Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sequences" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sequences.map((sequence) => (
              <Card key={sequence.id} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-200 text-lg">{sequence.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-400">{sequence.description}</p>

                  <div className="space-y-2">
                    <div className="text-xs text-slate-400">Commands:</div>
                    {sequence.commands.map((cmd, index) => (
                      <div key={index} className="text-xs text-slate-300 font-mono bg-slate-900 p-1 rounded">
                        {index + 1}. {cmd.command}
                        {cmd.delay && <span className="text-slate-500"> (wait {cmd.delay}ms)</span>}
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleExecuteSequence(sequence.id)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Execute Sequence
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Add New Sequence Card */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm border-dashed">
              <CardContent className="flex items-center justify-center h-full min-h-[200px]">
                <Button variant="outline" className="border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Sequence
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="discovery" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Command Discovery */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <Search className="h-5 w-5" />
                  Command Discovery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-400">
                  Automatically discover available commands by testing common protocols
                </p>

                <Button
                  onClick={handleDiscoverCommands}
                  disabled={isDiscovering}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  {isDiscovering ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Discovering Commands...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Start Discovery
                    </>
                  )}
                </Button>

                {discoveredCommands.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-200">Discovered Commands:</div>
                    <ScrollArea className="h-32 w-full border border-slate-600 rounded p-2 bg-slate-900">
                      {discoveredCommands.map((cmd, index) => (
                        <div key={index} className="text-xs text-emerald-400 mb-1">
                          ✓ {cmd}
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                )}

                <div className="text-xs text-slate-500">
                  ⚠️ Discovery sends test commands to your mower. Ensure it's in a safe location.
                </div>
              </CardContent>
            </Card>

            {/* Safety Controls */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <Settings className="h-5 w-5" />
                  Safety Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button
                    onClick={() => handleExecuteSequence("emergency-stop")}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  >
                    <Stop className="h-4 w-4 mr-2" />
                    Emergency Stop
                  </Button>

                  <Button
                    onClick={() => handleExecuteSequence("return-home")}
                    variant="outline"
                    className="w-full border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                  >
                    Return to Dock
                  </Button>
                </div>

                <div className="pt-2 border-t border-slate-700">
                  <div className="text-xs text-slate-400">Always test new commands in a controlled environment</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-200">
                <Zap className="h-5 w-5" />
                Automation Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-400">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Automation rules coming soon</p>
                <p className="text-sm">Create intelligent rules based on time, weather, and mower status</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Pattern Analysis */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <Code className="h-5 w-5" />
                  Pattern Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleAnalyzePatterns}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Code className="h-4 w-4 mr-2" />
                      Analyze Patterns
                    </>
                  )}
                </Button>

                {analysisResults && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-slate-400">Total Packets</div>
                        <div className="text-slate-200 font-medium">{analysisResults.totalPackets}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Patterns</div>
                        <div className="text-slate-200 font-medium">{analysisResults.detectedPatterns}</div>
                      </div>
                    </div>

                    {analysisResults.recommendations && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-slate-200">Recommendations:</div>
                        {analysisResults.recommendations.map((rec: string, index: number) => (
                          <div key={index} className="text-xs text-slate-300 flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                            {rec}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Analysis Results */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-200">AI Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-60 w-full">
                  {analysisResults?.aiAnalysis ? (
                    <div className="text-sm text-slate-300 whitespace-pre-wrap">{analysisResults.aiAnalysis}</div>
                  ) : (
                    <div className="text-slate-400 text-center py-8">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No analysis results yet</p>
                      <p className="text-xs">Run pattern analysis to see AI insights</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
