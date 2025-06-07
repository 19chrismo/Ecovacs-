export class MowerAIAssistant {
  async analyzeBluetoothData(data: {
    packets: any[]
    characteristics: any[]
    services: any[]
    deviceInfo: any
  }) {
    try {
      const response = await fetch("/api/ai/analyze-bluetooth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("AI analysis failed")
      }

      const result = await response.json()
      return result.text
    } catch (error) {
      console.error("AI analysis failed:", error)
      throw error
    }
  }

  async suggestConnectionFix(error: string, context: any) {
    try {
      const response = await fetch("/api/ai/connection-fix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error, context }),
      })

      if (!response.ok) {
        return "Unable to get AI assistance at this time."
      }

      const result = await response.json()
      return result.text
    } catch (error) {
      console.error("AI troubleshooting failed:", error)
      return "Unable to get AI assistance at this time."
    }
  }

  async generateProtocolCommands(observedData: any[]) {
    try {
      const response = await fetch("/api/ai/generate-commands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ observedData }),
      })

      if (!response.ok) {
        throw new Error("AI code generation failed")
      }

      const result = await response.json()
      return result.text
    } catch (error) {
      console.error("AI code generation failed:", error)
      throw error
    }
  }

  async *streamAnalysis(data: any) {
    try {
      const response = await fetch("/api/ai/stream-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("AI streaming failed")
      }

      const reader = response.body?.getReader()
      if (!reader) return

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        yield chunk
      }
    } catch (error) {
      console.error("AI streaming failed:", error)
      throw error
    }
  }
}

export const aiAssistant = new MowerAIAssistant()
