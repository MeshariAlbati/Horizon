"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function TransitionScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const textOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0])
  const textY = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [100, 0, -100])
  const lineWidth = useTransform(scrollYProgress, [0.3, 0.6], ["0%", "100%"])

  return (
    <section 
      ref={containerRef}
      className="relative h-[150vh] flex items-center justify-center"
    >
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main text content */}
      <motion.div 
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        style={{ opacity: textOpacity, y: textY }}
      >
        {/* Quote marks */}
        <motion.span 
          className="block text-6xl md:text-8xl text-primary/20 font-serif leading-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {"\""}
        </motion.span>

        {/* Main quote */}
        <motion.h2 
          className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight text-foreground/90 text-pretty"
        >
          Cities are no longer built.
          <br />
          <span className="text-primary">They are designed.</span>
        </motion.h2>

        {/* Animated underline */}
        <motion.div 
          className="mt-8 mx-auto h-px bg-gradient-to-r from-transparent via-primary to-transparent"
          style={{ width: lineWidth }}
        />

        {/* Subtitle */}
        <motion.p
          className="mt-8 text-muted-foreground text-lg md:text-xl tracking-wide"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Welcome to the future of urban living
        </motion.p>
      </motion.div>

      {/* Light beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-primary/0 via-primary/20 to-primary/0"
          style={{ 
            opacity: useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.5, 0])
          }}
        />
        <motion.div
          className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-primary/0 via-primary/20 to-primary/0"
          style={{ 
            opacity: useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 0.5, 0])
          }}
        />
      </div>
    </section>
  )
}
