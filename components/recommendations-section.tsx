"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

// Sample recommendations with Unsplash images
const recommendations = [
  {
    id: 1,
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    album: "Fine Line",
    cover: "/images/album8.png",
    reason: "Based on your recent listening",
  },
  {
    id: 2,
    title: "Save Your Tears",
    artist: "The Weeknd",
    album: "After Hours",
    cover: "/images/album2.png",
    reason: "Because you liked Blinding Lights",
  },
  {
    id: 3,
    title: "Physical",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    cover: "/images/album7.png",
    reason: "New release from artist you follow",
  },
  {
    id: 4,
    title: "Sunflower",
    artist: "Post Malone, Swae Lee",
    album: "Spider-Man: Into the Spider-Verse",
    cover: "/images/album5.png",
    reason: "Popular in your area",
  },
]

interface RecommendationsSectionProps {
  theme: "dark" | "light"
}

export default function RecommendationsSection({ theme }: RecommendationsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {recommendations.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            theme === "dark" ? "hover:bg-gray-800/60" : "hover:bg-gray-100"
          }`}
        >
          <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
            <img src={item.cover || "/placeholder.svg"} alt={item.album} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{item.title}</h3>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{item.artist}</p>
            <div className="flex items-center mt-1">
              <Sparkles className={`h-3 w-3 mr-1 ${theme === "dark" ? "text-purple-400" : "text-purple-500"}`} />
              <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>{item.reason}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
