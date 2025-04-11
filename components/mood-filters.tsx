"use client"
import { motion } from "framer-motion"
import { Smile, Frown, Coffee, Zap, Moon } from "lucide-react"

// Mood filters
const moods = [
  {
    id: "happy",
    name: "Happy",
    icon: Smile,
    color: "bg-yellow-500",
    hoverColor: "hover:bg-yellow-400",
  },
  {
    id: "sad",
    name: "Sad",
    icon: Frown,
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-400",
  },
  {
    id: "chill",
    name: "Chill",
    icon: Coffee,
    color: "bg-green-500",
    hoverColor: "hover:bg-green-400",
  },
  {
    id: "energetic",
    name: "Energetic",
    icon: Zap,
    color: "bg-red-500",
    hoverColor: "hover:bg-red-400",
  },
  {
    id: "sleep",
    name: "Sleep",
    icon: Moon,
    color: "bg-indigo-500",
    hoverColor: "hover:bg-indigo-400",
  },
]

interface MoodFiltersProps {
  theme: "dark" | "light"
  selectedMood: string | null
  onSelectMood: (mood: string | null) => void
}

export default function MoodFilters({ theme, selectedMood, onSelectMood }: MoodFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {moods.map((mood) => {
        const isSelected = selectedMood === mood.id
        const Icon = mood.icon

        return (
          <motion.button
            key={mood.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectMood(isSelected ? null : mood.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              isSelected
                ? `${mood.color} text-white`
                : theme === "dark"
                  ? `bg-gray-800 text-white ${mood.hoverColor}`
                  : `bg-gray-100 text-gray-800 ${mood.hoverColor}`
            }`}
          >
            <motion.div
              animate={isSelected ? { rotate: [0, 15, -15, 0] } : {}}
              transition={{ duration: 0.5, repeat: isSelected ? Number.POSITIVE_INFINITY : 0, repeatDelay: 1 }}
            >
              <Icon className="h-4 w-4" />
            </motion.div>
            <span>{mood.name}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
