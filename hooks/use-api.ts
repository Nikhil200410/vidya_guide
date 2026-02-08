"use client"

import { useState, useCallback } from "react"
import * as api from "@/lib/api"
import type { ResumeAnalysisResult } from "@/lib/types"

export function useResumeAnalysis(onAnalyzed?: (data: ResumeAnalysisResult & { resumeText?: string }) => void) {
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(
    async (file: File) => {
      setIsLoading(true)
      setError(null)
      setResult(null)
      try {
        const data = await api.analyzeResume(file)
        setResult(data)
        onAnalyzed?.(data)
        return data
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Analysis failed"
        setError(msg)
      } finally {
        setIsLoading(false)
      }
    },
    [onAnalyzed]
  )

  return { result, isLoading, error, analyze }
}

export function useSkills(resumeText?: string | null) {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.getSkills>> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSkills = useCallback(
    async (overrideResumeText?: string | null) => {
      setIsLoading(true)
      setError(null)
      const text = overrideResumeText ?? resumeText
      try {
        const res = await api.getSkills(text)
        setData(res)
        return res
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load skills"
        setError(msg)
      } finally {
        setIsLoading(false)
      }
    },
    [resumeText]
  )

  return { ...data, isLoading, error, fetchSkills }
}

export function useCareerPaths(resumeText?: string | null) {
  const [paths, setPaths] = useState<Awaited<ReturnType<typeof api.getCareerPaths>>["paths"] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPaths = useCallback(
    async (overrideResumeText?: string | null) => {
      setIsLoading(true)
      setError(null)
      const text = overrideResumeText ?? resumeText
      try {
        const res = await api.getCareerPaths(text)
        setPaths(res.paths)
        return res.paths
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load career paths"
        setError(msg)
      } finally {
        setIsLoading(false)
      }
    },
    [resumeText]
  )

  return { paths, isLoading, error, fetchPaths }
}

export function useLearningPaths(careerGoal?: string | null) {
  const [paths, setPaths] = useState<Awaited<ReturnType<typeof api.getLearningPaths>>["paths"] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPaths = useCallback(
    async (overrideCareerGoal?: string | null) => {
      setIsLoading(true)
      setError(null)
      const goal = overrideCareerGoal ?? careerGoal
      try {
        const res = await api.getLearningPaths(goal)
        setPaths(res.paths)
        return res.paths
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load learning paths"
        setError(msg)
      } finally {
        setIsLoading(false)
      }
    },
    [careerGoal]
  )

  return { paths, isLoading, error, fetchPaths }
}
