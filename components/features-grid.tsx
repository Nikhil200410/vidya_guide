"use client"

import { useState } from "react"
import {
  FileSearch,
  Target,
  Compass,
  BookOpen,
  MessageSquareText,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react"

const featureSectionMap: Record<string, string> = {
  "Resume Analysis": "resume",
  "Skill Assessment": "skills",
  "Career Recommendations": "career",
  "Learning Guidance": "learning",
  "Interactive AI Agent": "agent",
  "Progress Tracking": "skills",
  "Industry Insights": "career",
  "Smart Networking": "agent",
}

const features = [
  {
    icon: FileSearch,
    title: "Resume Analysis",
    description:
      "AI scans your resume for formatting, keyword optimization, ATS compatibility, and provides a detailed score with actionable improvement suggestions.",
    tag: "Core",
  },
  {
    icon: Target,
    title: "Skill Assessment",
    description:
      "Comprehensive skill evaluation across technical, soft, and domain-specific competencies with gap analysis and benchmarking against industry standards.",
    tag: "Core",
  },
  {
    icon: Compass,
    title: "Career Recommendations",
    description:
      "AI-driven career path suggestions based on your skills, interests, education, and market demand with salary insights and growth projections.",
    tag: "Core",
  },
  {
    icon: BookOpen,
    title: "Learning Guidance",
    description:
      "Personalized course and certification recommendations from top platforms, organized into structured learning paths aligned with your career goals.",
    tag: "Core",
  },
  {
    icon: MessageSquareText,
    title: "Interactive AI Agent",
    description:
      "Conversational AI career advisor that answers questions, provides mock interview practice, and offers real-time guidance on career decisions.",
    tag: "Core",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Visual dashboards showing your skill development over time, completed milestones, and personalized next-step recommendations.",
    tag: "Extra",
  },
  {
    icon: Shield,
    title: "Industry Insights",
    description:
      "Real-time labor market data, trending skills by industry, company culture analysis, and hiring pattern intelligence to inform your decisions.",
    tag: "Extra",
  },
  {
    icon: Zap,
    title: "Smart Networking",
    description:
      "AI-powered networking suggestions, LinkedIn profile optimization tips, and personalized outreach templates for informational interviews.",
    tag: "Extra",
  },
]

export function FeaturesGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
            Platform Features
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            Everything You Need to Launch Your Career
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Our agentic AI platform provides end-to-end career support, from
            analyzing your resume to mapping your entire career trajectory.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              role="button"
              tabIndex={0}
              className={`group relative rounded-xl border p-6 transition-all duration-300 cursor-pointer ${
                hoveredIndex === index
                  ? "border-primary/40 bg-primary/5 scale-[1.02]"
                  : "border-border bg-card hover:border-primary/20"
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                const id = featureSectionMap[feature.title]
                if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  const id = featureSectionMap[feature.title]
                  if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                    hoveredIndex === index ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${
                    feature.tag === "Core"
                      ? "bg-primary/10 text-primary"
                      : "bg-chart-4/10 text-chart-4"
                  }`}
                >
                  {feature.tag}
                </span>
              </div>
              <h3 className="mb-2 font-heading text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
