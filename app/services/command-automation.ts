import { mowerBluetooth } from "./bluetooth-service"
import { protocolAnalyzer } from "./protocol-analyzer"
import { aiAssistant } from "./ai-assistant"

export interface AutomationRule {
  id: string
  name: string
  trigger: "time" | "condition" | "event"
  conditions: any[]
  actions: any[]
  enabled: boolean
  lastExecuted?: number
}

export interface CommandSequence {
  id: string
  name: string
  commands: Array<{
    command: string
    data?: Uint8Array
    delay?: number
  }>
  description: string
}

export class CommandAutomation {
  private rules: AutomationRule[] = []
  private sequences: CommandSequence[] = []
  private isRunning = false
  private intervalId?: NodeJS.Timeout

  constructor() {
    this.loadDefaultSequences()
  }

  private loadDefaultSequences() {
    this.sequences = [
      {
        id: "morning-routine",
        name: "Morning Mowing Routine",
        description: "Start mowing with safety checks",
        commands: [
          { command: "status_check", delay: 1000 },
          { command: "battery_check", delay: 1000 },
          { command: "blade_on", delay: 2000 },
          { command: "start", delay: 1000 },
        ],
      },
      {
        id: "emergency-stop",
        name: "Emergency Stop Sequence",
        description: "Immediate stop with blade shutdown",
        commands: [{ command: "emergency_stop" }, { command: "blade_off", delay: 500 }],
      },
      {
        id: "return-home",
        name: "Return Home Sequence",
        description: "Safe return to charging dock",
        commands: [
          { command: "blade_off", delay: 2000 },
          { command: "return_home", delay: 1000 },
        ],
      },
    ]
  }

  async executeSequence(sequenceId: string): Promise<boolean> {
    const sequence = this.sequences.find((s) => s.id === sequenceId)
    if (!sequence) {
      console.error(`Sequence ${sequenceId} not found`)
      return false
    }

    console.log(`Executing sequence: ${sequence.name}`)

    try {
      for (const step of sequence.commands) {
        console.log(`Executing command: ${step.command}`)

        const success = await mowerBluetooth.sendCommand(step.command, step.data)
        if (!success) {
          console.error(`Command ${step.command} failed`)
          return false
        }

        if (step.delay) {
          await new Promise((resolve) => setTimeout(resolve, step.delay))
        }
      }

      console.log(`Sequence ${sequence.name} completed successfully`)
      return true
    } catch (error) {
      console.error(`Sequence ${sequence.name} failed:`, error)
      return false
    }
  }

  async discoverCommands(): Promise<string[]> {
    console.log("Starting command discovery...")

    const discoveredCommands: string[] = []
    const testCommands = [
      // Status commands
      { name: "status_request", data: new Uint8Array([0x10]) },
      { name: "battery_request", data: new Uint8Array([0x11]) },
      { name: "position_request", data: new Uint8Array([0x12]) },

      // Control commands (be careful with these)
      { name: "ping", data: new Uint8Array([0x00]) },
      { name: "version_request", data: new Uint8Array([0x20]) },
      { name: "capabilities_request", data: new Uint8Array([0x21]) },
    ]

    for (const testCommand of testCommands) {
      try {
        console.log(`Testing command: ${testCommand.name}`)

        // Clear previous packets
        const packetsBefore = protocolAnalyzer.getPackets().length

        // Send test command
        await mowerBluetooth.sendCommand("manual_control", testCommand.data)

        // Wait for response
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Check if we got a response
        const packetsAfter = protocolAnalyzer.getPackets().length
        if (packetsAfter > packetsBefore) {
          discoveredCommands.push(testCommand.name)
          console.log(`✓ Command ${testCommand.name} got response`)
        } else {
          console.log(`✗ Command ${testCommand.name} no response`)
        }

        // Wait between commands
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`Error testing command ${testCommand.name}:`, error)
      }
    }

