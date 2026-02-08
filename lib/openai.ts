import type { ResumeAnalysisResult } from "./types"

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_MODEL = "llama-3.3-70b-versatile"
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

console.log("[Groq Config] GROQ_API_KEY present:", !!GROQ_API_KEY, "length:", GROQ_API_KEY?.length)

function getClient(): boolean {
  if (!GROQ_API_KEY || GROQ_API_KEY.trim() === "") {
    console.log("[getClient] No Groq API key found, returning false")
    return false
  }
  console.log("[getClient] Groq API key found, returning true")
  return true
}

export function hasOpenAI(): boolean {
  return getClient()
}

export async function analyzeResumeWithAI(text: string): Promise<{
  overallScore: number
  categories: { name: string; score: number; status: "good" | "warning" | "critical"; feedback: string }[]
  keywords: string[]
  suggestions: string[]
}> {
  if (!getClient()) {
    const fb = generateFallbackResumeAnalysis()
    return { ...fb, usedFallback: true }
  }

  const prompt = `Analyze this resume text and return a JSON object with exactly this structure (no markdown, no code blocks, just raw JSON):
{
  "overallScore": <number 0-100>,
  "categories": [
    {
      "name": "ATS Compatibility",
      "score": <0-100>,
      "status": "good" | "warning" | "critical",
      "feedback": "<brief feedback string>"
    },
    {
      "name": "Keyword Optimization",
      "score": <0-100>,
      "status": "good" | "warning" | "critical",
      "feedback": "<brief feedback string>"
    },
    {
      "name": "Impact Statements",
      "score": <0-100>,
      "status": "good" | "warning" | "critical",
      "feedback": "<brief feedback string>"
    },
    {
      "name": "Formatting & Structure",
      "score": <0-100>,
      "status": "good" | "warning" | "critical",
      "feedback": "<brief feedback string>"
    },
    {
      "name": "Skills Alignment",
      "score": <0-100>,
      "status": "good" | "warning" | "critical",
      "feedback": "<brief feedback string>"
    }
  ],
  "keywords": ["<skill1>", "<skill2>", "..."],
  "suggestions": ["<actionable suggestion 1>", "<suggestion 2>", "..."]
}

Resume text:
---
${text.slice(0, 8000)}
---
Return ONLY the JSON object.`

  try {
    console.log("[Groq] Calling API for resume analysis with key:", GROQ_API_KEY?.substring(0, 10) + "...")
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    })

    console.log("[Groq] Response status:", response.status)
    if (!response.ok) {
      const errText = await response.text()
      console.error("[Groq] API error response:", response.status, errText)
      try {
        const err = JSON.parse(errText)
        throw new Error(`Groq API error ${response.status}: ${JSON.stringify(err)}`)
      } catch {
        throw new Error(`Groq API error ${response.status}: ${errText}`)
      }
    }

    const result = await response.json()
    const content = result.choices?.[0]?.message?.content?.trim() ?? ""
    console.log("[Groq] Content length:", content.length)

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const parsed = JSON.parse(jsonMatch?.[0] ?? "{}")
    console.log("[Groq] Successfully parsed resume analysis")
    return { ...(parsed as ResumeAnalysisResult), usedFallback: false }
  } catch (err) {
    console.error("[Groq] Resume analysis error:", err instanceof Error ? err.message : String(err))
    const fb = generateFallbackResumeAnalysis()
    return { ...fb, usedFallback: true }
  }
}

function generateFallbackResumeAnalysis() {
  return {
    overallScore: 72,
    categories: [
      { name: "ATS Compatibility", score: 85, status: "good" as const, feedback: "Good formatting for applicant tracking systems." },
      { name: "Keyword Optimization", score: 62, status: "warning" as const, feedback: "Missing key industry terms. Add more domain-specific keywords." },
      { name: "Impact Statements", score: 45, status: "critical" as const, feedback: "Quantify achievements with metrics and numbers." },
      { name: "Formatting & Structure", score: 90, status: "good" as const, feedback: "Clean layout with clear section hierarchy." },
      { name: "Skills Alignment", score: 68, status: "warning" as const, feedback: "Some skills listed lack supporting evidence in experience section." },
    ],
    keywords: ["React", "TypeScript", "Node.js", "Python", "Agile"],
    suggestions: [
      "Add quantifiable metrics to your project descriptions",
      "Include a professional summary at the top",
      "Add more action verbs to bullet points",
    ],
  }
}

