"use client"

import React from "react"

import { motion, useScroll, useTransform } from "framer-motion"
import { useState, useEffect } from "react"

export function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollY } = useScroll()
  
  const navOpacity = useTransform(scrollY, [100, 200], [0, 1])

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsVisible(latest > 100)
    })
    return () => unsubscribe()
  }, [scrollY])

  return (
    <motion.nav
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{ opacity: navOpacity }}
    >
      <div className="glass-card rounded-full px-6 py-3 flex items-center gap-6">
        {/* Logo */}
        <span className="text-sm font-bold tracking-[0.2em] text-primary">
          HORIZON
        </span>

        {/* Divider */}
        <div className="w-px h-4 bg-primary/20" />

        {/* Nav links */}
        <div className="flex items-center gap-4">
          <NavLink href="#clubs">Clubs</NavLink>
          <NavLink href="#systems">Systems</NavLink>
          <NavLink href="#guide">AI Guide</NavLink>
        </div>
      </div>
    </motion.nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors uppercase"
    >
      {children}
    </a>
  )
}
