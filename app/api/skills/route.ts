import { NextRequest, NextResponse } from "next/server"
import { getSkillsFromAI } from "@/lib/openai"

export async function GET(req: NextRequest) {
  const resumeText = req.nextUrl.searchParams.get("resumeText") ?? undefined
  const data = await getSkillsFromAI(resumeText)
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { resumeText } = body as { resumeText?: string }
    const data = await getSkillsFromAI(resumeText)
    return NextResponse.json(data)
  } catch (err) {
    console.error("Skills error:", err)
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to get skills" },
      { status: 500 }
    )
  }
}
