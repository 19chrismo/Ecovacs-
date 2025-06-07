"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { appAnalyzer, type AppAnalysisResult } from "../services/app-analyzer"
import { Download, Copy, ExternalLink } from "lucide-react"

export function AppAnalyzerTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [analysisResults, setAnalysisResults] = useState<AppAnalysisResult | null>(null)
  const [activeTab, setActiveTab] = useState("api")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      // For demo purposes, we'll analyze without a real file
      setIsAnalyzing(true)
      
      // Start progress updates
      const progressInterval = setInterval(() => {
        const currentProgress = appAnalyzer.getProgress()
        setProgress(currentProgress)
        
        if (currentProgress >= 100) {
          clearInterval(progressInterval)
          setIsAnalyzing(false)
          setAnalysisResults(appAnalyzer.getAnalysisResults())
        }
      }, 500)
      
      // Start analysis
      await appAnalyzer.analyzeAppPackage("demo_path")
    }
  }

  const handleImportCommands = () => {
    // In a real implementation, this would import the commands to the app
    alert("Commands imported successfully!")
  }

  const renderApiEndpoints = () => {
    if (!analysisResults) return null
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-slate-200">API Endpoints</h3>
          <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
            {analysisResults.apiEndpoints.length} Found
          </Badge>
        </div>
        
        <ScrollArea className="h-[400px] w-full rounded-md border border-slate-700 bg-slate-900/50">
          <div className="p-4 space-y-4">
            {analysisResults.apiEndpoints.map((endpoint, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardHeader className="py-3">
                  <div className="flex justify-between items-center">
                    <Badge className={`${endpoint.method === "GET" ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/30" : "bg-blue-600/20 text-blue-400 border-blue-500/30"}`}>
                      {endpoint.method}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-xs font-mono text-slate-300 mt-2 break-all">
                    {endpoint.url}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-slate-400">Parameters:</p>
                      <pre className="text-slate-300 mt-1 bg-slate-900 p-1 rounded overflow-x-auto">
                        {JSON.stringify(endpoint.parameters, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <p className="text-slate-400">Headers:</p>
                      <pre className="text-slate-300 mt-1 bg-slate-900 p-1 rounded overflow-x-auto">
                        {JSON.stringify(endpoint.headers, null, 2)}
                      </pre>
                    </div>
                  </div>
                  <p className="text-slate-400 mt-2">{endpoint.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  }

  const renderCommands = () => {
    if (!analysisResults) return null
    
    // Group commands by category
    const commandsByCategory: Record<string, typeof analysisResults.commands> = {}
    analysisResults.commands.forEach(command => {
      if (!commandsByCategory[command.category]) {
        commandsByCategory[command.category] = []
      }
      commandsByCategory[command.category].push(command)
    })
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-slate-200">Mower Commands</h3>
          <div className="flex gap-2">
            <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30">
              {analysisResults.commands.length} Commands
            </Badge>
            <Button size="sm" onClick={handleImportCommands} className="h-7 text-xs bg-blue-600 hover:bg-blue-700">
              <Download className="h-3 w-3 mr-1" />
              Import All
            </Button>
          </div>
        </div>
        
        <ScrollArea className="h-[400px] w-full rounded-md border border-slate-700 bg-slate-900/50">
          <div className="p-4 space-y-6">
            {Object.entries(commandsByCategory).map(([category, commands]) => (
              <div key={category} className="space-y-2">
                <h4 className="text-sm font-medium text-slate-300 capitalize">{category}</h4>
                <div className="grid grid-cols-1 gap-2">
                  {commands.map((command, index) => (
                    <Card key={index} className="bg-slate-800 border-slate-700">
                      <CardHeader className="py-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm text-slate-200">{command.name}</CardTitle>
                          <Badge className="bg-slate-700 text-slate-300 border-slate-600 font-mono">
                            {command.hexCommand}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 text-xs">
                        <p className="text-slate-400">{command.description}</p>
                        {command.parameters.length > 0 && (
                          <div className="mt-2">
                            <span className="text-slate-400">Parameters: </span>
                            <span className="text-slate-300">{command.parameters.join(", ")}</span>
                          </div>
                        )}
                        <div className="mt-2">
                          <span className="text-slate-400">Response: </span>
                          <span className="text-slate-300">{command.response}</span>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <Button size="sm" variant="outline" className="h-6 text-xs border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200">
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  }

  const renderBluetoothInfo = () => {
    if (!analysisResults) return null
    
    const { bluetoothProtocol } = analysisResults
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between\
