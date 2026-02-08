"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Users, FileCheck, TrendingUp } from "lucide-react"

const stats = [
  { label: "Resumes Analyzed", value: "50K+", icon: FileCheck },
  { label: "Career Paths Mapped", value: "200+", icon: TrendingUp },
  { label: "Active Students", value: "12K+", icon: Users },
]

const rotatingTexts = [
  "Resume Evaluation",
  "Career Guidance",
  "Skill Assessment",
  "Learning Paths",
]

export function HeroSection() {
  const [currentText, setCurrentText] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % rotatingTexts.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-96 w-96 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="animate-slide-up mb-8 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              AI-Powered Career Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-slide-up font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl" style={{ animationDelay: "0.1s" }}>
            <span className="text-balance">Your AI Career Agent for</span>
            <br />
            <span className="relative inline-block text-primary">
              <span
                key={currentText}
                className="animate-fade-in inline-block"
              >
                {rotatingTexts[currentText]}
              </span>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="animate-slide-up mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl" style={{ animationDelay: "0.2s" }}>
            An intelligent AI agent that evaluates your resume, assesses your skills,
            recommends career paths, and creates personalized learning plans to
            accelerate your professional growth.
          </p>

          {/* CTA Buttons */}
          <div className="animate-slide-up mt-10 flex flex-col gap-4 sm:flex-row" style={{ animationDelay: "0.3s" }}>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8 text-base"
              onClick={() => document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start Your Analysis
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-secondary gap-2 px-8 text-base bg-transparent"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore Features
            </Button>
          </div>

          {/* Stats */}
          <div className="animate-slide-up mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3" style={{ animationDelay: "0.4s" }}>
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <stat.icon className="h-5 w-5 text-primary" />
                  <span className="font-heading text-3xl font-bold text-foreground">
                    {stat.value}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
