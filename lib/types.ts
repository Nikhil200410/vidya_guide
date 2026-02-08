// Shared types for AI Career Platform API

// Resume Analysis
export interface ResumeAnalysisCategory {
  name: string
  score: number
  status: "good" | "warning" | "critical"
  feedback: string
}

export interface ResumeAnalysisResult {
  overallScore: number
  categories: ResumeAnalysisCategory[]
  keywords: string[]
  suggestions: string[]
  usedFallback?: boolean
}

// Skill Assessment
export interface Skill {
  name: string
  level: number
  category: string
  trend: "up" | "stable" | "gap"
}

export interface RadarSkill {
  label: string
  value: number
}

// Career Paths
export interface CareerPathTimelinePhase {
  phase: string
  duration: string
  tasks: string[]
}

export interface CareerPath {
  id: string
  title: string
  match: number
  salary: string
  growth: string
  locations: string
  description: string
  requiredSkills: string[]
  timeline: CareerPathTimelinePhase[]
}

// Learning Paths
export interface Course {
  title: string
  provider: string
  duration: string
  rating: number
  status: "completed" | "in-progress" | "locked"
  progress: number
}

export interface LearningPath {
  id: string
  title: string
  description: string
  totalCourses: number
  completedCourses: number
  estimatedTime: string
  skills: string[]
  courses: Course[]
}

// Chat
export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}
