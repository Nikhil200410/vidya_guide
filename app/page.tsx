import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesGrid } from "@/components/features-grid"
import { ResumeAnalyzer } from "@/components/resume-analyzer"
import { SkillAssessment } from "@/components/skill-assessment"
import { CareerRoadmap } from "@/components/career-roadmap"
import { AiChatAgent } from "@/components/ai-chat-agent"
import { LearningPaths } from "@/components/learning-paths"
import { PlatformStats } from "@/components/platform-stats"
import { Testimonials } from "@/components/testimonials"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <ResumeAnalyzer />
      <SkillAssessment />
      <CareerRoadmap />
      <AiChatAgent />
      <LearningPaths />
      <PlatformStats />
      <Testimonials />
      <CtaSection />
      <Footer />
    </main>
  )
}
