import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { error, context } = await request.json()

    const prompt = `
    Help troubleshoot this Bluetooth connection issue with an Ecovacs GOAT-0050 mower:

    Error: ${error}
    
    Context:
    ${JSON.stringify(context, null, 2)}

    Provide specific troubleshooting steps and potential solutions.
    Include code examples if applicable.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 1000,
    })

    return NextResponse.json({ text })
  } catch (error) {
    console.error("AI troubleshooting failed:", error)
    return NextResponse.json({ error: "AI troubleshooting failed" }, { status: 500 })
  }
}
