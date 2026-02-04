"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { MessageCircle, Sparkles } from "lucide-react"

export function AIGuideSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0])
  const contentY = useTransform(scrollYProgress, [0.1, 0.3], [100, 0])
  const orbScale = useTransform(scrollYProgress, [0.2, 0.5], [0.5, 1])
  const orbOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])

  return (
    <section 
      ref={containerRef}
      className="relative py-32 px-6 min-h-screen flex items-center justify-center"
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Ambient glow */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px]"
          style={{ scale: orbScale, opacity: orbOpacity }}
        />
      </div>

      <motion.div 
        className="max-w-4xl mx-auto relative"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Floating glass panel */}
        <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl border border-primary/20" />
          <div className="absolute inset-0 rounded-3xl neon-glow opacity-20" />

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* AI Orb */}
            <motion.div
              className="w-32 h-32 mx-auto mb-8 relative"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Middle ring */}
              <motion.div
                className="absolute inset-2 rounded-full border border-primary/40"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Inner orb */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/60 to-accent/60 pulse-glow">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary to-accent breathe flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Floating particles around orb */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-primary"
                  style={{
                    top: "50%",
                    left: "50%",
                  }}
                  animate={{
                    x: [0, Math.cos(i * 60 * Math.PI / 180) * 60, 0],
                    y: [0, Math.sin(i * 60 * Math.PI / 180) * 60, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {"\""}Soon, the city will talk back.{"\""}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              An AI companion that understands your city, answers your questions, and guides your urban experience.
            </motion.p>

            {/* Chat placeholder */}
            <motion.div
              className="max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="glass rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm text-muted-foreground">
                    Ask Horizon anything...
                  </p>
                </div>
                <motion.div
                  className="w-3 h-3 rounded-full bg-primary"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              <p className="text-xs text-muted-foreground/50 mt-4">
                Powered by Groq AI — Coming Soon
              </p>
            </motion.div>
          </div>

          {/* Corner accents */}
          <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
          <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-primary/30 rounded-tr-lg" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-primary/30 rounded-bl-lg" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-primary/30 rounded-br-lg" />
        </div>
      </motion.div>
    </section>
  )
}
