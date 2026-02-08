"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  BrainCircuit,
  Menu,
  X,
  FileText,
  Target,
  Compass,
  BookOpen,
  MessageSquare,
} from "lucide-react"

const navLinks = [
  { label: "Features", href: "#features", icon: Target },
  { label: "Resume Analysis", href: "#resume", icon: FileText },
  { label: "Skill Assessment", href: "#skills", icon: Target },
  { label: "Career Path", href: "#career", icon: Compass },
  { label: "AI Agent", href: "#agent", icon: MessageSquare },
  { label: "Learning", href: "#learning", icon: BookOpen },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <BrainCircuit className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">
            CareerAI
          </span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" })}
          >
            Sign In
          </Button>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" })}
          >
            Get Started
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="animate-slide-up border-t border-border bg-background px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
                onClick={() => setMobileOpen(false)}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={() => {
                  document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" })
                  setMobileOpen(false)
                }}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="w-full bg-primary text-primary-foreground"
                onClick={() => {
                  document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" })
                  setMobileOpen(false)
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
