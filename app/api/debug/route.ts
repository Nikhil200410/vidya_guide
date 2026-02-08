import { NextResponse } from "next/server"
import { hasOpenAI } from "@/lib/openai"

export async function GET() {
  try {
    return NextResponse.json({ hasOpenAI: hasOpenAI() })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
