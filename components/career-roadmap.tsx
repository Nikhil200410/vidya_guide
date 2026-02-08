"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCareerPaths } from "@/hooks/use-api"
import { useAppContext } from "@/lib/context"
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  MapPin,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react"

interface CareerPath {
  id: string
  title: string
  match: number
  salary: string
  growth: string
  locations: string
  description: string
  requiredSkills: string[]
  timeline: { phase: string; duration: string; tasks: string[] }[]
}

const defaultCareerPaths: CareerPath[] = [
  {
    id: "fullstack",
    title: "Full-Stack Developer",
    match: 92,
    salary: "$95K - $145K",
    growth: "+25% demand",
    locations: "Remote / SF / NYC",
    description:
      "Build end-to-end web applications combining your strong frontend skills with growing backend knowledge.",
    requiredSkills: ["React", "Node.js", "PostgreSQL", "TypeScript", "AWS"],
    timeline: [
      {
        phase: "Foundation",
        duration: "0-3 months",
        tasks: ["Master Node.js & Express", "Learn PostgreSQL", "Build 2 full-stack projects"],
      },
      {
        phase: "Growth",
        duration: "3-6 months",
        tasks: ["Learn Docker & CI/CD", "Study system design", "Contribute to open source"],
      },
      {
        phase: "Ready",
        duration: "6-9 months",
        tasks: ["Build portfolio project", "Prep for interviews", "Apply to target companies"],
      },
    ],
  },
  {
    id: "frontend-lead",
    title: "Frontend Tech Lead",
    match: 85,
    salary: "$120K - $175K",
    growth: "+18% demand",
    locations: "Remote / Austin / Seattle",
    description:
      "Leverage your strong React and JavaScript skills to lead frontend architecture decisions and mentor teams.",
    requiredSkills: ["React", "TypeScript", "Architecture", "Mentoring", "Performance"],
    timeline: [
      {
        phase: "Foundation",
        duration: "0-4 months",
        tasks: ["Deep-dive into architecture patterns", "Learn advanced performance optimization", "Start mentoring juniors"],
      },
      {
        phase: "Growth",
        duration: "4-8 months",
        tasks: ["Lead a medium-scale project", "Study management frameworks", "Build tech talks"],
      },
      {
        phase: "Ready",
        duration: "8-12 months",
        tasks: ["Demonstrate team leadership", "Build case studies", "Target senior/lead roles"],
      },
    ],
  },
  {
    id: "ml-engineer",
    title: "ML Engineer",
    match: 58,
    salary: "$110K - $180K",
    growth: "+35% demand",
    locations: "Remote / SF / Boston",
    description:
      "Transition into machine learning by building on your Python foundation and problem-solving skills.",
    requiredSkills: ["Python", "TensorFlow", "Statistics", "MLOps", "Data Pipelines"],
    timeline: [
      {
        phase: "Foundation",
        duration: "0-6 months",
        tasks: ["Complete ML specialization course", "Learn statistics deeply", "Build 5 ML projects"],
      },
      {
        phase: "Growth",
        duration: "6-12 months",
        tasks: ["Study MLOps & deployment", "Kaggle competitions", "Research paper reading"],
      },
      {
        phase: "Ready",
        duration: "12-18 months",
        tasks: ["Build production ML system", "Contribute to ML open source", "Target ML engineer roles"],
      },
    ],
  },
]

function MatchRing({ value }: { value: number }) {
  const color = value >= 80 ? "var(--chart-3)" : value >= 60 ? "var(--chart-4)" : "var(--destructive)"
  return (
    <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center">
      <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="22" fill="none" stroke="hsl(var(--secondary))" strokeWidth="4" />
        <circle
          cx="28"
          cy="28"
          r="22"
          fill="none"
          stroke={`hsl(${color})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * 138.2} 138.2`}
        />
      </svg>
      <span className="absolute text-xs font-bold text-foreground">{value}%</span>
    </div>
  )
}

export function CareerRoadmap() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const ctx = useAppContext()
  const { paths, isLoading, error, fetchPaths } = useCareerPaths(ctx?.resumeText ?? null)

  useEffect(() => {
    fetchPaths()
  }, [fetchPaths])

  useEffect(() => {
    if (paths?.length && !expandedId) setExpandedId(paths[0].id)
  }, [paths, expandedId])

  const careerPaths = paths ?? defaultCareerPaths

  return (
    <section id="career" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
            Career Recommendations
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            Your Personalized Career Paths
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            AI-generated career recommendations based on your skills, interests,
            and market demand with detailed roadmaps.
          </p>
        </div>

        {(isLoading || error) && (
          <div className={`mb-6 flex flex-col items-center gap-2 text-sm ${error ? "text-destructive" : "text-muted-foreground"}`}>
            <span>{isLoading ? "Loading career paths..." : error}</span>
            {error && (
              <Button variant="outline" size="sm" onClick={() => fetchPaths()}>
                Try again
              </Button>
            )}
          </div>
        )}
        <div className="flex flex-col gap-4">
          {careerPaths.map((path) => {
            const isExpanded = expandedId === path.id
            return (
              <div
                key={path.id}
                className={`rounded-xl border transition-all duration-300 ${
                  isExpanded ? "border-primary/30 bg-primary/[0.02]" : "border-border bg-card"
                }`}
              >
                <button
                  type="button"
                  className="flex w-full items-center gap-4 p-6 text-left"
                  onClick={() => setExpandedId(isExpanded ? null : path.id)}
                >
                  <MatchRing value={path.match} />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-lg font-bold text-foreground">
                        {path.title}
                      </h3>
                      {path.match >= 85 && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 gap-1 text-[10px]">
                          <Star className="h-3 w-3" /> Best Match
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5" />
                        {path.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5" />
                        {path.growth}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {path.locations}
                      </span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>

                {isExpanded && (
                  <div className="animate-slide-up border-t border-border px-6 pb-6 pt-4">
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                      {path.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="mb-2 text-xs font-semibold text-foreground uppercase tracking-wider">
                        Required Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {path.requiredSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-4 text-xs font-semibold text-foreground uppercase tracking-wider">
                        Career Roadmap
                      </h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {path.timeline.map((phase, i) => (
                          <div
                            key={phase.phase}
                            className="relative rounded-lg border border-border bg-card p-4"
                          >
                            <div className="mb-3 flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                {i + 1}
                              </div>
                              <div>
                                <span className="text-sm font-semibold text-foreground">
                                  {phase.phase}
                                </span>
                                <span className="ml-2 text-xs text-muted-foreground">
                                  {phase.duration}
                                </span>
                              </div>
                            </div>
                            <ul className="flex flex-col gap-1.5">
                              {phase.tasks.map((task) => (
                                <li
                                  key={task}
                                  className="flex items-start gap-2 text-xs text-muted-foreground"
                                >
                                  <Briefcase className="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />
                                  {task}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                      onClick={() => {
                        ctx?.setSelectedCareerGoal(path.title)
                        document.getElementById("learning")?.scrollIntoView({ behavior: "smooth" })
                      }}
                    >
                      Start This Path
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