export async function chatWithAI(messages: { role: "user" | "assistant"; content: string }[]): Promise<string> {
  if (!getClient()) {
    return "AI chat requires a Groq API key. Add GROQ_API_KEY to your .env file. Get your key at https://console.groq.com"
  }

  const systemPrompt = `You are CareerAI, a friendly and knowledgeable AI career advisor. You help users with:
- Resume review and improvement tips
- Skill assessment and gap analysis
- Career path recommendations
- Learning path and course suggestions
- Interview preparation and networking advice

Be concise, actionable, and supportive. Use bullet points and formatting when helpful.`

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error ${response.status}`)
    }

    const result = await response.json()
    return result.choices?.[0]?.message?.content?.trim() ?? "I couldn't generate a response. Please try again."
  } catch (err) {
    console.error("[Groq] Chat error:", err)
    return "Sorry, I encountered an error. Please check your Groq API key and try again."
  }
}

export async function getSkillsFromAI(resumeText?: string): Promise<{
  skills: { name: string; level: number; category: string; trend: "up" | "stable" | "gap" }[]
  radarSkills: { label: string; value: number }[]
}> {
  if (!getClient()) {
    return getFallbackSkills()
  }

  const prompt = resumeText
    ? `Based on this resume, assess the person's skills. Return JSON: { "skills": [{ "name": string, "level": 0-100, "category": "Technical"|"Soft Skills"|"Domain", "trend": "up"|"stable"|"gap" }], "radarSkills": [{ "label": string, "value": 0-100 }] }. Use categories: Frontend, Backend, Data Science, DevOps, Design, Leadership for radarSkills.

Resume:
---
${resumeText.slice(0, 6000)}
---

Return ONLY valid JSON, no markdown.`
    : `Return default skill assessment JSON: { "skills": [{ "name": "JavaScript", "level": 88, "category": "Technical", "trend": "up" }, ... ], "radarSkills": [{ "label": "Frontend", "value": 85 }, ... ] }. Include 12 skills across Technical, Soft Skills, Domain. Include 6 radar skills.`

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 800,
      }),
    })

    if (!response.ok) throw new Error(`Groq API error ${response.status}`)

    const result = await response.json()
    const content = result.choices?.[0]?.message?.content?.trim() ?? ""
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const parsed = JSON.parse(jsonMatch?.[0] ?? "{}")
    
    // Validate skills data
    if (!parsed.skills || !Array.isArray(parsed.skills) || parsed.skills.length === 0 ||
        !parsed.radarSkills || !Array.isArray(parsed.radarSkills) || parsed.radarSkills.length === 0) {
      return getFallbackSkills()
    }
    
    return parsed
  } catch {
    return getFallbackSkills()
  }
}

function getFallbackSkills() {
  return {
    skills: [
      { name: "JavaScript", level: 88, category: "Technical", trend: "up" as const },
      { name: "React", level: 82, category: "Technical", trend: "up" as const },
      { name: "Python", level: 65, category: "Technical", trend: "stable" as const },
      { name: "Machine Learning", level: 40, category: "Technical", trend: "gap" as const },
      { name: "Communication", level: 78, category: "Soft Skills", trend: "up" as const },
      { name: "Leadership", level: 55, category: "Soft Skills", trend: "stable" as const },
      { name: "Problem Solving", level: 85, category: "Soft Skills", trend: "up" as const },
      { name: "Time Management", level: 70, category: "Soft Skills", trend: "stable" as const },
      { name: "Cloud (AWS)", level: 48, category: "Domain", trend: "gap" as const },
      { name: "System Design", level: 58, category: "Domain", trend: "stable" as const },
      { name: "DevOps/CI-CD", level: 42, category: "Domain", trend: "gap" as const },
      { name: "Data Structures", level: 76, category: "Domain", trend: "up" as const },
    ],
    radarSkills: [
      { label: "Frontend", value: 85 },
      { label: "Backend", value: 62 },
      { label: "Data Science", value: 40 },
      { label: "DevOps", value: 45 },
      { label: "Design", value: 55 },
      { label: "Leadership", value: 60 },
    ],
  }
}

export async function getCareerPathsFromAI(resumeText?: string): Promise<{
  paths: {
    id: string
    title: string
    match: number
    salary: string
    growth: string
    locations: string
    description: string
    requiredSkills: string[]
    timeline: { phase: string; duration: string; tasks: string[] }[]
  }[]
}> {
  if (!getClient()) {
    return { paths: getFallbackCareerPaths() }
  }

  const prompt = resumeText
    ? `Based on this resume, suggest 3 personalized career paths. Return JSON: { "paths": [{ "id": "slug", "title": string, "match": 0-100, "salary": string, "growth": string, "locations": string, "description": string, "requiredSkills": string[], "timeline": [{ "phase": string, "duration": string, "tasks": string[] }] }] }. Each path has 3 timeline phases.\n\nResume:\n---\n${resumeText.slice(0, 4000)}\n---\n\nReturn ONLY valid JSON.`
    : `Return 3 sample career paths as JSON. Use structure: { "paths": [{ "id", "title", "match", "salary", "growth", "locations", "description", "requiredSkills", "timeline" }] }`

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 1200,
      }),
    })

    if (!response.ok) throw new Error(`Groq API error ${response.status}`)

    const result = await response.json()
    const content = result.choices?.[0]?.message?.content?.trim() ?? ""
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const parsed = JSON.parse(jsonMatch?.[0] ?? "{}")
    if (!parsed.paths || !Array.isArray(parsed.paths)) return { paths: getFallbackCareerPaths() }
    
    // Validate and fix timeline data
    parsed.paths = parsed.paths.map((p: any, i: number) => ({
      ...p,
      id: p.id ?? `path-${i}`,
      timeline: Array.isArray(p.timeline) ? p.timeline : [],
      requiredSkills: Array.isArray(p.requiredSkills) ? p.requiredSkills : [],
    }))
    
    // Ensure all paths have valid timelines
    if (parsed.paths.some((p: any) => !Array.isArray(p.timeline) || p.timeline.length === 0)) {
      return { paths: getFallbackCareerPaths() }
    }
    
    return parsed
  } catch {
    return { paths: getFallbackCareerPaths() }
  }
}

function getFallbackCareerPaths() {
  return [
    {
      id: "fullstack",
      title: "Full-Stack Developer",
      match: 92,
      salary: "$95K - $145K",
      growth: "+25% demand",
      locations: "Remote / SF / NYC",
      description: "Build end-to-end web applications combining your strong frontend skills with growing backend knowledge.",
      requiredSkills: ["React", "Node.js", "PostgreSQL", "TypeScript", "AWS"],
      timeline: [
        { phase: "Foundation", duration: "0-3 months", tasks: ["Master Node.js & Express", "Learn PostgreSQL", "Build 2 full-stack projects"] },
        { phase: "Growth", duration: "3-6 months", tasks: ["Learn Docker & CI/CD", "Study system design", "Contribute to open source"] },
        { phase: "Ready", duration: "6-9 months", tasks: ["Build portfolio project", "Prep for interviews", "Apply to target companies"] },
      ],
    },
    {
      id: "frontend-lead",
      title: "Frontend Tech Lead",
      match: 85,
      salary: "$120K - $175K",
      growth: "+18% demand",
      locations: "Remote / Austin / Seattle",
      description: "Leverage your strong React and JavaScript skills to lead frontend architecture decisions and mentor teams.",
      requiredSkills: ["React", "TypeScript", "Architecture", "Mentoring", "Performance"],
      timeline: [
        { phase: "Foundation", duration: "0-4 months", tasks: ["Deep-dive into architecture patterns", "Learn advanced performance optimization", "Start mentoring juniors"] },
        { phase: "Growth", duration: "4-8 months", tasks: ["Lead a medium-scale project", "Study management frameworks", "Build tech talks"] },
        { phase: "Ready", duration: "8-12 months", tasks: ["Demonstrate team leadership", "Build case studies", "Target senior/lead roles"] },
      ],
    },
    {
      id: "ml-engineer",
      title: "ML Engineer",
      match: 58,
      salary: "$110K - $180K",
      growth: "+35% demand",
      locations: "Remote / SF / Boston",
      description: "Transition into machine learning by building on your Python foundation and problem-solving skills.",
      requiredSkills: ["Python", "TensorFlow", "Statistics", "MLOps", "Data Pipelines"],
      timeline: [
        { phase: "Foundation", duration: "0-6 months", tasks: ["Complete ML specialization course", "Learn statistics deeply", "Build 5 ML projects"] },
        { phase: "Growth", duration: "6-12 months", tasks: ["Study MLOps & deployment", "Kaggle competitions", "Research paper reading"] },
        { phase: "Ready", duration: "12-18 months", tasks: ["Build production ML system", "Contribute to ML open source", "Target ML engineer roles"] },
      ],
    },
  ]
}

export async function getLearningPathsFromAI(careerGoal?: string): Promise<{
  paths: {
    id: string
    title: string
    description: string
    totalCourses: number
    completedCourses: number
    estimatedTime: string
    skills: string[]
    courses: { title: string; provider: string; duration: string; rating: number; status: "completed" | "in-progress" | "locked"; progress: number }[]
  }[]
}> {
  if (!getClient()) {
    return { paths: getFallbackLearningPaths() }
  }

  const prompt = careerGoal
    ? `Suggest 3 personalized learning paths for career goal: "${careerGoal}". Return JSON: { "paths": [{ "id", "title", "description", "totalCourses", "completedCourses", "estimatedTime", "skills", "courses": [{ "title", "provider", "duration", "rating", "status", "progress" }] }] }. Use status: "completed", "in-progress", or "locked".

Return ONLY valid JSON.`
    : `Return 3 sample learning paths as JSON with courses. Structure: { "paths": [{ "id", "title", "description", "totalCourses", "completedCourses", "estimatedTime", "skills", "courses" }] }

Return ONLY valid JSON.`

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 1500,
      }),
    })

    if (!response.ok) throw new Error(`Groq API error ${response.status}`)

    const result = await response.json()
    const content = result.choices?.[0]?.message?.content?.trim() ?? ""
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const parsed = JSON.parse(jsonMatch?.[0] ?? "{}")
    if (!parsed.paths || !Array.isArray(parsed.paths)) return { paths: getFallbackLearningPaths() }
    
    // Validate and fix learning paths data
    parsed.paths = parsed.paths.map((p: any, i: number) => ({
      ...p,
      id: p.id ?? `path-${i}`,
      courses: Array.isArray(p.courses) ? p.courses : [],
      skills: Array.isArray(p.skills) ? p.skills : [],
    }))
    
    // Ensure all paths have valid courses
    if (parsed.paths.some((p: any) => !Array.isArray(p.courses) || p.courses.length === 0)) {
      return { paths: getFallbackLearningPaths() }
    }
    
    return parsed
  } catch {
    return { paths: getFallbackLearningPaths() }
  }
}

function getFallbackLearningPaths() {
  return [
    {
      id: "cloud",
      title: "Cloud Computing Fundamentals",
      description: "Master cloud infrastructure with AWS, covering core services, security, and deployment strategies.",
      totalCourses: 5,
      completedCourses: 2,
      estimatedTime: "12 weeks",
      skills: ["AWS", "Cloud Architecture", "Security", "Networking"],
      courses: [
        { title: "Cloud Computing Concepts", provider: "Coursera", duration: "4 weeks", rating: 4.8, status: "completed" as const, progress: 100 },
        { title: "AWS Cloud Practitioner Essentials", provider: "AWS Training", duration: "3 weeks", rating: 4.7, status: "completed" as const, progress: 100 },
        { title: "AWS Solutions Architect Associate", provider: "Udemy", duration: "6 weeks", rating: 4.9, status: "in-progress" as const, progress: 45 },
        { title: "Serverless Architecture Deep Dive", provider: "Pluralsight", duration: "2 weeks", rating: 4.6, status: "locked" as const, progress: 0 },
        { title: "AWS Security Best Practices", provider: "A Cloud Guru", duration: "3 weeks", rating: 4.5, status: "locked" as const, progress: 0 },
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
        { title: "Docker Fundamentals", provider: "Docker Inc.", duration: "2 weeks", rating: 4.7, status: "in-progress" as const, progress: 20 },
        { title: "Kubernetes for Developers", provider: "Udemy", duration: "4 weeks", rating: 4.8, status: "locked" as const, progress: 0 },
        { title: "GitHub Actions Mastery", provider: "GitHub", duration: "2 weeks", rating: 4.6, status: "locked" as const, progress: 0 },
        { title: "Production Deployment Strategies", provider: "Coursera", duration: "3 weeks", rating: 4.5, status: "locked" as const, progress: 0 },
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
        { title: "Engineering Management 101", provider: "Pluralsight", duration: "3 weeks", rating: 4.6, status: "in-progress" as const, progress: 10 },
        { title: "Technical Decision Making", provider: "Coursera", duration: "2 weeks", rating: 4.7, status: "locked" as const, progress: 0 },
        { title: "Effective Code Reviews", provider: "Frontend Masters", duration: "1 week", rating: 4.8, status: "locked" as const, progress: 0 },
        { title: "Leading Distributed Teams", provider: "LinkedIn Learning", duration: "2 weeks", rating: 4.5, status: "locked" as const, progress: 0 },
      ],
    },
  ]
}
