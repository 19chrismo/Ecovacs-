export interface PacketData {
  timestamp: number
  direction: "sent" | "received"
  characteristic: string
  data: Uint8Array
  hex: string
  ascii: string
  parsed?: any
}

export interface ProtocolPattern {
  name: string
  pattern: number[]
  mask?: number[]
  description: string
  likelihood: number
}

export class ProtocolAnalyzer {
  private packets: PacketData[] = []
  private patterns: ProtocolPattern[] = []
  private commandHistory: Map<string, PacketData[]> = new Map()

  addPacket(packet: Omit<PacketData, "hex" | "ascii">) {
    const hex = Array.from(packet.data)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ")

    const ascii = Array.from(packet.data)
      .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : "."))
      .join("")

    const fullPacket: PacketData = {
      ...packet,
      hex,
      ascii,
    }

    this.packets.push(fullPacket)
    this.analyzePacket(fullPacket)

    // Keep only last 1000 packets
    if (this.packets.length > 1000) {
      this.packets = this.packets.slice(-1000)
    }
  }

  private analyzePacket(packet: PacketData) {
    // Look for common patterns
    this.detectCommandPatterns(packet)
    this.detectStatusPatterns(packet)
    this.detectSensorPatterns(packet)
  }

  private detectCommandPatterns(packet: PacketData) {
    const data = packet.data

    // Common robotic mower command patterns
    const commandPatterns = [
      { name: "Start Command", pattern: [0x01, 0x01], description: "Likely start mowing" },
      { name: "Stop Command", pattern: [0x01, 0x00], description: "Likely stop mowing" },
      { name: "Pause Command", pattern: [0x01, 0x02], description: "Likely pause mowing" },
      { name: "Home Command", pattern: [0x02, 0x01], description: "Return to dock" },
      { name: "Emergency Stop", pattern: [0xff, 0x00], description: "Emergency stop" },
      { name: "Blade Control", pattern: [0x03], description: "Blade on/off control" },
      { name: "Manual Control", pattern: [0x04], description: "Manual movement" },
      { name: "Status Request", pattern: [0x10], description: "Status query" },
      { name: "Battery Request", pattern: [0x11], description: "Battery level query" },
    ]

    for (const pattern of commandPatterns) {
      if (this.matchesPattern(data, pattern.pattern)) {
        console.log(`Detected ${pattern.name}:`, packet.hex)
        this.addPattern({
          ...pattern,
          likelihood: 0.8,
        })
      }
    }
  }

  private detectStatusPatterns(packet: PacketData) {
    const data = packet.data

    // Status response patterns
    if (data.length >= 4) {
      // Possible battery level (0-100)
      if (data[0] === 0x20 && data[1] <= 100) {
        console.log(`Possible battery level: ${data[1]}%`)
      }

      // Possible coordinates
      if (data[0] === 0x30 && data.length >= 6) {
        const x = (data[1] << 8) | data[2]
        const y = (data[3] << 8) | data[4]
        console.log(`Possible position: X=${x}, Y=${y}`)
      }

      // Possible status byte
      if (data[0] === 0x21) {
        const statusMap = {
          0: "Idle",
          1: "Mowing",
          2: "Returning",
          3: "Charging",
          4: "Error",
          5: "Paused",
        }
        console.log(`Possible status: ${statusMap[data[1]] || "Unknown"}`)
      }
    }
  }

  private detectSensorPatterns(packet: PacketData) {
    const data = packet.data

    // Sensor data patterns
    if (data.length >= 8) {
      // Temperature (signed 16-bit, divide by 100)
      if (data[0] === 0x40) {
        const temp = ((data[1] << 8) | data[2]) / 100
        console.log(`Possible temperature: ${temp}°C`)
      }

      // Accelerometer/gyroscope data
      if (data[0] === 0x50 && data.length >= 8) {
        const x = (data[1] << 8) | data[2]
        const y = (data[3] << 8) | data[4]
        const z = (data[5] << 8) | data[6]
        console.log(`Possible IMU data: X=${x}, Y=${y}, Z=${z}`)
      }
    }
  }

  private matchesPattern(data: Uint8Array, pattern: number[]): boolean {
    if (data.length < pattern.length) return false

    for (let i = 0; i < pattern.length; i++) {
      if (data[i] !== pattern[i]) return false
    }

    return true
  }

  private addPattern(pattern: ProtocolPattern) {
    const existing = this.patterns.find((p) => p.name === pattern.name)
    if (existing) {
      existing.likelihood = Math.min(1.0, existing.likelihood + 0.1)
    } else {
      this.patterns.push(pattern)
    }
  }

  getPackets(): PacketData[] {
    return [...this.packets]
  }

  getPatterns(): ProtocolPattern[] {
    return [...this.patterns].sort((a, b) => b.likelihood - a.likelihood)
  }

  generateCommands(): string {
    const commands = this.patterns
      .filter((p) => p.likelihood > 0.5)
      .map((p) => {
        const bytes = p.pattern.map((b) => `0x${b.toString(16).padStart(2, "0")}`).join(", ")
        return `
// ${p.description}
async send${p.name.replace(/\s+/g, "")}() {
  const command = new Uint8Array([${bytes}])
  return await this.sendCommand(command)
}`
      })
      .join("\n")

    return `// Auto-generated commands based on protocol analysis\n${commands}`
  }

  exportAnalysis() {
    return {
      packets: this.packets,
      patterns: this.patterns,
      summary: {
        totalPackets: this.packets.length,
        detectedPatterns: this.patterns.length,
        highConfidencePatterns: this.patterns.filter((p) => p.likelihood > 0.7).length,
      },
    }
  }
}

export const protocolAnalyzer = new ProtocolAnalyzer()
