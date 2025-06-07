// Real Bluetooth service for GOAT-0050 mower
export class MowerBluetoothService {
  private device: BluetoothDevice | null = null
  private server: BluetoothRemoteGATTServer | null = null
  private characteristics: Map<string, BluetoothRemoteGATTCharacteristic> = new Map()

  // Actual device information from your mower
  private readonly DEVICE_NAME = "GOAT-0050"
  private readonly DEVICE_SERIAL = "E03C35162F09HVXP0050"
  private readonly WIFI_ADDRESS = "64:82:14:1D:37:AE"
  private readonly BLUETOOTH_ADDRESS = "64:82:14:1D:37:AF"
  private readonly FIRMWARE_VERSION = "1.2.120"

  // BLE Service UUIDs from your screenshots
  private readonly SERVICES = {
    GENERIC_ACCESS: "1800",
    GENERIC_ATTRIBUTE: "1801",
    UNKNOWN_SERVICE: "8888",
  }

  // BLE Characteristic UUIDs from your screenshots
  private readonly CHARACTERISTICS = {
    NOTIFY_INDICATE: "FF01",
    BROADCAST_WRITE: "FF02",
    CLIENT_CONFIG: "2902",
  }

  async connect(): Promise<boolean> {
    try {
      console.log("Scanning for GOAT-0050 mower...")

      // Request device with actual service UUIDs
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ name: this.DEVICE_NAME }, { namePrefix: "GOAT" }],
        optionalServices: [
          this.SERVICES.GENERIC_ACCESS,
          this.SERVICES.GENERIC_ATTRIBUTE,
          this.SERVICES.UNKNOWN_SERVICE,
        ],
      })

      console.log("Device found:", this.device.name)

      // Connect to GATT server
      this.server = await this.device.gatt?.connect()
      if (!this.server) {
        throw new Error("Failed to connect to GATT server")
      }

      console.log("Connected to GATT server")

      // Get the main service (8888 from your screenshots)
      const service = await this.server.getPrimaryService(this.SERVICES.UNKNOWN_SERVICE)
      console.log("Got primary service:", service.uuid)

      // Get characteristics
      const notifyChar = await service.getCharacteristic(this.CHARACTERISTICS.NOTIFY_INDICATE)
      const writeChar = await service.getCharacteristic(this.CHARACTERISTICS.BROADCAST_WRITE)

      this.characteristics.set("notify", notifyChar)
      this.characteristics.set("write", writeChar)

      // Start notifications for sensor data
      await notifyChar.startNotifications()
      notifyChar.addEventListener("characteristicvaluechanged", this.handleNotification.bind(this))

      console.log("Bluetooth connection established successfully")
      return true
    } catch (error) {
      console.error("Bluetooth connection failed:", error)
      return false
    }
  }

  async disconnect(): Promise<void> {
    if (this.device?.gatt?.connected) {
      await this.device.gatt.disconnect()
      console.log("Disconnected from mower")
    }
    this.device = null
    this.server = null
    this.characteristics.clear()
  }

  private handleNotification(event: Event): void {
    const target = event.target as BluetoothRemoteGATTCharacteristic
    const value = target.value

    if (value) {
      // Parse the incoming data based on your mower's protocol
      const data = new Uint8Array(value.buffer)
      this.parseIncomingData(data)
    }
  }

  private parseIncomingData(data: Uint8Array): void {
    // Parse real mower data - you'll need to reverse engineer the protocol
    // This is a basic example structure
    try {
      const dataView = new DataView(data.buffer)

      // Example parsing (adjust based on actual protocol)
      if (data.length >= 8) {
        const battery = dataView.getUint8(0)
        const status = dataView.getUint8(1)
        const temperature = dataView.getInt16(2, true) / 100
        const position_x = dataView.getInt16(4, true)
        const position_y = dataView.getInt16(6, true)

        // Dispatch custom event with real data
        window.dispatchEvent(
          new CustomEvent("mowerDataUpdate", {
            detail: {
              battery,
              status,
              temperature,
              position: { x: position_x, y: position_y },
              timestamp: Date.now(),
            },
          }),
        )
      }
    } catch (error) {
      console.error("Error parsing mower data:", error)
    }
  }

  async sendCommand(command: string, data?: Uint8Array): Promise<boolean> {
    const writeChar = this.characteristics.get("write")
    if (!writeChar) {
      console.error("Write characteristic not available")
      return false
    }

    try {
      let commandData: Uint8Array

      switch (command) {
        case "start":
          commandData = new Uint8Array([0x01, 0x01])
          break
        case "stop":
          commandData = new Uint8Array([0x01, 0x00])
          break
        case "pause":
          commandData = new Uint8Array([0x01, 0x02])
          break
        case "return_home":
          commandData = new Uint8Array([0x02, 0x01])
          break
        case "emergency_stop":
          commandData = new Uint8Array([0xff, 0x00])
          break
        case "blade_on":
          commandData = new Uint8Array([0x03, 0x01])
          break
        case "blade_off":
          commandData = new Uint8Array([0x03, 0x00])
          break
        case "manual_control":
          commandData = data || new Uint8Array([0x04, 0x00, 0x00])
          break
        default:
          console.error("Unknown command:", command)
          return false
      }

      await writeChar.writeValueWithoutResponse(commandData)
      console.log(`Command sent: ${command}`)
      return true
    } catch (error) {
      console.error("Failed to send command:", error)
      return false
    }
  }

  async sendJoystickData(x: number, y: number, speed: number): Promise<boolean> {
    // Convert joystick position to mower movement commands
    const normalizedX = Math.max(-127, Math.min(127, Math.round((x * 127) / 100)))
    const normalizedY = Math.max(-127, Math.min(127, Math.round((y * 127) / 100)))
    const normalizedSpeed = Math.max(0, Math.min(255, Math.round((speed * 255) / 100)))

    const joystickData = new Uint8Array([
      0x04, // Manual control command
      normalizedX & 0xff,
      normalizedY & 0xff,
      normalizedSpeed & 0xff,
    ])

    return await this.sendCommand("manual_control", joystickData)
  }

  getDeviceInfo() {
    return {
      name: this.DEVICE_NAME,
      serial: this.DEVICE_SERIAL,
      wifiAddress: this.WIFI_ADDRESS,
      bluetoothAddress: this.BLUETOOTH_ADDRESS,
      firmwareVersion: this.FIRMWARE_VERSION,
      connected: this.device?.gatt?.connected || false,
    }
  }

  isConnected(): boolean {
    return this.device?.gatt?.connected || false
  }
}

// Singleton instance
export const mowerBluetooth = new MowerBluetoothService()
