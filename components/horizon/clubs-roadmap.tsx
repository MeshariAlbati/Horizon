"use client"

import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion"
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
    name: "CCSIT Club",
    icon: Brain,
    mission: "Harnessing artificial intelligence to create smarter, more responsive urban environments.",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 2,
    name: "AI Club",
    icon: Shield,
    mission: "Protecting the digital infrastructure that powers tomorrow's connected cities.",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 3,
    name: "Programming Club",
    icon: Wifi,
    mission: "Connecting billions of devices to create truly intelligent urban ecosystems.",
    color: "from-teal-500 to-cyan-600"
  },
  {
    id: 4,
    name: "Google Club",
    icon: Code,
    mission: "Building the digital foundations that make smart cities possible.",
    color: "from-indigo-500 to-purple-600"
  },
  {
    id: 5,
    name: "Amazon Club",
    icon: Building2,
    mission: "Reimagining physical spaces for the digital age.",
    color: "from-purple-500 to-pink-600"
  },
  {
    id: 6,
    name: "Cyber Security Club",
    icon: Leaf,
    mission: "Ensuring our smart cities are also green cities for future generations.",
    color: "from-green-500 to-teal-600"
  },
  {
    id: 7,
    name: "TEC CCSIT",
    icon: Bot,
    mission: "Developing autonomous systems that serve and enhance urban life.",
    color: "from-orange-500 to-red-600"
  }
]

/* ── Card variants: direction > 0 = scrolling forward, < 0 = backward ── */
const cardVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    scale: 0.92,
    x: dir > 0 ? 70 : -70,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
  },
  exit: (dir: number) => ({
    opacity: 0,
    scale: 0.92,
    x: dir > 0 ? -70 : 70,
  }),
}

function ClubCard({ club, direction }: { club: typeof clubs[0]; direction: number }) {
  const Icon = club.icon

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center p-6"
      custom={direction}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="glass-card rounded-2xl p-8 md:p-12 max-w-2xl w-full relative overflow-hidden">
        {/* Glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${club.color} opacity-10 blur-3xl`} />

        {/* Content */}
        <div className="relative z-10">
          {/* Chapter label */}
          <motion.span
            className="text-xs tracking-[0.3em] text-primary/60 uppercase mb-4 block"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Chapter {club.id} of 7
          </motion.span>

          {/* Icon */}
          <motion.div
            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${club.color} p-4 mb-6 pulse-glow`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.25, type: "spring" }}
          >
            <Icon className="w-full h-full text-white" strokeWidth={1.5} />
          </motion.div>

          {/* Title */}
          <motion.h3
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {club.name}
          </motion.h3>

          {/* Mission */}
          <motion.p
            className="text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
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
  const directionRef = useRef(1)
  const [direction, setDirection] = useState(1)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const newIndex = Math.min(Math.floor(latest * clubs.length), clubs.length - 1)
    if (newIndex !== activeIndex) {
      const dir = newIndex > activeIndex ? 1 : -1
      directionRef.current = dir
      setDirection(dir)
      setActiveIndex(newIndex)
    }
  })

  // Progress fill synced to active index: fills up to the center of the active dot
  const progressPercent = ((activeIndex + 0.5) / clubs.length) * 100

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${clubs.length * 100 + 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex flex-col">
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

        {/* Progress bar */}
        <div className="px-6 md:px-12">
          <div className="relative max-w-4xl mx-auto">
            {/* Track + animated fill — overflow-hidden only on this layer */}
            <div className="h-1 bg-secondary/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>

            {/* Dots — sibling, NOT inside overflow-hidden */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between">
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

        {/* Card area */}
        <div className="flex-1 relative mt-8">
          <AnimatePresence mode="wait" custom={direction}>
            <ClubCard
              key={clubs[activeIndex].id}
              club={clubs[activeIndex]}
              direction={direction}
            />
          </AnimatePresence>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="pb-8 text-center"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [1, 0.5, 0.5, 0]) }}
        >
          <span className="text-xs tracking-[0.2em] text-muted-foreground/50 uppercase">
            Scroll to explore
          </span>
        </motion.div>
      </div>
    </section>
  )
}
