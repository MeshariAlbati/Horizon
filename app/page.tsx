"use client"

import { SmoothScrollProvider } from "@/components/horizon/smooth-scroll-provider"
import { FloatingNav } from "@/components/horizon/floating-nav"
import { HeroSection } from "@/components/horizon/hero-section"
import { TransitionScene } from "@/components/horizon/transition-scene"
import { ClubsRoadmap } from "@/components/horizon/clubs-roadmap"
import { SystemsGrid } from "@/components/horizon/systems-grid"
import { AIGuideSection } from "@/components/horizon/ai-guide-section"
import { ExitScene } from "@/components/horizon/exit-scene"

export default function HorizonExhibition() {
  return (
    <SmoothScrollProvider>
      <main className="relative">
        {/* Floating navigation */}
        <FloatingNav />

        {/* Scene 1: Hero - Arrival */}
        <HeroSection />

        {/* Scene 2: Transition - Entering the City */}
        <TransitionScene />

        {/* Scene 3: 7 Clubs Roadmap - Scroll-driven story */}
        <section id="clubs">
          <ClubsRoadmap />
        </section>

        {/* Scene 4: Smart City Systems */}
        <section id="systems">
          <SystemsGrid />
        </section>

        {/* Scene 5: AI Guide - Future Companion */}
        <section id="guide">
          <AIGuideSection />
        </section>

        {/* Scene 6: Exit - Horizon Ahead */}
        <ExitScene />
      </main>
    </SmoothScrollProvider>
  )
}
