"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { ArrowRight, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ExitScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [particles, setParticles] = useState<{ left: number; duration: number; delay: number; travel: number }[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }).map(() => ({
        left: Math.random() * 100,
        duration: 8 + Math.random() * 4,
        delay: Math.random() * 5,
        travel: window.innerHeight * 1.2,
      }))
    )
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  })

  const contentOpacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 1])
  const contentY = useTransform(scrollYProgress, [0, 0.4], [100, 0])
  const bgOpacity = useTransform(scrollYProgress, [0.5, 1], [0, 0.8])

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center px-6 py-32"
    >
      {/* Fade to dark overlay */}
      <motion.div 
        className="absolute inset-0 bg-deep-blue pointer-events-none"
        style={{ opacity: bgOpacity }}
      />

      {/* Horizon line effect */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Ambient particles rising */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/40"
            style={{
              left: `${p.left}%`,
              bottom: `-10%`,
            }}
            animate={{
              y: [0, -p.travel],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <motion.div 
        className="relative z-10 max-w-4xl mx-auto text-center"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Main text */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
            The future is not coming.
            <br />
            <span className="text-primary neon-text">It{"'"}s being built.</span>
          </h2>

          <motion.div
            className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Join us at Horizon and discover how smart cities are transforming the way we live, work, and connect.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Button
            size="lg"
            className="glass-card border-primary/30 hover:border-primary/60 hover:neon-glow transition-all duration-300 group bg-primary/10 hover:bg-primary/20 text-foreground"
          >
            <MapPin className="w-5 h-5 mr-2 text-primary" />
            Visit the Exhibition
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            size="lg"
            variant="ghost"
            className="hover:bg-primary/10 text-foreground"
          >
            <Users className="w-5 h-5 mr-2 text-primary" />
            Meet the Clubs
          </Button>
        </motion.div>

        {/* Footer info */}
        <motion.div
          className="mt-16 pt-8 border-t border-primary/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary pulse-glow" />
              Now Open
            </span>
            <span className="hidden md:block w-px h-4 bg-primary/20" />
            <span>Dubai Future Foundation Center</span>
            <span className="hidden md:block w-px h-4 bg-primary/20" />
            <span>2026 Edition</span>
          </div>
        </motion.div>

        {/* HORIZON wordmark */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          transition={{ duration: 2, delay: 1 }}
        >
          <span className="text-8xl md:text-9xl font-bold tracking-[0.3em] text-foreground/10">
            HORIZON
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}
