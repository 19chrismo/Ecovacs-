export interface PathPoint {
  x: number
  y: number
  heading: number
  speed: number
  action?: "cut" | "move" | "turn" | "edge"
}

export interface MowingPattern {
  id: string
  name: string
  description: string
  efficiency: number
  grassQuality: number
  timeEstimate: number
}

export interface Zone {
  id: string
  name: string
  boundary: { x: number; y: number }[]
  obstacles: { x: number; y: number; radius: number }[]
  grassType: "fine" | "coarse" | "mixed"
  priority: number
  lastMowed: number
}

export class PathPlanner {
  private patterns: MowingPattern[] = [
    {
      id: "parallel",
      name: "Parallel Lines",
      description: "Systematic parallel cutting for even coverage",
      efficiency: 95,
      grassQuality: 90,
      timeEstimate: 1.0,
    },
    {
      id: "spiral",
      name: "Spiral Pattern",
      description: "Spiral from outside to inside",
      efficiency: 85,
      grassQuality: 85,
      timeEstimate: 1.1,
    },
    {
      id: "random",
      name: "Random Pattern",
      description: "Random movement for natural look",
      efficiency: 70,
      grassQuality: 95,
      timeEstimate: 1.3,
    },
    {
      id: "edge_first",
      name: "Edge First",
      description: "Cut edges first, then fill interior",
      efficiency: 90,
      grassQuality: 95,
      timeEstimate: 1.2,
    },
    {
      id: "checkerboard",
      name: "Checkerboard",
      description: "Alternating pattern for stripe effect",
      efficiency: 88,
      grassQuality: 92,
      timeEstimate: 1.15,
    },
  ]

  generatePath(zone: Zone, pattern: string, cuttingWidth = 20): PathPoint[] {
    switch (pattern) {
      case "parallel":
        return this.generateParallelPath(zone, cuttingWidth)
      case "spiral":
        return this.generateSpiralPath(zone, cuttingWidth)
      case "random":
        return this.generateRandomPath(zone, cuttingWidth)
      case "edge_first":
        return this.generateEdgeFirstPath(zone, cuttingWidth)
      case "checkerboard":
        return this.generateCheckerboardPath(zone, cuttingWidth)
      default:
        return this.generateParallelPath(zone, cuttingWidth)
    }
  }

  private generateParallelPath(zone: Zone, cuttingWidth: number): PathPoint[] {
    const path: PathPoint[] = []
    const bounds = this.getZoneBounds(zone)

    let y = bounds.minY + cuttingWidth / 2
    let direction = 1 // 1 for left-to-right, -1 for right-to-left

    while (y < bounds.maxY) {
      const startX = direction > 0 ? bounds.minX : bounds.maxX
      const endX = direction > 0 ? bounds.maxX : bounds.minX

      // Add turn at start of line
      if (path.length > 0) {
        path.push({
          x: startX,
          y: y - cuttingWidth / 2,
          heading: direction > 0 ? 0 : 180,
          speed: 30,
          action: "turn",
        })
      }

      // Add cutting line
      const steps = Math.ceil(Math.abs(endX - startX) / 10) // 10cm steps
      for (let i = 0; i <= steps; i++) {
        const x = startX + (endX - startX) * (i / steps)

        if (this.isPointInZone({ x, y }, zone) && !this.hasObstacle({ x, y }, zone)) {
          path.push({
            x,
            y,
            heading: direction > 0 ? 90 : 270,
            speed: 50,
            action: "cut",
          })
        }
      }

      y += cuttingWidth
      direction *= -1
    }

    return this.optimizePath(path)
  }

  private generateSpiralPath(zone: Zone, cuttingWidth: number): PathPoint[] {
    const path: PathPoint[] = []
    const bounds = this.getZoneBounds(zone)
    const centerX = (bounds.minX + bounds.maxX) / 2
    const centerY = (bounds.minY + bounds.maxY) / 2

    let radius = Math.min(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) / 2
    const radiusStep = cuttingWidth

    while (radius > radiusStep) {
      const circumference = 2 * Math.PI * radius
      const steps = Math.ceil(circumference / 10) // 10cm steps

      for (let i = 0; i < steps; i++) {
        const angle = (i / steps) * 2 * Math.PI
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)

        if (this.isPointInZone({ x, y }, zone) && !this.hasObstacle({ x, y }, zone)) {
          path.push({
            x,
            y,
            heading: (angle * 180) / Math.PI + 90,
            speed: 45,
            action: "cut",
          })
        }
      }

      radius -= radiusStep
    }

