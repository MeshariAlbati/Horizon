"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect, useCallback } from "react"
import { ChevronDown } from "lucide-react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

/* ─── 3D: Wireframe Globe ──────────────────────────────────────────── */
function Globe({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const outerRef = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    const s = scrollProgress.current
    // Rotate main globe on Y + slight X wobble
    meshRef.current.rotation.y += delta * 0.25
    meshRef.current.rotation.x += Math.sin(Date.now() * 0.0008) * 0.003
    // Counter-rotate the faint outer shell
    outerRef.current.rotation.y -= delta * 0.1
    outerRef.current.rotation.z += delta * 0.05
    // Fade & shrink on scroll
    const scale = 1 - s * 0.18
    meshRef.current.scale.setScalar(scale)
    outerRef.current.scale.setScalar(scale * 1.45);
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.38 - s * 0.28;
    (outerRef.current.material as THREE.MeshBasicMaterial).opacity = 0.1 - s * 0.08
  })

  return (
    <>
      {/* Main wireframe sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.6, 48, 48]} />
        <meshBasicMaterial
          color={0x00c8ff}
          wireframe
          transparent
          opacity={0.38}
        />
      </mesh>
      {/* Outer atmospheric shell */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[2.6, 32, 32]} />
        <meshBasicMaterial
          color={0x00c8ff}
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>
    </>
  )
}

/* ─── 3D: Orbiting Particle Cloud ─────────────────────────────────── */
function ParticleField({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const particleCount = 200

  // Generate positions once on a sphere shell
  const positions = useRef<Float32Array | null>(null)
  if (!positions.current) {
    const arr = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      // Distribute evenly on a sphere using fibonacci
      const goldenRatio = (1 + Math.sqrt(5)) / 2
      const theta = 2 * Math.PI * (i / goldenRatio)
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount)
      const r = 3.8 + Math.random() * 1.0 // shell between 3.8 – 4.8
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    positions.current = arr
  }

  useFrame((_, delta) => {
    const s = scrollProgress.current
    // Orbit on a tilted axis
    pointsRef.current.rotation.y += delta * 0.12
    pointsRef.current.rotation.x += delta * 0.04
    // Fade out on scroll
    ;(pointsRef.current.material as THREE.PointsMaterial).opacity = 0.7 - s * 0.6
    pointsRef.current.scale.setScalar(1 - s * 0.15)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions.current} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color={0x44dfff}
        size={0.04}
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  )
}

/* ─── 3D: Ambient glow ring (flat torus behind the globe) ─────────── */
function GlowRing({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const torusRef = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    const s = scrollProgress.current
    torusRef.current.rotation.x = Math.PI / 2.4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.08
    torusRef.current.rotation.z += delta * 0.08;
    (torusRef.current.material as THREE.MeshBasicMaterial).opacity = 0.18 - s * 0.15
  })

  return (
    <mesh ref={torusRef}>
      <torusGeometry args={[3.6, 0.015, 8, 120]} />
      <meshBasicMaterial color={0x00c8ff} transparent opacity={0.18} />
    </mesh>
  )
}

/* ─── 3D Scene root ────────────────────────────────────────────────── */
function Scene({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  return (
    <>
      <Globe scrollProgress={scrollProgress} />
      <ParticleField scrollProgress={scrollProgress} />
      <GlowRing scrollProgress={scrollProgress} />
    </>
  )
}

/* ─── Main Hero ────────────────────────────────────────────────────── */
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollProgressRef = useRef(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Keep a plain ref in sync so Three.js components can read it without re-renders
  const syncScrollRef = useCallback((v: number) => { scrollProgressRef.current = v }, [])
  useEffect(() => {
    const unsub = scrollYProgress.on("change", syncScrollRef)
    return unsub
  }, [scrollYProgress, syncScrollRef])

  const titleY        = useTransform(scrollYProgress, [0, 1],   [0, 200])
  const titleOpacity  = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const overlayOpacity = useTransform(scrollYProgress, [0.3, 0.8], [0, 0.9])

  return (
    <section
      ref={containerRef}
      className="relative h-[200vh]"
    >
      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* 3D Canvas – fills entire background */}
        {mounted && (
          <Canvas
            className="absolute inset-0 w-full h-full"
            camera={{ position: [0, 0.6, 7], fov: 50 }}
            style={{ background: "transparent" }}
          >
            <Scene scrollProgress={scrollProgressRef} />
          </Canvas>
        )}

        {/* Radial vignette so edges darken into the page background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, oklch(0.12 0.02 250) 100%)"
          }}
        />

        {/* Scan-line texture overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,200,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

        {/* Dark overlay that fades in as user scrolls (matches transition to next scene) */}
        <motion.div
          className="absolute inset-0 bg-background pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />

        {/* ── Text layer ── */}
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

          {/* Exhibition 2026 tag */}
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

        {/* ── Corner accents ── */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-primary/30" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-primary/30" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-primary/30" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-primary/30" />
      </div>
    </section>
  )
}
