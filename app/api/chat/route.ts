import { NextRequest, NextResponse } from "next/server"
import { chatWithAI } from "@/lib/openai"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { messages } = (body || {}) as { messages?: { role: string; content: string }[] }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { message: "Messages array is required" },
        { status: 400 }
      )
    }

    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== "user") {
      return NextResponse.json(
        { message: "Last message must be from user" },
        { status: 400 }
      )
    }

    const reply = await chatWithAI(
      messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content }))
    )

    return NextResponse.json({ message: reply })
  } catch (err) {
    console.error("Chat error:", err)
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Chat failed" },
      { status: 500 }
    )
  }
}
