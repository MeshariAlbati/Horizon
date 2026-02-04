"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import {
  Search, Monitor, Package, Cpu, Globe, Database, Smartphone,
  Server, Zap, Settings, ShieldCheck, Layers, PenTool, Building2
} from "lucide-react"

/* ── Sponsor data ── */
const sponsorsRow1 = [
  { name: "Google",   icon: Search },
  { name: "Microsoft", icon: Monitor },
  { name: "Amazon",   icon: Package },
  { name: "Intel",    icon: Cpu },
  { name: "Cisco",    icon: Globe },
  { name: "Oracle",   icon: Database },
  { name: "Samsung",  icon: Smartphone },
]

const sponsorsRow2 = [
  { name: "IBM",       icon: Server },
  { name: "Tesla",     icon: Zap },
  { name: "Siemens",   icon: Settings },
  { name: "Honeywell", icon: ShieldCheck },
  { name: "Huawei",    icon: Layers },
  { name: "Adobe",     icon: PenTool },
  { name: "Dubai Tech", icon: Building2 },
]

/* Gradient mask: fades both edges so items dissolve in/out smoothly */
const edgeMask = {
  WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
  maskImage:       "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
} as React.CSSProperties

/* ── Single marquee row ── */
function MarqueeRow({
  sponsors,
  duration,
  delay = 0,
}: {
  sponsors: typeof sponsorsRow1
  duration: number
  delay?: number
}) {
  return (
    <div className="overflow-hidden" style={edgeMask}>
      <div
        className="flex"
        style={{
          animation: `marquee ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
          width: "max-content",
        }}
      >
        {/* Duplicate array → seamless loop when translateX hits -50% */}
        {[...sponsors, ...sponsors].map((sponsor, i) => {
          const Icon = sponsor.icon
          return (
            <div
              key={i}
              className="flex items-center gap-2.5 mx-2.5 px-5 py-2.5 rounded-xl border border-primary/10 bg-card/40"
              style={{ backdropFilter: "blur(8px)" }}
            >
              <Icon className="w-4 h-4 text-primary/50" strokeWidth={1.5} />
              <span className="text-sm text-foreground/50 whitespace-nowrap font-medium tracking-wide">
                {sponsor.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Main section ── */
export function TransitionScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  /* Quote text: slides up & fades */
  const textOpacity  = useTransform(scrollYProgress, [0.12, 0.28, 0.55, 0.7],  [0, 1, 1, 0])
  const textY        = useTransform(scrollYProgress, [0.12, 0.38, 0.7],        [90, 0, -90])
  const lineWidth    = useTransform(scrollYProgress, [0.22, 0.48], ["0%", "100%"])

  /* Sponsors: fade in a beat after the text, fade out a beat after */
  const sponsorsOpacity = useTransform(scrollYProgress, [0.28, 0.42, 0.68, 0.82], [0, 1, 1, 0])

  /* Particles (client-only to avoid hydration mismatch) */
  const [particles, setParticles] = useState<{ left: number; top: number; duration: number; delay: number }[]>([])
  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 2,
      }))
    )
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative h-[180vh] flex flex-col items-center justify-center gap-14"
    >
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            style={{ left: `${p.left}%`, top: `${p.top}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
          />
        ))}
      </div>

      {/* ── Quote ── */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        style={{ opacity: textOpacity, y: textY }}
      >
        <motion.span
          className="block text-6xl md:text-8xl text-primary/20 font-serif leading-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {"\""}
        </motion.span>

        <motion.h2 className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight text-foreground/90 text-pretty">
          Cities are no longer built.
          <br />
          <span className="text-primary">They are designed.</span>
        </motion.h2>

        <motion.div
          className="mt-8 mx-auto h-px bg-gradient-to-r from-transparent via-primary to-transparent"
          style={{ width: lineWidth }}
        />

        <motion.p
          className="mt-8 text-muted-foreground text-lg md:text-xl tracking-wide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Welcome to the future of urban living
        </motion.p>
      </motion.div>

      {/* ── Sponsors marquee ── */}
      <motion.div
        className="relative z-10 w-full max-w-5xl mx-auto px-4"
        style={{ opacity: sponsorsOpacity }}
      >
        <p className="text-xs tracking-[0.3em] text-primary/40 uppercase text-center mb-5">
          Our Sponsors
        </p>
        <div className="flex flex-col gap-3">
          <MarqueeRow sponsors={sponsorsRow1} duration={28} />
          <MarqueeRow sponsors={sponsorsRow2} duration={34} delay={-17} />
        </div>
      </motion.div>

      {/* Light beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-primary/0 via-primary/20 to-primary/0"
          style={{ opacity: useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.5, 0]) }}
        />
        <motion.div
          className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-primary/0 via-primary/20 to-primary/0"
          style={{ opacity: useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 0.5, 0]) }}
        />
      </div>
    </section>
  )
}