    return this.optimizePath(path)
  }

  private generateRandomPath(zone: Zone, cuttingWidth: number): PathPoint[] {
    const path: PathPoint[] = []
    const bounds = this.getZoneBounds(zone)
    const targetPoints = Math.ceil(
      ((bounds.maxX - bounds.minX) * (bounds.maxY - bounds.minY)) / (cuttingWidth * cuttingWidth),
    )

    for (let i = 0; i < targetPoints; i++) {
      let attempts = 0
      let point: { x: number; y: number } | null = null

      while (attempts < 50 && !point) {
        const x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX)
        const y = bounds.minY + Math.random() * (bounds.maxY - bounds.minY)

        if (this.isPointInZone({ x, y }, zone) && !this.hasObstacle({ x, y }, zone)) {
          point = { x, y }
        }
        attempts++
      }

      if (point) {
        const prevPoint = path[path.length - 1]
        const heading = prevPoint ? (Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x) * 180) / Math.PI : 0

        path.push({
          x: point.x,
          y: point.y,
          heading,
          speed: 40,
          action: "cut",
        })
      }
    }

    return this.optimizePath(path)
  }

  private generateEdgeFirstPath(zone: Zone, cuttingWidth: number): PathPoint[] {
    const edgePath = this.generateEdgePath(zone, cuttingWidth)
    const interiorPath = this.generateParallelPath(zone, cuttingWidth)

    return [...edgePath, ...interiorPath]
  }

  private generateEdgePath(zone: Zone, cuttingWidth: number): PathPoint[] {
    const path: PathPoint[] = []
    const boundary = zone.boundary

    for (let i = 0; i < boundary.length; i++) {
      const current = boundary[i]
      const next = boundary[(i + 1) % boundary.length]

      const dx = next.x - current.x
      const dy = next.y - current.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const steps = Math.ceil(distance / 10) // 10cm steps

      for (let j = 0; j <= steps; j++) {
        const t = j / steps
        const x = current.x + dx * t
        const y = current.y + dy * t
        const heading = (Math.atan2(dy, dx) * 180) / Math.PI

        path.push({
          x,
          y,
          heading,
          speed: 35,
          action: "edge",
        })
      }
    }

    return path
  }

  private generateCheckerboardPath(zone: Zone, cuttingWidth: number): PathPoint[] {
    const path: PathPoint[] = []
    const bounds = this.getZoneBounds(zone)
    const squareSize = cuttingWidth * 4

    for (let y = bounds.minY; y < bounds.maxY; y += squareSize) {
      for (let x = bounds.minX; x < bounds.maxX; x += squareSize) {
        const squareIndex = Math.floor((x - bounds.minX) / squareSize) + Math.floor((y - bounds.minY) / squareSize)

        if (squareIndex % 2 === 0) {
          // Cut this square
          const squarePath = this.generateSquarePath(
            { x, y },
            { x: x + squareSize, y: y + squareSize },
            zone,
            cuttingWidth,
          )
          path.push(...squarePath)
        }
      }
    }

    return this.optimizePath(path)
  }

  private generateSquarePath(
    topLeft: { x: number; y: number },
    bottomRight: { x: number; y: number },
    zone: Zone,
    cuttingWidth: number,
  ): PathPoint[] {
    const path: PathPoint[] = []
    let y = topLeft.y + cuttingWidth / 2
    let direction = 1

    while (y < bottomRight.y) {
      const startX = direction > 0 ? topLeft.x : bottomRight.x
      const endX = direction > 0 ? bottomRight.x : topLeft.x

      const steps = Math.ceil(Math.abs(endX - startX) / 10)
      for (let i = 0; i <= steps; i++) {
        const x = startX + (endX - startX) * (i / steps)

        if (this.isPointInZone({ x, y }, zone) && !this.hasObstacle({ x, y }, zone)) {
          path.push({
            x,
            y,
            heading: direction > 0 ? 90 : 270,
            speed: 50,
            action: "cut",
          })
        }
      }

      y += cuttingWidth
      direction *= -1
    }

    return path
  }

  private getZoneBounds(zone: Zone): { minX: number; maxX: number; minY: number; maxY: number } {
    const xs = zone.boundary.map((p) => p.x)
    const ys = zone.boundary.map((p) => p.y)

    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    }
  }

  private isPointInZone(point: { x: number; y: number }, zone: Zone): boolean {
    // Ray casting algorithm for point-in-polygon
    let inside = false
    const boundary = zone.boundary

    for (let i = 0, j = boundary.length - 1; i < boundary.length; j = i++) {
      if (
        boundary[i].y > point.y !== boundary[j].y > point.y &&
        point.x <
          ((boundary[j].x - boundary[i].x) * (point.y - boundary[i].y)) / (boundary[j].y - boundary[i].y) +
            boundary[i].x
      ) {
        inside = !inside
      }
    }

    return inside
  }

  private hasObstacle(point: { x: number; y: number }, zone: Zone): boolean {
    return zone.obstacles.some((obstacle) => {
      const dx = point.x - obstacle.x
      const dy = point.y - obstacle.y
      return Math.sqrt(dx * dx + dy * dy) < obstacle.radius
    })
  }

  private optimizePath(path: PathPoint[]): PathPoint[] {
    // Remove redundant points and optimize turns
    const optimized: PathPoint[] = []

    for (let i = 0; i < path.length; i++) {
      const current = path[i]
      const prev = optimized[optimized.length - 1]

      if (!prev || this.shouldKeepPoint(prev, current, path[i + 1])) {
        optimized.push(current)
      }
    }

    return optimized
  }

  private shouldKeepPoint(prev: PathPoint, current: PathPoint, next?: PathPoint): boolean {
    if (!next) return true

    // Keep points that change direction significantly
    const angle1 = Math.atan2(current.y - prev.y, current.x - prev.x)
    const angle2 = Math.atan2(next.y - current.y, next.x - current.x)
    const angleDiff = Math.abs(angle1 - angle2)

    return angleDiff > 0.1 || current.action !== prev.action
  }

  getPatterns(): MowingPattern[] {
    return [...this.patterns]
  }

  estimateTime(path: PathPoint[]): number {
    let totalTime = 0

    for (let i = 1; i < path.length; i++) {
      const prev = path[i - 1]
      const current = path[i]

      const distance = Math.sqrt(Math.pow(current.x - prev.x, 2) + Math.pow(current.y - prev.y, 2))

      const avgSpeed = (prev.speed + current.speed) / 2
      totalTime += distance / (avgSpeed / 3.6) // Convert km/h to m/s
    }

    return totalTime / 60 // Return in minutes
  }
}

export const pathPlanner = new PathPlanner()
