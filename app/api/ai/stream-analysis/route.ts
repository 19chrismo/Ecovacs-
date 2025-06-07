import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const prompt = `
    Provide real-time analysis of this mower data stream:
    ${JSON.stringify(data, null, 2)}

    Stream your analysis as you process the data.
    `

    const result = streamText({
      model: openai("gpt-4o"),
      prompt,
      maxTokens: 1500,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("AI streaming failed:", error)
    return new Response("AI streaming failed", { status: 500 })
  }
}
