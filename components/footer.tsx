"use client"

import { BrainCircuit } from "lucide-react"

const platformSectionMap: Record<string, string> = {
  "Resume Analysis": "resume",
  "Skill Assessment": "skills",
  "Career Paths": "career",
  "Learning Hub": "learning",
  "AI Agent": "agent",
}

const footerLinks = {
  Platform: ["Resume Analysis", "Skill Assessment", "Career Paths", "Learning Hub", "AI Agent"],
  Resources: ["Blog", "Documentation", "API Reference", "Changelog", "Status"],
  Company: ["About", "Careers", "Press", "Partners", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <BrainCircuit className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-bold text-foreground">
                CareerAI
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              AI-powered career platform helping students make smarter decisions
              about their professional future.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 text-xs font-semibold text-foreground uppercase tracking-wider">
                {category}
              </h4>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link}>
                    {category === "Platform" && platformSectionMap[link] ? (
                      <button
                        type="button"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground text-left"
                        onClick={() =>
                          document.getElementById(platformSectionMap[link])?.scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        {link}
                      </button>
                    ) : (
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            2026 CareerAI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Twitter
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              GitHub
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
