// API client for CareerAI backend

const API_BASE = "/api"

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `API error: ${res.status}`)
  }
  return res.json()
}

// Resume Analysis
export async function analyzeResume(file: File) {
  const formData = new FormData()
  formData.append("file", file)
  const res = await fetch(`${API_BASE}/resume/analyze`, {
    method: "POST",
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `API error: ${res.status}`)
  }
  return res.json()
}

// Skills - pass resumeText for AI-personalized assessment
export async function getSkills(resumeText?: string | null) {
  if (resumeText) {
    const res = await fetch(`${API_BASE}/skills`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText }),
    })
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || "API error")
    return res.json()
  }
  return fetchApi<{ skills: import("./types").Skill[]; radarSkills: import("./types").RadarSkill[] }>(
    "/skills"
  )
}

// Career Paths - pass resumeText for AI-personalized paths
export async function getCareerPaths(resumeText?: string | null) {
  if (resumeText) {
    const res = await fetch(`${API_BASE}/career-paths`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText }),
    })
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || "API error")
    return res.json()
  }
  return fetchApi<{ paths: import("./types").CareerPath[] }>("/career-paths")
}

// Learning Paths - pass careerGoal for AI-personalized paths
export async function getLearningPaths(careerGoal?: string | null) {
  if (careerGoal) {
    const res = await fetch(`${API_BASE}/learning-paths`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ careerGoal }),
    })
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || "API error")
    return res.json()
  }
  return fetchApi<{ paths: import("./types").LearningPath[] }>("/learning-paths")
}

// Chat
export async function sendChatMessage(messages: { role: "user" | "assistant"; content: string }[]) {
  return fetchApi<{ message: string }>("/chat", {
    method: "POST",
    body: JSON.stringify({ messages }),
  })
}
