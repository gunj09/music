"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LyricsDisplayProps {
  lyrics: { time: number; text: string }[]
  currentTime: number
  onClose: () => void
  theme: "dark" | "light"
}

export default function LyricsDisplay({ lyrics, currentTime, onClose, theme }: LyricsDisplayProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const activeLyricRef = useRef<HTMLDivElement>(null)

  // Find the current lyric based on time
  const currentLyricIndex = lyrics.findIndex(
    (lyric, index) =>
      currentTime >= lyric.time && (index === lyrics.length - 1 || currentTime < lyrics[index + 1].time),
  )

  // Scroll to the active lyric
  useEffect(() => {
    if (activeLyricRef.current && scrollAreaRef.current) {
      const container = scrollAreaRef.current
      const element = activeLyricRef.current
      const containerHeight = container.clientHeight
      const elementTop = element.offsetTop
      const elementHeight = element.clientHeight

      // Calculate the scroll position to center the active lyric
      const scrollPosition = elementTop - containerHeight / 2 + elementHeight / 2

      container.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      })
    }
  }, [currentLyricIndex])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed inset-x-0 bottom-0 z-40 rounded-t-xl shadow-2xl ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
      style={{ maxHeight: "60vh" }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Lyrics</h2>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="h-[40vh]" ref={scrollAreaRef}>
        <ScrollArea className="h-full p-4">
          <div className="space-y-6">
            {lyrics.map((lyric, index) => (
              <div
                key={index}
                ref={index === currentLyricIndex ? activeLyricRef : null}
                className={`transition-all duration-300 ${
                  index === currentLyricIndex
                    ? `text-lg font-bold ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`
                    : `text-base ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`
                }`}
              >
                {lyric.text}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  )
}
