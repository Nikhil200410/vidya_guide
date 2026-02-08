"use client"

import { useEffect, useState, useRef } from "react"
import { BrainCircuit, Users, FileCheck, GraduationCap, Award, TrendingUp } from "lucide-react"

const stats = [
  { label: "AI Analyses Completed", target: 154000, suffix: "+", icon: BrainCircuit },
  { label: "Active Students", target: 12400, suffix: "+", icon: Users },
  { label: "Resumes Optimized", target: 51200, suffix: "+", icon: FileCheck },
  { label: "Certifications Earned", target: 8700, suffix: "+", icon: Award },
  { label: "Career Transitions", target: 3200, suffix: "+", icon: GraduationCap },
  { label: "Avg Salary Increase", target: 32, suffix: "%", icon: TrendingUp },
]

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 1 : 1)}K`
  return n.toString()
}

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    let rafId: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(target * eased))

      if (progress < 1) {
        rafId = requestAnimationFrame(animate)
      }
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [target, duration, start])

  return count
}

function StatCard({ stat, delay, isVisible }: { stat: typeof stats[0]; delay: number; isVisible: boolean }) {
  const count = useCountUp(stat.target, 2000, isVisible)
  const display = stat.target >= 1000 ? formatNumber(count) : count.toString()

  return (
    <div
      className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/20"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        <stat.icon className="h-6 w-6 text-primary" />
      </div>
      <span className="font-heading text-3xl font-bold text-foreground">
        {display}{stat.suffix}
      </span>
      <span className="text-sm text-muted-foreground">{stat.label}</span>
    </div>
  )
}

export function PlatformStats() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-20 lg:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
            Platform Impact
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            Trusted by Thousands of Students
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Real numbers from real students who accelerated their careers with our platform.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} delay={i * 100} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}
