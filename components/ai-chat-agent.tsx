"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { sendChatMessage } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  BrainCircuit,
  Send,
  User,
  FileText,
  Target,
  Compass,
  BookOpen,
  Sparkles,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

const quickActions = [
  { label: "Review my resume", icon: FileText },
  { label: "Assess my skills", icon: Target },
  { label: "Suggest career paths", icon: Compass },
  { label: "Recommend courses", icon: BookOpen },
]

function formatTime(): string {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function AiChatAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your AI Career Agent. I can help you with resume analysis, skill assessment, career path recommendations, and personalized learning plans. What would you like to explore today?",
      timestamp: "",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [mounted, setMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === "welcome" ? { ...msg, timestamp: formatTime() } : msg
      )
    )
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: formatTime(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }))
      const { message } = await sendChatMessage(history)
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: message,
        timestamp: formatTime(),
      }
      setMessages((prev) => [...prev, botMsg])
    } catch {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I couldn't process that. Please try again.",
        timestamp: formatTime(),
      }
      setMessages((prev) => [...prev, botMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <section id="agent" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
            Interactive AI Agent
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            Chat With Your Career AI
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Get real-time career advice, mock interview practice, and personalized
            guidance from our conversational AI agent.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b border-border bg-secondary/30 px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                <BrainCircuit className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">CareerAI Agent</p>
                <p className="text-xs text-muted-foreground">
                  <span className="mr-1 inline-block h-2 w-2 rounded-full bg-chart-3" />
                  Online - Ready to help
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex h-[420px] flex-col gap-4 overflow-y-auto p-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      msg.role === "assistant"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <BrainCircuit className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 ${
                      msg.role === "assistant"
                        ? "bg-secondary text-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <div
                      className="whitespace-pre-line text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: msg.content
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\n/g, "<br/>"),
                      }}
                    />
                    {mounted && msg.timestamp && (
                      <p
                        className={`mt-1 text-[10px] ${
                          msg.role === "assistant" ? "text-muted-foreground" : "text-primary-foreground/70"
                        }`}
                      >
                        {msg.timestamp}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <BrainCircuit className="h-4 w-4" />
                  </div>
                  <div className="rounded-xl bg-secondary px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 border-t border-border px-6 py-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => sendMessage(action.label)}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                >
                  <action.icon className="h-3 w-3" />
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-border px-4 py-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your career..."
                className="flex-1 bg-transparent px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || isTyping}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
