"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ChevronDown } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const titleY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const overlayOpacity = useTransform(scrollYProgress, [0.3, 0.8], [0, 0.8])

  return (
    <section 
      ref={containerRef}
      className="relative h-[200vh]"
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Hero Image with parallax */}
        <motion.div 
          className="absolute inset-0"
          style={{ scale: imageScale, y: imageY }}
        >
          <Image
            src="/images/smart-city-hero.jpg"
            alt="Futuristic smart city at night with glowing buildings and light trails"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Animated scan lines overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,200,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background pointer-events-none" />
        <motion.div 
          className="absolute inset-0 bg-background pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />

        {/* Hero content */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ y: titleY, opacity: titleOpacity }}
        >
          {/* Floating accent line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mb-8"
          />

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-[0.2em] neon-text text-balance"
          >
            HORIZON
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-6 text-lg md:text-xl lg:text-2xl text-muted-foreground tracking-widest uppercase"
          >
            Where Smart Cities Meet the Future
          </motion.p>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12 flex items-center gap-4"
          >
            <span className="w-12 h-px bg-primary/50" />
            <span className="text-xs tracking-[0.3em] text-primary/70 uppercase">Exhibition 2026</span>
            <span className="w-12 h-px bg-primary/50" />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          >
            <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Scroll to enter the city
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-6 h-6 text-primary" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-primary/30" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-primary/30" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-primary/30" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-primary/30" />
      </div>
    </section>
  )
}
