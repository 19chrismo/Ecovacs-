import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { observedData } = await request.json()

    const prompt = `
    Based on this observed Bluetooth data from an Ecovacs mower, generate likely command structures:

    Observed Data:
    ${JSON.stringify(observedData, null, 2)}

    Generate JavaScript code for:
    1. Command functions (start, stop, pause, return home)
    2. Data parsing functions
    3. Status monitoring
    4. Error handling

    Provide working TypeScript/JavaScript code.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 2000,
    })

    return NextResponse.json({ text })
  } catch (error) {
    console.error("AI code generation failed:", error)
    return NextResponse.json({ error: "AI code generation failed" }, { status: 500 })
  }
}
