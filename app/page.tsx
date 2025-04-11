"use client"

import { useState } from "react"
import MusicPlayer from "@/components/music-player"
import PlaylistDrawer from "@/components/playlist-drawer"
import ThemeToggle from "@/components/theme-toggle"
import { AnimatedBackground } from "@/components/animated-background"
import AlbumCarousel from "@/components/album-carousel"
import RecommendationsSection from "@/components/recommendations-section"
import MoodFilters from "@/components/mood-filters"

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-4 transition-colors duration-500 relative ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-950 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-100 to-white text-gray-900"
      }`}
    >
      <AnimatedBackground theme={theme} />

      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>

      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-8 mt-8">
          <h1 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Featured Albums
          </h1>
          <AlbumCarousel theme={theme} />
        </div>

        <div className="mb-8">
          <h2 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Browse by Mood
          </h2>
          <MoodFilters theme={theme} selectedMood={selectedMood} onSelectMood={setSelectedMood} />
        </div>

        <div className="flex w-full relative">
          <div className="flex-1">
            <MusicPlayer theme={theme} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />

            <div className="mt-8 mb-16">
              <h2 className={`text-xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>For You</h2>
              <RecommendationsSection theme={theme} />
            </div>
          </div>
          <PlaylistDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} theme={theme} />
        </div>
      </div>
    </main>
  )
}
