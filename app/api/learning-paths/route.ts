import { NextRequest, NextResponse } from "next/server"
import { getLearningPathsFromAI } from "@/lib/openai"

export async function GET(req: NextRequest) {
  const careerGoal = req.nextUrl.searchParams.get("careerGoal") ?? undefined
  const data = await getLearningPathsFromAI(careerGoal)
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { careerGoal } = body as { careerGoal?: string }
    const data = await getLearningPathsFromAI(careerGoal)
    return NextResponse.json(data)
  } catch (err) {
    console.error("Learning paths error:", err)
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to get learning paths" },
      { status: 500 }
    )
  }
}
