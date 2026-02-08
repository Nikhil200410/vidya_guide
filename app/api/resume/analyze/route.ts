import { NextRequest, NextResponse } from "next/server"
import { extractTextFromFile } from "@/lib/parse-resume"
import { analyzeResumeWithAI } from "@/lib/openai"
import type { ResumeAnalysisResult } from "@/lib/types"

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "No file provided. Please upload a PDF, DOCX, or TXT file." },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith(".txt")) {
      return NextResponse.json(
        { message: "Invalid file type. Supports PDF, DOCX, and TXT only." },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { message: "File too large. Maximum size is 5MB." },
        { status: 400 }
      )
    }

    const buffer = await file.arrayBuffer()
    const text = await extractTextFromFile(buffer, file.type, file.name)

    if (!text.trim()) {
      return NextResponse.json(
        { message: "Could not extract text from the file. Ensure it's a valid PDF, DOCX, or TXT." },
        { status: 400 }
      )
    }

    const result = await analyzeResumeWithAI(text)

    // Log when fallback analysis is returned so developers can debug
    if ((result as any).usedFallback) {
      console.warn("Resume analysis returned fallback result (OpenAI call likely failed or API key issue).")
    }

    return NextResponse.json({
      ...result,
      resumeText: text.slice(0, 15000),
    } as ResumeAnalysisResult & { resumeText?: string })
  } catch (err) {
    console.error("Resume analysis error:", err)
    const message =
      err instanceof Error ? err.message : "Analysis failed. Please try a different file."
    return NextResponse.json({ message }, { status: 500 })
  }
}
