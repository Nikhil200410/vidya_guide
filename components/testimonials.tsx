"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer at Google",
    avatar: "PS",
    content:
      "CareerAI completely transformed my job search. The resume analysis caught issues I'd missed for years, and the career path recommendation to pivot toward full-stack development was spot-on. I landed my dream role within 4 months.",
  },
  {
    name: "Marcus Chen",
    role: "Data Scientist at Meta",
    avatar: "MC",
    content:
      "The skill assessment was incredibly accurate. It identified my gaps in statistics and MLOps, then created a learning path that was perfectly paced. The AI chat agent was like having a personal career coach available 24/7.",
  },
  {
    name: "Aisha Johnson",
    role: "Frontend Lead at Stripe",
    avatar: "AJ",
    content:
      "As a bootcamp graduate, I felt lost about career direction. CareerAI's personalized roadmap gave me clarity. The learning recommendations were from top-tier platforms and directly relevant to my goals. Highly recommend!",
  },
  {
    name: "David Park",
    role: "Cloud Engineer at AWS",
    avatar: "DP",
    content:
      "The platform's industry insights feature is a game-changer. It showed me trending skills in cloud computing before they became mainstream. I was able to position myself ahead of the curve and accelerate my career growth.",
  },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length)
  const prev = () =>
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
            Success Stories
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            Students Who Transformed Their Careers
          </h2>
        </div>

        {/* Desktop grid */}
        <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20"
            >
              <Quote className="mb-4 h-6 w-6 text-primary/30" />
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                {t.content}
              </p>
              <div className="flex items-center gap-3 border-t border-border pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div className="rounded-xl border border-border bg-card p-6">
            <Quote className="mb-4 h-6 w-6 text-primary/30" />
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              {testimonials[current].content}
            </p>
            <div className="flex items-center gap-3 border-t border-border pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {testimonials[current].avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {testimonials[current].name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {testimonials[current].role}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? "w-6 bg-primary" : "w-2 bg-border"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
