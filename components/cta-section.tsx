"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function CtaSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-12 lg:p-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="relative flex flex-col items-center text-center">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
              Ready to Accelerate Your Career?
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Join thousands of students using AI to make smarter career
              decisions, build stronger skills, and land better opportunities.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8 text-base"
                onClick={() => document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" })}
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-secondary px-8 text-base bg-transparent"
                onClick={() => window.open("mailto:demo@careerai.example.com?subject=Schedule%20a%20Demo", "_blank")}
              >
                Schedule a Demo
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card required. Free tier includes 3 resume analyses and
              unlimited AI chat.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
