import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const prompt = `
    Analyze this Bluetooth Low Energy data from an Ecovacs GOAT-0050 robotic mower:

    Device Information:
    ${JSON.stringify(data.deviceInfo, null, 2)}

    BLE Services:
    ${JSON.stringify(data.services, null, 2)}

    BLE Characteristics:
    ${JSON.stringify(data.characteristics, null, 2)}

    Recent Packets (last 10):
    ${JSON.stringify(data.packets.slice(-10), null, 2)}

    Please analyze this data and provide:
    1. Likely command structure and protocol
    2. Potential control commands (start, stop, direction, etc.)
    3. Data parsing suggestions for sensor readings
    4. Security considerations
    5. Recommended next steps for reverse engineering

    Focus on practical implementation for controlling the mower.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 2000,
    })

    return NextResponse.json({ text })
  } catch (error) {
    console.error("AI analysis failed:", error)
    return NextResponse.json({ error: "AI analysis failed" }, { status: 500 })
  }
}
