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
    meshRef.current.rotation.y += delta * 0.25
    meshRef.current.rotation.x += Math.sin(Date.now() * 0.0008) * 0.003
    outerRef.current.rotation.y -= delta * 0.1
    outerRef.current.rotation.z += delta * 0.05
    const scale = 1 - s * 0.18
    meshRef.current.scale.setScalar(scale)
    outerRef.current.scale.setScalar(scale * 1.45);
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.28 - s * 0.2;
    (outerRef.current.material as THREE.MeshBasicMaterial).opacity = 0.08 - s * 0.06
  })

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.6, 48, 48]} />
        <meshBasicMaterial color={0x00c8ff} wireframe transparent opacity={0.28} />
      </mesh>
      <mesh ref={outerRef}>
        <sphereGeometry args={[2.6, 32, 32]} />
        <meshBasicMaterial color={0x00c8ff} wireframe transparent opacity={0.08} />
      </mesh>
    </>
  )
}

/* ─── 3D: Orbiting Particle Cloud ─────────────────────────────────── */
function ParticleField({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const particleCount = 200

  const positions = useRef<Float32Array | null>(null)
  if (!positions.current) {
    const arr = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const goldenRatio = (1 + Math.sqrt(5)) / 2
      const theta = 2 * Math.PI * (i / goldenRatio)
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount)
      const r = 3.8 + Math.random() * 1.0
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    positions.current = arr
  }

  useFrame((_, delta) => {
    const s = scrollProgress.current
    pointsRef.current.rotation.y += delta * 0.12
    pointsRef.current.rotation.x += delta * 0.04
    ;(pointsRef.current.material as THREE.PointsMaterial).opacity = 0.5 - s * 0.4
    pointsRef.current.scale.setScalar(1 - s * 0.15)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions.current} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={0x44dfff} size={0.05} transparent opacity={0.5} depthWrite={false} />
    </points>
  )
}

/* ─── 3D: Ambient glow ring ────────────────────────────────────────── */
function GlowRing({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const torusRef = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    const s = scrollProgress.current
    torusRef.current.rotation.x = Math.PI / 2.4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.08
    torusRef.current.rotation.z += delta * 0.08;
    (torusRef.current.material as THREE.MeshBasicMaterial).opacity = 0.1 - s * 0.08
  })

  return (
    <mesh ref={torusRef}>
      <torusGeometry args={[3.6, 0.015, 8, 120]} />
      <meshBasicMaterial color={0x00c8ff} transparent opacity={0.1} />
    </mesh>
  )
}

/* ─── 3D Scene ─────────────────────────────────────────────────────── */
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

  const syncScrollRef = useCallback((v: number) => { scrollProgressRef.current = v }, [])
  useEffect(() => {
    const unsub = scrollYProgress.on("change", syncScrollRef)
    return unsub
  }, [scrollYProgress, syncScrollRef])

  const contentY      = useTransform(scrollYProgress, [0, 1],   [0, 160])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const overlayOpacity = useTransform(scrollYProgress, [0.3, 0.8], [0, 0.9])

  return (
    <section
      ref={containerRef}
      className="relative h-[200vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Dark scroll-out overlay */}
        <motion.div
          className="absolute inset-0 bg-background pointer-events-none z-10"
          style={{ opacity: overlayOpacity }}
        />

        {/* ── Split layout ── */}
        <motion.div
          className="absolute inset-0 flex flex-col md:flex-row items-center justify-center px-6 md:px-12 lg:px-20 gap-8 lg:gap-16"
          style={{ y: contentY, opacity: contentOpacity }}
        >

          {/* LEFT — text */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
            {/* Accent line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100px" }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mb-6"
            />

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-[0.15em] neon-text leading-tight"
            >
              HORIZON
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-5 text-base md:text-lg text-muted-foreground tracking-widest uppercase max-w-xs"
            >
              Where Smart Cities Meet the Future
            </motion.p>

            {/* Exhibition 2026 tag */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-8 flex items-center gap-4"
            >
              <span className="w-10 h-px bg-primary/50" />
              <span className="text-xs tracking-[0.3em] text-primary/70 uppercase">Exhibition 2026</span>
              <span className="w-10 h-px bg-primary/50" />
            </motion.div>
          </div>

          {/* RIGHT — globe window */}
          <div className="flex-1 flex items-center justify-center order-1 md:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.1 }}
              className="glass-card rounded-2xl relative overflow-hidden"
              style={{ width: "min(440px, 85vw)", aspectRatio: "1" }}
            >
              {/* Inner ambient glow */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div
                  style={{
                    width: 340,
                    height: 340,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(0,200,255,0.1) 0%, rgba(0,200,255,0.03) 40%, transparent 70%)",
                    filter: "blur(36px)",
                  }}
                />
              </div>

              {/* 3D Canvas */}
              {mounted && (
                <Canvas
                  className="absolute inset-0 w-full h-full"
                  camera={{ position: [0, 0.3, 6.2], fov: 52 }}
                  gl={{ alpha: true }}
                >
                  <Scene scrollProgress={scrollProgressRef} />
                </Canvas>
              )}

              {/* Scan lines on top of canvas */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,200,255,0.025)_50%)] bg-[length:100%_4px] pointer-events-none" />

              {/* Window corner accents */}
              <div className="absolute top-3 left-3 w-5 h-5 border-l-2 border-t-2 border-primary/40 rounded-tl-sm" />
              <div className="absolute top-3 right-3 w-5 h-5 border-r-2 border-t-2 border-primary/40 rounded-tr-sm" />
              <div className="absolute bottom-3 left-3 w-5 h-5 border-l-2 border-b-2 border-primary/40 rounded-bl-sm" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-r-2 border-b-2 border-primary/40 rounded-br-sm" />
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator — stays bottom-center of viewport */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        >
          <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Scroll to enter the city
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-primary" />
          </motion.div>
        </motion.div>

        {/* Viewport corner accents */}
        <div className="absolute top-6 left-6 w-14 h-14 border-l border-t border-primary/20 pointer-events-none" />
        <div className="absolute top-6 right-6 w-14 h-14 border-r border-t border-primary/20 pointer-events-none" />
        <div className="absolute bottom-6 left-6 w-14 h-14 border-l border-b border-primary/20 pointer-events-none" />
        <div className="absolute bottom-6 right-6 w-14 h-14 border-r border-b border-primary/20 pointer-events-none" />
      </div>
    </section>
  )
}
