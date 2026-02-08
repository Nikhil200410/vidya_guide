"use client"

import { useState, useEffect } from "react"
import { useLearningPaths } from "@/hooks/use-api"
import { useAppContext } from "@/lib/context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Clock,
  Star,
  ChevronRight,
  Play,
  CheckCircle2,
  Lock,
  ExternalLink,
} from "lucide-react"

interface Course {
  title: string
  provider: string
  duration: string
  rating: number
  status: "completed" | "in-progress" | "locked"
  progress: number
}

interface LearningPath {
  id: string
  title: string
  description: string
  totalCourses: number
  completedCourses: number
  estimatedTime: string
  skills: string[]
  courses: Course[]
}

const defaultLearningPaths: LearningPath[] = [
  {
    id: "cloud",
    title: "Cloud Computing Fundamentals",
    description: "Master cloud infrastructure with AWS, covering core services, security, and deployment strategies.",
    totalCourses: 5,
    completedCourses: 2,
    estimatedTime: "12 weeks",
    skills: ["AWS", "Cloud Architecture", "Security", "Networking"],
    courses: [
      { title: "Cloud Computing Concepts", provider: "Coursera", duration: "4 weeks", rating: 4.8, status: "completed", progress: 100 },
      { title: "AWS Cloud Practitioner Essentials", provider: "AWS Training", duration: "3 weeks", rating: 4.7, status: "completed", progress: 100 },
      { title: "AWS Solutions Architect Associate", provider: "Udemy", duration: "6 weeks", rating: 4.9, status: "in-progress", progress: 45 },
      { title: "Serverless Architecture Deep Dive", provider: "Pluralsight", duration: "2 weeks", rating: 4.6, status: "locked", progress: 0 },
      { title: "AWS Security Best Practices", provider: "A Cloud Guru", duration: "3 weeks", rating: 4.5, status: "locked", progress: 0 },
    ],
  },
  {
    id: "devops",
    title: "DevOps & CI/CD Pipeline",
    description: "Learn modern DevOps practices including containerization, orchestration, and continuous deployment.",
    totalCourses: 4,
    completedCourses: 0,
    estimatedTime: "10 weeks",
    skills: ["Docker", "Kubernetes", "CI/CD", "GitHub Actions"],
    courses: [
      { title: "Docker Fundamentals", provider: "Docker Inc.", duration: "2 weeks", rating: 4.7, status: "in-progress", progress: 20 },
      { title: "Kubernetes for Developers", provider: "Udemy", duration: "4 weeks", rating: 4.8, status: "locked", progress: 0 },
      { title: "GitHub Actions Mastery", provider: "GitHub", duration: "2 weeks", rating: 4.6, status: "locked", progress: 0 },
      { title: "Production Deployment Strategies", provider: "Coursera", duration: "3 weeks", rating: 4.5, status: "locked", progress: 0 },
    ],
  },
  {
    id: "leadership",
    title: "Tech Leadership Essentials",
    description: "Develop leadership and management skills to transition from individual contributor to tech lead.",
    totalCourses: 4,
    completedCourses: 0,
    estimatedTime: "8 weeks",
    skills: ["Team Management", "Mentoring", "Architecture Decisions", "Communication"],
    courses: [
      { title: "Engineering Management 101", provider: "Pluralsight", duration: "3 weeks", rating: 4.6, status: "in-progress", progress: 10 },
      { title: "Technical Decision Making", provider: "Coursera", duration: "2 weeks", rating: 4.7, status: "locked", progress: 0 },
      { title: "Effective Code Reviews", provider: "Frontend Masters", duration: "1 week", rating: 4.8, status: "locked", progress: 0 },
      { title: "Leading Distributed Teams", provider: "LinkedIn Learning", duration: "2 weeks", rating: 4.5, status: "locked", progress: 0 },
    ],
  },
]

export function LearningPaths() {
  const [activePath, setActivePath] = useState("cloud")
  const ctx = useAppContext()
  const { paths, isLoading, error, fetchPaths } = useLearningPaths(ctx?.selectedCareerGoal ?? null)

  useEffect(() => {
    fetchPaths()
  }, [fetchPaths])

  const learningPaths = paths ?? defaultLearningPaths
  const currentPath = learningPaths.find((p) => p.id === activePath) ?? learningPaths[0]

  useEffect(() => {
    if (learningPaths.length && !learningPaths.some((p) => p.id === activePath)) {
      setActivePath(learningPaths[0].id)
    }
  }, [learningPaths, activePath])
  const overallProgress = Math.round(
    (currentPath.courses.reduce((sum, c) => sum + c.progress, 0) / (currentPath.courses.length * 100)) * 100
  )

  const statusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-chart-3" />
    if (status === "in-progress") return <Play className="h-4 w-4 text-primary" />
    return <Lock className="h-4 w-4 text-muted-foreground/40" />
  }

  return (
    <section id="learning" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
            Learning Guidance
          </span>
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            Personalized Learning Paths
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Curated courses and certifications organized into structured paths
            aligned with your career goals.
          </p>
        </div>

        {(isLoading || error) && (
          <div className={`mb-6 flex flex-col items-center gap-2 text-sm ${error ? "text-destructive" : "text-muted-foreground"}`}>
            <span>{isLoading ? "Loading learning paths..." : error}</span>
            {error && (
              <Button variant="outline" size="sm" onClick={() => fetchPaths()}>
                Try again
              </Button>
            )}
          </div>
        )}
        {/* Path Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {learningPaths.map((path) => (
            <button
              key={path.id}
              type="button"
              onClick={() => setActivePath(path.id)}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activePath === path.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {path.title}
            </button>
          ))}
        </div>

        {/* Path Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Path Overview */}
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">
                    {currentPath.title}
                  </h3>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {currentPath.estimatedTime}
                  </p>
                </div>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {currentPath.description}
              </p>

              <div className="mb-4">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-bold text-foreground">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {currentPath.completedCourses} / {currentPath.totalCourses} courses
                </span>
                <Badge variant="outline" className="border-primary/20 text-primary text-[10px]">
                  In Progress
                </Badge>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h4 className="mb-3 text-xs font-semibold text-foreground uppercase tracking-wider">
                Skills You{"'"}ll Gain
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentPath.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Course List */}
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-3">
              {currentPath.courses.map((course, i) => (
                <div
                  key={course.title}
                  className={`group rounded-xl border p-5 transition-all ${
                    course.status === "locked"
                      ? "border-border/50 bg-card/50 opacity-60"
                      : "border-border bg-card hover:border-primary/20"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <span className="text-sm font-bold text-muted-foreground">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {statusIcon(course.status)}
                          <h4 className="text-sm font-semibold text-foreground">
                            {course.title}
                          </h4>
                        </div>
                        {course.status !== "locked" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-primary hover:text-primary/80 gap-1"
                            onClick={() =>
                              window.open(
                                `https://www.google.com/search?q=${encodeURIComponent(course.title + " " + course.provider)}`,
                                "_blank"
                              )
                            }
                          >
                            {course.status === "completed" ? "Review" : "Continue"}
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>{course.provider}</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-3 w-3" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-chart-4 text-chart-4" />
                          {course.rating}
                        </span>
                      </div>
                      {course.status !== "locked" && course.progress < 100 && (
                        <div className="mt-3">
                          <div className="mb-1 flex justify-between text-[10px]">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium text-foreground">{course.progress}%</span>
                          </div>
                          <div className="h-1 overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              onClick={() => {
                ctx?.setSelectedCareerGoal(null)
                fetchPaths(null)
              }}
            >
              Explore All Learning Paths
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
