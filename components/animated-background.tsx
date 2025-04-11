"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Music } from "lucide-react"

interface AnimatedBackgroundProps {
  theme: "dark" | "light"
}

export function AnimatedBackground({ theme }: AnimatedBackgroundProps) {
  const [blobs, setBlobs] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([])
  const [windowHeight, setWindowHeight] = useState(1000) // Fallback height for SSR

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowHeight(window.innerHeight)
    }

    // Generate random blobs
    const newBlobs = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 100 + Math.random() * 200,
      delay: Math.random() * 5,
    }))
    setBlobs(newBlobs)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated blobs */}
      {blobs.map((blob) => (
        <motion.div
          key={blob.id}
          className={`absolute rounded-full blur-3xl opacity-20 ${
            theme === "dark"
              ? "bg-gradient-to-r from-purple-600 to-blue-600"
              : "bg-gradient-to-r from-purple-300 to-blue-300"
          }`}
          style={{
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: blob.size,
            height: blob.size,
          }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -20, 30, -10, 0],
          }}
          transition={{
            duration: 20 + blob.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: blob.delay,
          }}
        />
      ))}

      {/* Floating music notes */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 10}%`,
              top: "100%",
            }}
            animate={{
              y: [0, -windowHeight - 100],
              x: [0, Math.sin(i) * 100],
              opacity: [0, 0.7, 0],
              rotate: [0, i % 2 === 0 ? 20 : -20],
            }}
            transition={{
              duration: 15 + i,
              repeat: Infinity,
              delay: i * 3,
              ease: "linear",
            }}
          >
            <Music className={`h-6 w-6 ${theme === "dark" ? "text-purple-500/30" : "text-purple-400/30"}`} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
