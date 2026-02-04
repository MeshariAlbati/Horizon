"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { 
  Car, 
  Zap, 
  Heart, 
  ShieldCheck, 
  GraduationCap, 
  Landmark 
} from "lucide-react"

const systems = [
  {
    id: 1,
    name: "Smart Traffic",
    description: "AI-powered traffic management reducing congestion by 40%",
    icon: Car,
    gradient: "from-cyan-500/20 to-blue-500/20"
  },
  {
    id: 2,
    name: "Smart Energy",
    description: "Intelligent grids optimizing renewable energy distribution",
    icon: Zap,
    gradient: "from-yellow-500/20 to-orange-500/20"
  },
  {
    id: 3,
    name: "Smart Healthcare",
    description: "Connected health systems for proactive patient care",
    icon: Heart,
    gradient: "from-pink-500/20 to-rose-500/20"
  },
  {
    id: 4,
    name: "Smart Security",
    description: "Predictive security systems protecting urban environments",
    icon: ShieldCheck,
    gradient: "from-indigo-500/20 to-purple-500/20"
  },
  {
    id: 5,
    name: "Smart Education",
    description: "Personalized learning powered by adaptive AI",
    icon: GraduationCap,
    gradient: "from-green-500/20 to-teal-500/20"
  },
  {
    id: 6,
    name: "Smart Governance",
    description: "Transparent, efficient civic services for all citizens",
    icon: Landmark,
    gradient: "from-blue-500/20 to-indigo-500/20"
  }
]

function SystemCard({ 
  system, 
  index,
  scrollProgress
}: { 
  system: typeof systems[0]
  index: number
  scrollProgress: ReturnType<typeof useTransform<number>>
}) {
  const Icon = system.icon
  const delay = index * 0.1
  
  const cardOpacity = useTransform(
    scrollProgress,
    [0.1 + delay, 0.2 + delay],
    [0, 1]
  )
  
  const cardY = useTransform(
    scrollProgress,
    [0.1 + delay, 0.25 + delay],
    [100, 0]
  )

  const cardScale = useTransform(
    scrollProgress,
    [0.1 + delay, 0.25 + delay],
    [0.8, 1]
  )

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 relative overflow-hidden group"
      style={{ opacity: cardOpacity, y: cardY, scale: cardScale }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${system.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Light trail effect */}
      <div className="absolute inset-0 light-trail opacity-0 group-hover:opacity-100" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {system.name}
        </h3>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          {system.description}
        </p>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
      </div>
    </motion.div>
  )
}

export function SystemsGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1])
  const headerY = useTransform(scrollYProgress, [0, 0.15], [50, 0])

  // Connection lines opacity
  const linesOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1])

  return (
    <section 
      ref={containerRef}
      className="relative py-32 px-6"
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Radial gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <span className="text-xs tracking-[0.3em] text-primary/60 uppercase block mb-4">
            Urban Intelligence
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Integrated City Systems
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Six interconnected systems working in harmony to create seamless urban experiences.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {systems.map((system, index) => (
            <SystemCard 
              key={system.id}
              system={system}
              index={index}
              scrollProgress={scrollYProgress}
            />
          ))}

          {/* Connection lines (SVG overlay) */}
          <motion.svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
            style={{ opacity: linesOpacity }}
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
                <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Horizontal lines */}
            <line x1="33%" y1="50%" x2="67%" y2="50%" stroke="url(#lineGradient)" strokeWidth="1" />
            {/* Vertical lines */}
            <line x1="50%" y1="25%" x2="50%" y2="75%" stroke="url(#lineGradient)" strokeWidth="1" />
          </motion.svg>
        </div>

        {/* Central node */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary pulse-glow hidden lg:block"
          style={{ opacity: linesOpacity }}
        />
      </div>
    </section>
  )
}