    console.log(`Discovery complete. Found ${discoveredCommands.length} working commands`)
    return discoveredCommands
  }

  async analyzeResponsePatterns(): Promise<any> {
    const packets = protocolAnalyzer.getPackets()
    const patterns = protocolAnalyzer.getPatterns()

    // Use AI to analyze patterns
    try {
      const analysis = await aiAssistant.analyzeBluetoothData({
        packets: packets.slice(-50),
        characteristics: [],
        services: [],
        deviceInfo: mowerBluetooth.getDeviceInfo(),
      })

      return {
        totalPackets: packets.length,
        detectedPatterns: patterns.length,
        aiAnalysis: analysis,
        recommendations: this.generateRecommendations(patterns),
      }
    } catch (error) {
      console.error("AI analysis failed:", error)
      return {
        totalPackets: packets.length,
        detectedPatterns: patterns.length,
        error: error.message,
      }
    }
  }

  private generateRecommendations(patterns: any[]): string[] {
    const recommendations: string[] = []

    const highConfidencePatterns = patterns.filter((p) => p.likelihood > 0.7)

    if (highConfidencePatterns.length > 0) {
      recommendations.push(`Found ${highConfidencePatterns.length} high-confidence command patterns`)
    }

    if (patterns.some((p) => p.name.includes("Battery"))) {
      recommendations.push("Battery monitoring commands detected - implement battery alerts")
    }

    if (patterns.some((p) => p.name.includes("Position"))) {
      recommendations.push("Position tracking available - implement real-time mapping")
    }

    if (patterns.some((p) => p.name.includes("Emergency"))) {
      recommendations.push("Emergency stop protocol identified - ensure safety implementation")
    }

    return recommendations
  }

  addRule(rule: Omit<AutomationRule, "id">): string {
    const id = `rule_${Date.now()}`
    this.rules.push({ ...rule, id })
    return id
  }

  removeRule(id: string): boolean {
    const index = this.rules.findIndex((r) => r.id === id)
    if (index >= 0) {
      this.rules.splice(index, 1)
      return true
    }
    return false
  }

  addSequence(sequence: Omit<CommandSequence, "id">): string {
    const id = `seq_${Date.now()}`
    this.sequences.push({ ...sequence, id })
    return id
  }

  getSequences(): CommandSequence[] {
    return [...this.sequences]
  }

  getRules(): AutomationRule[] {
    return [...this.rules]
  }

  startAutomation() {
    if (this.isRunning) return

    this.isRunning = true
    this.intervalId = setInterval(() => {
      this.processRules()
    }, 5000) // Check rules every 5 seconds

    console.log("Automation engine started")
  }

  stopAutomation() {
    if (!this.isRunning) return

    this.isRunning = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }

    console.log("Automation engine stopped")
  }

  private async processRules() {
    for (const rule of this.rules.filter((r) => r.enabled)) {
      try {
        if (await this.evaluateRule(rule)) {
          await this.executeRuleActions(rule)
          rule.lastExecuted = Date.now()
        }
      } catch (error) {
        console.error(`Error processing rule ${rule.name}:`, error)
      }
    }
  }

  private async evaluateRule(rule: AutomationRule): Promise<boolean> {
    // Simple rule evaluation - extend as needed
    switch (rule.trigger) {
      case "time":
        // Check time-based conditions
        return this.evaluateTimeConditions(rule.conditions)
      case "condition":
        // Check mower state conditions
        return this.evaluateStateConditions(rule.conditions)
      case "event":
        // Check for specific events
        return this.evaluateEventConditions(rule.conditions)
      default:
        return false
    }
  }

  private evaluateTimeConditions(conditions: any[]): boolean {
    // Implement time-based rule evaluation
    return false
  }

  private evaluateStateConditions(conditions: any[]): boolean {
    // Implement state-based rule evaluation
    return false
  }

  private evaluateEventConditions(conditions: any[]): boolean {
    // Implement event-based rule evaluation
    return false
  }

  private async executeRuleActions(rule: AutomationRule) {
    for (const action of rule.actions) {
      switch (action.type) {
        case "command":
          await mowerBluetooth.sendCommand(action.command, action.data)
          break
        case "sequence":
          await this.executeSequence(action.sequenceId)
          break
        case "notification":
          console.log(`Automation notification: ${action.message}`)
          break
      }
    }
  }
}

export const commandAutomation = new CommandAutomation()
