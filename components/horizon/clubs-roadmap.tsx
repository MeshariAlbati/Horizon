"use client"

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion"
import { useRef, useState } from "react"
import { 
  Brain, 
  Shield, 
  Wifi, 
  Code, 
  Building2, 
  Leaf, 
  Bot 
} from "lucide-react"

const clubs = [
  {
    id: 1,
    name: "AI & Data Club",
    icon: Brain,
    mission: "Harnessing artificial intelligence to create smarter, more responsive urban environments.",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 2,
    name: "Cybersecurity Club",
    icon: Shield,
    mission: "Protecting the digital infrastructure that powers tomorrow's connected cities.",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 3,
    name: "IoT Club",
    icon: Wifi,
    mission: "Connecting billions of devices to create truly intelligent urban ecosystems.",
    color: "from-teal-500 to-cyan-600"
  },
  {
    id: 4,
    name: "Software Engineering Club",
    icon: Code,
    mission: "Building the digital foundations that make smart cities possible.",
    color: "from-indigo-500 to-purple-600"
  },
  {
    id: 5,
    name: "Architecture & Design Club",
    icon: Building2,
    mission: "Reimagining physical spaces for the digital age.",
    color: "from-purple-500 to-pink-600"
  },
  {
    id: 6,
    name: "Sustainability Club",
    icon: Leaf,
    mission: "Ensuring our smart cities are also green cities for future generations.",
    color: "from-green-500 to-teal-600"
  },
  {
    id: 7,
    name: "Robotics Club",
    icon: Bot,
    mission: "Developing autonomous systems that serve and enhance urban life.",
    color: "from-orange-500 to-red-600"
  }
]



function ClubCard({ 
  club, 
  isActive, 
  progress 
}: { 
  club: typeof clubs[0]
  isActive: boolean
  progress: number 
}) {
  const Icon = club.icon

  return (
    <motion.div
      className={`
        absolute inset-0 flex items-center justify-center p-6
        transition-all duration-700
      `}
      initial={{ opacity: 0, scale: 0.8, x: 100 }}
      animate={{ 
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.8,
        x: isActive ? 0 : 100,
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="glass-card rounded-2xl p-8 md:p-12 max-w-2xl w-full relative overflow-hidden">
        {/* Glow effect */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${club.color} opacity-10 blur-3xl`}
        />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Chapter number */}
          <motion.span 
            className="text-xs tracking-[0.3em] text-primary/60 uppercase mb-4 block"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -20 }}
            transition={{ delay: 0.2 }}
          >
            Chapter {club.id} of 7
          </motion.span>

          {/* Icon */}
          <motion.div
            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${club.color} p-4 mb-6 pulse-glow`}
            initial={{ scale: 0 }}
            animate={{ scale: isActive ? 1 : 0 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Icon className="w-full h-full text-white" strokeWidth={1.5} />
          </motion.div>

          {/* Title */}
          <motion.h3
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -30 }}
            transition={{ delay: 0.4 }}
          >
            {club.name}
          </motion.h3>

          {/* Mission */}
          <motion.p
            className="text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.5 }}
          >
            {club.mission}
          </motion.p>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-primary/30" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-primary/30" />
      </div>
    </motion.div>
  )
}

export function ClubsRoadmap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Track scroll progress and update active club
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Map scroll progress to club index (7 clubs spread across the scroll)
    const clubProgress = Math.min(latest * 1.2, 1) // Speed up the progression slightly
    const newIndex = Math.min(Math.floor(clubProgress * clubs.length), clubs.length - 1)
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex)
    }
  })

  const progressWidth = useTransform(scrollYProgress, [0.05, 0.85], ["0%", "100%"])

  return (
    <section 
      ref={containerRef}
      className="relative"
      style={{ height: `${clubs.length * 100 + 100}vh` }}
    >
      {/* Section header */}
      <motion.div
        className="sticky top-0 h-screen flex flex-col"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Header */}
        <div className="pt-12 pb-6 px-6 text-center">
          <motion.span
            className="text-xs tracking-[0.3em] text-primary/60 uppercase block mb-2"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            The Journey
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            7 Clubs. One Vision.
          </motion.h2>
        </div>

        {/* Progress line */}
        <div className="px-6 md:px-12">
          <div className="relative h-1 bg-secondary/30 rounded-full overflow-hidden max-w-4xl mx-auto">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full"
              style={{ width: useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]) }}
            />
            {/* Progress markers */}
            <div className="absolute inset-0 flex justify-between items-center px-2">
              {clubs.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                    i <= activeIndex 
                      ? "bg-primary border-primary scale-110" 
                      : "bg-background border-primary/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Cards container */}
        <div className="flex-1 relative mt-8">
          <motion.div className="absolute inset-0">
            {clubs.map((club, index) => (
              <ClubCard
                key={club.id}
                club={club}
                isActive={activeIndex === index}
                progress={scrollYProgress.get()}
              />
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="pb-8 text-center"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 0.5, 0.5, 0]) }}
        >
          <span className="text-xs tracking-[0.2em] text-muted-foreground/50 uppercase">
            Scroll to explore
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}
