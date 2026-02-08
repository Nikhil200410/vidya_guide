"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import type { ResumeAnalysisResult } from "./types"

interface AppContextValue {
  resumeText: string | null
  resumeAnalysis: ResumeAnalysisResult | null
  setResumeData: (text: string | null, analysis: ResumeAnalysisResult | null) => void
  selectedCareerGoal: string | null
  setSelectedCareerGoal: (goal: string | null) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [resumeText, setResumeText] = useState<string | null>(null)
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysisResult | null>(null)
  const [selectedCareerGoal, setSelectedCareerGoal] = useState<string | null>(null)

  const setResumeData = useCallback((text: string | null, analysis: ResumeAnalysisResult | null) => {
    setResumeText(text)
    setResumeAnalysis(analysis)
  }, [])

  return (
    <AppContext.Provider
      value={{
        resumeText,
        resumeAnalysis,
        setResumeData,
        selectedCareerGoal,
        setSelectedCareerGoal,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext(): AppContextValue | null {
  return useContext(AppContext)
}
