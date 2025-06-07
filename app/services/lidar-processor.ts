export interface LidarPoint {
  angle: number
  distance: number
  intensity: number
  timestamp: number
}

export interface LidarScan {
  points: LidarPoint[]
  timestamp: number
  scanId: string
}

export interface Obstacle {
  id: string
  type: "static" | "dynamic" | "unknown"
  position: { x: number; y: number }
  size: { width: number; height: number }
  confidence: number
  lastSeen: number
}

export class LidarProcessor {
  private scans: LidarScan[] = []
  private obstacles: Obstacle[] = []
  private mapData: number[][] = []
  private mapResolution = 0.05 // 5cm per pixel
  private mapWidth = 1000
  private mapHeight = 1000

  constructor() {
    this.initializeMap()
  }

  private initializeMap() {
    this.mapData = Array(this.mapHeight)
      .fill(null)
      .map(() => Array(this.mapWidth).fill(0))
  }

  processLidarData(rawData: Uint8Array): LidarScan {
    const points: LidarPoint[] = []
    const scanId = `scan_${Date.now()}`

    // Parse LIDAR data (adjust based on actual GX 600 protocol)
    for (let i = 0; i < rawData.length; i += 6) {
      if (i + 5 < rawData.length) {
        const angle = ((rawData[i] << 8) | rawData[i + 1]) / 100 // degrees
        const distance = ((rawData[i + 2] << 8) | rawData[i + 3]) / 10 // mm to cm
        const intensity = rawData[i + 4]

        if (distance > 0 && distance < 800) {
          // Valid range 0-8m
          points.push({
            angle,
            distance,
            intensity,
            timestamp: Date.now(),
          })
        }
      }
    }

    const scan: LidarScan = {
      points,
      timestamp: Date.now(),
      scanId,
    }

    this.scans.push(scan)
    this.updateMap(scan)
    this.detectObstacles(scan)

    // Keep only last 100 scans
    if (this.scans.length > 100) {
      this.scans = this.scans.slice(-100)
    }

    return scan
  }

  private updateMap(scan: LidarScan) {
    scan.points.forEach((point) => {
      const x = Math.round((point.distance * Math.cos((point.angle * Math.PI) / 180)) / this.mapResolution)
      const y = Math.round((point.distance * Math.sin((point.angle * Math.PI) / 180)) / this.mapResolution)

      const mapX = Math.floor(this.mapWidth / 2 + x)
      const mapY = Math.floor(this.mapHeight / 2 + y)

      if (mapX >= 0 && mapX < this.mapWidth && mapY >= 0 && mapY < this.mapHeight) {
        this.mapData[mapY][mapX] = Math.min(255, this.mapData[mapY][mapX] + 1)
      }
    })
  }

  private detectObstacles(scan: LidarScan) {
    const clusters = this.clusterPoints(scan.points)

    clusters.forEach((cluster) => {
      if (cluster.length > 3) {
        // Minimum points for obstacle
        const centerX =
          cluster.reduce((sum, p) => sum + p.distance * Math.cos((p.angle * Math.PI) / 180), 0) / cluster.length
        const centerY =
          cluster.reduce((sum, p) => sum + p.distance * Math.sin((p.angle * Math.PI) / 180), 0) / cluster.length

        const obstacle: Obstacle = {
          id: `obs_${Date.now()}_${Math.random()}`,
          type: this.classifyObstacle(cluster),
          position: { x: centerX, y: centerY },
          size: this.calculateObstacleSize(cluster),
          confidence: Math.min(1, cluster.length / 10),
          lastSeen: Date.now(),
        }

        this.obstacles.push(obstacle)
      }
    })

    // Remove old obstacles
    this.obstacles = this.obstacles.filter((obs) => Date.now() - obs.lastSeen < 5000)
  }

  private clusterPoints(points: LidarPoint[]): LidarPoint[][] {
    const clusters: LidarPoint[][] = []
    const used = new Set<number>()

    points.forEach((point, index) => {
      if (used.has(index)) return

      const cluster = [point]
      used.add(index)

      // Find nearby points
      points.forEach((otherPoint, otherIndex) => {
        if (used.has(otherIndex)) return

        const angleDiff = Math.abs(point.angle - otherPoint.angle)
        const distanceDiff = Math.abs(point.distance - otherPoint.distance)

        if (angleDiff < 5 && distanceDiff < 20) {
          // 5 degrees, 20cm threshold
          cluster.push(otherPoint)
          used.add(otherIndex)
        }
      })

      if (cluster.length > 1) {
        clusters.push(cluster)
      }
    })

    return clusters
  }

  private classifyObstacle(cluster: LidarPoint[]): "static" | "dynamic" | "unknown" {
    // Simple classification - can be enhanced with ML
    const avgDistance = cluster.reduce((sum, p) => sum + p.distance, 0) / cluster.length

    if (avgDistance < 50) return "dynamic" // Likely moving object
    if (cluster.length > 10) return "static" // Large, likely static
    return "unknown"
  }

  private calculateObstacleSize(cluster: LidarPoint[]): { width: number; height: number } {
    const distances = cluster.map((p) => p.distance)
    const angles = cluster.map((p) => p.angle)

    const minDistance = Math.min(...distances)
    const maxDistance = Math.max(...distances)
    const angleSpan = Math.max(...angles) - Math.min(...angles)

    return {
      width: maxDistance - minDistance,
      height: (angleSpan * Math.PI * minDistance) / 180,
    }
  }

  getLatestScan(): LidarScan | null {
    return this.scans.length > 0 ? this.scans[this.scans.length - 1] : null
  }

  getObstacles(): Obstacle[] {
    return [...this.obstacles]
  }

  getMapData(): number[][] {
    return this.mapData
  }

  generatePath(start: { x: number; y: number }, end: { x: number; y: number }): { x: number; y: number }[] {
    // A* pathfinding implementation
    return this.aStar(start, end)
  }

  private aStar(start: { x: number; y: number }, end: { x: number; y: number }): { x: number; y: number }[] {
    // Simplified A* implementation
    const path: { x: number; y: number }[] = []

    // This would be a full A* implementation in production
    // For now, return a simple straight line
    const steps = 10
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      path.push({
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
      })
    }

    return path
  }
}

export const lidarProcessor = new LidarProcessor()
