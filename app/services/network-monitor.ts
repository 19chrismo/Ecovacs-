export interface NetworkCapture {
  timestamp: number
  method: string
  url: string
  headers: Record<string, string>
  body?: any
  response?: any
  status?: number
}

export class NetworkMonitor {
  private captures: NetworkCapture[] = []
  private isMonitoring = false
  private originalFetch: typeof fetch
  private originalXHROpen: typeof XMLHttpRequest.prototype.open
  private originalXHRSend: typeof XMLHttpRequest.prototype.send

  constructor() {
    this.originalFetch = window.fetch
    this.originalXHROpen = XMLHttpRequest.prototype.open
    this.originalXHRSend = XMLHttpRequest.prototype.send
  }

  startMonitoring() {
    if (this.isMonitoring) return

    this.isMonitoring = true
    console.log("Starting network monitoring...")

    // Intercept fetch requests
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString()
      const method = init?.method || "GET"
      const headers = (init?.headers as Record<string, string>) || {}

      const capture: NetworkCapture = {
        timestamp: Date.now(),
        method,
        url,
        headers,
        body: init?.body,
      }

      try {
        const response = await this.originalFetch(input, init)
        const clonedResponse = response.clone()

        capture.status = response.status
        capture.response = await clonedResponse.text()

        this.addCapture(capture)
        return response
      } catch (error) {
        capture.response = error
        this.addCapture(capture)
        throw error
      }
    }

    // Intercept XMLHttpRequest
    const self = this
    XMLHttpRequest.prototype.open = function (method: string, url: string | URL, ...args: any[]) {
      this._captureData = {
        method,
        url: url.toString(),
        timestamp: Date.now(),
      }
      return self.originalXHROpen.call(this, method, url, ...args)
    }

    XMLHttpRequest.prototype.send = function (body?: any) {
      if (this._captureData) {
        const capture: NetworkCapture = {
          ...this._captureData,
          headers: {},
          body,
        }

        this.addEventListener("load", () => {
          capture.status = this.status
          capture.response = this.responseText
          self.addCapture(capture)
        })

        this.addEventListener("error", () => {
          capture.response = "Network Error"
          self.addCapture(capture)
        })
      }

      return self.originalXHRSend.call(this, body)
    }
  }

  stopMonitoring() {
    if (!this.isMonitoring) return

    this.isMonitoring = false
    console.log("Stopping network monitoring...")

    // Restore original functions
    window.fetch = this.originalFetch
    XMLHttpRequest.prototype.open = this.originalXHROpen
    XMLHttpRequest.prototype.send = this.originalXHRSend
  }

  private addCapture(capture: NetworkCapture) {
    this.captures.push(capture)

    // Keep only last 500 captures
    if (this.captures.length > 500) {
      this.captures = this.captures.slice(-500)
    }

    // Log interesting captures
    if (this.isEcovacsRelated(capture)) {
      console.log("Ecovacs API call detected:", capture)
    }
  }

  private isEcovacsRelated(capture: NetworkCapture): boolean {
    const url = capture.url.toLowerCase()
    return url.includes("ecovacs") || url.includes("goat") || url.includes("mower") || url.includes("robot")
  }

  getCaptures(): NetworkCapture[] {
    return [...this.captures]
  }

  getEcovacsCaptures(): NetworkCapture[] {
    return this.captures.filter((c) => this.isEcovacsRelated(c))
  }

  analyzeApiPatterns() {
    const ecovacsCaptures = this.getEcovacsCaptures()
    const patterns = new Map<string, NetworkCapture[]>()

    ecovacsCaptures.forEach((capture) => {
      const pattern = `${capture.method} ${new URL(capture.url).pathname}`
      if (!patterns.has(pattern)) {
        patterns.set(pattern, [])
      }
      patterns.get(pattern)!.push(capture)
    })

    return Array.from(patterns.entries()).map(([pattern, captures]) => ({
      pattern,
      count: captures.length,
      examples: captures.slice(0, 3),
      lastSeen: Math.max(...captures.map((c) => c.timestamp)),
    }))
  }

  exportCaptures() {
    return {
      total: this.captures.length,
      ecovacsRelated: this.getEcovacsCaptures().length,
      captures: this.captures,
      patterns: this.analyzeApiPatterns(),
    }
  }
}

export const networkMonitor = new NetworkMonitor()
