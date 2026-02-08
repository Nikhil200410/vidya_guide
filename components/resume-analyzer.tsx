"use client"

import React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useResumeAnalysis } from "@/hooks/use-api"
import { useAppContext } from "@/lib/context"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
} from "lucide-react"

interface AnalysisResult {
  overallScore: number
  categories: {
    name: string
    score: number
    status: "good" | "warning" | "critical"
    feedback: string
  }[]
  keywords: string[]
  suggestions: string[]
  usedFallback?: boolean
}

export function ResumeAnalyzer() {
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const ctx = useAppContext()
  const { result, isLoading, error, analyze } = useResumeAnalysis((data) => {
    const d = data as { resumeText?: string; overallScore: number; categories: unknown[]; keywords: string[]; suggestions: string[] }
    ctx?.setResumeData(d.resumeText ?? null, {
      overallScore: d.overallScore,
      categories: d.categories,
      keywords: d.keywords,
      suggestions: d.suggestions,
    })
  })

  const startAnalysis = useCallback(
    async (file?: File) => {
      setProgress(0)
      if (file) {
        const interval = setInterval(() => {
          setProgress((p) => (p >= 90 ? p : p + 5))
        }, 100)
        try {
          await analyze(file)
          setProgress(100)
        } finally {
          clearInterval(interval)
        }
      }
    },
    [analyze]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) startAnalysis(file)
    },
    [startAnalysis]
  )

  const statusIcon = (status: string) => {
    if (status === "good") return <CheckCircle2 className="h-4 w-4 text-chart-3" />
    if (status === "warning") return <AlertTriangle className="h-4 w-4 text-chart-4" />
    return <XCircle className="h-4 w-4 text-destructive" />
  }

  const statusColor = (status: string) => {
    if (status === "good") return "text-chart-3"
    if (status === "warning") return "text-chart-4"
    return "text-destructive"
  }

  const progressColor = (score: number) => {
    if (score >= 80) return "bg-chart-3"
    if (score >= 60) return "bg-chart-4"
    return "bg-destructive"
  }

  return (
    <section id="resume" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
            Resume Analysis
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            AI-Powered Resume Evaluation
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Get instant, detailed feedback on your resume with scoring across
            multiple dimensions and actionable improvement tips.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Upload Area */}
          <div className="flex flex-col gap-6">
            <div
              className={`relative flex min-h-[280px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {isLoading ? (
                <div className="flex w-full flex-col items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-7 w-7 animate-pulse text-primary" />
                  </div>
                  <p className="font-heading text-lg font-semibold text-foreground">
                    Analyzing Your Resume...
                  </p>
                  <div className="w-full max-w-xs">
                    <Progress value={progress} className="h-2" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {progress < 30
                      ? "Parsing document structure..."
                      : progress < 60
                        ? "Evaluating keyword optimization..."
                        : progress < 90
                          ? "Running ATS compatibility check..."
                          : "Generating recommendations..."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                    <Upload className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <p className="mb-2 font-heading text-lg font-semibold text-foreground">
                    Drop Your Resume Here
                  </p>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Supports PDF, DOCX, and TXT formats
                  </p>
                  <input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) startAnalysis(f)
                    }}
                  />
                  <Button
                    onClick={() => document.getElementById("resume-upload")?.click()}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Upload & Analyze
                  </Button>
                </>
              )}
            </div>

            {/* Detected Keywords */}
            {result && (
              <div className="animate-slide-up rounded-xl border border-border bg-card p-6">
                <h3 className="mb-3 font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
                  Detected Skills & Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="flex flex-col gap-6">
            {result ? (
              <>
                {result.usedFallback && (
                  <div className="mb-4 rounded-lg border border-yellow-400/30 bg-yellow-50/40 px-4 py-3 text-sm text-yellow-700">
                    Groq API call failed — showing fallback analysis. Ensure GROQ_API_KEY is valid in .env and restart the dev server for personalized AI results.
                  </div>
                )}
                {/* Score Ring */}
                <div className="animate-slide-up flex items-center gap-6 rounded-xl border border-border bg-card p-6">
                  <div className="relative flex h-28 w-28 flex-shrink-0 items-center justify-center">
                    <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="hsl(var(--secondary))"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(result.overallScore / 100) * 264} 264`}
                      />
                    </svg>
                    <span className="absolute font-heading text-2xl font-bold text-foreground">
                      {result.overallScore}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-foreground">
                      Resume Score
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Your resume scores above average. Focus on impact statements
                      and keyword optimization to reach 85+.
                    </p>
                  </div>
                </div>

                {/* Category Scores */}
                <div className="animate-slide-up rounded-xl border border-border bg-card p-6" style={{ animationDelay: "0.1s" }}>
                  <h3 className="mb-4 font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
                    Detailed Breakdown
                  </h3>
                  <div className="flex flex-col gap-4">
                    {result.categories.map((cat) => (
                      <div key={cat.name}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {statusIcon(cat.status)}
                            <span className="text-sm font-medium text-foreground">
                              {cat.name}
                            </span>
                          </div>
                          <span className={`text-sm font-bold ${statusColor(cat.status)}`}>
                            {cat.score}%
                          </span>
                        </div>
                        <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${progressColor(cat.score)}`}
                            style={{ width: `${cat.score}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{cat.feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="animate-slide-up rounded-xl border border-border bg-card p-6" style={{ animationDelay: "0.2s" }}>
                  <h3 className="mb-3 font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
                    Top Suggestions
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {i + 1}
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border bg-card p-12">
                <div className="text-center">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
                  <p className="font-heading text-lg font-semibold text-muted-foreground/50">
                    Upload a resume to see analysis
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground/30">
                    Your detailed breakdown will appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
