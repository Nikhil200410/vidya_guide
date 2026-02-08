"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useSkills } from "@/hooks/use-api"
import { useAppContext } from "@/lib/context"
import { Badge } from "@/components/ui/badge"
import { Target, ChevronRight } from "lucide-react"

interface Skill {
  name: string
  level: number
  category: string
  trend: "up" | "stable" | "gap"
}

const categories = ["All", "Technical", "Soft Skills", "Domain"]

const defaultRadarSkills = [
  { label: "Frontend", value: 85 },
  { label: "Backend", value: 62 },
  { label: "Data Science", value: 40 },
  { label: "DevOps", value: 45 },
  { label: "Design", value: 55 },
  { label: "Leadership", value: 60 },
]

function RadarChart({ skills }: { skills: { label: string; value: number }[] }) {
  const cx = 150
  const cy = 150
  const r = 110
  const levels = 4
  const safeSkills = skills?.length ? skills : [{ label: "N/A", value: 0 }]

  const angleStep = (2 * Math.PI) / safeSkills.length
  const startAngle = -Math.PI / 2

  const getPoint = (index: number, value: number) => {
    const angle = startAngle + index * angleStep
    const distance = (value / 100) * r
    return {
      x: cx + distance * Math.cos(angle),
      y: cy + distance * Math.sin(angle),
    }
  }

  const dataPoints = safeSkills.map((s, i) => getPoint(i, s.value))
  const pathD =
    dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z"

  return (
    <svg viewBox="0 0 300 300" className="h-full w-full">
      {/* Grid levels */}
      {Array.from({ length: levels }, (_, i) => {
        const levelR = (r * (i + 1)) / levels
        const points = safeSkills
          .map((_, j) => {
            const angle = startAngle + j * angleStep
            return `${cx + levelR * Math.cos(angle)},${cy + levelR * Math.sin(angle)}`
          })
          .join(" ")
        return (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
          />
        )
      })}

      {/* Axis lines */}
      {safeSkills.map((_, i) => {
        const angle = startAngle + i * angleStep
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + r * Math.cos(angle)}
            y2={cy + r * Math.sin(angle)}
            stroke="hsl(var(--border))"
            strokeWidth="1"
          />
        )
      })}

      {/* Data area */}
      <path d={pathD} fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary))" strokeWidth="2" />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="hsl(var(--primary))" />
      ))}

      {/* Labels */}
      {safeSkills.map((s, i) => {
        const angle = startAngle + i * angleStep
        const labelR = r + 22
        const x = cx + labelR * Math.cos(angle)
        const y = cy + labelR * Math.sin(angle)
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground text-[11px]"
          >
            {s.label}
          </text>
        )
      })}
    </svg>
  )
}

export function SkillAssessment() {
  const [activeCategory, setActiveCategory] = useState("All")
  const ctx = useAppContext()
  const { skills: skillsData, radarSkills, isLoading, error, fetchSkills } = useSkills(ctx?.resumeText ?? null)

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  const filtered =
    activeCategory === "All"
      ? skillsData ?? []
      : (skillsData ?? []).filter((s) => s.category === activeCategory)

  const trendBadge = (trend: string) => {
    if (trend === "up")
      return (
        <Badge variant="outline" className="border-chart-3/30 bg-chart-3/10 text-chart-3 text-[10px]">
          Growing
        </Badge>
      )
    if (trend === "stable")
      return (
        <Badge variant="outline" className="border-chart-4/30 bg-chart-4/10 text-chart-4 text-[10px]">
          Stable
        </Badge>
      )
    return (
      <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive text-[10px]">
        Skill Gap
      </Badge>
    )
  }

  const barColor = (level: number) => {
    if (level >= 75) return "bg-chart-3"
    if (level >= 50) return "bg-chart-4"
    return "bg-destructive"
  }

  return (
    <section id="skills" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
            Skill Assessment
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            Know Your Strengths & Gaps
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Comprehensive skill evaluation with visual analytics to identify growth areas
            and benchmark against industry standards.
          </p>
        </div>

        {(isLoading || error) && (
          <div className={`mb-6 flex flex-col items-center gap-2 text-sm ${error ? "text-destructive" : "text-muted-foreground"}`}>
            <span>{isLoading ? "Loading skills..." : error}</span>
            {error && (
              <Button variant="outline" size="sm" onClick={() => fetchSkills()}>
                Try again
              </Button>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Radar Chart */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
                Competency Radar
              </h3>
              <div className="mx-auto aspect-square max-w-[300px]">
                <RadarChart skills={radarSkills ?? defaultRadarSkills} />
              </div>
            </div>
          </div>

          {/* Skills List */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
                  Skill Breakdown
                </h3>
                <div className="flex gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        activeCategory === cat
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {filtered.map((skill) => (
                  <div
                    key={skill.name}
                    className="group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {skill.name}
                        </span>
                        <div className="flex items-center gap-2">
                          {trendBadge(skill.trend)}
                          <span className="text-sm font-bold text-foreground">
                            {skill.level}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${barColor(skill.level)}`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="ghost"
                className="mt-4 w-full text-primary hover:text-primary/80 hover:bg-primary/5 gap-1"
                onClick={() => fetchSkills()}
              >
                View Full Assessment
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
